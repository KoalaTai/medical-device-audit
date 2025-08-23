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
  
  const questions = getFilteredQuestions(session.selectedFrameworks, session.riskClassification);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const currentTeamResponse = teamResponses[currentQuestion?.id] || {
    questionId: currentQuestion?.id || '',
    individualResponses: {},
    discussionNotes: [],
    consensusReached: false,
    disagreementLevel: 'none' as const,
    votingRounds: []
  };

  const hasAnswered = currentMember.id in currentTeamResponse.individualResponses;
  const allMembersAnswered = session.members.every(member => 
    member.id in currentTeamResponse.individualResponses
  );

  const handleSubmitIndividualResponse = () => {
    if (individualAnswer === '' || individualAnswer === null) {
      toast.error('Please provide an answer');
      return;
    }

    const updatedTeamResponse: TeamResponse = {
      ...currentTeamResponse,
      individualResponses: {
        ...currentTeamResponse.individualResponses,
        [currentMember.id]: {
          answer: individualAnswer,
          confidence,
          rationale: rationale.trim(),
          timestamp: new Date()
        }
      }
    };

    // Check for disagreement
    const responses = Object.values(updatedTeamResponse.individualResponses);
    if (responses.length > 1) {
      const answers = responses.map(r => r.answer);
      const uniqueAnswers = [...new Set(answers)];
      
      if (uniqueAnswers.length > 1) {
        const confidenceLevels = responses.map(r => r.confidence);
        const avgConfidence = confidenceLevels.reduce((a, b) => a + b, 0) / confidenceLevels.length;
        
        updatedTeamResponse.disagreementLevel = 
          uniqueAnswers.length === responses.length ? 'major' :
          avgConfidence < 2.5 ? 'significant' :
          'minor';
      }
    }

    setTeamResponses(current => ({
      ...current,
      [currentQuestion.id]: updatedTeamResponse
    }));

    // Reset form
    setIndividualAnswer('');
    setConfidence(3);
    setRationale('');

    toast.success('Your response has been submitted');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(current => current + 1);
      setIndividualAnswer('');
      setConfidence(3);
      setRationale('');
    } else {
      // All questions completed, move to team discussion phase
      const updatedSession = {
        ...session,
        currentPhase: 'team_discussion' as const
      };
      onPhaseComplete(updatedSession);
      toast.success('Individual assessment completed! Moving to team discussion.');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(current => current - 1);
      setIndividualAnswer('');
      setConfidence(3);
      setRationale('');
    }
  };

  const renderAnswerInput = () => {
    if (currentQuestion.type === 'yesno') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={individualAnswer === true ? 'default' : 'outline'}
              onClick={() => setIndividualAnswer(true)}
              className="h-16"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Yes
            </Button>
            <Button
              variant={individualAnswer === false ? 'default' : 'outline'}
              onClick={() => setIndividualAnswer(false)}
              className="h-16"
            >
              ✗ No
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
              className="w-full justify-start h-auto p-4 whitespace-normal"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <Textarea
        placeholder="Enter your response..."
        value={individualAnswer as string}
        onChange={(e) => setIndividualAnswer(e.target.value)}
        className="min-h-24"
      />
    );
  };

  const getDisagreementColor = (level: string) => {
    switch (level) {
      case 'major': return 'text-destructive';
      case 'significant': return 'text-warning';
      case 'minor': return 'text-accent';
      default: return 'text-success';
    }
  };

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Assessment Complete!</h3>
          <p className="text-muted-foreground">
            All team members have completed the individual assessment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium">Individual Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <Badge variant="secondary">
              {currentMember.role.replace('_', ' ')}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">
                {currentQuestion.prompt}
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <Badge variant="outline">
                  {currentQuestion.clauseRef}
                </Badge>
                <span>Weight: {currentQuestion.weight}</span>
                {currentQuestion.critical && (
                  <Badge variant="destructive">Critical</Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasAnswered ? (
            // Individual response form
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Your Answer</label>
                {renderAnswerInput()}
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Confidence Level: {confidence}/5
                </label>
                <Slider
                  value={[confidence]}
                  onValueChange={(value) => setConfidence(value[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Uncertain</span>
                  <span>Very Confident</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Rationale (Optional)
                </label>
                <Textarea
                  placeholder="Explain your reasoning, especially if you have concerns or additional context..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <Button 
                onClick={handleSubmitIndividualResponse}
                className="w-full"
                disabled={individualAnswer === '' || individualAnswer === null}
              >
                Submit Response
              </Button>
            </div>
          ) : (
            // Show submitted response and team status
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Your Response</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Answer:</span>
                    <Badge variant="secondary">
                      {typeof currentTeamResponse.individualResponses[currentMember.id].answer === 'boolean'
                        ? currentTeamResponse.individualResponses[currentMember.id].answer ? 'Yes' : 'No'
                        : currentTeamResponse.individualResponses[currentMember.id].answer
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Confidence:</span>
                    <span className="text-sm font-medium">
                      {currentTeamResponse.individualResponses[currentMember.id].confidence}/5
                    </span>
                  </div>
                  {currentTeamResponse.individualResponses[currentMember.id].rationale && (
                    <div>
                      <span className="text-sm">Rationale:</span>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {currentTeamResponse.individualResponses[currentMember.id].rationale}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Team response status */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Team Status</h4>
                  <Badge variant={allMembersAnswered ? 'default' : 'secondary'}>
                    {Object.keys(currentTeamResponse.individualResponses).length}/{session.members.length} answered
                  </Badge>
                </div>

                <div className="space-y-2">
                  {session.members.map(member => {
                    const hasResponded = member.id in currentTeamResponse.individualResponses;
                    return (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {hasResponded ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-sm">{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>

                {currentTeamResponse.disagreementLevel !== 'none' && (
                  <div className={`mt-4 p-3 rounded-lg bg-muted ${getDisagreementColor(currentTeamResponse.disagreementLevel)}`}>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {currentTeamResponse.disagreementLevel} disagreement detected
                      </span>
                    </div>
                    <p className="text-xs mt-1 opacity-80">
                      This will be discussed in the team phase
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} / {questions.length}
        </div>

        <Button
          onClick={handleNextQuestion}
          disabled={!allMembersAnswered}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}