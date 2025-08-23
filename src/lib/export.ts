import { ScoreResult, AssessmentResponse, ExportData, FilterOptions, TeamScoreResult, TeamSession, TeamResponse } from './types';
import { frameworkLabels } from './data';

export function generateGapAnalysis(scoreResult: ScoreResult, filterOptions?: FilterOptions): string {
  const { score, status, gaps, criticalFailures, weightedBreakdown, riskAssessment, frameworkScores } = scoreResult;
  
  const statusText = status === 'red' ? 'RED - HIGH RISK' : 
                    status === 'amber' ? 'AMBER - MEDIUM RISK' : 
                    'GREEN - LOW RISK';

  let analysis = `# Enhanced Gap Analysis Report

## Executive Summary

**Assessment Type:** ${filterOptions?.includeAllFrameworks ? 'Comprehensive Assessment (All Frameworks)' : 'Focused Assessment'}  
${!filterOptions?.includeAllFrameworks ? `**Selected Frameworks:** ${filterOptions?.selectedFrameworks.map(f => frameworkLabels[f]).join(', ') || 'Not specified'}  
` : ''}**Overall Readiness Score:** ${score}/100  
**Risk Status:** ${statusText}  
**Critical Failures:** ${criticalFailures.length}  
**Compliance Maturity:** ${riskAssessment.complianceMaturity.charAt(0).toUpperCase() + riskAssessment.complianceMaturity.slice(1)}  
**Overall Risk Level:** ${riskAssessment.overallRisk.charAt(0).toUpperCase() + riskAssessment.overallRisk.slice(1)}  

## Weighted Scoring Analysis

**Total Weighted Score:** ${weightedBreakdown.actualWeightedScore.toFixed(1)} / ${weightedBreakdown.totalPossibleWeight.toFixed(1)}  
**Critical Impact Penalty:** -${weightedBreakdown.criticalImpact}%  
**Effective Score:** ${((weightedBreakdown.actualWeightedScore / weightedBreakdown.totalPossibleWeight) * 100).toFixed(1)}%  

### Category Performance Breakdown

| Category | Weight | Score | Performance | Status |
|----------|--------|-------|-------------|---------|
`;

  weightedBreakdown.weightingFactors.forEach(factor => {
    const statusEmoji = factor.performance >= 80 ? 'PASS' : factor.performance >= 70 ? 'WARN' : 'FAIL';
    analysis += `| ${factor.category} | ${factor.weight.toFixed(1)} | ${factor.actualScore.toFixed(1)}/${factor.maxScore.toFixed(1)} | ${factor.performance.toFixed(1)}% | ${statusEmoji} |\n`;
  });

  analysis += `

`;

  if (criticalFailures.length > 0) {
    analysis += `### Critical Compliance Gaps

The following critical regulatory requirements have failed and must be addressed immediately:

${criticalFailures.map(id => `- Question ${id}: Critical compliance requirement not met`).join('\n')}

**Risk Impact:** These failures automatically elevate the overall risk assessment and cap the maximum achievable score.

---

`;
  }

  // Risk Assessment Section
  if (riskAssessment.riskFactors.length > 0) {
    analysis += `## Risk Assessment

`;
    riskAssessment.riskFactors.forEach((factor, index) => {
      analysis += `### Risk Factor ${index + 1}: ${factor.type.replace('_', ' ').toUpperCase()}
**Description:** ${factor.description}  
**Impact:** ${factor.impact}%  
**Likelihood:** ${factor.likelihood.charAt(0).toUpperCase() + factor.likelihood.slice(1)}  
**Affected Clauses:** ${factor.clauseRefs.join(', ')}  

`;
    });

    analysis += `### Mitigation Priorities
${riskAssessment.mitigationPriority.map((priority, index) => `${index + 1}. ${priority}`).join('\n')}

`;
  }

  // Framework-specific scores
  analysis += `## Regulatory Framework Performance

`;
  Object.entries(frameworkScores).forEach(([framework, data]) => {
    const frameworkName = frameworkLabels[framework as keyof typeof frameworkLabels];
    analysis += `### ${frameworkName}
**Performance Score:** ${data.score}%  
**Critical Failures:** ${data.criticalFailures}  
**Total Gaps:** ${data.gaps}  
**Recommendation:** ${data.recommendation}  

`;
  });

  analysis += `## Top Priority Gaps

The following gaps represent the highest impact areas for improvement (enhanced priority ranking):

| Priority | Clause | Requirement | Impact | Risk Weight | Suggested Evidence |
|----------|--------|-------------|--------|-------------|-------------------|
`;

  gaps.forEach((gap, index) => {
    const priority = index + 1;
    const evidenceList = gap.suggestedEvidence.slice(0, 2).join(', ');
    analysis += `| ${priority} | ${gap.clauseRef} | ${gap.clauseTitle} | ${gap.deficit.toFixed(1)} | High | ${evidenceList} |\n`;
  });

  analysis += `
## Detailed Gap Analysis

`;

  gaps.forEach((gap, index) => {
    analysis += `### ${index + 1}. ${gap.clauseTitle} (${gap.clauseRef})

**Question:** ${gap.prompt}  
**Impact Score:** ${gap.deficit.toFixed(1)}  
**Priority Ranking:** ${index + 1} of ${gaps.length}  

**Required Evidence:**
${gap.suggestedEvidence.map(evidence => `- ${evidence}`).join('\n')}

**Recommended Actions:**
- Establish documented procedures for ${gap.clauseTitle.toLowerCase()}
- Implement systematic controls and monitoring
- Train relevant personnel on requirements
- Document all activities with objective evidence
- Conduct periodic reviews and updates

**Success Criteria:**
- Documented procedure in place
- Training completed and recorded
- Objective evidence available
- Process effectiveness demonstrated

---

`;
  });

  return analysis;
}

