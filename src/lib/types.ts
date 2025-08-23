export type RegulatoryFramework = 'ISO_13485' | 'CFR_820' | 'MDR' | 'ISO_14155';

export type DeviceRiskClass = 'Class I' | 'Class II' | 'Class III' | 'Class IIa' | 'Class IIb';

export type DeviceCategory = 'surgical' | 'diagnostic' | 'therapeutic';

export interface RiskClassification {
  fdaClass?: 'Class I' | 'Class II' | 'Class III';
  euClass?: 'Class I' | 'Class IIa' | 'Class IIb' | 'Class III';
  isSterile?: boolean;
  isMeasuring?: boolean;
  hasActiveComponents?: boolean;
  isDrugDevice?: boolean;
  deviceCategory?: DeviceCategory;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface Question {
  id: string;
  prompt: string;
  type: 'yesno' | 'select' | 'text';
  weight: number;
  clauseRef: string;
  options?: string[];
  critical?: boolean;
  frameworks: RegulatoryFramework[];
  riskMultipliers?: Partial<Record<DeviceRiskClass, number>>;
  categoryMultipliers?: Partial<Record<DeviceCategory, number>>;
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
  weightedBreakdown: WeightedBreakdown;
  riskAssessment: RiskAssessment;
  frameworkScores: Record<RegulatoryFramework, FrameworkScore>;
}

export interface WeightedBreakdown {
  totalPossibleWeight: number;
  actualWeightedScore: number;
  weightingFactors: WeightingFactor[];
  criticalImpact: number;
}

export interface WeightingFactor {
  category: string;
  weight: number;
  maxScore: number;
  actualScore: number;
  performance: number; // percentage
  clauseRefs: string[];
}

export interface RiskAssessment {
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  riskFactors: RiskFactor[];
  mitigationPriority: string[];
  complianceMaturity: 'basic' | 'developing' | 'advanced' | 'optimized';
}

export interface RiskFactor {
  type: 'critical_failure' | 'high_weight_gap' | 'framework_weakness' | 'process_gap';
  description: string;
  impact: number;
  likelihood: 'high' | 'medium' | 'low';
  clauseRefs: string[];
}

export interface FrameworkScore {
  framework: RegulatoryFramework;
  score: number;
  maxPossibleScore: number;
  criticalFailures: number;
  gaps: number;
  performance: number; // percentage
  recommendation: string;
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
  weightedBreakdown: WeightedBreakdown;
  riskAssessment: RiskAssessment;
  frameworkScores: Record<RegulatoryFramework, FrameworkScore>;
}

export interface FilterOptions {
  selectedFrameworks: RegulatoryFramework[];
  includeAllFrameworks: boolean;
  riskClassification?: RiskClassification;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  frameworks: RegulatoryFramework[];
  deviceCategories: DeviceCategory[];
  riskClasses: DeviceRiskClass[];
  estimatedHours: number;
  dependencies?: string[];
  evidenceTypes: string[];
  commonPitfalls?: string[];
  tips?: string[];
}

export interface PreparationGuide {
  id: string;
  title: string;
  description: string;
  category: DeviceCategory;
  frameworks: RegulatoryFramework[];
  riskClass: DeviceRiskClass;
  sections: GuideSection[];
  totalEstimatedHours: number;
  keyMilestones: Milestone[];
}

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  estimatedHours: number;
  order: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  daysFromStart: number;
  deliverables: string[];
  criticalPath: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  expectedResponse: string;
  followUpQuestions?: string[];
  commonMistakes: string[];
  clauseReferences: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  frameworks: RegulatoryFramework[];
  roles: InspectorRole[];
  tips: string[];
}

export type InspectorRole = 'lead_inspector' | 'quality_specialist' | 'technical_reviewer' | 'compliance_officer';

export interface InterviewSession {
  id: string;
  role: InspectorRole;
  questions: InterviewQuestion[];
  duration: number; // minutes
  focus: string[];
  preparation: string[];
}

export interface InterviewResponse {
  questionId: string;
  userResponse: string;
  confidence: number; // 1-5 scale
  needsImprovement: boolean;
  notes?: string;
}