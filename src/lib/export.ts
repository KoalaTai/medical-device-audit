import { ScoreResult, AssessmentResponse, ExportData } from './types';

export function generateGapAnalysis(scoreResult: ScoreResult): string {
  const { score, status, gaps, criticalFailures } = scoreResult;
  
  const statusText = status === 'red' ? 'RED - HIGH RISK' : 
                    status === 'amber' ? 'AMBER - MEDIUM RISK' : 
                    'GREEN - LOW RISK';

  let analysis = `# Gap Analysis Report

## Assessment Summary

**Overall Readiness Score:** ${score}/100  
**Risk Status:** ${statusText}  
**Critical Failures:** ${criticalFailures.length}  

`;

  if (criticalFailures.length > 0) {
    analysis += `### ⚠️ Critical Compliance Gaps

The following critical regulatory requirements have failed and must be addressed immediately:

${criticalFailures.map(id => `- Question ${id}: Critical compliance requirement not met`).join('\n')}

---

`;
  }

  analysis += `## Top Priority Gaps

The following gaps represent the highest impact areas for improvement:

| Priority | Clause | Requirement | Impact | Suggested Evidence |
|----------|--------|-------------|--------|-------------------|
`;

  gaps.forEach((gap, index) => {
    const priority = index + 1;
    const evidenceList = gap.suggestedEvidence.slice(0, 2).join(', ');
    analysis += `| ${priority} | ${gap.clauseRef} | ${gap.clauseTitle} | ${gap.deficit.toFixed(1)} | ${evidenceList} |\n`;
  });

  analysis += `
## Gap Details

`;

  gaps.forEach((gap, index) => {
    analysis += `### ${index + 1}. ${gap.clauseTitle} (${gap.clauseRef})

**Question:** ${gap.prompt}  
**Impact Score:** ${gap.deficit.toFixed(1)}  

**Required Evidence:**
${gap.suggestedEvidence.map(evidence => `- ${evidence}`).join('\n')}

**Recommended Actions:**
- Establish documented procedures for ${gap.clauseTitle.toLowerCase()}
- Implement systematic controls and monitoring
- Train relevant personnel on requirements
- Document all activities with objective evidence

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
  responses: AssessmentResponse[]
): ExportData {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return {
    timestamp,
    score: scoreResult.score,
    status: scoreResult.status,
    responses,
    gaps: scoreResult.gaps,
    gapAnalysis: generateGapAnalysis(scoreResult),
    capaPlan: generateCapaPlan(scoreResult),
    interviewScript: generateInterviewScript()
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