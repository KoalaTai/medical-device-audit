import { Question, StandardsMap } from './types';

export const questionnaire: Question[] = [
  {
    id: 'Q1',
    prompt: 'Do you maintain a Design History File (DHF) with complete traceability from user needs to design outputs?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'QMS.820.30',
    critical: true
  },
  {
    id: 'Q2',
    prompt: 'Are design controls implemented throughout the product development lifecycle?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'QMS.820.30',
    critical: true
  },
  {
    id: 'Q3',
    prompt: 'Do you conduct formal design reviews at appropriate stages of development?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'QMS.820.30'
  },
  {
    id: 'Q4',
    prompt: 'Are design verification and validation activities documented and executed?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'QMS.820.30',
    critical: true
  },
  {
    id: 'Q5',
    prompt: 'How frequently do you conduct management reviews of the quality management system?',
    type: 'select',
    weight: 3,
    clauseRef: 'ISO.9.3',
    options: ['Annually', 'Semi-annually', 'Quarterly', 'Monthly', 'Not conducted']
  },
  {
    id: 'Q6',
    prompt: 'Are supplier CAPAs verified for effectiveness before closure?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.8.5'
  },
  {
    id: 'Q7',
    prompt: 'Do you maintain a risk management file throughout the product lifecycle?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'ISO.14971',
    critical: true
  },
  {
    id: 'Q8',
    prompt: 'Are post-market surveillance activities systematically conducted and documented?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.8.2.1'
  },
  {
    id: 'Q9',
    prompt: 'How do you ensure competency of personnel performing work affecting product quality?',
    type: 'select',
    weight: 3,
    clauseRef: 'ISO.7.2',
    options: ['Comprehensive training program with records', 'Basic training documentation', 'On-the-job training only', 'No formal program']
  },
  {
    id: 'Q10',
    prompt: 'Are nonconforming products consistently identified, controlled, and dispositioned?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.8.3',
    critical: true
  },
  {
    id: 'Q11',
    prompt: 'Do you conduct periodic internal audits of all QMS processes?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.9.2'
  },
  {
    id: 'Q12',
    prompt: 'Are corrective and preventive actions (CAPAs) implemented with root cause analysis?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'ISO.8.5',
    critical: true
  },
  {
    id: 'Q13',
    prompt: 'What percentage of your manufacturing processes are validated?',
    type: 'select',
    weight: 5,
    clauseRef: 'QMS.820.75',
    options: ['100% - All processes', '80-99% - Most processes', '50-79% - Some processes', 'Less than 50%', 'No validation program'],
    critical: true
  },
  {
    id: 'Q14',
    prompt: 'Do you maintain documented procedures for all quality management system processes?',
    type: 'yesno',
    weight: 3,
    clauseRef: 'ISO.4.2'
  },
  {
    id: 'Q15',
    prompt: 'Are customer complaints investigated and trended for patterns?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'QMS.820.198'
  },
  {
    id: 'Q16',
    prompt: 'How do you control design changes and their implementation?',
    type: 'select',
    weight: 4,
    clauseRef: 'QMS.820.30',
    options: ['Formal change control process with approvals', 'Basic documentation of changes', 'Informal change tracking', 'No systematic control']
  },
  {
    id: 'Q17',
    prompt: 'Are production and process controls established to ensure consistent output?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.7.5',
    critical: true
  },
  {
    id: 'Q18',
    prompt: 'Do you conduct sterilization validation studies for sterile products?',
    type: 'select',
    weight: 5,
    clauseRef: 'ISO.11135',
    options: ['Complete validation with full documentation', 'Partial validation studies', 'Rely on third-party validation', 'No validation conducted', 'Not applicable - non-sterile products']
  },
  {
    id: 'Q19',
    prompt: 'Are measuring and monitoring equipment calibrated and controlled?',
    type: 'yesno',
    weight: 3,
    clauseRef: 'ISO.7.1.5'
  },
  {
    id: 'Q20',
    prompt: 'How often do you review and update your quality manual?',
    type: 'select',
    weight: 2,
    clauseRef: 'ISO.4.2',
    options: ['Annually', 'Every 2 years', 'Every 3+ years', 'Only when required by regulations', 'Never updated']
  },
  {
    id: 'Q21',
    prompt: 'Do you maintain traceability records linking materials to finished products?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.7.5.3',
    critical: true
  },
  {
    id: 'Q22',
    prompt: 'Are software lifecycle processes established for medical device software?',
    type: 'select',
    weight: 4,
    clauseRef: 'IEC.62304',
    options: ['Full IEC 62304 compliance', 'Partial software processes', 'Basic software documentation', 'No formal software processes', 'Not applicable - no software']
  },
  {
    id: 'Q23',
    prompt: 'How do you ensure purchased materials and services meet specified requirements?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.7.4',
    options: ['Comprehensive supplier qualification and monitoring', 'Basic supplier approvals', 'Incoming inspection only', 'No formal supplier controls']
  },
  {
    id: 'Q24',
    prompt: 'Are advisory notices and field safety corrective actions documented and tracked?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'ISO.8.2.2'
  },
  {
    id: 'Q25',
    prompt: 'Do you conduct usability engineering studies throughout device development?',
    type: 'select',
    weight: 3,
    clauseRef: 'IEC.62366',
    options: ['Complete usability engineering file', 'Basic usability studies', 'Limited user testing', 'No formal usability program']
  },
  // MDR (Medical Device Regulation) specific questions
  {
    id: 'Q26',
    prompt: 'Do you have a Person Responsible for Regulatory Compliance (PRRC) appointed?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'MDR.15',
    critical: true
  },
  {
    id: 'Q27',
    prompt: 'Is your Unique Device Identification (UDI) system fully implemented and maintained?',
    type: 'select',
    weight: 4,
    clauseRef: 'MDR.27',
    options: ['Fully implemented with database registration', 'Partially implemented', 'In development', 'Not implemented']
  },
  {
    id: 'Q28',
    prompt: 'Are clinical evaluation reports updated throughout the device lifecycle per MDR requirements?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'MDR.61',
    critical: true
  },
  {
    id: 'Q29',
    prompt: 'Do you maintain a post-market clinical follow-up (PMCF) plan and execute studies?',
    type: 'select',
    weight: 4,
    clauseRef: 'MDR.61.11',
    options: ['Active PMCF with ongoing studies', 'PMCF plan exists but limited execution', 'Basic PMCF documentation', 'No PMCF activities']
  },
  {
    id: 'Q30',
    prompt: 'Are periodic safety update reports (PSURs) prepared and submitted as required?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'MDR.86'
  },
  {
    id: 'Q31',
    prompt: 'Do you have authorized representative agreements in place for EU market access?',
    type: 'select',
    weight: 3,
    clauseRef: 'MDR.11',
    options: ['Formal agreement with qualified AR', 'Basic AR arrangement', 'In negotiation', 'Not applicable - EU manufacturer', 'No AR appointed']
  },
  {
    id: 'Q32',
    prompt: 'Are serious incident reports submitted to competent authorities within required timeframes?',
    type: 'select',
    weight: 5,
    clauseRef: 'MDR.87',
    options: ['Always within required timeframes', 'Usually timely with minor delays', 'Sometimes delayed', 'Frequently delayed', 'No systematic reporting'],
    critical: true
  },
  {
    id: 'Q33',
    prompt: 'Do you maintain conformity assessment procedures appropriate for your device classification?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'MDR.52',
    critical: true
  },
  // ISO 14155 (Clinical Investigation) specific questions
  {
    id: 'Q34',
    prompt: 'Are clinical investigation protocols developed according to ISO 14155 requirements?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.14155.6',
    options: ['Full ISO 14155 compliance', 'Partial compliance with gaps', 'Basic protocol development', 'No formal clinical protocols', 'Not applicable - no clinical studies']
  },
  {
    id: 'Q35',
    prompt: 'Do you have qualified clinical investigators and adequate investigational sites?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.14155.7',
    options: ['Comprehensive investigator qualification program', 'Basic investigator oversight', 'Limited qualification processes', 'No systematic investigator management', 'Not applicable']
  },
  {
    id: 'Q36',
    prompt: 'Are clinical investigation reports prepared with statistical analysis plans?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.14155.12'
  },
  {
    id: 'Q37',
    prompt: 'Do you conduct risk-benefit analyses for ongoing clinical investigations?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.14155.8'
  },
  {
    id: 'Q38',
    prompt: 'Are adverse device effects systematically collected and analyzed during clinical studies?',
    type: 'select',
    weight: 5,
    clauseRef: 'ISO.14155.9',
    options: ['Comprehensive ADE monitoring system', 'Basic adverse event tracking', 'Limited safety monitoring', 'No systematic ADE collection', 'Not applicable'],
    critical: true
  },
  {
    id: 'Q39',
    prompt: 'Do you maintain clinical investigation master files with all essential documents?',
    type: 'yesno',
    weight: 3,
    clauseRef: 'ISO.14155.11'
  },
  {
    id: 'Q40',
    prompt: 'Are clinical data management procedures established with data integrity controls?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.14155.10',
    options: ['Validated clinical data management system', 'Basic data management procedures', 'Manual data collection only', 'No formal data management', 'Not applicable']
  }
];