export function generateCapaPlan(scoreResult: ScoreResult): string {
  const { gaps } = scoreResult;

  let capa = `# Corrective and Preventive Action (CAPA) Plan

## Purpose
This CAPA plan addresses identified compliance gaps to improve audit readiness and ensure regulatory compliance.

## CAPA Summary Table

| Problem | Root Cause (5-Whys) | Correction | Corrective Action | Preventive Action | Owner | Due Date | Verification |
|---------|-------------------|------------|------------------|------------------|-------|----------|-------------|
`;

  gaps.forEach((gap, index) => {
    capa += `| ${gap.clauseTitle} gap | Process not established | Document current state | Implement ${gap.clauseTitle.toLowerCase()} process | Establish ongoing monitoring | Quality Manager | 30 days | Audit verification |\n`;
  });

  capa += `

## Detailed CAPA Actions

`;

  gaps.forEach((gap, index) => {
    const gapNumber = index + 1;
    capa += `### CAPA ${gapNumber}: ${gap.clauseTitle}

**Problem Statement:**  
${gap.prompt.replace('Do you ', 'Organization does not ').replace('Are ', 'Organization has not established ').replace('How ', 'Organization lacks systematic approach for ')}

**5-Whys Root Cause Analysis:**
1. Why does this gap exist? → Lack of documented process
2. Why is there no documented process? → No formal requirement identified
3. Why wasn't the requirement identified? → Inadequate gap analysis
4. Why was gap analysis inadequate? → Limited regulatory knowledge
5. Why is regulatory knowledge limited? → Insufficient training and resources

**Immediate Correction:**
- Document current practices and identify existing controls
- Implement temporary measures to address immediate risks

**Corrective Action:**
- Develop formal procedures for ${gap.clauseTitle.toLowerCase()}
- Train personnel on new procedures
- Implement required documentation and records

**Preventive Action:**
- Establish periodic review process for ${gap.clauseTitle.toLowerCase()}
- Include in management review agenda
- Monitor effectiveness through key performance indicators

**Resources Required:**
- Quality Manager (40 hours)
- Subject Matter Expert (20 hours)
- Training materials and documentation

**Verification Method:**
- Internal audit of implemented process
- Review of generated records and documentation
- Management review of effectiveness

**Target Completion:** 30 days from initiation

---

`;
  });

  capa += `## Implementation Schedule

| Week | Activity | Responsible |
|------|----------|-------------|
| 1 | Complete root cause analysis for all gaps | Quality Manager |
| 2-3 | Develop procedures and documentation | Quality Team |
| 4 | Conduct training and implementation | All Departments |
| 5-6 | Monitor implementation and collect evidence | Quality Manager |
| 7-8 | Verify effectiveness and close CAPAs | Management |

## Success Metrics

- 100% of identified gaps addressed with documented procedures
- All personnel trained on new processes
- Objective evidence available for each requirement
- Follow-up assessment shows improved score
- Zero critical findings in next audit

`;

  return capa;
}

