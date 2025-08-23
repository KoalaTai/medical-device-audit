import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from './components/HomePage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { ResultsPage } from './components/ResultsPage';
import { AssessmentResponse, FilterOptions } from './lib/types';

type AppState = 'home' | 'questionnaire' | 'results';

function App() {
  const [currentPage, setCurrentPage] = useKV<AppState>('currentPage', 'home');
  const [responses, setResponses] = useKV<AssessmentResponse[]>('responses', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useKV<number>('currentQuestionIndex', 0);
  const [filterOptions, setFilterOptions] = useKV<FilterOptions>('filterOptions', {
    selectedFrameworks: [],
    includeAllFrameworks: true
  });

  const handleStartAssessment = (newFilterOptions: FilterOptions) => {
    setFilterOptions(() => newFilterOptions);
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
    setFilterOptions(() => ({
      selectedFrameworks: [],
      includeAllFrameworks: true
    }));
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
          filterOptions={filterOptions || { selectedFrameworks: [], includeAllFrameworks: true }}
        />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          responses={responses || []}
          onRestartAssessment={handleRestartAssessment}
          filterOptions={filterOptions || { selectedFrameworks: [], includeAllFrameworks: true }}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;