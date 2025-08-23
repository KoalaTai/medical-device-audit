import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { AssessmentResponse, Question } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { ArrowRight, ArrowLeft, HelpCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface QuestionnairePageProps {
  responses: AssessmentResponse[];
  setResponses: (update: (current: AssessmentResponse[]) => AssessmentResponse[]) => void;
  onComplete: (responses: AssessmentResponse[]) => void;
}

export function QuestionnairePage({ responses, setResponses, onComplete }: QuestionnairePageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string | boolean | number>('');
  const [showHelp, setShowHelp] = useState(false);
  
  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Load existing response for current question
  React.useEffect(() => {
    const existingResponse = responses.find(r => r.question_id === currentQuestion?.id);
    if (existingResponse) {
      setCurrentAnswer(existingResponse.value);
    } else {
      setCurrentAnswer(currentQuestion?.type === 'slider' ? 3 : '');
    }
  }, [currentQuestionIndex, responses, currentQuestion]);

  const handleAnswer = (value: string | boolean | number) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    // Validate answer
    if (currentAnswer === '' || currentAnswer === null || currentAnswer === undefined) {
      toast.error('Please provide an answer before continuing');
      return;
    }

    // Save response
    const newResponse: AssessmentResponse = {
      question_id: currentQuestion.id,
      value: currentAnswer,
      timestamp: new Date().toISOString()
    };

    setResponses((current) => {
      const filtered = current.filter(r => r.question_id !== currentQuestion.id);
      return [...filtered, newResponse];
    });

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHelp(false);
    } else {
      // Assessment complete
      const finalResponses = responses.filter(r => r.question_id !== currentQuestion.id);
      finalResponses.push(newResponse);
      onComplete(finalResponses);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHelp(false);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'boolean':
        return (
          <div className="space-y-3">
            <div className="flex gap-4">
              <Button
                variant={currentAnswer === true ? 'default' : 'outline'}
                onClick={() => handleAnswer(true)}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                variant={currentAnswer === false ? 'default' : 'outline'}
                onClick={() => handleAnswer(false)}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <Button
                key={option}
                variant={currentAnswer === option ? 'default' : 'outline'}
                onClick={() => handleAnswer(option)}
                className="w-full justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        );

      case 'slider':
        const sliderValue = typeof currentAnswer === 'number' ? [currentAnswer] : [3];
        return (
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={sliderValue}
                onValueChange={(value) => handleAnswer(value[0])}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-4">
              <span>1 - Poor</span>
              <span className="font-medium">
                Current: {sliderValue[0]}
              </span>
              <span>5 - Excellent</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <Textarea
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your response..."
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Assessment in Progress</h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {currentQuestion.clause_ref}
                  </Badge>
                  {currentQuestion.critical && (
                    <Badge variant="destructive" className="text-xs">
                      Critical
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">
                  {currentQuestion.text}
                </CardTitle>
                {currentQuestion.help_text && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(!showHelp)}
                    className="mb-4 h-auto p-2"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {showHelp ? 'Hide' : 'Show'} Help
                  </Button>
                )}
                {showHelp && currentQuestion.help_text && (
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <p className="text-sm text-muted-foreground">
                      {currentQuestion.help_text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderQuestionInput()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestionIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}