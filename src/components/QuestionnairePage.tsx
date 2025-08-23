import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Info } from '@phosphor-icons/react';
import { getFilteredQuestions } from '../lib/data';
import { AssessmentResponse, FilterOptions } from '../lib/types';
import { QuestionInput } from './QuestionInput';

interface QuestionnairePageProps {
  responses: AssessmentResponse[];
  setResponses: (updater: (prev: AssessmentResponse[]) => AssessmentResponse[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (updater: (prev: number) => number) => void;
  onComplete: (responses: AssessmentResponse[]) => void;
  filterOptions: FilterOptions;
}

export function QuestionnairePage({
  responses,
  setResponses,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  onComplete,
  filterOptions
}: QuestionnairePageProps) {
  const filteredQuestions = useMemo(() => 
    getFilteredQuestions(filterOptions.selectedFrameworks, filterOptions.includeAllFrameworks),
    [filterOptions.selectedFrameworks, filterOptions.includeAllFrameworks]
  );
  
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const totalQuestions = filteredQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);

  const handleAnswerChange = (answer: string | boolean) => {
    setResponses((currentResponses) => {
      const newResponses = currentResponses.filter(r => r.questionId !== currentQuestion.id);
      newResponses.push({
        questionId: currentQuestion.id,
        answer
      });
      return newResponses;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((current) => current + 1);
    } else {
      // Complete assessment
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((current) => current - 1);
    }
  };

  const isAnswered = currentResponse !== undefined && 
    (currentResponse.answer !== '' && currentResponse.answer !== null && currentResponse.answer !== undefined);

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Audit Readiness Assessment</h1>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
        </div>
        <Progress value={progress} className="w-full h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {currentQuestion.id}
                </span>
                <Badge 
                  variant={currentQuestion.critical ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {currentQuestion.critical ? "Critical" : `Weight: ${currentQuestion.weight}`}
                </Badge>
              </div>
              <h2 className="text-lg font-semibold text-foreground leading-relaxed">
                {currentQuestion.prompt}
              </h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <QuestionInput
              question={currentQuestion}
              value={currentResponse?.answer}
              onChange={handleAnswerChange}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Info size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Regulatory Reference: <strong>{currentQuestion.clauseRef}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{responses.length}</span>
          <span>/</span>
          <span>{totalQuestions}</span>
          <span>answered</span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="flex items-center gap-2"
        >
          {isLastQuestion ? 'Complete Assessment' : 'Next'}
          {!isLastQuestion && <ArrowRight size={16} />}
        </Button>
      </div>

      {/* Question Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Assessment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questionnaire.map((q, index) => {
              const isAnswered = responses.some(r => r.questionId === q.id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(() => index)}
                  className={`
                    aspect-square rounded-lg border-2 text-xs font-medium transition-all
                    ${isCurrent 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : isAnswered
                      ? 'border-success bg-success/10 text-success'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}