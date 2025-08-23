import { ScoringResult, ArtifactData, Gap } from './types';
import { getQuestionById } from './questions';

// Generate gap analysis document
export function generateGapList(scoring: ScoringResult): string {
  const gaps = scoring.top_gaps.sort((a, b) => b.deficit - a.deficit);
  
  let content = `# Compliance Gap Analysis Report

**Generated**: ${new Date().toLocaleString()}
**Overall Score**: ${scoring.overall_score}% (${scoring.status})
**Critical Issues**: ${scoring.critical_hit ? 'Yes' : 'No'}

## Executive Summary

This assessment identified ${gaps.length} priority gaps in your compliance readiness. ${scoring.critical_hit ? 'Critical compliance gaps require immediate attention to meet regulatory requirements.' : 'Focus on the highest-impact gaps below to improve your audit readiness.'}

## Priority Gaps (Ranked by Impact)

`;

  gaps.forEach((gap, index) => {
    const question = getQuestionById(gap.question_id);
    const priority = index < 2 ? 'HIGH' : index < 4 ? 'MEDIUM' : 'LOW';
    
    content += `### ${index + 1}. ${gap.clause_ref} - ${priority} PRIORITY

**Gap Description**: ${gap.label}
**Regulatory Reference**: ${gap.clause_ref}
**Impact Score**: ${gap.deficit.toFixed(1)}
**Category**: ${question?.category || 'General'}

**Recommended Action**: Review and strengthen controls in this area to ensure compliance with regulatory requirements.

---

`;
  });

  content += `## Next Steps

1. Address HIGH priority gaps immediately
2. Develop action plans for MEDIUM priority items
3. Schedule follow-up assessment in 30-60 days
4. Consider engaging regulatory consultants for critical gaps

**Disclaimer**: This assessment is for educational purposes only and does not constitute legal or regulatory advice. Consult with qualified regulatory professionals for compliance guidance.
`;

  return content;
}

// Generate CAPA plan template
export function generateCAPAPlan(scoring: ScoringResult): string {
  const gaps = scoring.top_gaps.slice(0, 10); // Top 10 gaps
  
  let content = `# Corrective and Preventive Action Plan

**Generated**: ${new Date().toLocaleString()}
**Assessment Score**: ${scoring.overall_score}% (${scoring.status})

## CAPA Plan Template

| Problem | Root Cause | Correction | Corrective Action | Preventive Action | Owner | Due Date | Effectiveness Verification |
|---------|------------|------------|-------------------|-------------------|--------|----------|---------------------------|
`;

  gaps.forEach((gap) => {
    const question = getQuestionById(gap.question_id);
    content += `| ${gap.label} | TBD - Root cause analysis required | TBD - Immediate fix | TBD - Long-term corrective action | TBD - Prevention measures | TBD - Assign owner | TBD - Set deadline | TBD - Define verification method |
`;
  });

  content += `

## Instructions for Completion

1. **Problem**: Brief description of the compliance gap (pre-filled from assessment)
2. **Root Cause**: Conduct analysis to identify underlying causes
3. **Correction**: Immediate actions to address the gap
4. **Corrective Action**: Long-term fixes to prevent recurrence
5. **Preventive Action**: Measures to prevent similar issues
6. **Owner**: Assign responsible person with authority
7. **Due Date**: Set realistic but urgent timeline
8. **Effectiveness Verification**: Define how success will be measured

## CAPA Process Guidelines

### Investigation Phase
- Document current state thoroughly
- Identify contributing factors
- Interview relevant personnel
- Review related procedures and records

### Action Planning Phase
- Prioritize actions based on risk and impact
- Ensure resource availability
- Define clear, measurable objectives
- Establish verification criteria

### Implementation Phase
- Execute actions according to plan
- Monitor progress regularly
- Document implementation evidence
- Adjust plan if needed

### Verification Phase
- Verify effectiveness through objective evidence
- Conduct follow-up assessments
- Update procedures and training as needed
- Close CAPA when verification is complete

**Disclaimer**: This template is for educational purposes only. Ensure CAPA activities comply with your organization's procedures and regulatory requirements.
`;

  return content;
}

