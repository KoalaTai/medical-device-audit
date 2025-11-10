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
  questionId?: string;
  answer?: any;
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

export type DeviceCategory = 'surgical' | 'diagnostic' | 'therapeutic' | 'monitoring' | 'implantable' | 'ivd';
export type DeviceRiskClass = 'Class I' | 'Class II' | 'Class III' | 'Class IIa' | 'Class IIb';
export type RegulatoryFramework = 'CFR_820' | 'ISO_13485' | 'MDR' | 'ISO_14155' | 'IVDR';
export type InspectorRole = 'lead_inspector' | 'quality_specialist' | 'technical_reviewer' | 'compliance_officer';
export type TeamRole = 'quality_manager' | 'regulatory_affairs' | 'design_engineer' | 'manufacturing_lead' | 'clinical_specialist';
export type TrainingPhase = 'role_assignment' | 'individual_assessment' | 'team_discussion' | 'consensus_building' | 'results_review';

export interface FilterOptions {
  selectedFrameworks: RegulatoryFramework[];
  deviceCategory?: DeviceCategory;
  riskClass?: DeviceRiskClass;
  includeAllFrameworks?: boolean;
  riskClassification?: RiskClassification;
}

export interface RiskClassification {
  level: 'low' | 'medium' | 'high';
  justification: string;
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
  evidenceTypes?: string[];
  commonPitfalls?: string[];
  tips?: string[];
}

export interface PreparationGuide {
  id: string;
  title: string;
  description: string;
  deviceCategory: DeviceCategory;
  riskClass: DeviceRiskClass;
  totalEstimatedHours: number;
  sections: PreparationSection[];
  keyMilestones: Milestone[];
}

export interface PreparationSection {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  items: PreparationItem[];
}

export interface PreparationItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
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

export interface InterviewSession {
  id: string;
  role: InspectorRole;
  questions: InterviewQuestion[];
  duration: number;
  focus: string[];
  preparation: string[];
}

export interface InterviewResponse {
  questionId: string;
  userResponse: string;
  confidence: number;
  needsImprovement: boolean;
}

export interface TeamSession {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  members: TeamMember[];
  status: 'setup' | 'in_progress' | 'completed' | 'archived';
  currentPhase: TrainingPhase;
  filterOptions?: FilterOptions;
}

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  department: string;
  joinedAt: Date;
  isLeader: boolean;
}

export interface TeamResponse {
  questionId: string;
  individualResponses: Record<string, {
    answer: any;
    confidence: number;
    rationale?: string;
  }>;
  consensusAnswer?: any;
  consensusReached: boolean;
  discussionNotes?: string[];
  votingRounds?: Array<{
    round: number;
    votes: Record<string, any>;
  }>;
}

export interface TeamScoreResult extends ScoringResult {
  individualScores: Record<string, ScoringResult>;
  consensusScore?: ScoringResult;
  teamMetrics?: ConsensusMetrics;
  dynamics?: TeamDynamics;
  roleAnalysis: Record<TeamRole, RoleAnalysis>;
  recommendations?: TeamRecommendation[];
  collaborationScore?: number;
  recommendedActions?: TeamRecommendation[];
}

export interface ConsensusMetrics {
  consensusRate?: number;
  averageDiscussionTime?: number;
  highestDisagreementTopics?: string[];
  overallConsensusRate: number;
  timeToConsensus: Record<string, number>;
  disagreementPatterns: any[];
  consensusQuality: 'strong' | 'moderate' | 'weak' | 'forced';
  votingRoundsRequired: number;
}

export interface TeamDynamics {
  leadershipBalance?: number;
  participationBalance: Record<string, number>;
  expertiseUtilization?: number;
  influencePatterns: any[];
  communicationEffectiveness: number;
  conflictResolutionStyle: string;
  decisionMakingSpeed: string;
}

export interface RoleAnalysis {
  memberId?: string;
  memberName?: string;
  role: TeamRole;
  strengthAreas?: string[];
  improvementAreas?: string[];
  contributionScore?: number;
  expectedStrengths: string[];
  actualPerformance: number;
  knowledgeGaps: any[];
  contributionQuality: number;
  collaborationScore: number;
  recommendedTraining: string[];
  roleSpecificInsights: string[];
}

export interface TeamRecommendation {
  type: 'training' | 'process' | 'collaboration' | 'documentation' | 'communication' | 'leadership';
  priority: 'high' | 'medium' | 'low' | 'immediate' | 'short_term';
  title?: string;
  description: string;
  actionItems?: string[];
  targetRoles?: TeamRole[];
  estimatedImpact?: number;
  implementationSteps?: string[];
}