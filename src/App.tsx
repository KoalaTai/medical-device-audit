import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from './components/HomePage';
import { QuestionnairePage } from './components/QuestionnairePage';
import { ResultsPage } from './components/ResultsPage';
import { AuditChecklist } from './components/AuditChecklist';
import { AssessmentResponse, FilterOptions } from './lib/types';

type AppState = 'home' | 'questionnaire' | 'results' | 'checklist';

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

  const handleBackToResults = () => {
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
          onShowAuditChecklist={handleShowAuditChecklist}
          filterOptions={filterOptions || { selectedFrameworks: [], includeAllFrameworks: true }}
        />
      )}
      {currentPage === 'checklist' && filterOptions?.riskClassification && (
        <AuditChecklist
          deviceCategory={filterOptions.riskClassification.deviceCategory || 'diagnostic'}
          riskClass={filterOptions.riskClassification.fdaClass || filterOptions.riskClassification.euClass || 'Class II'}
          frameworks={filterOptions.selectedFrameworks || ['ISO_13485', 'CFR_820']}
          onBack={handleBackToResults}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;