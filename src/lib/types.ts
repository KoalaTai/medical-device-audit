export type RegulatoryFramework = 'ISO_13485' | 'CFR_820' | 'MDR' | 'ISO_14155';

export interface Question {
  id: string;
  prompt: string;
  type: 'yesno' | 'select' | 'text';
  weight: number;
  clauseRef: string;
  options?: string[];
  critical?: boolean;
  frameworks: RegulatoryFramework[];
}

export interface StandardsMap {
  [key: string]: {
    title: string;
    riskWeight: number;
    critical?: boolean;
    framework: RegulatoryFramework;
  };
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | boolean;
}

export interface ScoreResult {
  score: number;
  status: 'red' | 'amber' | 'green';
  gaps: Gap[];
  criticalFailures: string[];
}

export interface Gap {
  questionId: string;
  prompt: string;
  clauseRef: string;
  clauseTitle: string;
  deficit: number;
  suggestedEvidence: string[];
}

export interface ExportData {
  timestamp: string;
  score: number;
  status: string;
  responses: AssessmentResponse[];
  gaps: Gap[];
  gapAnalysis: string;
  capaPlan: string;
  interviewScript: string;
  selectedFrameworks: RegulatoryFramework[];
}

export interface FilterOptions {
  selectedFrameworks: RegulatoryFramework[];
  includeAllFrameworks: boolean;
}