export function generateInterviewScript(): string {
  return `# Audit Interview Script

## Management Interview Questions

### Quality Management System
1. Describe your organization's quality policy and how it's communicated
2. How do you ensure the QMS remains effective and suitable?
3. What are your quality objectives and how do you measure progress?
4. How often do you conduct management reviews? What topics are covered?
5. Describe your approach to resource allocation for quality activities

### Risk Management
1. How does your organization identify and assess risks?
2. Describe your risk management process throughout the product lifecycle
3. How do you monitor and update risk assessments?
4. Can you provide examples of risk controls implemented?

## Design and Development Interview Questions

### Design Controls
1. Walk me through your design control process from concept to market
2. How do you capture and manage design inputs?
3. Describe your design review process - who participates and when?
4. How do you conduct design verification and validation?
5. Show me examples of your Design History File organization

### Change Control
1. How do you manage design changes?
2. What approval process is required for design modifications?
3. How do you ensure changes don't negatively impact safety or effectiveness?

## Production Interview Questions

### Process Control
1. Describe how you ensure consistent manufacturing processes
2. How do you validate your manufacturing processes?
3. What environmental controls are in place?
4. How do you handle process deviations or excursions?

### Material Control
1. How do you qualify and monitor suppliers?
2. Describe your incoming inspection process
3. How do you maintain traceability of materials?
4. What procedures exist for handling nonconforming materials?

## Quality Assurance Interview Questions

### Monitoring and Measurement
1. How do you monitor product quality throughout production?
2. Describe your inspection and testing procedures
3. How do you calibrate and maintain measuring equipment?
4. What statistical techniques do you use for process control?

### Nonconforming Product
1. How do you identify and control nonconforming products?
2. What disposition options are available and who authorizes them?
3. How do you prevent inadvertent use or delivery of nonconforming products?

### CAPA System
1. Describe your corrective and preventive action process
2. How do you investigate and determine root causes?
3. What methods do you use to verify CAPA effectiveness?
4. How do you trending data to identify systemic issues?

## Regulatory Affairs Interview Questions

### Post-Market Activities
1. How do you monitor product performance after market release?
2. Describe your complaint handling process
3. How do you evaluate and report adverse events?
4. What procedures exist for product recalls or field corrections?

### Documentation
1. How do you control documents and ensure they're current?
2. Describe your record retention practices
3. How do you ensure document confidentiality and integrity?

## Technical Interview Questions (Device-Specific)

### Software (if applicable)
1. How do you develop and validate medical device software?
2. Describe your software lifecycle processes
3. How do you manage software configuration and version control?
4. What cybersecurity measures are implemented?

### Sterilization (if applicable)
1. Describe your sterilization validation approach
2. How do you monitor and maintain sterility assurance?
3. What procedures exist for sterilization process monitoring?

### Biocompatibility (if applicable)
1. How do you evaluate biological safety of materials?
2. What testing has been performed and by whom?
3. How do you monitor biocompatibility throughout the product lifecycle?

## Follow-up Questions for All Areas

1. Can you show me objective evidence of this process?
2. Where is this requirement documented?
3. How do you know this process is effective?
4. What would happen if [scenario]?
5. Who is responsible for ensuring this happens?
6. How often is this reviewed or updated?
7. What training is provided on this process?
8. How do you handle exceptions to this procedure?

## Evidence to Request

### Documentation
- Procedures and work instructions
- Quality manual and policies
- Training records and competency assessments
- Calibration certificates
- Validation reports
- CAPA records
- Management review minutes

### Records
- Production records and batch documentation
- Inspection and test results
- Nonconformance reports
- Complaint files
- Internal audit reports
- Supplier qualification records

### Observations
- Manufacturing operations
- Testing and inspection activities
- Document control systems
- Training in progress
- CAPA implementation
- Environmental controls
`;
}

