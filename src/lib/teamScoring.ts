import { 
  TeamScoreResult, 
  AssessmentResponse, 
  Question, 
  TeamResponse, 
  TeamMember, 
  RegulatoryFramework,
  RiskClassification,
  ConsensusMetrics,
  TeamDynamics,
  RoleAnalysis,
  TeamRecommendation,
  TeamRole
} from './types';
import { calculateScore } from './scoring';

export function calculateTeamScore(
  assessmentResponses: AssessmentResponse[],
  questions: Question[],
  teamResponses: Record<string, TeamResponse>,
  members: TeamMember[],
  frameworks: RegulatoryFramework[],
  riskClassification?: RiskClassification
): TeamScoreResult {
  // Calculate individual scores for each member
  const individualScores: Record<string, any> = {};
  
  members.forEach(member => {
    const memberResponses: AssessmentResponse[] = [];
    
    Object.values(teamResponses).forEach(teamResponse => {
      const individualResponse = teamResponse.individualResponses[member.id];
      if (individualResponse) {
        memberResponses.push({
          questionId: teamResponse.questionId,
          answer: individualResponse.answer
        });
      }
    });

    individualScores[member.id] = calculateScore(memberResponses);
  });

  // Calculate base team score using consensus responses
  const baseScore = calculateScore(assessmentResponses);

  // Calculate consensus metrics
  const consensusMetrics = calculateConsensusMetrics(teamResponses, members);
  
  // Calculate team dynamics
  const teamDynamics = calculateTeamDynamics(teamResponses, members);
  
  // Calculate collaboration score
  const collaborationScore = calculateCollaborationScore(consensusMetrics, teamDynamics);
  
  // Calculate role analysis
  const roleAnalysis = calculateRoleAnalysis(
    individualScores, 
    teamResponses, 
    members, 
    questions
  );
  
  // Generate recommendations
  const recommendedActions = generateTeamRecommendations(
    baseScore,
    consensusMetrics,
    teamDynamics,
    roleAnalysis,
    individualScores
  );

  return {
    ...baseScore,
    individualScores,
    consensusMetrics,
    teamMetrics: consensusMetrics,
    dynamics: teamDynamics,
    teamDynamics,
    roleAnalysis,
    collaborationScore,
    recommendedActions,
    recommendations: recommendedActions
  } as TeamScoreResult;
}

function calculateConsensusMetrics(
  teamResponses: Record<string, TeamResponse>,
  members: TeamMember[]
): ConsensusMetrics {
  const responses = Object.values(teamResponses);
  const totalQuestions = responses.length;
  const consensusReached = responses.filter(r => r.consensusReached).length;
  
  const timeToConsensus: Record<string, number> = {};
  let totalVotingRounds = 0;
  
  responses.forEach(response => {
    if (response.votingRounds && response.votingRounds.length > 0) {
      totalVotingRounds += response.votingRounds.length;
      
      // Simulate time based on voting rounds and discussion length
      const discussionTime = (response.discussionNotes?.length || 0) * 2; // 2 min per note
      const votingTime = response.votingRounds.length * 5; // 5 min per round
      timeToConsensus[response.questionId] = discussionTime + votingTime;
    }
  });

  const disagreementPatterns = analyzeDisagreementPatterns(teamResponses, members);

  return {
    overallConsensusRate: totalQuestions > 0 ? (consensusReached / totalQuestions) * 100 : 0,
    timeToConsensus,
    disagreementPatterns,
    consensusQuality: getConsensusQuality(consensusReached, totalQuestions, disagreementPatterns.length),
    votingRoundsRequired: totalQuestions > 0 ? totalVotingRounds / totalQuestions : 0
  };
}

function calculateTeamDynamics(
  teamResponses: Record<string, TeamResponse>,
  members: TeamMember[]
): TeamDynamics {
  const participationBalance: Record<string, number> = {};
  const responses = Object.values(teamResponses);
  
  // Calculate participation balance
  members.forEach(member => {
    let participationCount = 0;
    let totalPossible = 0;
    
    responses.forEach(response => {
      totalPossible++;
      if (response.individualResponses[member.id]) {
        participationCount++;
      }
      if (response.discussionNotes?.some(note => note.includes(member.name))) {
        participationCount += 0.5; // Bonus for discussion participation
      }
    });
    
    participationBalance[member.id] = totalPossible > 0 ? 
      Math.min(100, (participationCount / totalPossible) * 100) : 0;
  });

  // Analyze influence patterns
  const influencePatterns = calculateInfluencePatterns(teamResponses, members);
  
  // Communication effectiveness based on discussion quality
  const totalDiscussionNotes = responses.reduce((sum, r) => sum + (r.discussionNotes?.length || 0), 0);
  const avgDiscussionPerQuestion = totalDiscussionNotes / responses.length;
  const communicationEffectiveness = Math.min(100, avgDiscussionPerQuestion * 25); // 4 notes = 100%

  return {
    participationBalance,
    influencePatterns,
    communicationEffectiveness,
    conflictResolutionStyle: getConflictResolutionStyle(teamResponses),
    decisionMakingSpeed: getDecisionMakingSpeed(teamResponses)
  };
}

