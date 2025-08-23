import { Question } from './types';

// Sample questionnaire covering key ISO 13485 and 21 CFR 820 requirements
export const QUESTIONS: Question[] = [
  {
    id: 'Q1',
    text: 'Does your organization have a documented Quality Management System?',
    type: 'boolean',
    clause_ref: 'QMS.820.30',
    critical: true,
    weight: 10,
    category: 'Quality Management System',
    help_text: 'A documented QMS is fundamental to regulatory compliance'
  },
  {
    id: 'Q2', 
    text: 'Are management responsibilities and authorities clearly defined?',
    type: 'boolean',
    clause_ref: 'QMS.820.20',
    critical: true,
    weight: 8,
    category: 'Management Responsibility'
  },
  {
    id: 'Q3',
    text: 'How comprehensive is your document control system?',
    type: 'select',
    options: ['No formal system', 'Basic procedures', 'Comprehensive system', 'Fully automated system'],
    clause_ref: 'DOC.820.40',
    critical: false,
    weight: 7,
    category: 'Document Control'
  },
  {
    id: 'Q4',
    text: 'Are design controls implemented for your medical devices?',
    type: 'boolean',
    clause_ref: 'DES.820.30',
    critical: true,
    weight: 9,
    category: 'Design Controls',
    help_text: 'Design controls are required for Class II and Class III devices'
  },
  {
    id: 'Q5',
    text: 'Rate the effectiveness of your risk management process (1-5 scale)',
    type: 'slider',
    clause_ref: 'RSK.14971',
    critical: false,
    weight: 8,
    category: 'Risk Management'
  },
  {
    id: 'Q6',
    text: 'Do you have procedures for supplier evaluation and control?',
    type: 'boolean',
    clause_ref: 'PUR.820.50',
    critical: false,
    weight: 6,
    category: 'Purchasing Controls'
  },
  {
    id: 'Q7',
    text: 'How mature is your corrective and preventive action (CAPA) system?',
    type: 'select',
    options: ['No formal CAPA', 'Basic procedures', 'Systematic approach', 'Advanced analytics'],
    clause_ref: 'CAP.820.100',
    critical: true,
    weight: 9,
    category: 'CAPA System'
  },
  {
    id: 'Q8',
    text: 'Are production and process controls documented and validated?',
    type: 'boolean',
    clause_ref: 'PRO.820.70',
    critical: true,
    weight: 8,
    category: 'Production Controls'
  },
  {
    id: 'Q9',
    text: 'Do you maintain device history records (DHR) for each batch/lot?',
    type: 'boolean',
    clause_ref: 'DHR.820.184',
    critical: true,
    weight: 7,
    category: 'Records Management'
  },
  {
    id: 'Q10',
    text: 'How comprehensive is your post-market surveillance system?',
    type: 'select',
    options: ['Minimal compliance', 'Basic monitoring', 'Systematic surveillance', 'Advanced analytics'],
    clause_ref: 'PMS.820.198',
    critical: false,
    weight: 6,
    category: 'Post-Market Surveillance'
  },
  {
    id: 'Q11',
    text: 'Are statistical techniques used for process validation and monitoring?',
    type: 'boolean',
    clause_ref: 'STA.820.250',
    critical: false,
    weight: 5,
    category: 'Statistical Techniques'
  },
  {
    id: 'Q12',
    text: 'Do you have a formal training program for personnel?',
    type: 'boolean',
    clause_ref: 'TRN.820.25',
    critical: false,
    weight: 6,
    category: 'Training and Competence'
  },
  {
    id: 'Q13',
    text: 'Rate your internal audit program effectiveness (1-5 scale)',
    type: 'slider',
    clause_ref: 'AUD.820.22',
    critical: false,
    weight: 7,
    category: 'Internal Audits'
  },
  {
    id: 'Q14',
    text: 'Are nonconforming products properly identified and controlled?',
    type: 'boolean',
    clause_ref: 'NCO.820.90',
    critical: true,
    weight: 8,
    category: 'Nonconforming Product'
  },
  {
    id: 'Q15',
    text: 'How robust is your complaint handling system?',
    type: 'select',
    options: ['Ad-hoc handling', 'Basic procedures', 'Systematic process', 'Integrated system'],
    clause_ref: 'COM.820.198',
    critical: true,
    weight: 8,
    category: 'Complaint Handling'
  },
  {
    id: 'Q16',
    text: 'Do you conduct management reviews at planned intervals?',
    type: 'boolean',
    clause_ref: 'MGR.820.20',
    critical: false,
    weight: 6,
    category: 'Management Review'
  },
  {
    id: 'Q17',
    text: 'Are measurement and monitoring devices calibrated?',
    type: 'boolean',
    clause_ref: 'CAL.820.72',
    critical: false,
    weight: 7,
    category: 'Measurement Equipment'
  },
  {
    id: 'Q18',
    text: 'How comprehensive is your labeling control system?',
    type: 'select',
    options: ['Basic compliance', 'Good controls', 'Comprehensive system', 'Fully validated'],
    clause_ref: 'LAB.820.120',
    critical: false,
    weight: 6,
    category: 'Labeling Controls'
  },
  {
    id: 'Q19',
    text: 'Do you have procedures for medical device reporting (MDR)?',
    type: 'boolean',
    clause_ref: 'MDR.803.50',
    critical: true,
    weight: 9,
    category: 'Medical Device Reporting'
  },
  {
    id: 'Q20',
    text: 'Rate your change control process maturity (1-5 scale)',
    type: 'slider',
    clause_ref: 'CHG.820.30',
    critical: false,
    weight: 7,
    category: 'Change Control'
  }
];

export const getQuestions = (): Question[] => {
  return QUESTIONS;
};

export const getQuestionById = (id: string): Question | undefined => {
  return QUESTIONS.find(q => q.id === id);
};