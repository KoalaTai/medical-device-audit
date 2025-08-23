import { Question, StandardsMap, RegulatoryFramework, DeviceRiskClass, RiskClassification } from './types';

export const questionnaire: Question[] = [
  {
    id: 'Q1',
    prompt: 'Do you maintain a Design History File (DHF) with complete traceability from user needs to design outputs?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'QMS.820.30',
    critical: true,
    frameworks: ['CFR_820', 'ISO_13485'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.5,
      'Class IIa': 0.9,
      'Class IIb': 1.2
    }
  },
  {
    id: 'Q2',
    prompt: 'Are design controls implemented throughout the product development lifecycle?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'QMS.820.30',
    critical: true,
    frameworks: ['CFR_820', 'ISO_13485'],
    riskMultipliers: {
      'Class I': 0.7,
      'Class II': 1.0,
      'Class III': 1.6,
      'Class IIa': 0.8,
      'Class IIb': 1.3
    }
  },
  {
    id: 'Q3',
    prompt: 'Do you conduct formal design reviews at appropriate stages of development?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'QMS.820.30',
    frameworks: ['CFR_820', 'ISO_13485'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.4,
      'Class IIa': 0.9,
      'Class IIb': 1.2
    }
  },
  {
    id: 'Q4',
    prompt: 'Are design verification and validation activities documented and executed?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'QMS.820.30',
    critical: true,
    frameworks: ['CFR_820', 'ISO_13485'],
    riskMultipliers: {
      'Class I': 0.6,
      'Class II': 1.0,
      'Class III': 1.8,
      'Class IIa': 0.8,
      'Class IIb': 1.4
    }
  },
  {
    id: 'Q5',
    prompt: 'How frequently do you conduct management reviews of the quality management system?',
    type: 'select',
    weight: 3,
    clauseRef: 'ISO.9.3',
    options: ['Annually', 'Semi-annually', 'Quarterly', 'Monthly', 'Not conducted'],
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q6',
    prompt: 'Are supplier CAPAs verified for effectiveness before closure?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.8.5',
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q7',
    prompt: 'Do you maintain a risk management file throughout the product lifecycle?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'ISO.14971',
    critical: true,
    frameworks: ['ISO_13485', 'MDR'],
    riskMultipliers: {
      'Class I': 0.9,
      'Class II': 1.0,
      'Class III': 1.7,
      'Class IIa': 1.0,
      'Class IIb': 1.4
    }
  },
  {
    id: 'Q8',
    prompt: 'Are post-market surveillance activities systematically conducted and documented?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.8.2.1',
    frameworks: ['ISO_13485', 'MDR']
  },
  {
    id: 'Q9',
    prompt: 'How do you ensure competency of personnel performing work affecting product quality?',
    type: 'select',
    weight: 3,
    clauseRef: 'ISO.7.2',
    options: ['Comprehensive training program with records', 'Basic training documentation', 'On-the-job training only', 'No formal program'],
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q10',
    prompt: 'Are nonconforming products consistently identified, controlled, and dispositioned?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.8.3',
    critical: true,
    frameworks: ['ISO_13485'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.5,
      'Class IIa': 0.9,
      'Class IIb': 1.3
    }
  },
  {
    id: 'Q11',
    prompt: 'Do you conduct periodic internal audits of all QMS processes?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.9.2',
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q12',
    prompt: 'Are corrective and preventive actions (CAPAs) implemented with root cause analysis?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'ISO.8.5',
    critical: true,
    frameworks: ['ISO_13485', 'CFR_820'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.6,
      'Class IIa': 0.9,
      'Class IIb': 1.3
    }
  },
  {
    id: 'Q13',
    prompt: 'What percentage of your manufacturing processes are validated?',
    type: 'select',
    weight: 5,
    clauseRef: 'QMS.820.75',
    options: ['100% - All processes', '80-99% - Most processes', '50-79% - Some processes', 'Less than 50%', 'No validation program'],
    critical: true,
    frameworks: ['CFR_820'],
    riskMultipliers: {
      'Class I': 0.7,
      'Class II': 1.0,
      'Class III': 1.6,
      'Class IIa': 0.8,
      'Class IIb': 1.4
    }
  },
  {
    id: 'Q14',
    prompt: 'Do you maintain documented procedures for all quality management system processes?',
    type: 'yesno',
    weight: 3,
    clauseRef: 'ISO.4.2',
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q15',
    prompt: 'Are customer complaints investigated and trended for patterns?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'QMS.820.198',
    frameworks: ['CFR_820']
  },
  {
    id: 'Q16',
    prompt: 'How do you control design changes and their implementation?',
    type: 'select',
    weight: 4,
    clauseRef: 'QMS.820.30',
    options: ['Formal change control process with approvals', 'Basic documentation of changes', 'Informal change tracking', 'No systematic control'],
    frameworks: ['CFR_820', 'ISO_13485']
  },
  {
    id: 'Q17',
    prompt: 'Are production and process controls established to ensure consistent output?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.7.5',
    critical: true,
    frameworks: ['ISO_13485'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.4,
      'Class IIa': 0.9,
      'Class IIb': 1.2
    }
  },
  {
    id: 'Q18',
    prompt: 'Do you conduct sterilization validation studies for sterile products?',
    type: 'select',
    weight: 5,
    clauseRef: 'ISO.11135',
    options: ['Complete validation with full documentation', 'Partial validation studies', 'Rely on third-party validation', 'No validation conducted', 'Not applicable - non-sterile products'],
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q19',
    prompt: 'Are measuring and monitoring equipment calibrated and controlled?',
    type: 'yesno',
    weight: 3,
    clauseRef: 'ISO.7.1.5',
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q20',
    prompt: 'How often do you review and update your quality manual?',
    type: 'select',
    weight: 2,
    clauseRef: 'ISO.4.2',
    options: ['Annually', 'Every 2 years', 'Every 3+ years', 'Only when required by regulations', 'Never updated'],
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q21',
    prompt: 'Do you maintain traceability records linking materials to finished products?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.7.5.3',
    critical: true,
    frameworks: ['ISO_13485', 'MDR'],
    riskMultipliers: {
      'Class I': 0.7,
      'Class II': 1.0,
      'Class III': 1.5,
      'Class IIa': 0.9,
      'Class IIb': 1.3
    }
  },
  {
    id: 'Q22',
    prompt: 'Are software lifecycle processes established for medical device software?',
    type: 'select',
    weight: 4,
    clauseRef: 'IEC.62304',
    options: ['Full IEC 62304 compliance', 'Partial software processes', 'Basic software documentation', 'No formal software processes', 'Not applicable - no software'],
    frameworks: ['ISO_13485', 'MDR']
  },
  {
    id: 'Q23',
    prompt: 'How do you ensure purchased materials and services meet specified requirements?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.7.4',
    options: ['Comprehensive supplier qualification and monitoring', 'Basic supplier approvals', 'Incoming inspection only', 'No formal supplier controls'],
    frameworks: ['ISO_13485']
  },
  {
    id: 'Q24',
    prompt: 'Are advisory notices and field safety corrective actions documented and tracked?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'ISO.8.2.2',
    frameworks: ['ISO_13485', 'MDR']
  },
  {
    id: 'Q25',
    prompt: 'Do you conduct usability engineering studies throughout device development?',
    type: 'select',
    weight: 3,
    clauseRef: 'IEC.62366',
    options: ['Complete usability engineering file', 'Basic usability studies', 'Limited user testing', 'No formal usability program'],
    frameworks: ['ISO_13485', 'MDR']
  },
  // MDR (Medical Device Regulation) specific questions
  {
    id: 'Q26',
    prompt: 'Do you have a Person Responsible for Regulatory Compliance (PRRC) appointed?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'MDR.15',
    critical: true,
    frameworks: ['MDR'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.3,
      'Class IIa': 1.0,
      'Class IIb': 1.2
    }
  },
  {
    id: 'Q27',
    prompt: 'Is your Unique Device Identification (UDI) system fully implemented and maintained?',
    type: 'select',
    weight: 4,
    clauseRef: 'MDR.27',
    options: ['Fully implemented with database registration', 'Partially implemented', 'In development', 'Not implemented'],
    frameworks: ['MDR']
  },
  {
    id: 'Q28',
    prompt: 'Are clinical evaluation reports updated throughout the device lifecycle per MDR requirements?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'MDR.61',
    critical: true,
    frameworks: ['MDR'],
    riskMultipliers: {
      'Class I': 0.5,
      'Class II': 1.0,
      'Class III': 1.8,
      'Class IIa': 0.8,
      'Class IIb': 1.4
    }
  },
  {
    id: 'Q29',
    prompt: 'Do you maintain a post-market clinical follow-up (PMCF) plan and execute studies?',
    type: 'select',
    weight: 4,
    clauseRef: 'MDR.61.11',
    options: ['Active PMCF with ongoing studies', 'PMCF plan exists but limited execution', 'Basic PMCF documentation', 'No PMCF activities'],
    frameworks: ['MDR']
  },
  {
    id: 'Q30',
    prompt: 'Are periodic safety update reports (PSURs) prepared and submitted as required?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'MDR.86',
    frameworks: ['MDR']
  },
  {
    id: 'Q31',
    prompt: 'Do you have authorized representative agreements in place for EU market access?',
    type: 'select',
    weight: 3,
    clauseRef: 'MDR.11',
    options: ['Formal agreement with qualified AR', 'Basic AR arrangement', 'In negotiation', 'Not applicable - EU manufacturer', 'No AR appointed'],
    frameworks: ['MDR']
  },
  {
    id: 'Q32',
    prompt: 'Are serious incident reports submitted to competent authorities within required timeframes?',
    type: 'select',
    weight: 5,
    clauseRef: 'MDR.87',
    options: ['Always within required timeframes', 'Usually timely with minor delays', 'Sometimes delayed', 'Frequently delayed', 'No systematic reporting'],
    critical: true,
    frameworks: ['MDR'],
    riskMultipliers: {
      'Class I': 0.8,
      'Class II': 1.0,
      'Class III': 1.5,
      'Class IIa': 1.0,
      'Class IIb': 1.3
    }
  },
  {
    id: 'Q33',
    prompt: 'Do you maintain conformity assessment procedures appropriate for your device classification?',
    type: 'yesno',
    weight: 5,
    clauseRef: 'MDR.52',
    critical: true,
    frameworks: ['MDR'],
    riskMultipliers: {
      'Class I': 0.6,
      'Class II': 1.0,
      'Class III': 1.7,
      'Class IIa': 0.8,
      'Class IIb': 1.4
    }
  },
  // ISO 14155 (Clinical Investigation) specific questions
  {
    id: 'Q34',
    prompt: 'Are clinical investigation protocols developed according to ISO 14155 requirements?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.14155.6',
    options: ['Full ISO 14155 compliance', 'Partial compliance with gaps', 'Basic protocol development', 'No formal clinical protocols', 'Not applicable - no clinical studies'],
    frameworks: ['ISO_14155']
  },
  {
    id: 'Q35',
    prompt: 'Do you have qualified clinical investigators and adequate investigational sites?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.14155.7',
    options: ['Comprehensive investigator qualification program', 'Basic investigator oversight', 'Limited qualification processes', 'No systematic investigator management', 'Not applicable'],
    frameworks: ['ISO_14155']
  },
  {
    id: 'Q36',
    prompt: 'Are clinical investigation reports prepared with statistical analysis plans?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.14155.12',
    frameworks: ['ISO_14155']
  },
  {
    id: 'Q37',
    prompt: 'Do you conduct risk-benefit analyses for ongoing clinical investigations?',
    type: 'yesno',
    weight: 4,
    clauseRef: 'ISO.14155.8',
    frameworks: ['ISO_14155']
  },
  {
    id: 'Q38',
    prompt: 'Are adverse device effects systematically collected and analyzed during clinical studies?',
    type: 'select',
    weight: 5,
    clauseRef: 'ISO.14155.9',
    options: ['Comprehensive ADE monitoring system', 'Basic adverse event tracking', 'Limited safety monitoring', 'No systematic ADE collection', 'Not applicable'],
    critical: true,
    frameworks: ['ISO_14155'],
    riskMultipliers: {
      'Class I': 0.6,
      'Class II': 1.0,
      'Class III': 1.8,
      'Class IIa': 0.8,
      'Class IIb': 1.5
    }
  },
  {
    id: 'Q39',
    prompt: 'Do you maintain clinical investigation master files with all essential documents?',
    type: 'yesno',
    weight: 3,
    clauseRef: 'ISO.14155.11',
    frameworks: ['ISO_14155']
  },
  {
    id: 'Q40',
    prompt: 'Are clinical data management procedures established with data integrity controls?',
    type: 'select',
    weight: 4,
    clauseRef: 'ISO.14155.10',
    options: ['Validated clinical data management system', 'Basic data management procedures', 'Manual data collection only', 'No formal data management', 'Not applicable'],
    frameworks: ['ISO_14155']
  }
];