function calculateCollaborationScore(
  consensusMetrics: ConsensusMetrics,
  teamDynamics: TeamDynamics
): number {
  const consensusWeight = 0.4;
  const participationWeight = 0.3;
  const communicationWeight = 0.3;

  const avgParticipation = Object.values(teamDynamics.participationBalance)
    .reduce((sum, p) => sum + p, 0) / Object.values(teamDynamics.participationBalance).length;

  return (
    consensusMetrics.overallConsensusRate * consensusWeight +
    avgParticipation * participationWeight +
    teamDynamics.communicationEffectiveness * communicationWeight
  );
}

function calculateRoleAnalysis(
  individualScores: Record<string, any>,
  teamResponses: Record<string, TeamResponse>,
  members: TeamMember[],
  questions: Question[]
): Record<TeamRole, RoleAnalysis> {
  const roleAnalysis: Record<TeamRole, RoleAnalysis> = {} as Record<TeamRole, RoleAnalysis>;

  const roleStrengths: Record<TeamRole, string[]> = {
    'quality_manager': ['Quality Systems', 'CAPA Management', 'Management Review', 'Supplier Control'],
    'regulatory_affairs': ['Regulatory Strategy', 'Submissions', 'Post-Market Surveillance', 'Global Regulations'],
    'design_engineer': ['Design Controls', 'Risk Management', 'Design Validation', 'Change Control'],
    'manufacturing_lead': ['Production Controls', 'Process Validation', 'Equipment Maintenance', 'Batch Records'],
    'clinical_specialist': ['Clinical Evaluation', 'Post-Market Data', 'Adverse Event Reporting', 'Clinical Studies']
  };

  const roleTraining: Record<TeamRole, string[]> = {
    'quality_manager': ['Advanced CAPA Techniques', 'Risk-Based QMS Design', 'Supplier Audit Skills'],
    'regulatory_affairs': ['Regulatory Science', 'Global Harmonization', 'Digital Submissions'],
    'design_engineer': ['Design for Regulatory Compliance', 'Advanced Risk Management', 'V&V Best Practices'],
    'manufacturing_lead': ['Lean Manufacturing for Medical Devices', 'Process Validation 3.0', 'Industry 4.0'],
    'clinical_specialist': ['Real-World Evidence', 'Post-Market Studies', 'Regulatory Science']
  };

  members.forEach(member => {
    const individualScore = individualScores[member.id];
    if (!individualScore) return;

    const roleInsights = generateRoleInsights(member.role, individualScore, teamResponses);

    roleAnalysis[member.role] = {
      role: member.role,
      expectedStrengths: roleStrengths[member.role] || [],
      actualPerformance: individualScore.overall_score,
      knowledgeGaps: individualScore.top_gaps.slice(0, 5),
      contributionQuality: calculateContributionQuality(member, teamResponses),
      collaborationScore: calculateMemberCollaboration(member, teamResponses),
      recommendedTraining: roleTraining[member.role] || [],
      roleSpecificInsights: roleInsights
    };
  });

  return roleAnalysis;
}

