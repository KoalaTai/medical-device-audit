// Core types for the audit simulation system
export interface Question {
  id: string;
  text: string;
  type: 'boolean' | 'select' | 'text' | 'slider';
  options?: string[];
  clause_ref: string;
  critical: boolean;
  weight: number;
  category: string;
  help_text?: string;
}

export interface AssessmentResponse {
  question_id: string;
  value: string | boolean | number;
  timestamp: string;
}

export interface ScoringResult {
  version: string;
  overall_score: number;
  status: 'Red' | 'Amber' | 'Green';
  critical_hit: boolean;
  top_gaps: Gap[];
  answers: AssessmentResponse[];
  weights_summary: {
    sum_weights: number;
    sum_obtained: number;
  };
  timestamp: string;
  engine_notes: string;
}

export interface Gap {
  question_id: string;
  clause_ref: string;
  deficit: number;
  label: string;
}

export interface ArtifactData {
  gap_list: string;
  capa_plan: string;
  interview_script: string;
}