export function createExportPackage(
  scoreResult: ScoreResult,
  responses: AssessmentResponse[],
  filterOptions?: FilterOptions
): ExportData {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return {
    timestamp,
    score: scoreResult.score,
    status: scoreResult.status,
    responses,
    gaps: scoreResult.gaps,
    gapAnalysis: generateGapAnalysis(scoreResult, filterOptions),
    capaPlan: generateCapaPlan(scoreResult),
    interviewScript: generateInterviewScript(),
    selectedFrameworks: filterOptions?.selectedFrameworks || [],
    weightedBreakdown: scoreResult.weightedBreakdown,
    riskAssessment: scoreResult.riskAssessment,
    frameworkScores: scoreResult.frameworkScores
  };
}

export function downloadExportPackage(exportData: ExportData): void {
  // Create individual files as blobs
  const files: { [key: string]: string } = {
    'gap_analysis.md': exportData.gapAnalysis,
    'capa_plan.md': exportData.capaPlan,
    'interview_script.md': exportData.interviewScript,
    'assessment_data.json': JSON.stringify(exportData, null, 2)
  };

  // Create a simple download for each file (since we can't create real ZIPs in browser)
  // In a real implementation, you'd use a library like JSZip
  Object.entries(files).forEach(([filename, content]) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_assessment_${exportData.timestamp}_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Team Training Export Functions
export function generateTeamGapAnalysis(teamScore: TeamScoreResult, session: TeamSession): string {
  const baseAnalysis = generateGapAnalysis(teamScore, {
    selectedFrameworks: session.selectedFrameworks,
    includeAllFrameworks: false
  });

  const teamAnalysis = `# Team Training Assessment Report

## Team Session Overview

**Session Name:** ${session.name}  
**Assessment Date:** ${session.createdAt.toLocaleDateString()}  
**Team Size:** ${session.members.length} members  
**Selected Frameworks:** ${session.selectedFrameworks.map(f => frameworkLabels[f]).join(', ')}  
**Session Status:** ${session.status.toUpperCase()}  

## Team Composition

| Member | Role | Department | Individual Score | Performance |
|--------|------|------------|-----------------|-------------|
${session.members.map(member => {
  const individualScore = teamScore.individualScores[member.id];
  const scoreText = individualScore ? `${Math.round(individualScore.score)}` : 'N/A';
  const performance = individualScore ? 
    (individualScore.score >= 85 ? 'Strong' : 
     individualScore.score >= 70 ? 'Adequate' : 'Needs Improvement') : 'N/A';
  return `| ${member.name} | ${member.role.replace('_', ' ')} | ${member.department} | ${scoreText} | ${performance} |`;
}).join('\n')}

## Team Performance Summary

**Overall Team Score:** ${Math.round(teamScore.score)}/100  
**Collaboration Effectiveness:** ${Math.round(teamScore.collaborationScore)}/100  
**Consensus Achievement Rate:** ${Math.round(teamScore.consensusMetrics.overallConsensusRate)}%  
**Team Status:** ${teamScore.status.toUpperCase()}  

## Consensus Analysis

**Overall Consensus Rate:** ${Math.round(teamScore.consensusMetrics.overallConsensusRate)}%  
**Average Voting Rounds Required:** ${teamScore.consensusMetrics.votingRoundsRequired.toFixed(1)}  
**Consensus Quality:** ${teamScore.consensusMetrics.consensusQuality}  

### Disagreement Patterns
${teamScore.consensusMetrics.disagreementPatterns.length > 0 ? 
  teamScore.consensusMetrics.disagreementPatterns.map((pattern, index) => 
    `${index + 1}. **${pattern.type.replace('_', ' ')}**: ${pattern.frequency} occurrences across ${pattern.affectedQuestions.length} questions`
  ).join('\n') : 
  'No significant disagreement patterns identified.'
}

## Team Dynamics Assessment

**Communication Effectiveness:** ${Math.round(teamScore.teamDynamics.communicationEffectiveness)}%  
**Decision Making Speed:** ${teamScore.teamDynamics.decisionMakingSpeed}  
**Conflict Resolution Style:** ${teamScore.teamDynamics.conflictResolutionStyle}  

### Participation Balance
${Object.entries(teamScore.teamDynamics.participationBalance)
  .sort(([,a], [,b]) => b - a)
  .map(([memberId, participation]) => {
    const member = session.members.find(m => m.id === memberId);
    return member ? `- **${member.name}**: ${Math.round(participation)}%` : '';
  })
  .filter(Boolean)
  .join('\n')
}

${baseAnalysis}

## Team-Specific Recommendations

${teamScore.recommendedActions.map((rec, index) => `
### ${index + 1}. ${rec.description}

**Type:** ${rec.type.replace('_', ' ')}  
**Priority:** ${rec.priority.replace('_', ' ')}  
**Estimated Impact:** ${rec.estimatedImpact}%  
**Target Roles:** ${rec.targetRoles.map(r => r.replace('_', ' ')).join(', ')}  

**Implementation Steps:**
${rec.implementationSteps.map(step => `- ${step}`).join('\n')}
`).join('\n')}

## Role-Based Performance Analysis

${Object.entries(teamScore.roleAnalysis).map(([role, analysis]) => `
### ${role.replace('_', ' ')} Performance

**Overall Performance:** ${Math.round(analysis.actualPerformance)}%  
**Contribution Quality:** ${Math.round(analysis.contributionQuality)}%  
**Collaboration Score:** ${Math.round(analysis.collaborationScore)}%  

**Knowledge Gaps:**
${analysis.knowledgeGaps.slice(0, 3).map(gap => `- ${gap.clauseTitle} (${gap.clauseRef})`).join('\n')}

**Recommended Training:**
${analysis.recommendedTraining.map(training => `- ${training}`).join('\n')}

**Role-Specific Insights:**
${analysis.roleSpecificInsights.map(insight => `- ${insight}`).join('\n')}
`).join('\n')}
`;

  return teamAnalysis;
}

export function generateTeamCapaPlan(teamScore: TeamScoreResult, session: TeamSession): string {
  const baseCapa = generateCapaPlan(teamScore);
  
  const teamCapa = `# Team Training CAPA Plan

## Team Training Session Overview

**Session:** ${session.name}  
**Date:** ${session.createdAt.toLocaleDateString()}  
**Participants:** ${session.members.length} team members  

## Team Performance Issues Identified

${teamScore.recommendedActions.map((action, index) => `
### Team Issue ${index + 1}: ${action.description}

**Root Cause Analysis:**
1. Why does this team challenge exist? → ${action.type === 'communication' ? 'Lack of structured discussion protocols' : 
                                       action.type === 'leadership' ? 'Unbalanced participation patterns' :
                                       action.type === 'training' ? 'Knowledge gaps in team members' :
                                       'Process inefficiencies'}
2. Why are protocols/patterns/knowledge lacking? → Insufficient team training and setup
3. Why is team training insufficient? → No formal team assessment processes
4. Why are there no formal processes? → Limited understanding of team dynamics impact
5. Why is understanding limited? → Lack of team-based audit preparation experience

**Corrective Actions:**
${action.implementationSteps.map(step => `- ${step}`).join('\n')}

**Target Roles:** ${action.targetRoles.map(r => r.replace('_', ' ')).join(', ')}  
**Priority:** ${action.priority.replace('_', ' ')}  
**Expected Impact:** ${action.estimatedImpact}% improvement  
`).join('\n')}

## Individual Member CAPAs

${Object.entries(teamScore.individualScores).map(([memberId, score]) => {
  const member = session.members.find(m => m.id === memberId);
  if (!member || !score.gaps.length) return '';
  
  return `
### ${member.name} (${member.role.replace('_', ' ')}) - Individual CAPA

**Performance Score:** ${Math.round(score.score)}/100  
**Critical Issues:** ${score.criticalFailures.length}  
**Priority Gaps:** ${score.gaps.slice(0, 3).map(gap => gap.clauseTitle).join(', ')}  

**Individual Action Plan:**
- Schedule focused training on identified knowledge gaps
- Assign mentor from high-performing team member
- Provide additional resources for weak areas
- Follow up with individual assessment in 30 days
`;
}).filter(Boolean).join('\n')}

${baseCapa}

## Team Follow-up Plan

### 30-Day Review
- Conduct follow-up team assessment
- Measure improvement in consensus building
- Evaluate participation balance
- Review individual performance gains

### 60-Day Review  
- Complete team effectiveness assessment
- Validate CAPA effectiveness
- Plan next team training session
- Document lessons learned

### 90-Day Review
- Conduct mini audit simulation
- Measure readiness improvement
- Close successful CAPAs
- Plan ongoing team development
`;

  return teamCapa;
}

export function generateTeamInterviewScript(session: TeamSession): string {
  const baseScript = generateInterviewScript();
  
  const teamScript = `# Team-Based Audit Interview Preparation

## Team Session: ${session.name}

This script is designed for team-based interview preparation, with role-specific guidance for each team member.

## Team Member Roles and Responsibilities

${session.members.map(member => {
  const roleQuestions = getQuestionsForRole(member.role);
  return `
### ${member.name} - ${member.role.replace('_', ' ')}

**Primary Areas of Responsibility:**
${getRoleResponsibilities(member.role).map(resp => `- ${resp}`).join('\n')}

**Key Interview Topics:**
${roleQuestions.slice(0, 5).map(q => `- ${q}`).join('\n')}

**Preparation Focus:**
- Review procedures and documentation in your area
- Prepare objective evidence for your processes
- Practice explaining your role in cross-functional activities
- Be ready to demonstrate process effectiveness
`;
}).join('\n')}

## Team Coordination Guidelines

### Before the Interview
1. **Team Huddle** (15 minutes before inspector arrival)
   - Review key messages and positions
   - Confirm who leads discussions for each area
   - Align on any process changes or improvements

2. **Role Clarity**
   - Each member knows their primary areas
   - Understand when to defer to other team members
   - Practice smooth handoffs between areas

3. **Evidence Preparation**
   - Ensure all required documents are accessible
   - Designate backup locations for critical evidence
   - Test any systems or demonstrations

### During Team Interviews
1. **Stay in Role** - Focus on your areas of expertise
2. **Support Colleagues** - Provide backup when needed
3. **Consistent Messaging** - Align with team positions
4. **Active Listening** - Pay attention to inspector concerns
5. **Professional Demeanor** - Maintain confidence and cooperation

### Communication Protocols
- **Lead Spokesperson**: ${session.members.find(m => m.isLeader)?.name || 'Team Leader'} handles general questions
- **Technical Questions**: Defer to appropriate subject matter expert
- **Escalation**: If unsure, it's okay to say "Let me get you the right person"
- **Documentation**: ${session.members.find(m => m.role === 'quality_manager')?.name || 'Quality Manager'} handles QMS documents

${baseScript}

## Team-Specific Practice Scenarios

### Scenario 1: Cross-Functional Process Review
**Inspector Focus**: Design controls and risk management integration
**Team Response**: 
- **Design Engineer** leads technical discussion
- **Quality Manager** explains process oversight
- **Regulatory Affairs** covers regulatory requirements
- **Manufacturing Lead** describes production implications

### Scenario 2: CAPA System Review  
**Inspector Focus**: How the team handles corrective actions
**Team Response**:
- **Quality Manager** explains CAPA process
- **Relevant SME** discusses specific examples
- **All Members** show how they participate in CAPA activities

### Scenario 3: Management Review Process
**Inspector Focus**: How leadership oversees quality
**Team Response**:
- **Team Leader** explains management review structure
- **Each Member** describes their input and follow-up actions
- **Quality Manager** shows documentation and follow-up

## Post-Interview Team Debrief

### Immediate Actions (within 2 hours)
1. Gather team to discuss inspector feedback
2. Identify any commitments made during interview
3. Document action items and assignments
4. Plan follow-up evidence if requested

### Success Metrics
- All team members stayed within their roles
- Consistent answers across team members  
- Effective evidence presentation
- Professional team dynamic demonstrated
- Inspector concerns addressed collaboratively
`;

  return teamScript;
}

function getQuestionsForRole(role: string): string[] {
  const roleQuestions: Record<string, string[]> = {
    'quality_manager': [
      'Describe your quality management system structure',
      'How do you monitor QMS effectiveness?',
      'Explain your management review process',
      'How do you handle nonconformances?',
      'Describe your internal audit program'
    ],
    'regulatory_affairs': [
      'How do you track regulatory requirements?',
      'Describe your submission strategy',
      'How do you handle post-market surveillance?',
      'Explain your regulatory change management',
      'How do you maintain regulatory compliance?'
    ],
    'design_engineer': [
      'Walk through your design control process',
      'How do you manage design inputs and outputs?',
      'Describe your verification and validation approach',
      'How do you handle design changes?',
      'Explain your risk management integration'
    ],
    'manufacturing_lead': [
      'Describe your production control processes',
      'How do you validate manufacturing processes?',
      'Explain your material control systems',
      'How do you handle process deviations?',
      'Describe your equipment maintenance program'
    ],
    'clinical_specialist': [
      'How do you evaluate clinical data?',
      'Describe your post-market data collection',
      'How do you handle adverse events?',
      'Explain your clinical study management',
      'How do you maintain clinical evaluation?'
    ]
  };
  
  return roleQuestions[role] || [];
}

function getRoleResponsibilities(role: string): string[] {
  const responsibilities: Record<string, string[]> = {
    'quality_manager': [
      'Quality management system oversight',
      'CAPA system management',
      'Internal audit coordination',
      'Management review facilitation',
      'Supplier quality management'
    ],
    'regulatory_affairs': [
      'Regulatory strategy development',
      'Submission preparation and maintenance',
      'Post-market surveillance coordination',
      'Regulatory intelligence monitoring',
      'Global compliance management'
    ],
    'design_engineer': [
      'Design control implementation',
      'Risk management execution',
      'Verification and validation activities',
      'Design change control',
      'Technical file maintenance'
    ],
    'manufacturing_lead': [
      'Production process control',
      'Process validation oversight',
      'Material and supply chain management',
      'Equipment qualification and maintenance',
      'Batch record control'
    ],
    'clinical_specialist': [
      'Clinical evaluation activities',
      'Post-market clinical data analysis',
      'Adverse event reporting',
      'Clinical study oversight',
      'Literature monitoring'
    ]
  };
  
  return responsibilities[role] || [];
}

export async function exportTeamAssessment(
  teamScore: TeamScoreResult,
  session: TeamSession,
  teamResponses: Record<string, TeamResponse>
): Promise<Blob> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  const files: { [key: string]: string } = {
    'team_gap_analysis.md': generateTeamGapAnalysis(teamScore, session),
    'team_capa_plan.md': generateTeamCapaPlan(teamScore, session),
    'team_interview_script.md': generateTeamInterviewScript(session),
    'team_assessment_data.json': JSON.stringify({
      timestamp,
      session,
      teamScore,
      teamResponses
    }, null, 2)
  };

  // In a real implementation, you'd use JSZip to create a proper ZIP file
  // For now, we'll create a simple text bundle
  const bundleContent = Object.entries(files)
    .map(([filename, content]) => `=== ${filename} ===\n\n${content}\n\n`)
    .join('\n');
  
  return new Blob([bundleContent], { type: 'text/plain' });
}