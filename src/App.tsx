import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from './components/HomePage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { ResultsPage } from './components/ResultsPage';
import { AssessmentResponse } from './lib/types';

type AppState = 'home' | 'questionnaire' | 'results';

function App() {
  const [currentPage, setCurrentPage] = useKV<AppState>('currentPage', 'home');
  const [responses, setResponses] = useKV<AssessmentResponse[]>('responses', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useKV<number>('currentQuestionIndex', 0);

  const handleStartAssessment = () => {
    setResponses(() => []);
    setCurrentQuestionIndex(() => 0);
    setCurrentPage(() => 'questionnaire');
  };

  const handleQuestionnaireComplete = (finalResponses: AssessmentResponse[]) => {
    setResponses(() => finalResponses);
    setCurrentPage(() => 'results');
  };

  const handleRestartAssessment = () => {
    setResponses(() => []);
    setCurrentQuestionIndex(() => 0);
    setCurrentPage(() => 'home');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'home' && (
        <HomePage onStartAssessment={handleStartAssessment} />
      )}
      {currentPage === 'questionnaire' && (
        <QuestionnairePage
          responses={responses || []}
          setResponses={setResponses}
          currentQuestionIndex={currentQuestionIndex || 0}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          onComplete={handleQuestionnaireComplete}
        />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          responses={responses || []}
          onRestartAssessment={handleRestartAssessment}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;