export const standardsMap: StandardsMap = {
  'QMS.820.30': {
    title: 'Design Controls',
    riskWeight: 5,
    critical: true
  },
  'ISO.9.3': {
    title: 'Management Review',
    riskWeight: 3
  },
  'ISO.8.5': {
    title: 'Corrective and Preventive Action',
    riskWeight: 5,
    critical: true
  },
  'ISO.14971': {
    title: 'Risk Management',
    riskWeight: 5,
    critical: true
  },
  'ISO.8.2.1': {
    title: 'Post-Market Surveillance',
    riskWeight: 4
  },
  'ISO.7.2': {
    title: 'Competence',
    riskWeight: 3
  },
  'ISO.8.3': {
    title: 'Control of Nonconforming Output',
    riskWeight: 4,
    critical: true
  },
  'ISO.9.2': {
    title: 'Internal Audit',
    riskWeight: 4
  },
  'QMS.820.75': {
    title: 'Process Validation',
    riskWeight: 5,
    critical: true
  },
  'ISO.4.2': {
    title: 'Documentation Requirements',
    riskWeight: 3
  },
  'QMS.820.198': {
    title: 'Complaint Files',
    riskWeight: 4
  },
  'ISO.7.5': {
    title: 'Production and Service Provision',
    riskWeight: 4,
    critical: true
  },
  'ISO.11135': {
    title: 'Sterilization of Healthcare Products',
    riskWeight: 5
  },
  'ISO.7.1.5': {
    title: 'Monitoring and Measuring Resources',
    riskWeight: 3
  },
  'ISO.7.5.3': {
    title: 'Traceability',
    riskWeight: 4,
    critical: true
  },
  'IEC.62304': {
    title: 'Medical Device Software',
    riskWeight: 4
  },
  'ISO.7.4': {
    title: 'Control of Externally Provided Processes, Products and Services',
    riskWeight: 4
  },
  'ISO.8.2.2': {
    title: 'Feedback',
    riskWeight: 5
  },
  'IEC.62366': {
    title: 'Usability Engineering',
    riskWeight: 3
  },
  // MDR clauses
  'MDR.15': {
    title: 'Person Responsible for Regulatory Compliance',
    riskWeight: 5,
    critical: true
  },
  'MDR.27': {
    title: 'Unique Device Identification System',
    riskWeight: 4
  },
  'MDR.61': {
    title: 'Clinical Evaluation and Post-Market Clinical Follow-up',
    riskWeight: 5,
    critical: true
  },
  'MDR.61.11': {
    title: 'Post-Market Clinical Follow-up',
    riskWeight: 4
  },
  'MDR.86': {
    title: 'Periodic Safety Update Report',
    riskWeight: 4
  },
  'MDR.11': {
    title: 'Authorized Representative',
    riskWeight: 3
  },
  'MDR.87': {
    title: 'Reporting of Serious Incidents',
    riskWeight: 5,
    critical: true
  },
  'MDR.52': {
    title: 'Conformity Assessment Procedures',
    riskWeight: 5,
    critical: true
  },
  // ISO 14155 clauses
  'ISO.14155.6': {
    title: 'Clinical Investigation Protocol',
    riskWeight: 4
  },
  'ISO.14155.7': {
    title: 'Clinical Investigators and Investigation Sites',
    riskWeight: 4
  },
  'ISO.14155.12': {
    title: 'Clinical Investigation Report',
    riskWeight: 4
  },
  'ISO.14155.8': {
    title: 'Risk-Benefit Analysis',
    riskWeight: 4
  },
  'ISO.14155.9': {
    title: 'Safety Reporting',
    riskWeight: 5,
    critical: true
  },
  'ISO.14155.11': {
    title: 'Clinical Investigation Master File',
    riskWeight: 3
  },
  'ISO.14155.10': {
    title: 'Clinical Data Management',
    riskWeight: 4
  }
};

