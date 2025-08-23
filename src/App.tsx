import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from './components/HomePage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { ResultsPage } from './components/ResultsPage';
import { AssessmentResponse } from './lib/types';

type AppState = 'home' | 'questionnaire' | 'results';

function App() {
  const [currentPage, setCurrentPage] = useKV<AppState>('audit_sim_page', 'home');
  const [responses, setResponses] = useKV<AssessmentResponse[]>('audit_sim_responses', []);

  const handleStartAssessment = () => {
    setResponses(() => []);
    setCurrentPage(() => 'questionnaire');
  };

  const handleAssessmentComplete = (finalResponses: AssessmentResponse[]) => {
    setResponses(() => finalResponses);
    setCurrentPage(() => 'results');
  };

  const handleRestartAssessment = () => {
    setResponses(() => []);
    setCurrentPage(() => 'home');
  };

  const handleBackToResults = () => {
    setCurrentPage(() => 'results');
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
          onComplete={handleAssessmentComplete}
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