// Generate audit interview script
export function generateInterviewScript(scoring: ScoringResult): string {
  const criticalGaps = scoring.top_gaps.filter((_, index) => index < 3);
  
  let content = `# Audit Interview Preparation Script

**Generated**: ${new Date().toLocaleString()}
**Assessment Results**: ${scoring.overall_score}% (${scoring.status})

## Interview Strategy Overview

Based on your assessment results, focus preparation on these priority areas:
${criticalGaps.map(gap => `- ${gap.clause_ref}: ${gap.label}`).join('\n')}

## Role-Based Interview Preparation

### For Quality Manager Role

**Opening Questions You May Face:**
- "Walk me through your Quality Management System structure"
- "How do you ensure compliance with 21 CFR 820 requirements?"
- "Describe your management review process"

**Key Points to Emphasize:**
- QMS documentation and implementation
- Management commitment and resources
- Continuous improvement activities

**Evidence to Have Ready:**
- Quality manual and procedures
- Management review records
- Training records for quality personnel

### For Production Manager Role

**Expected Questions:**
- "How do you control production processes?"
- "Describe your approach to process validation"
- "Walk me through your batch record system"

**Preparation Focus:**
- Production and process controls (21 CFR 820.70)
- Device history records (21 CFR 820.184)
- Statistical process control methods

### For Design Control Lead Role

**Likely Discussion Topics:**
- Design control procedures and implementation
- Design validation and verification activities
- Design change control process

**Key Documentation:**
- Design history files
- Validation and verification protocols
- Design review meeting minutes

## Gap-Specific Questions

Based on your assessment gaps, prepare for these specific areas:

`;

  criticalGaps.forEach((gap, index) => {
    const question = getQuestionById(gap.question_id);
    content += `### Gap ${index + 1}: ${gap.clause_ref}

**Auditor Might Ask:**
- "Show me evidence of ${gap.label.toLowerCase()}"
- "How do you ensure this requirement is consistently met?"
- "When was this last reviewed or updated?"

**Your Response Strategy:**
- Acknowledge current state honestly
- Describe improvement actions underway
- Provide timeline for full implementation
- Show interim controls if applicable

---

`;
  });

  content += `## General Interview Tips

### Before the Interview
- Review all relevant procedures and records
- Practice explaining processes clearly and concisely
- Prepare supporting documentation
- Coordinate with team members on consistent messaging

### During the Interview
- Be honest about gaps and improvement areas
- Focus on what is in place and working
- Demonstrate knowledge of requirements
- Show evidence of continuous improvement

### Documentation to Have Available
- Current procedures and work instructions
- Training records for relevant personnel
- Evidence of process monitoring and measurement
- Records of management review and CAPA activities

## Mock Questions by Category

### Quality Management System
- "How does senior management demonstrate commitment to quality?"
- "Describe your process for setting quality objectives"
- "How do you measure QMS effectiveness?"

### Document Control
- "How do you ensure personnel have access to current documents?"
- "Describe your process for document approval and review"
- "How do you control obsolete documents?"

### Risk Management
- "How do you identify and assess product-related risks?"
- "Describe your risk control measures"
- "How do you monitor risk control effectiveness?"

**Final Preparation Checklist:**
- [ ] Review all gap areas identified in assessment
- [ ] Practice key explanations with team members
- [ ] Organize supporting documentation
- [ ] Confirm roles and responsibilities with interview participants
- [ ] Prepare improvement timeline and resource commitments

**Disclaimer**: This guidance is for educational purposes only. Actual audit experiences may vary based on specific products, processes, and regulatory requirements.
`;

  return content;
}

// Generate all artifacts
export function generateArtifacts(scoring: ScoringResult): ArtifactData {
  return {
    gap_list: generateGapList(scoring),
    capa_plan: generateCAPAPlan(scoring),
    interview_script: generateInterviewScript(scoring)
  };
}

// Export functions for ZIP generation
export function createExportData(scoring: ScoringResult): { [filename: string]: string } {
  const artifacts = generateArtifacts(scoring);
  
  return {
    'gap_list.md': artifacts.gap_list,
    'capa_plan.md': artifacts.capa_plan,
    'audit_interview_script.md': artifacts.interview_script,
    'readiness.json': JSON.stringify(scoring, null, 2)
  };
}