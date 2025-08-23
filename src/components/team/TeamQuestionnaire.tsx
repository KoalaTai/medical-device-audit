import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { TeamSession, TeamMember, TeamResponse, Question, AssessmentResponse } from '@/lib/types';
import { CheckCircle, Clock, Users, MessageCircle, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { getFilteredQuestions } from '@/lib/data';
import { toast } from 'sonner';

interface TeamQuestionnaireProps {
  session: TeamSession;
  currentMember: TeamMember;
  onPhaseComplete: (session: TeamSession) => void;
}

export function TeamQuestionnaire({ session, currentMember, onPhaseComplete }: TeamQuestionnaireProps) {
  const [teamResponses, setTeamResponses] = useKV<Record<string, TeamResponse>>(`team_responses_${session.id}`, {});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useKV<number>(`team_question_index_${session.id}`, 0);
  const [individualAnswer, setIndividualAnswer] = useState<string | boolean>('');
  const [confidence, setConfidence] = useState<number>(3);
  const [rationale, setRationale] = useState<string>('');
  
  const questions = getFilteredQuestions(session.selectedFrameworks, false);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const currentTeamResponse = teamResponses[currentQuestion?.id] || {
    questionId: currentQuestion?.id || '',
    memberResponses: {},
    finalAnswer: '',
    consensus: false,
    discussionNotes: ''
  };

  useEffect(() => {
    if (currentQuestion) {
      const memberResponse = currentTeamResponse.memberResponses[currentMember.id];
      if (memberResponse) {
        setIndividualAnswer(memberResponse.answer);
        setConfidence(memberResponse.confidence);
        setRationale(memberResponse.rationale);
      } else {
        setIndividualAnswer('');
        setConfidence(3);
        setRationale('');
      }
    }
  }, [currentQuestion, currentMember.id, currentTeamResponse]);

  const handleIndividualSubmit = () => {
    if (!currentQuestion) return;

    const memberResponse = {
      memberId: currentMember.id,
      memberName: currentMember.name,
      answer: individualAnswer,
      confidence,
      rationale,
      timestamp: new Date().toISOString()
    };

    const updatedTeamResponse = {
      ...currentTeamResponse,
      memberResponses: {
        ...currentTeamResponse.memberResponses,
        [currentMember.id]: memberResponse
      }
    };

    // Check if all members have responded
    const allMembersResponded = session.members.every(member => 
      updatedTeamResponse.memberResponses[member.id]
    );

    if (allMembersResponded) {
      updatedTeamResponse.finalAnswer = getMostCommonAnswer(updatedTeamResponse.memberResponses);
      updatedTeamResponse.consensus = hasConsensus(updatedTeamResponse.memberResponses);
    }

    setTeamResponses(current => ({
      ...current,
      [currentQuestion.id]: updatedTeamResponse
    }));

    toast.success('Response submitted to team');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(current => current + 1);
    } else {
      // All questions completed, check if all team responses are ready
      const allQuestionsAnswered = questions.every(q => {
        const response = teamResponses[q.id];
        return response && session.members.every(member => 
          response.memberResponses[member.id]
        );
      });

      if (allQuestionsAnswered) {
        onPhaseComplete(session);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(current => current - 1);
    }
  };

  const getMostCommonAnswer = (memberResponses: Record<string, any>) => {
    const answers = Object.values(memberResponses).map(r => r.answer);
    const counts = answers.reduce((acc, answer) => {
      acc[String(answer)] = (acc[String(answer)] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
  };

  const hasConsensus = (memberResponses: Record<string, any>) => {
    if (currentQuestion.type === 'yesno') {
      const answers = Object.values(memberResponses).map(r => r.answer);
      return answers.every(answer => answer === answers[0]);
    }
    return false;
  };

  const renderQuestionInput = () => {
    if (currentQuestion.type === 'yesno') {
      return (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={individualAnswer === true ? 'default' : 'outline'}
              onClick={() => setIndividualAnswer(true)}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              variant={individualAnswer === false ? 'default' : 'outline'}
              onClick={() => setIndividualAnswer(false)}
              className="flex-1"
            >
              No
            </Button>
          </div>
        </div>
      );
    }

    if (currentQuestion.type === 'select' && currentQuestion.options) {
      return (
        <div className="space-y-2">
          {currentQuestion.options.map(option => (
            <Button
              key={option}
              variant={individualAnswer === option ? 'default' : 'outline'}
              onClick={() => setIndividualAnswer(option)}
              className="w-full text-left justify-start"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <Textarea
        value={String(individualAnswer)}
        onChange={(e) => setIndividualAnswer(e.target.value)}
        placeholder="Enter your answer..."
        className="min-h-24"
      />
    );
  };

  const renderTeamResponses = () => {
    if (!currentQuestion) return null;

    const teamResponse = teamResponses[currentQuestion.id];
    if (!teamResponse) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">Team Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.members.map(member => {
            const memberResponse = teamResponse.memberResponses[member.id];
            const isCurrentMember = member.id === currentMember.id;
            
            return (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isCurrentMember ? 'font-medium' : ''}`}>
                    {member.name} {isCurrentMember ? '(You)' : ''}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {member.role}
                  </Badge>
                </div>
                
                {memberResponse ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Responded
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-muted-foreground">
                      Pending
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {teamResponse.finalAnswer && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Team Answer:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={teamResponse.consensus ? 'default' : 'secondary'}>
                    {String(teamResponse.finalAnswer)}
                  </Badge>
                  {teamResponse.consensus && (
                    <Badge variant="outline" className="text-xs">
                      Consensus
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-semibold mb-4">Assessment Complete</h2>
              <p className="text-muted-foreground">
                All questions have been completed. Moving to team discussion phase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentMemberResponse = currentTeamResponse.memberResponses[currentMember.id];
  const hasSubmitted = !!currentMemberResponse;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Assessment</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {session.members.length} Members
          </Badge>
        </div>

        {/* Progress */}
        <Progress value={progress} className="w-full" />

        {/* Current Question */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.prompt}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {currentQuestion.clauseRef}
                  </Badge>
                  <span>Weight: {currentQuestion.weight}</span>
                  {currentQuestion.critical && (
                    <Badge variant="destructive">Critical</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Individual Response Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Your Individual Response</h3>
              
              {renderQuestionInput()}

              {/* Confidence Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Confidence Level: {confidence}/5
                </label>
                <Slider
                  value={[confidence]}
                  onValueChange={(value) => setConfidence(value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Not confident</span>
                  <span>Very confident</span>
                </div>
              </div>

              {/* Rationale */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rationale (optional)
                </label>
                <Textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Explain your reasoning..."
                  className="min-h-20"
                />
              </div>

              {/* Submit Individual Response */}
              <Button
                onClick={handleIndividualSubmit}
                disabled={individualAnswer === '' || hasSubmitted}
                className="w-full"
              >
                {hasSubmitted ? 'Response Submitted' : 'Submit Individual Response'}
              </Button>
            </div>

            {/* Team Responses Display */}
            {renderTeamResponses()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {questions.length}
          </span>

          <Button
            onClick={handleNextQuestion}
            disabled={!hasSubmitted}
            className="flex items-center gap-2"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}