export const standardsMap: StandardsMap = {
  'QMS.820.30': {
    title: 'Design Controls',
    riskWeight: 5,
    critical: true,
    framework: 'CFR_820'
  },
  'ISO.9.3': {
    title: 'Management Review',
    riskWeight: 3,
    framework: 'ISO_13485'
  },
  'ISO.8.5': {
    title: 'Corrective and Preventive Action',
    riskWeight: 5,
    critical: true,
    framework: 'ISO_13485'
  },
  'ISO.14971': {
    title: 'Risk Management',
    riskWeight: 5,
    critical: true,
    framework: 'ISO_13485'
  },
  'ISO.8.2.1': {
    title: 'Post-Market Surveillance',
    riskWeight: 4,
    framework: 'ISO_13485'
  },
  'ISO.7.2': {
    title: 'Competence',
    riskWeight: 3,
    framework: 'ISO_13485'
  },
  'ISO.8.3': {
    title: 'Control of Nonconforming Output',
    riskWeight: 4,
    critical: true,
    framework: 'ISO_13485'
  },
  'ISO.9.2': {
    title: 'Internal Audit',
    riskWeight: 4,
    framework: 'ISO_13485'
  },
  'QMS.820.75': {
    title: 'Process Validation',
    riskWeight: 5,
    critical: true,
    framework: 'CFR_820'
  },
  'ISO.4.2': {
    title: 'Documentation Requirements',
    riskWeight: 3,
    framework: 'ISO_13485'
  },
  'QMS.820.198': {
    title: 'Complaint Files',
    riskWeight: 4,
    framework: 'CFR_820'
  },
  'ISO.7.5': {
    title: 'Production and Service Provision',
    riskWeight: 4,
    critical: true,
    framework: 'ISO_13485'
  },
  'ISO.11135': {
    title: 'Sterilization of Healthcare Products',
    riskWeight: 5,
    framework: 'ISO_13485'
  },
  'ISO.7.1.5': {
    title: 'Monitoring and Measuring Resources',
    riskWeight: 3,
    framework: 'ISO_13485'
  },
  'ISO.7.5.3': {
    title: 'Traceability',
    riskWeight: 4,
    critical: true,
    framework: 'ISO_13485'
  },
  'IEC.62304': {
    title: 'Medical Device Software',
    riskWeight: 4,
    framework: 'ISO_13485'
  },
  'ISO.7.4': {
    title: 'Control of Externally Provided Processes, Products and Services',
    riskWeight: 4,
    framework: 'ISO_13485'
  },
  'ISO.8.2.2': {
    title: 'Feedback',
    riskWeight: 5,
    framework: 'ISO_13485'
  },
  'IEC.62366': {
    title: 'Usability Engineering',
    riskWeight: 3,
    framework: 'ISO_13485'
  },
  // MDR clauses
  'MDR.15': {
    title: 'Person Responsible for Regulatory Compliance',
    riskWeight: 5,
    critical: true,
    framework: 'MDR'
  },
  'MDR.27': {
    title: 'Unique Device Identification System',
    riskWeight: 4,
    framework: 'MDR'
  },
  'MDR.61': {
    title: 'Clinical Evaluation and Post-Market Clinical Follow-up',
    riskWeight: 5,
    critical: true,
    framework: 'MDR'
  },
  'MDR.61.11': {
    title: 'Post-Market Clinical Follow-up',
    riskWeight: 4,
    framework: 'MDR'
  },
  'MDR.86': {
    title: 'Periodic Safety Update Report',
    riskWeight: 4,
    framework: 'MDR'
  },
  'MDR.11': {
    title: 'Authorized Representative',
    riskWeight: 3,
    framework: 'MDR'
  },
  'MDR.87': {
    title: 'Reporting of Serious Incidents',
    riskWeight: 5,
    critical: true,
    framework: 'MDR'
  },
  'MDR.52': {
    title: 'Conformity Assessment Procedures',
    riskWeight: 5,
    critical: true,
    framework: 'MDR'
  },
  // ISO 14155 clauses
  'ISO.14155.6': {
    title: 'Clinical Investigation Protocol',
    riskWeight: 4,
    framework: 'ISO_14155'
  },
  'ISO.14155.7': {
    title: 'Clinical Investigators and Investigation Sites',
    riskWeight: 4,
    framework: 'ISO_14155'
  },
  'ISO.14155.12': {
    title: 'Clinical Investigation Report',
    riskWeight: 4,
    framework: 'ISO_14155'
  },
  'ISO.14155.8': {
    title: 'Risk-Benefit Analysis',
    riskWeight: 4,
    framework: 'ISO_14155'
  },
  'ISO.14155.9': {
    title: 'Safety Reporting',
    riskWeight: 5,
    critical: true,
    framework: 'ISO_14155'
  },
  'ISO.14155.11': {
    title: 'Clinical Investigation Master File',
    riskWeight: 3,
    framework: 'ISO_14155'
  },
  'ISO.14155.10': {
    title: 'Clinical Data Management',
    riskWeight: 4,
    framework: 'ISO_14155'
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

export const frameworkLabels: Record<RegulatoryFramework, string> = {
  'ISO_13485': 'ISO 13485:2016',
  'CFR_820': '21 CFR 820',
  'MDR': 'EU MDR 2017/745',
  'ISO_14155': 'ISO 14155:2020'
};

export const frameworkDescriptions: Record<RegulatoryFramework, string> = {
  'ISO_13485': 'Medical devices - Quality management systems - Requirements for regulatory purposes',
  'CFR_820': 'Quality System Regulation for medical devices in the United States',
  'MDR': 'Medical Device Regulation for the European Union market',
  'ISO_14155': 'Clinical investigation of medical devices for human subjects'
};

/**
 * Filter questions based on selected regulatory frameworks
 */
export function getFilteredQuestions(
  selectedFrameworks: RegulatoryFramework[], 
  includeAllFrameworks: boolean = false
): Question[] {
  if (includeAllFrameworks || selectedFrameworks.length === 0) {
    return questionnaire;
  }
  
  return questionnaire.filter(question => 
    question.frameworks.some(framework => 
      selectedFrameworks.includes(framework)
    )
  );
}

/**
 * Get count of questions for each framework
 */
export function getQuestionCountByFramework(): Record<RegulatoryFramework, number> {
  const counts: Record<RegulatoryFramework, number> = {
    'ISO_13485': 0,
    'CFR_820': 0,
    'MDR': 0,
    'ISO_14155': 0
  };
  
  questionnaire.forEach(question => {
    question.frameworks.forEach(framework => {
      counts[framework]++;
    });
  });
  
  return counts;
}

/**
 * Determine device risk classification based on user inputs
 */
export function determineRiskClassification(
  fdaClass?: 'Class I' | 'Class II' | 'Class III',
  euClass?: 'Class I' | 'Class IIa' | 'Class IIb' | 'Class III',
  isSterile: boolean = false,
  isMeasuring: boolean = false,
  hasActiveComponents: boolean = false,
  isDrugDevice: boolean = false
): RiskClassification {
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  
  // Determine overall risk level based on classifications and characteristics
  if (fdaClass === 'Class III' || euClass === 'Class III') {
    riskLevel = 'Very High';
  } else if (fdaClass === 'Class II' || euClass === 'Class IIb' || isDrugDevice) {
    riskLevel = 'High';
  } else if (euClass === 'Class IIa' || isSterile || hasActiveComponents || isMeasuring) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }
  
  return {
    fdaClass,
    euClass,
    isSterile,
    isMeasuring,
    hasActiveComponents,
    isDrugDevice,
    riskLevel
  };
}

/**
 * Get risk-adjusted weight for a question based on device classification
 */
export function getRiskAdjustedWeight(
  question: Question, 
  riskClassification?: RiskClassification
): number {
  if (!riskClassification || !question.riskMultipliers) {
    return question.weight;
  }
  
  // Determine which risk class to use for multiplier
  let deviceClass: DeviceRiskClass | undefined;
  
  if (riskClassification.fdaClass) {
    deviceClass = riskClassification.fdaClass;
  } else if (riskClassification.euClass) {
    deviceClass = riskClassification.euClass;
  }
  
  if (!deviceClass || !question.riskMultipliers[deviceClass]) {
    return question.weight;
  }
  
  const baseMultiplier = question.riskMultipliers[deviceClass];
  
  // Additional multipliers based on device characteristics
  let adjustedMultiplier = baseMultiplier;
  
  if (riskClassification.isSterile && question.clauseRef === 'ISO.11135') {
    adjustedMultiplier *= 1.2;
  }
  
  if (riskClassification.hasActiveComponents && 
      (question.clauseRef === 'IEC.62304' || question.clauseRef === 'IEC.62366')) {
    adjustedMultiplier *= 1.3;
  }
  
  if (riskClassification.isDrugDevice && question.critical) {
    adjustedMultiplier *= 1.1;
  }
  
  return Math.round(question.weight * adjustedMultiplier * 10) / 10;
}

/**
 * Get risk-specific question recommendations
 */
export function getRiskSpecificRecommendations(
  riskClassification?: RiskClassification
): string[] {
  if (!riskClassification) return [];
  
  const recommendations: string[] = [];
  
  switch (riskClassification.riskLevel) {
    case 'Very High':
      recommendations.push(
        'Implement comprehensive clinical evaluation and post-market surveillance',
        'Establish rigorous design controls with extensive verification and validation',
        'Maintain detailed risk management throughout entire product lifecycle'
      );
      break;
    case 'High':
      recommendations.push(
        'Conduct thorough clinical evaluation or leverage predicate devices',
        'Implement robust quality management system with regular audits',
        'Establish comprehensive post-market monitoring program'
      );
      break;
    case 'Medium':
      recommendations.push(
        'Maintain appropriate design controls and risk management',
        'Implement targeted post-market surveillance activities',
        'Ensure proper validation of critical processes'
      );
      break;
    case 'Low':
      recommendations.push(
        'Maintain basic quality management system documentation',
        'Implement essential design controls and risk management',
        'Establish fundamental post-market monitoring'
      );
      break;
  }
  
  if (riskClassification.isSterile) {
    recommendations.push('Validate sterilization processes with comprehensive documentation');
  }
  
  if (riskClassification.hasActiveComponents) {
    recommendations.push('Implement software lifecycle processes per IEC 62304');
  }
  
  if (riskClassification.isDrugDevice) {
    recommendations.push('Coordinate with drug regulatory requirements and combination product guidance');
  }
  
  return recommendations;
}