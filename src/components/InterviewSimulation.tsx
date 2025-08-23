import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, RotateCcw, Clock, User, MessageCircle, CheckCircle, AlertTriangle } from '@phosphor-icons/react';
import { FilterOptions, AssessmentResponse, InterviewQuestion, InterviewSession, InterviewResponse, InspectorRole } from '@/lib/types';
import { generateInterviewQuestions } from '@/lib/interviewData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface InterviewSimulationProps {
  responses: AssessmentResponse[];
  filterOptions: FilterOptions;
  onBack: () => void;
}

export function InterviewSimulation({ responses, filterOptions, onBack }: InterviewSimulationProps) {
  const [selectedRole, setSelectedRole] = useState<InspectorRole>('lead_inspector');
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useKV<InterviewResponse[]>('interview_responses', []);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentConfidence, setCurrentConfidence] = useState(3);
  const [showExpectedAnswer, setShowExpectedAnswer] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const roles = [
    { 
      id: 'lead_inspector' as InspectorRole, 
      title: 'Lead Inspector', 
      description: 'Overall audit strategy, high-level QMS questions',
      icon: User,
      color: 'bg-primary/10 text-primary'
    },
    { 
      id: 'quality_specialist' as InspectorRole, 
      title: 'Quality Specialist', 
      description: 'Quality systems, processes, and documentation',
      icon: CheckCircle,
      color: 'bg-success/10 text-success'
    },
    { 
      id: 'technical_reviewer' as InspectorRole, 
      title: 'Technical Reviewer', 
      description: 'Design controls, risk management, validation',
      icon: AlertTriangle,
      color: 'bg-warning/10 text-warning'
    },
    { 
      id: 'compliance_officer' as InspectorRole, 
      title: 'Compliance Officer', 
      description: 'Regulatory requirements, corrective actions',
      icon: MessageCircle,
      color: 'bg-accent/10 text-accent'
    }
  ];

  useEffect(() => {
    if (currentSession && currentQuestionIndex >= currentSession.questions.length) {
      setSessionComplete(true);
    }
  }, [currentQuestionIndex, currentSession]);

  const startSession = (role: InspectorRole) => {
    const questions = generateInterviewQuestions(responses, filterOptions, role);
    const session: InterviewSession = {
      id: `session_${Date.now()}`,
      role,
      questions,
      duration: questions.length * 3, // 3 minutes per question estimate
      focus: getSessionFocus(role),
      preparation: getPreparationTips(role)
    };
    
    setCurrentSession(session);
    setCurrentQuestionIndex(0);
    setUserResponses(() => []);
    setCurrentResponse('');
    setShowExpectedAnswer(false);
    setSessionComplete(false);
  };

  const getSessionFocus = (role: InspectorRole): string[] => {
    const focusMap = {
      lead_inspector: ['Management commitment', 'QMS overview', 'Risk management strategy'],
      quality_specialist: ['Document control', 'Process validation', 'Corrective actions'],
      technical_reviewer: ['Design controls', 'Verification & validation', 'Device safety'],
      compliance_officer: ['Regulatory compliance', 'Change control', 'Post-market surveillance']
    };
    return focusMap[role];
  };

  const getPreparationTips = (role: InspectorRole): string[] => {
    const tipsMap = {
      lead_inspector: ['Know your organizational structure', 'Understand your quality policy', 'Be ready to discuss strategic quality initiatives'],
      quality_specialist: ['Have process flowcharts ready', 'Know your metrics and KPIs', 'Understand interdepartmental handoffs'],
      technical_reviewer: ['Prepare technical justifications', 'Have design history files accessible', 'Know your testing protocols'],
      compliance_officer: ['Keep regulatory correspondence organized', 'Know your change control process', 'Understand market feedback loops']
    };
    return tipsMap[role];
  };

  const submitResponse = () => {
    if (!currentSession || !currentResponse.trim()) {
      toast.error('Please provide a response before continuing');
      return;
    }

    const response: InterviewResponse = {
      questionId: currentSession.questions[currentQuestionIndex].id,
      userResponse: currentResponse,
      confidence: currentConfidence,
      needsImprovement: currentConfidence < 3
    };

    setUserResponses((prev) => [...prev, response]);
    setCurrentResponse('');
    setCurrentConfidence(3);
    setShowExpectedAnswer(true);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setShowExpectedAnswer(false);
  };

  const resetSession = () => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setUserResponses(() => []);
    setSessionComplete(false);
  };

  const calculateScore = () => {
    if (!userResponses?.length) return 0;
    const averageConfidence = userResponses.reduce((sum, r) => sum + r.confidence, 0) / userResponses.length;
    return Math.round((averageConfidence / 5) * 100);
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
            <h1 className="text-3xl font-bold mb-2">Interview Simulation</h1>
            <p className="text-muted-foreground">
              Practice responding to common regulatory inspector questions based on your assessment results.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg">{role.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Focus Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {getSessionFocus(role.id).map((focus, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        onClick={() => startSession(role.id)}
                        className="w-full"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-sm"><strong>Select Role</strong><br />Choose the type of inspector</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p className="text-sm"><strong>Practice Responses</strong><br />Answer realistic questions</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <p className="text-sm"><strong>Review & Improve</strong><br />Compare with expected answers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const score = calculateScore();
    const needsWork = userResponses?.filter(r => r.needsImprovement) || [];
    
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Session Complete!</CardTitle>
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <p className="text-muted-foreground">Interview Confidence Score</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">{userResponses?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{needsWork.length}</div>
                  <p className="text-sm text-muted-foreground">Areas for Improvement</p>
                </div>
              </div>

              {needsWork.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Focus Areas for Practice:</h3>
                  <div className="space-y-2">
                    {needsWork.map((response, idx) => {
                      const question = currentSession.questions.find(q => q.id === response.questionId);
                      return (
                        <div key={idx} className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                          <p className="text-sm font-medium text-warning">{question?.category}</p>
                          <p className="text-sm">{question?.question}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={resetSession} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Another Role
                </Button>
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = currentSession.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / currentSession.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={resetSession}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Role Selection
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              ~{currentSession.duration} min session
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {roles.find(r => r.id === currentSession.role)?.title} Interview
              </h2>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentSession.questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{currentQuestion.category}</Badge>
                  <Badge variant={
                    currentQuestion.difficulty === 'basic' ? 'default' :
                    currentQuestion.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                  }>
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-4">{currentQuestion.question}</h3>
                
                {currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Potential Follow-ups:</p>
                    <ul className="text-sm space-y-1">
                      {currentQuestion.followUpQuestions.map((followUp, idx) => (
                        <li key={idx} className="text-muted-foreground">• {followUp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Response:</label>
                    <Textarea
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      placeholder="Type your response as you would speak to the inspector..."
                      className="min-h-[120px]"
                      disabled={showExpectedAnswer}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Confidence Level: {currentConfidence}/5
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => setCurrentConfidence(level)}
                          disabled={showExpectedAnswer}
                          className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                            level <= currentConfidence
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted-foreground/10'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!showExpectedAnswer ? (
                    <Button onClick={submitResponse} disabled={!currentResponse.trim()}>
                      Submit Response
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQuestionIndex < currentSession.questions.length - 1 ? 'Next Question' : 'Complete Session'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {showExpectedAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expected Response</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{currentQuestion.expectedResponse}</p>

                      {currentQuestion.tips.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-success mb-2">💡 Key Tips:</p>
                          <ul className="text-sm space-y-1">
                            {currentQuestion.tips.map((tip, idx) => (
                              <li key={idx} className="text-muted-foreground">• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentQuestion.commonMistakes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-destructive mb-2">⚠️ Common Mistakes:</p>
                          <ul className="text-sm space-y-1">
                            {currentQuestion.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="text-muted-foreground">• {mistake}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentQuestion.clauseReferences.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">📋 Related Clauses:</p>
                          <div className="flex flex-wrap gap-1">
                            {currentQuestion.clauseReferences.map((ref, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {ref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Focus Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentSession.focus.map((focus, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{focus}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}