export const evidenceExamples: Record<string, string[]> = {
  'QMS.820.30': [
    'Design History File (DHF)',
    'Design Input Requirements',
    'Design Output Documents',
    'Design Review Records',
    'Design Verification Protocols',
    'Design Validation Reports'
  ],
  'ISO.8.5': [
    'CAPA Procedures',
    'Root Cause Analysis Reports',
    'Corrective Action Records',
    'Effectiveness Verification',
    'Trend Analysis Reports'
  ],
  'ISO.14971': [
    'Risk Management File',
    'Risk Analysis Reports',
    'Risk Control Implementation',
    'Post-Market Risk Evaluation',
    'Risk Management Plan'
  ],
  'QMS.820.75': [
    'Process Validation Protocols',
    'Installation Qualification (IQ)',
    'Operational Qualification (OQ)',
    'Performance Qualification (PQ)',
    'Process Monitoring Data'
  ],
  'ISO.7.5': [
    'Work Instructions',
    'Process Control Charts',
    'Environmental Monitoring',
    'Production Records',
    'Process Capability Studies'
  ],
  'ISO.8.3': [
    'Nonconformance Reports',
    'Disposition Records',
    'Segregation Controls',
    'Investigation Reports',
    'Corrective Actions'
  ],
  'ISO.7.5.3': [
    'Traceability Matrix',
    'Lot/Batch Records',
    'Component Traceability',
    'Distribution Records',
    'Recall Procedures'
  ],
  // MDR evidence examples
  'MDR.15': [
    'PRRC Appointment Letter',
    'PRRC Qualification Records',
    'Regulatory Compliance Monitoring Reports',
    'Competent Authority Communications'
  ],
  'MDR.27': [
    'UDI Database Registration',
    'UDI Labeling Documentation',
    'UDI Assignment Records',
    'GUDID Registration Certificates'
  ],
  'MDR.61': [
    'Clinical Evaluation Report',
    'Clinical Evidence Summary',
    'Literature Review Documentation',
    'Equivalence Demonstration',
    'PMCF Plan and Reports'
  ],
  'MDR.87': [
    'Incident Reporting Procedures',
    'EUDAMED Incident Reports',
    'Competent Authority Notifications',
    'Trend Analysis of Incidents'
  ],
  'MDR.52': [
    'Conformity Assessment Documentation',
    'Technical Documentation',
    'EC Declaration of Conformity',
    'Notified Body Certificates'
  ],
  // ISO 14155 evidence examples
  'ISO.14155.6': [
    'Clinical Investigation Protocol',
    'Protocol Amendments',
    'Statistical Analysis Plan',
    'Ethics Committee Approvals'
  ],
  'ISO.14155.9': [
    'Adverse Device Effect Reports',
    'Safety Monitoring Procedures',
    'Data Safety Monitoring Board Reports',
    'Risk-Benefit Assessments'
  ],
  'ISO.14155.10': [
    'Clinical Data Management Plan',
    'Case Report Forms',
    'Data Validation Procedures',
    'Database Lock Documentation'
  ],
  'ISO.14155.11': [
    'Clinical Investigation Master File',
    'Essential Documents Checklist',
    'Investigator Site Files',
    'Regulatory Submissions'
  ]
};