function generateTeamRecommendations(
  baseScore: any,
  consensusMetrics: ConsensusMetrics,
  teamDynamics: TeamDynamics,
  roleAnalysis: Record<TeamRole, RoleAnalysis>,
  individualScores: Record<string, any>
): TeamRecommendation[] {
  const recommendations: TeamRecommendation[] = [];

  // Low consensus rate
  if (consensusMetrics.overallConsensusRate < 70) {
    recommendations.push({
      type: 'communication',
      priority: 'short_term',
      description: 'Improve team consensus building through structured discussion protocols',
      targetRoles: Object.keys(roleAnalysis) as TeamRole[],
      estimatedImpact: 25,
      implementationSteps: [
        'Implement structured discussion templates',
        'Set clear consensus criteria before discussions',
        'Use decision-making frameworks (e.g., RACI matrix)',
        'Practice active listening techniques'
      ]
    });
  }

  // Participation imbalance
  const participationValues = Object.values(teamDynamics.participationBalance);
  const participationRange = Math.max(...participationValues) - Math.min(...participationValues);
  if (participationRange > 40) {
    recommendations.push({
      type: 'leadership',
      priority: 'immediate',
      description: 'Address participation imbalance to ensure all voices are heard',
      targetRoles: Object.keys(roleAnalysis) as TeamRole[],
      estimatedImpact: 30,
      implementationSteps: [
        'Assign rotating discussion facilitators',
        'Implement round-robin discussion format',
        'Create psychological safety for all team members',
        'Set participation guidelines and expectations'
      ]
    });
  }

  // Low individual scores
  const lowPerformers = Object.values(individualScores)
    .filter((score: ScoringResult) => score.overall_score < 70).length;
  if (lowPerformers > 0) {
    recommendations.push({
      type: 'training',
      priority: 'short_term',
      description: 'Provide targeted training to address individual knowledge gaps',
      targetRoles: Object.keys(roleAnalysis).filter(role => 
        roleAnalysis[role as TeamRole].actualPerformance < 70
      ) as TeamRole[],
      estimatedImpact: 40,
      implementationSteps: [
        'Conduct detailed skills gap analysis',
        'Develop role-specific training programs',
        'Implement peer mentoring system',
        'Schedule regular knowledge sharing sessions'
      ]
    });
  }

  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}

// Helper functions
function analyzeDisagreementPatterns(
  teamResponses: Record<string, TeamResponse>,
  members: TeamMember[]
): any[] {
  return []; // Simplified for demo
}

function getConsensusQuality(
  consensusReached: number,
  total: number,
  disagreements: number
): 'strong' | 'moderate' | 'weak' | 'forced' {
  const rate = consensusReached / total;
  if (rate >= 0.9 && disagreements < 2) return 'strong';
  if (rate >= 0.75) return 'moderate';
  if (rate >= 0.5) return 'weak';
  return 'forced';
}

function calculateInfluencePatterns(
  teamResponses: Record<string, TeamResponse>,
  members: TeamMember[]
): any[] {
  return []; // Simplified for demo
}

function getConflictResolutionStyle(teamResponses: Record<string, TeamResponse>): string {
  return 'collaborative'; // Simplified for demo
}

function getDecisionMakingSpeed(teamResponses: Record<string, TeamResponse>): string {
  const avgRounds = Object.values(teamResponses)
    .reduce((sum, r) => sum + (r.votingRounds?.length || 0), 0) / 
    Object.values(teamResponses).length;

  if (avgRounds <= 1) return 'fast';
  if (avgRounds <= 2) return 'moderate';
  if (avgRounds <= 3) return 'slow';
  return 'stalled';
}

function generateRoleInsights(
  role: TeamRole,
  individualScore: ScoringResult,
  teamResponses: Record<string, TeamResponse>
): string[] {
  const insights: string[] = [];
  
  if (individualScore.overall_score < 70) {
    insights.push(`Performance below expected level for ${role.replace('_', ' ')} role`);
  }
  
  if (individualScore.critical_hit) {
    insights.push(`Critical compliance areas need immediate attention`);
  }
  
  return insights;
}

function calculateContributionQuality(
  member: TeamMember,
  teamResponses: Record<string, TeamResponse>
): number {
  let qualityScore = 0;
  let totalResponses = 0;

  Object.values(teamResponses).forEach(response => {
    const individualResponse = response.individualResponses[member.id];
    if (individualResponse) {
      totalResponses++;
      qualityScore += individualResponse.confidence;
      if (individualResponse.rationale && individualResponse.rationale.length > 20) {
        qualityScore += 1; // Bonus for providing rationale
      }
    }
  });

  return totalResponses > 0 ? (qualityScore / totalResponses) * 20 : 0; // Scale to 0-100
}

function calculateMemberCollaboration(
  member: TeamMember,
  teamResponses: Record<string, TeamResponse>
): number {
  let collaborationScore = 0;
  let opportunities = 0;

  Object.values(teamResponses).forEach(response => {
    opportunities++;
    
    // Participation in discussion
    if (response.discussionNotes?.some(note => note.includes(member.name))) {
      collaborationScore += 2;
    }
    
    // Flexibility in voting
    if (response.votingRounds && response.votingRounds.length > 1) {
      const memberVotes = response.votingRounds.map(round => round.votes[member.id]).filter(Boolean);
      if (memberVotes.length > 1 && new Set(memberVotes).size > 1) {
        collaborationScore += 1; // Bonus for changing mind based on discussion
      }
    }
  });

  return opportunities > 0 ? Math.min(100, (collaborationScore / (opportunities * 3)) * 100) : 0;
}