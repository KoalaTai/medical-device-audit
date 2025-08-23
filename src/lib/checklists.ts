import { ChecklistItem, PreparationGuide, DeviceCategory, RegulatoryFramework, DeviceRiskClass } from './types';

export const checklistItems: ChecklistItem[] = [
  // Design Controls - Critical for all categories
  {
    id: 'DC001',
    title: 'Design History File (DHF) Completeness',
    description: 'Ensure DHF contains all required design inputs, outputs, reviews, verification, validation, and change control records',
    priority: 'critical',
    category: 'Design Controls',
    frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
    deviceCategories: ['surgical', 'diagnostic', 'therapeutic'],
    riskClasses: ['Class I', 'Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 8,
    evidenceTypes: ['Design History File', 'Design Controls Procedures', 'Design Review Records'],
    commonPitfalls: ['Missing traceability matrices', 'Incomplete design reviews', 'Inadequate change control documentation'],
    tips: ['Use design control checklists for each phase', 'Maintain digital DHF with version control']
  },
  {
    id: 'DC002', 
    title: 'Risk Management File (ISO 14971)',
    description: 'Complete risk analysis with hazard identification, risk estimation, risk control, and residual risk evaluation',
    priority: 'critical',
    category: 'Risk Management',
    frameworks: ['ISO_13485', 'MDR', 'CFR_820'],
    deviceCategories: ['surgical', 'diagnostic', 'therapeutic'],
    riskClasses: ['Class I', 'Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 12,
    evidenceTypes: ['Risk Management File', 'Risk Analysis Reports', 'Risk Control Implementation Records'],
    commonPitfalls: ['Incomplete hazard identification', 'Missing clinical risk assessment', 'Inadequate post-market surveillance integration'],
    tips: ['Use structured hazard identification methods (FMEA, FTA)', 'Ensure clinical evaluation aligns with risk assessment']
  },
  
  // Manufacturing Quality System
  {
    id: 'MFG001',
    title: 'Manufacturing Process Validation',
    description: 'Document and validate all manufacturing processes with statistical process control where applicable',
    priority: 'high',
    category: 'Manufacturing',
    frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
    deviceCategories: ['surgical', 'diagnostic', 'therapeutic'],
    riskClasses: ['Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 16,
    dependencies: ['DC001'],
    evidenceTypes: ['Process Validation Protocols', 'Statistical Process Control Records', 'Equipment Qualification Records'],
    commonPitfalls: ['Insufficient process parameters', 'Missing statistical justification', 'Inadequate equipment qualification'],
    tips: ['Develop process maps before validation', 'Include worst-case scenarios in validation']
  },

  // Surgical Device Specific
  {
    id: 'SUR001',
    title: 'Sterilization Validation (Surgical Devices)',
    description: 'Complete sterilization validation including bioburden determination, sterility assurance level, and packaging validation',
    priority: 'critical',
    category: 'Sterilization',
    frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
    deviceCategories: ['surgical'],
    riskClasses: ['Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 20,
    evidenceTypes: ['Sterilization Validation Reports', 'Bioburden Studies', 'Package Integrity Testing'],
    commonPitfalls: ['Inadequate bioburden characterization', 'Missing worst-case load configurations', 'Insufficient packaging validation'],
    tips: ['Follow ISO 11135/11137 standards', 'Include material compatibility studies']
  },

  // Diagnostic Device Specific  
  {
    id: 'DIAG001',
    title: 'Analytical Performance Validation',
    description: 'Demonstrate accuracy, precision, analytical sensitivity, analytical specificity, and measurement range',
    priority: 'critical',
    category: 'Performance Validation',
    frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
    deviceCategories: ['diagnostic'],
    riskClasses: ['Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 24,
    evidenceTypes: ['Analytical Performance Studies', 'Method Validation Reports', 'Reference Method Comparisons'],
    commonPitfalls: ['Insufficient sample sizes', 'Missing interference studies', 'Inadequate reference standards'],
    tips: ['Follow CLSI guidelines for study design', 'Include clinically relevant interferents']
  },

  // Therapeutic Device Specific
  {
    id: 'THER001',
    title: 'Clinical Evidence Package',
    description: 'Compile clinical evaluation report with appropriate clinical data demonstrating safety and efficacy',
    priority: 'critical', 
    category: 'Clinical Evidence',
    frameworks: ['MDR', 'ISO_13485', 'CFR_820'],
    deviceCategories: ['therapeutic'],
    riskClasses: ['Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 32,
    evidenceTypes: ['Clinical Evaluation Report', 'Clinical Investigation Reports', 'Post-Market Clinical Follow-up'],
    commonPitfalls: ['Insufficient clinical data', 'Missing equivalence demonstrations', 'Inadequate benefit-risk analysis'],
    tips: ['Align with MEDDEV 2.7/1 guidance', 'Include post-market surveillance plan']
  },

  // Software/AI Specific
  {
    id: 'SW001',
    title: 'Software Lifecycle Documentation (IEC 62304)',
    description: 'Complete software development lifecycle documentation including planning, design, implementation, integration, testing',
    priority: 'high',
    category: 'Software',
    frameworks: ['ISO_13485', 'MDR'],
    deviceCategories: ['diagnostic', 'therapeutic'],
    riskClasses: ['Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 20,
    evidenceTypes: ['Software Requirements Specification', 'Software Architecture Document', 'Software Testing Records'],
    commonPitfalls: ['Incomplete requirements traceability', 'Missing software risk analysis', 'Inadequate cybersecurity measures'],
    tips: ['Classify software safety class early', 'Integrate with overall device risk management']
  },

  // Quality System Infrastructure
  {
    id: 'QS001',
    title: 'Management Responsibility Documentation',
    description: 'Demonstrate management commitment, quality policy, organizational structure, management representative assignment',
    priority: 'high',
    category: 'Quality System',
    frameworks: ['ISO_13485', 'CFR_820', 'MDR'],
    deviceCategories: ['surgical', 'diagnostic', 'therapeutic'],
    riskClasses: ['Class I', 'Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 4,
    evidenceTypes: ['Quality Manual', 'Management Review Records', 'Organizational Charts'],
    commonPitfalls: ['Generic quality policies', 'Missing management review records', 'Unclear roles and responsibilities'],
    tips: ['Tailor quality policy to device-specific risks', 'Schedule regular management reviews']
  },

  {
    id: 'QS002',
    title: 'Corrective and Preventive Action (CAPA) System',
    description: 'Establish systematic approach to identify, investigate, and correct quality problems and prevent recurrence',
    priority: 'high',
    category: 'Quality System',
    frameworks: ['ISO_13485', 'CFR_820', 'MDR'],
    deviceCategories: ['surgical', 'diagnostic', 'therapeutic'],
    riskClasses: ['Class I', 'Class II', 'Class III', 'Class IIa', 'Class IIb'],
    estimatedHours: 6,
    evidenceTypes: ['CAPA Procedures', 'Investigation Records', 'Trend Analysis Reports'],
    commonPitfalls: ['Reactive vs. proactive approach', 'Missing root cause analysis', 'Inadequate effectiveness verification'],
    tips: ['Implement data-driven trending', 'Include statistical process control integration']
  }
];

export const preparationGuides: PreparationGuide[] = [
  {
    id: 'SURGICAL_CLASS_III',
    title: 'Class III Surgical Device Audit Preparation',
    description: 'Comprehensive 21-day preparation guide for high-risk surgical devices',
    category: 'surgical',
    frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
    riskClass: 'Class III',
    totalEstimatedHours: 120,
    sections: [
      {
        id: 'WEEK1_FOUNDATION',
        title: 'Week 1: Foundation & Documentation Review',
        description: 'Establish audit readiness team and review core documentation',
        estimatedHours: 40,
        order: 1,
        items: checklistItems.filter(item => 
          ['DC001', 'DC002', 'QS001', 'QS002'].includes(item.id)
        )
      },
      {
        id: 'WEEK2_TECHNICAL',
        title: 'Week 2: Technical Validation & Manufacturing',
        description: 'Focus on manufacturing processes, sterilization, and technical documentation',
        estimatedHours: 50,
        order: 2,
        items: checklistItems.filter(item => 
          ['MFG001', 'SUR001', 'SW001'].includes(item.id)
        )
      },
      {
        id: 'WEEK3_REHEARSAL',
        title: 'Week 3: Mock Audit & Final Preparation',
        description: 'Conduct internal mock audits and final documentation review',
        estimatedHours: 30,
        order: 3,
        items: []
      }
    ],
    keyMilestones: [
      {
        id: 'M1',
        title: 'Documentation Complete',
        description: 'All required documentation reviewed and gaps identified',
        daysFromStart: 7,
        deliverables: ['Gap Assessment Report', 'Documentation Matrix'],
        criticalPath: true
      },
      {
        id: 'M2',
        title: 'Technical Validation Verified',
        description: 'Manufacturing processes and sterilization validation confirmed',
        daysFromStart: 14,
        deliverables: ['Process Validation Summary', 'Sterilization Validation Report'],
        criticalPath: true
      },
      {
        id: 'M3',
        title: 'Audit Rehearsal Complete',
        description: 'Mock audit conducted and action items resolved',
        daysFromStart: 19,
        deliverables: ['Mock Audit Report', 'Response Scripts'],
        criticalPath: false
      }
    ]
  },

  {
    id: 'DIAGNOSTIC_CLASS_II',
    title: 'Class II Diagnostic Device Audit Preparation', 
    description: '21-day preparation guide for moderate-risk diagnostic devices',
    category: 'diagnostic',
    frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
    riskClass: 'Class II',
    totalEstimatedHours: 90,
    sections: [
      {
        id: 'DIAG_WEEK1',
        title: 'Week 1: Quality System & Design Controls',
        description: 'Review quality system documentation and design control records',
        estimatedHours: 30,
        order: 1,
        items: checklistItems.filter(item => 
          ['DC001', 'DC002', 'QS001'].includes(item.id)
        )
      },
      {
        id: 'DIAG_WEEK2',
        title: 'Week 2: Performance Validation & Manufacturing',
        description: 'Verify analytical performance studies and manufacturing processes',
        estimatedHours: 40,
        order: 2,
        items: checklistItems.filter(item => 
          ['DIAG001', 'MFG001', 'SW001'].includes(item.id)
        )
      },
      {
        id: 'DIAG_WEEK3',
        title: 'Week 3: Final Review & Preparation',
        description: 'Conduct final review and prepare audit responses',
        estimatedHours: 20,
        order: 3,
        items: checklistItems.filter(item => 
          ['QS002'].includes(item.id)
        )
      }
    ],
    keyMilestones: [
      {
        id: 'DM1',
        title: 'Design Controls Verified',
        description: 'DHF completeness and risk management files reviewed',
        daysFromStart: 5,
        deliverables: ['Design Control Checklist', 'Risk Management Summary'],
        criticalPath: true
      },
      {
        id: 'DM2',
        title: 'Performance Data Validated',
        description: 'Analytical performance studies and claims substantiated',
        daysFromStart: 12,
        deliverables: ['Performance Validation Summary', 'Claims Matrix'],
        criticalPath: true
      }
    ]
  }
];

// Helper functions to filter checklists based on device characteristics
export const getFilteredChecklists = (
  deviceCategory: DeviceCategory,
  riskClass: DeviceRiskClass,
  frameworks: RegulatoryFramework[]
): ChecklistItem[] => {
  return checklistItems.filter(item =>
    item.deviceCategories.includes(deviceCategory) &&
    item.riskClasses.includes(riskClass) &&
    frameworks.some(framework => item.frameworks.includes(framework))
  );
};

export const getPreparationGuide = (
  deviceCategory: DeviceCategory,
  riskClass: DeviceRiskClass
): PreparationGuide | undefined => {
  return preparationGuides.find(guide =>
    guide.category === deviceCategory && guide.riskClass === riskClass
  );
};

export const getChecklistsByPriority = (checklists: ChecklistItem[]) => {
  return {
    critical: checklists.filter(item => item.priority === 'critical'),
    high: checklists.filter(item => item.priority === 'high'),
    medium: checklists.filter(item => item.priority === 'medium'),
    low: checklists.filter(item => item.priority === 'low')
  };
};