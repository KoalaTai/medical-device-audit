import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamSession, TeamMember, TeamResponse, VotingRound } from '@/lib/types';
import { MessageCircle, Check, CheckCircle, Clock, Users, ArrowRight, AlertTriangle } from '@phosphor-icons/react';
import { getFilteredQuestions } from '@/lib/data';
import { toast } from 'sonner';

interface TeamDiscussionProps {
  session: TeamSession;
  currentMember: TeamMember;
  onPhaseComplete: (session: TeamSession) => void;
}

export function TeamDiscussion({ session, currentMember, onPhaseComplete }: TeamDiscussionProps) {
  const [teamResponses, setTeamResponses] = useKV<Record<string, TeamResponse>>(`team_responses_${session.id}`, {});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useKV<number>(`team_discussion_index_${session.id}`, 0);
  const [discussionNote, setDiscussionNote] = useState<string>('');
  const [selectedVote, setSelectedVote] = useState<string | boolean>('');
  
  const questions = getFilteredQuestions(session.selectedFrameworks, false);
  const questionsNeedingDiscussion = questions.filter(q => {
    const response = teamResponses[q.id];
    return response && (response.disagreementLevel !== 'none' || !response.consensusReached);
  });

  const currentQuestion = questionsNeedingDiscussion[currentQuestionIndex];
  const currentTeamResponse = currentQuestion ? teamResponses[currentQuestion.id] : null;

  const progress = questionsNeedingDiscussion.length > 0 
    ? ((currentQuestionIndex + 1) / questionsNeedingDiscussion.length) * 100 
    : 100;

  const handleAddDiscussionNote = () => {
    if (!discussionNote.trim() || !currentQuestion || !currentTeamResponse) return;

    const updatedResponse: TeamResponse = {
      ...currentTeamResponse,
      discussionNotes: [
        ...(currentTeamResponse.discussionNotes || []),
        `${currentMember.name} (${currentMember.role}): ${discussionNote.trim()}`
      ]
    };

    setTeamResponses(current => ({
      ...current,
      [currentQuestion.id]: updatedResponse
    }));

    setDiscussionNote('');
    toast.success('Discussion note added');
  };

  const handleSubmitVote = () => {
    if (!currentQuestion || !currentTeamResponse || selectedVote === '') return;

    const newVotingRound: VotingRound = {
      roundNumber: (currentTeamResponse.votingRounds?.length || 0) + 1,
      timestamp: new Date(),
      votes: {
        ...((currentTeamResponse.votingRounds?.[currentTeamResponse.votingRounds.length - 1]?.votes) || {}),
        [currentMember.id]: selectedVote
      },
      discussion: currentTeamResponse.discussionNotes || [],
      outcome: 'consensus' // Will be determined after all votes
    };

    // Check if all members have voted in this round
    const allVoted = session.members.every(member => 
      member.id in newVotingRound.votes
    );

    if (allVoted) {
      // Determine consensus
      const votes = Object.values(newVotingRound.votes);
      const voteGroups = votes.reduce((acc, vote) => {
        const key = String(vote);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const maxVotes = Math.max(...Object.values(voteGroups));
      const winningAnswers = Object.keys(voteGroups).filter(key => voteGroups[key] === maxVotes);

      if (winningAnswers.length === 1 && maxVotes > session.members.length / 2) {
        // Consensus reached
        newVotingRound.outcome = 'consensus';
        const finalAnswer = winningAnswers[0] === 'true' ? true : 
                           winningAnswers[0] === 'false' ? false : 
                           winningAnswers[0];

        const updatedResponse: TeamResponse = {
          ...currentTeamResponse,
          votingRounds: [...(currentTeamResponse.votingRounds || []), newVotingRound],
          consensusReached: true,
          finalAnswer,
          finalRationale: `Consensus reached after ${newVotingRound.roundNumber} voting round(s)`
        };

        setTeamResponses(current => ({
          ...current,
          [currentQuestion.id]: updatedResponse
        }));

        toast.success('Consensus reached!');
      } else {
        // No clear consensus
        newVotingRound.outcome = 'majority';
        const updatedResponse: TeamResponse = {
          ...currentTeamResponse,
          votingRounds: [...(currentTeamResponse.votingRounds || []), newVotingRound]
        };

        setTeamResponses(current => ({
          ...current,
          [currentQuestion.id]: updatedResponse
        }));

        toast.info('No consensus yet. Continue discussion or escalate.');
      }
    } else {
      // Still waiting for other votes
      const updatedResponse: TeamResponse = {
        ...currentTeamResponse,
        votingRounds: [...(currentTeamResponse.votingRounds || []), newVotingRound]
      };

      setTeamResponses(current => ({
        ...current,
        [currentQuestion.id]: updatedResponse
      }));
    }

    setSelectedVote('');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsNeedingDiscussion.length - 1) {
      setCurrentQuestionIndex(current => current + 1);
      setSelectedVote('');
    } else {
      // Move to results phase
      const updatedSession = {
        ...session,
        currentPhase: 'results_review' as const,
        status: 'completed' as const
      };
      onPhaseComplete(updatedSession);
      toast.success('Team discussion completed!');
    }
  };

  const getAnswerOptions = () => {
    if (!currentQuestion) return [];

    if (currentQuestion.type === 'yesno') {
      return [{ value: true, label: 'Yes' }, { value: false, label: 'No' }];
    }

    if (currentQuestion.type === 'select' && currentQuestion.options) {
      return currentQuestion.options.map(option => ({ value: option, label: option }));
    }

    // For text questions, we'll use the individual responses as options
    const individualAnswers = currentTeamResponse ? 
      Object.values(currentTeamResponse.individualResponses).map(r => r.answer) : 
      [];
    return [...new Set(individualAnswers)].map(answer => ({ 
      value: answer, 
      label: String(answer) 
    }));
  };

  if (questionsNeedingDiscussion.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Questions Resolved!</h3>
          <p className="text-muted-foreground mb-4">
            Your team has reached consensus on all questions.
          </p>
          <Button onClick={() => onPhaseComplete({
            ...session,
            currentPhase: 'results_review',
            status: 'completed'
          })}>
            View Team Results
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion || !currentTeamResponse) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Loading Discussion...</h3>
        </CardContent>
      </Card>
    );
  }

  const currentVotingRound = currentTeamResponse.votingRounds?.[currentTeamResponse.votingRounds.length - 1];
  const hasVotedInCurrentRound = currentVotingRound && currentMember.id in currentVotingRound.votes;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium">Team Discussion & Consensus</h3>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questionsNeedingDiscussion.length} requiring discussion
              </p>
            </div>
            <Badge variant={currentTeamResponse.consensusReached ? 'default' : 'secondary'}>
              {currentTeamResponse.consensusReached ? 'Consensus Reached' : 'Discussion Needed'}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div className="flex-1">
              {currentQuestion.prompt}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{currentQuestion.clauseRef}</Badge>
                <Badge variant={
                  currentTeamResponse.disagreementLevel === 'major' ? 'destructive' :
                  currentTeamResponse.disagreementLevel === 'significant' ? 'secondary' :
                  currentTeamResponse.disagreementLevel === 'minor' ? 'default' : 
                  'outline'
                }>
                  {currentTeamResponse.disagreementLevel} disagreement
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="responses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="responses">Individual Responses</TabsTrigger>
              <TabsTrigger value="discussion">Team Discussion</TabsTrigger>
              <TabsTrigger value="voting">Consensus Voting</TabsTrigger>
            </TabsList>

            <TabsContent value="responses" className="space-y-4">
              <div className="grid gap-4">
                {session.members.map(member => {
                  const response = currentTeamResponse.individualResponses[member.id];
                  if (!response) return null;

                  return (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.role.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {typeof response.answer === 'boolean' 
                              ? response.answer ? 'Yes' : 'No'
                              : response.answer
                            }
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Confidence: {response.confidence}/5
                          </div>
                        </div>
                      </div>
                      {response.rationale && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          {response.rationale}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentTeamResponse.discussionNotes?.map((note, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <p className="text-sm">{note}</p>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-4">
                    No discussion notes yet. Start the conversation!
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Textarea
                  placeholder={`Share your perspective as ${currentMember.role.replace('_', ' ')}...`}
                  value={discussionNote}
                  onChange={(e) => setDiscussionNote(e.target.value)}
                  className="min-h-20"
                />
                <Button
                  onClick={handleAddDiscussionNote}
                  disabled={!discussionNote.trim()}
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Add to Discussion
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="voting" className="space-y-4">
              {!currentTeamResponse.consensusReached ? (
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Cast Your Vote
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on the discussion, select your final answer for this question.
                    </p>
                    
                    <div className="space-y-2">
                      {getAnswerOptions().map(option => (
                        <Button
                          key={String(option.value)}
                          variant={selectedVote === option.value ? 'default' : 'outline'}
                          onClick={() => setSelectedVote(option.value)}
                          className="w-full justify-start"
                          disabled={hasVotedInCurrentRound}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    {!hasVotedInCurrentRound && (
                      <Button
                        onClick={handleSubmitVote}
                        disabled={selectedVote === ''}
                        className="w-full mt-4"
                      >
                        Submit Vote
                      </Button>
                    )}

                    {hasVotedInCurrentRound && (
                      <div className="mt-4 p-3 bg-success/10 rounded-lg">
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Vote submitted</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Waiting for other team members to vote...
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Voting status */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Voting Progress</h4>
                    <div className="space-y-2">
                      {session.members.map(member => {
                        const hasVoted = currentVotingRound && member.id in currentVotingRound.votes;
                        return (
                          <div key={member.id} className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                              {hasVoted ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-sm">{member.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {member.role.replace('_', ' ')}
                            </Badge>
                            {session.settings.anonymousVoting ? (
                              hasVoted && <Badge variant="secondary" className="text-xs">Voted</Badge>
                            ) : (
                              hasVoted && currentVotingRound && (
                                <Badge variant="secondary" className="text-xs">
                                  {String(currentVotingRound.votes[member.id])}
                                </Badge>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-success/10 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <h4 className="font-medium text-success mb-2">Consensus Reached!</h4>
                  <div className="space-y-2">
                    <Badge variant="default" className="text-base px-4 py-2">
                      Final Answer: {
                        typeof currentTeamResponse.finalAnswer === 'boolean'
                          ? currentTeamResponse.finalAnswer ? 'Yes' : 'No'
                          : currentTeamResponse.finalAnswer
                      }
                    </Badge>
                    {currentTeamResponse.finalRationale && (
                      <p className="text-sm text-muted-foreground">
                        {currentTeamResponse.finalRationale}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} / {questionsNeedingDiscussion.length} questions needing consensus
        </div>

        <Button
          onClick={handleNextQuestion}
          disabled={!currentTeamResponse.consensusReached}
        >
          {currentQuestionIndex === questionsNeedingDiscussion.length - 1 ? 'Complete Discussion' : 'Next Question'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}