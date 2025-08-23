import { InterviewQuestion, AssessmentResponse, FilterOptions, InspectorRole, RegulatoryFramework } from './types';

const baseQuestions: Record<InspectorRole, InterviewQuestion[]> = {
  lead_inspector: [
    {
      id: 'lead_001',
      category: 'Management Commitment',
      question: 'How does your organization demonstrate management commitment to the quality management system?',
      expectedResponse: 'Management commitment is demonstrated through our quality policy, resource allocation for quality activities, regular management reviews where quality metrics are analyzed, and leadership participation in quality initiatives. Our CEO personally signs off on major quality decisions and attends quarterly quality reviews.',
      followUpQuestions: [
        'Can you show me evidence of management review meetings?',
        'How are quality objectives communicated throughout the organization?'
      ],
      commonMistakes: [
        'Only mentioning the quality policy without concrete actions',
        'Unable to provide specific examples of resource allocation',
        'Vague responses about leadership involvement'
      ],
      clauseReferences: ['ISO 13485:5.1', '21 CFR 820.20'],
      difficulty: 'basic',
      frameworks: ['ISO_13485', 'CFR_820'],
      roles: ['lead_inspector'],
      tips: [
        'Prepare specific examples of management involvement',
        'Have metrics and KPIs ready to show management oversight',
        'Reference recent management review minutes'
      ]
    },
    {
      id: 'lead_002',
      category: 'Risk Management',
      question: 'Describe your organization\'s approach to risk management and how it integrates with your QMS.',
      expectedResponse: 'Our risk management follows ISO 14971, integrated throughout the product lifecycle. We conduct risk analyses during design, manufacturing, and post-market phases. Risk management activities are documented, regularly reviewed, and feed into our design controls and change control processes.',
      followUpQuestions: [
        'How do you handle residual risks that cannot be mitigated?',
        'Can you walk me through a specific risk analysis example?'
      ],
      commonMistakes: [
        'Confusing quality risk with product safety risk',
        'Unable to explain integration with design controls',
        'No clear process for risk management file maintenance'
      ],
      clauseReferences: ['ISO 14971', 'ISO 13485:7.1', '21 CFR 820.30(g)'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820', 'ISO_14155'],
      roles: ['lead_inspector'],
      tips: [
        'Understand the difference between risk management standards and QMS requirements',
        'Be ready to discuss specific risk control measures',
        'Know your risk acceptability criteria'
      ]
    },
    {
      id: 'lead_003',
      category: 'Outsourced Processes',
      question: 'How does your organization control outsourced processes and ensure they meet quality requirements?',
      expectedResponse: 'We maintain a qualified supplier program with approved vendor lists, supplier agreements defining quality requirements, regular audits, and incoming inspection procedures. Critical suppliers undergo on-site audits, and we maintain supplier performance metrics.',
      followUpQuestions: [
        'What criteria do you use for supplier qualification?',
        'How do you handle supplier corrective actions?'
      ],
      commonMistakes: [
        'Treating all suppliers the same regardless of criticality',
        'Lack of documented supplier evaluation criteria',
        'No evidence of ongoing supplier monitoring'
      ],
      clauseReferences: ['ISO 13485:4.1', 'ISO 13485:7.4', '21 CFR 820.50'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820'],
      roles: ['lead_inspector'],
      tips: [
        'Classify suppliers by criticality and risk',
        'Have supplier audit reports and corrective action records available',
        'Know your supplier qualification timeline and criteria'
      ]
    }
  ],
  
  quality_specialist: [
    {
      id: 'qual_001',
      category: 'Document Control',
      question: 'Walk me through your document control process, including how you ensure the latest versions are available at points of use.',
      expectedResponse: 'Our document control system includes unique document identifiers, revision tracking, approval workflows, controlled distribution, and regular review cycles. Current versions are available through our document management system, with automated notifications for updates. Obsolete documents are clearly marked and archived.',
      followUpQuestions: [
        'How do you handle emergency changes to controlled documents?',
        'What is your process for external document control?'
      ],
      commonMistakes: [
        'Manual tracking systems that are prone to error',
        'No clear process for obsolete document control',
        'Inability to demonstrate document availability at point of use'
      ],
      clauseReferences: ['ISO 13485:4.2.3', '21 CFR 820.40'],
      difficulty: 'basic',
      frameworks: ['ISO_13485', 'CFR_820'],
      roles: ['quality_specialist'],
      tips: [
        'Demonstrate your document management system live',
        'Show examples of version control and approval workflows',
        'Have examples of both internal and external documents'
      ]
    },
    {
      id: 'qual_002',
      category: 'Corrective and Preventive Actions',
      question: 'Describe your CAPA process and how you investigate and resolve quality problems.',
      expectedResponse: 'Our CAPA process begins with problem identification, followed by investigation using root cause analysis tools like 5-Why and fishbone diagrams. We implement corrective actions to address immediate issues and preventive actions to prevent recurrence. All CAPAs include effectiveness verification and are tracked to closure.',
      followUpQuestions: [
        'How do you determine when a CAPA is required versus other quality actions?',
        'Can you show me an example of CAPA effectiveness verification?'
      ],
      commonMistakes: [
        'Confusing correction with corrective action',
        'Inadequate root cause analysis',
        'No systematic approach to effectiveness verification'
      ],
      clauseReferences: ['ISO 13485:8.5.2', 'ISO 13485:8.5.3', '21 CFR 820.100'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820'],
      roles: ['quality_specialist'],
      tips: [
        'Bring specific CAPA examples with complete documentation',
        'Know the difference between correction, corrective action, and preventive action',
        'Be prepared to discuss trending and analysis of quality data'
      ]
    },
    {
      id: 'qual_003',
      category: 'Internal Audit',
      question: 'How does your internal audit program ensure comprehensive coverage of your QMS?',
      expectedResponse: 'Our internal audit program includes an annual audit schedule covering all QMS processes, trained internal auditors, risk-based audit planning, and systematic follow-up of findings. Audits are conducted by personnel independent of the area being audited, and results feed into management review.',
      followUpQuestions: [
        'How do you ensure auditor competence and objectivity?',
        'What is your process for audit finding classification and closure?'
      ],
      commonMistakes: [
        'Inadequate audit frequency for high-risk areas',
        'Lack of auditor independence',
        'Poor documentation of audit findings and follow-up'
      ],
      clauseReferences: ['ISO 13485:8.2.4', '21 CFR 820.22'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820'],
      roles: ['quality_specialist'],
      tips: [
        'Have your audit schedule and auditor qualification records ready',
        'Show examples of different types of audit findings',
        'Demonstrate how audit results influence management decisions'
      ]
    }
  ],

  technical_reviewer: [
    {
      id: 'tech_001',
      category: 'Design Controls',
      question: 'Explain your design control process and how you ensure design outputs meet design inputs.',
      expectedResponse: 'Our design control process follows a stage-gate approach with defined design inputs, outputs, reviews, verification, validation, and transfer activities. Design outputs are traceable to inputs through a requirements traceability matrix. Each stage requires formal approval before proceeding.',
      followUpQuestions: [
        'How do you handle design changes during development?',
        'What is your process for design transfer to manufacturing?'
      ],
      commonMistakes: [
        'Confusing verification with validation',
        'Inadequate design input requirements',
        'Poor traceability between inputs and outputs'
      ],
      clauseReferences: ['21 CFR 820.30', 'ISO 13485:7.3'],
      difficulty: 'advanced',
      frameworks: ['CFR_820', 'ISO_13485'],
      roles: ['technical_reviewer'],
      tips: [
        'Prepare design history file examples',
        'Know the difference between verification and validation clearly',
        'Have design review minutes and decision records available'
      ]
    },
    {
      id: 'tech_002',
      category: 'Verification and Validation',
      question: 'Describe your approach to design verification and validation. How do you ensure clinical evidence supports intended use?',
      expectedResponse: 'Design verification confirms the design outputs meet design inputs through testing and analysis. Validation ensures the device meets user needs and intended use through clinical evaluation or clinical investigation. We maintain detailed protocols, reports, and statistical analysis plans.',
      followUpQuestions: [
        'How do you determine what clinical data is needed?',
        'What is your process for post-market clinical follow-up?'
      ],
      commonMistakes: [
        'Using non-clinical testing for validation activities',
        'Inadequate clinical evaluation documentation',
        'No clear acceptance criteria for verification testing'
      ],
      clauseReferences: ['21 CFR 820.30(f)', 'ISO 13485:7.3.6', 'ISO 14155'],
      difficulty: 'advanced',
      frameworks: ['CFR_820', 'ISO_13485', 'MDR', 'ISO_14155'],
      roles: ['technical_reviewer'],
      tips: [
        'Understand regulatory requirements for your device class',
        'Have clinical evaluation reports readily available',
        'Know your post-market surveillance obligations'
      ]
    },
    {
      id: 'tech_003',
      category: 'Software Validation',
      question: 'If your device contains software, how do you approach software lifecycle processes and validation?',
      expectedResponse: 'We follow IEC 62304 for software lifecycle processes, including software safety classification, development planning, requirements analysis, architectural design, implementation, integration testing, and software validation. Software validation includes all software requirements and safety requirements.',
      followUpQuestions: [
        'How do you handle software changes and updates?',
        'What is your cybersecurity risk management approach?'
      ],
      commonMistakes: [
        'Treating software as hardware in validation approach',
        'Inadequate software safety classification',
        'No systematic approach to software change control'
      ],
      clauseReferences: ['IEC 62304', '21 CFR 820.30', 'ISO 13485:4.1.6'],
      difficulty: 'advanced',
      frameworks: ['CFR_820', 'ISO_13485', 'MDR'],
      roles: ['technical_reviewer'],
      tips: [
        'Know your software safety classification rationale',
        'Have software validation documentation organized',
        'Be prepared to discuss cybersecurity considerations'
      ]
    }
  ],

  compliance_officer: [
    {
      id: 'comp_001',
      category: 'Regulatory Requirements',
      question: 'How do you stay current with regulatory requirements and ensure your QMS remains compliant?',
      expectedResponse: 'We maintain regulatory intelligence through subscriptions to regulatory updates, participation in industry associations, consultation with regulatory experts, and regular review of applicable regulations. Changes are evaluated for impact and incorporated through our change control process.',
      followUpQuestions: [
        'How do you assess the impact of regulatory changes?',
        'What is your process for implementing regulatory updates?'
      ],
      commonMistakes: [
        'Relying solely on informal information sources',
        'No systematic impact assessment process',
        'Delayed implementation of regulatory changes'
      ],
      clauseReferences: ['ISO 13485:8.2.1', '21 CFR 820.20(b)'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820', 'MDR'],
      roles: ['compliance_officer'],
      tips: [
        'Show evidence of systematic regulatory monitoring',
        'Have examples of recent regulatory change implementations',
        'Know key regulatory requirements for your product category'
      ]
    },
    {
      id: 'comp_002',
      category: 'Post-Market Surveillance',
      question: 'Describe your post-market surveillance system and how you monitor device performance in the field.',
      expectedResponse: 'Our post-market surveillance includes complaint handling, adverse event reporting, periodic safety update reports, trend analysis, and feedback to design and manufacturing processes. We maintain vigilance systems for timely identification and reporting of safety issues.',
      followUpQuestions: [
        'How do you determine if a complaint requires regulatory reporting?',
        'What is your process for implementing field corrections?'
      ],
      commonMistakes: [
        'Treating all complaints as customer service issues',
        'Inadequate trend analysis and data review',
        'Poor integration with risk management and design controls'
      ],
      clauseReferences: ['ISO 13485:8.2.1', '21 CFR 820.198', 'MDR Article 83-92'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820', 'MDR'],
      roles: ['compliance_officer'],
      tips: [
        'Know your reporting timelines and requirements',
        'Have complaint and adverse event data readily available',
        'Understand the connection between post-market data and risk management'
      ]
    },
    {
      id: 'comp_003',
      category: 'Change Control',
      question: 'Walk me through your change control process and how you ensure changes don\'t adversely affect product quality.',
      expectedResponse: 'Our change control process includes change request documentation, impact assessment, risk evaluation, approval requirements based on change significance, implementation planning, validation activities as needed, and effectiveness monitoring. All changes are documented and approved before implementation.',
      followUpQuestions: [
        'How do you classify changes by significance?',
        'What validation activities are triggered by changes?'
      ],
      commonMistakes: [
        'No systematic change classification system',
        'Inadequate impact assessment',
        'Implementing changes before proper approval'
      ],
      clauseReferences: ['ISO 13485:4.1.6', '21 CFR 820.70(b)', 'ISO 13485:7.3.9'],
      difficulty: 'intermediate',
      frameworks: ['ISO_13485', 'CFR_820'],
      roles: ['compliance_officer'],
      tips: [
        'Have examples of different types of changes and their approvals',
        'Know your change classification criteria',
        'Be prepared to discuss validation requirements for changes'
      ]
    }
  ]
};

export function generateInterviewQuestions(
  responses: AssessmentResponse[],
  filterOptions: FilterOptions,
  role: InspectorRole,
  maxQuestions: number = 8
): InterviewQuestion[] {
  const frameworks = filterOptions.includeAllFrameworks 
    ? ['ISO_13485', 'CFR_820', 'MDR', 'ISO_14155'] as RegulatoryFramework[]
    : filterOptions.selectedFrameworks;
  
  // Get base questions for the role
  let availableQuestions = baseQuestions[role].filter(q => 
    q.frameworks.some(f => frameworks.includes(f))
  );

  // Analyze assessment responses to identify focus areas
  const weakAreas = identifyWeakAreas(responses);
  
  // Prioritize questions based on assessment gaps
  const prioritizedQuestions = prioritizeQuestions(availableQuestions, weakAreas, frameworks);
  
  // Add targeted questions based on specific weak areas
  const targetedQuestions = generateTargetedQuestions(weakAreas, role, frameworks);
  
  // Combine and limit to maxQuestions
  const combinedQuestions = [...prioritizedQuestions, ...targetedQuestions];
  const uniqueQuestions = removeDuplicates(combinedQuestions);
  
  return uniqueQuestions.slice(0, maxQuestions);
}

function identifyWeakAreas(responses: AssessmentResponse[]): string[] {
  const weakAreas: string[] = [];
  
  // Analyze responses for common weak areas
  responses.forEach(response => {
    if (response.answer === false || response.answer === 'no' || response.answer === 'none') {
      // Map question IDs to focus areas based on common patterns
      if (typeof response.questionId === 'string') {
        if (response.questionId.toLowerCase().includes('document')) {
          weakAreas.push('Document Control');
        } else if (response.questionId.toLowerCase().includes('capa') || response.questionId.toLowerCase().includes('corrective')) {
          weakAreas.push('CAPA');
        } else if (response.questionId.toLowerCase().includes('design')) {
          weakAreas.push('Design Controls');
        } else if (response.questionId.toLowerCase().includes('risk')) {
          weakAreas.push('Risk Management');
        } else if (response.questionId.toLowerCase().includes('supplier') || response.questionId.toLowerCase().includes('outsource')) {
          weakAreas.push('Outsourced Processes');
        } else if (response.questionId.toLowerCase().includes('audit')) {
          weakAreas.push('Internal Audit');
        }
      }
    }
  });
  
  return [...new Set(weakAreas)]; // Remove duplicates
}

function prioritizeQuestions(
  questions: InterviewQuestion[],
  weakAreas: string[],
  frameworks: RegulatoryFramework[]
): InterviewQuestion[] {
  return questions
    .map(q => ({
      ...q,
      priority: weakAreas.includes(q.category) ? 1 : 2
    }))
    .sort((a, b) => {
      // Sort by priority, then by difficulty (easier first)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      const difficultyOrder = { basic: 1, intermediate: 2, advanced: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
}

function generateTargetedQuestions(
  weakAreas: string[],
  role: InspectorRole,
  frameworks: RegulatoryFramework[]
): InterviewQuestion[] {
  const targetedQuestions: InterviewQuestion[] = [];
  
  // Generate specific questions based on identified weak areas
  if (weakAreas.includes('Document Control') && role === 'quality_specialist') {
    targetedQuestions.push({
      id: 'targeted_doc_001',
      category: 'Document Control',
      question: 'I noticed potential gaps in your document control system. Can you show me how you ensure that obsolete documents are not inadvertently used?',
      expectedResponse: 'Obsolete documents are immediately removed from all points of use, clearly marked as obsolete, and archived separately. Our document management system automatically prevents access to obsolete versions and notifies users when documents are updated.',
      followUpQuestions: [
        'What happens if someone prints a controlled document?',
        'How do you handle uncontrolled copies?'
      ],
      commonMistakes: [
        'Relying on people to remember to discard old versions',
        'No systematic approach to obsolete document retrieval',
        'Unclear marking of obsolete documents'
      ],
      clauseReferences: ['ISO 13485:4.2.3', '21 CFR 820.40'],
      difficulty: 'intermediate',
      frameworks: frameworks,
      roles: [role],
      tips: [
        'Demonstrate your document retrieval process',
        'Show how your system prevents use of obsolete documents',
        'Have examples of properly marked obsolete documents'
      ]
    });
  }
  
  if (weakAreas.includes('CAPA') && (role === 'quality_specialist' || role === 'compliance_officer')) {
    targetedQuestions.push({
      id: 'targeted_capa_001',
      category: 'CAPA Follow-up',
      question: 'Your assessment suggests opportunities for improvement in corrective actions. Walk me through your most recent CAPA and how you verified its effectiveness.',
      expectedResponse: 'Our most recent CAPA involved [specific example]. We implemented corrective actions to address the immediate issue, conducted root cause analysis using structured tools, implemented preventive actions, and verified effectiveness through specific metrics and timeline. We continue to monitor these metrics to ensure sustained improvement.',
      followUpQuestions: [
        'How long do you monitor for effectiveness verification?',
        'What would trigger you to reopen this CAPA?'
      ],
      commonMistakes: [
        'Declaring CAPA effective too early',
        'Inadequate verification methods',
        'No ongoing monitoring plan'
      ],
      clauseReferences: ['ISO 13485:8.5.2', '21 CFR 820.100'],
      difficulty: 'advanced',
      frameworks: frameworks,
      roles: [role],
      tips: [
        'Have detailed CAPA records with effectiveness data available',
        'Know your effectiveness verification timeline and criteria',
        'Be specific about metrics and measurement methods'
      ]
    });
  }
  
  return targetedQuestions;
}

function removeDuplicates(questions: InterviewQuestion[]): InterviewQuestion[] {
  const seen = new Set();
  return questions.filter(q => {
    if (seen.has(q.id)) {
      return false;
    }
    seen.add(q.id);
    return true;
  });
}