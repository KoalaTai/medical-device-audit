import { 
  AssessmentResponse, 
  ScoreResult, 
  Gap, 
  FilterOptions, 
  WeightedBreakdown,
  WeightingFactor,
  RiskAssessment,
  RiskFactor,
  FrameworkScore,
  RegulatoryFramework 
} from './types';
import { getFilteredQuestions, standardsMap, evidenceExamples, frameworkLabels, getRiskAdjustedWeight } from './data';

/**
 * Enhanced scoring engine with sophisticated weighted calculations and risk assessment
 */
export function calculateScore(responses: AssessmentResponse[], filterOptions?: FilterOptions): ScoreResult {
  try {
    // Get the filtered questions that were used for this assessment
    const assessmentQuestions = filterOptions 
      ? getFilteredQuestions(filterOptions.selectedFrameworks, filterOptions.includeAllFrameworks)
      : getFilteredQuestions([], true);
    
    if (assessmentQuestions.length === 0) {
      // Return a default score if no questions are available
      return {
        score: 0,
        status: 'red',
        gaps: [],
        criticalFailures: [],
        weightedBreakdown: {
          totalPossibleWeight: 0,
          actualWeightedScore: 0,
          weightingFactors: [],
          criticalImpact: 0
        },
        riskAssessment: {
          overallRisk: 'critical',
          riskFactors: [],
          mitigationPriority: [],
          complianceMaturity: 'basic'
        },
        frameworkScores: {}
      };
    }
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  const gaps: Gap[] = [];
  const criticalFailures: string[] = [];
  const questionScores: Record<string, { score: number; weight: number; critical: boolean; clauseRef: string; frameworks: RegulatoryFramework[] }> = {};

  // Process each response with enhanced scoring logic
  for (const response of responses) {
    const question = assessmentQuestions.find(q => q.id === response.questionId);
    if (!question) continue;

    const clauseInfo = standardsMap[question.clauseRef];
    let questionScore = 0;

    // Enhanced question scoring based on type and answer
    if (question.type === 'yesno') {
      questionScore = response.answer === true ? 1 : 0;
    } else if (question.type === 'select') {
      const answerIndex = question.options?.indexOf(response.answer as string) ?? -1;
      if (answerIndex >= 0 && question.options) {
        // Non-linear scoring with higher penalties for poor choices
        const optionCount = question.options.length;
        const normalizedPosition = answerIndex / (optionCount - 1);
        
        // Apply exponential penalty curve for critical questions
        if (question.critical) {
          questionScore = Math.max(0, Math.pow(1 - normalizedPosition, 2));
        } else {
          questionScore = Math.max(0, 1 - normalizedPosition);
        }
      }
    } else if (question.type === 'text') {
      const textLength = (response.answer as string).trim().length;
      // Progressive scoring based on text length and quality
      if (textLength === 0) {
        questionScore = 0;
      } else if (textLength < 20) {
        questionScore = 0.3;
      } else if (textLength < 100) {
        questionScore = 0.7;
      } else {
        questionScore = 1;
      }
    }

    // Store question score data for detailed analysis
    questionScores[question.id] = {
      score: questionScore,
      weight: question.weight,
      critical: question.critical || false,
      clauseRef: question.clauseRef,
      frameworks: question.frameworks
    };

    // Check for critical failures
    if (question.critical && questionScore < 0.5) {
      criticalFailures.push(question.id);
    }

    // Apply risk-adjusted weighting based on device classification
    let adjustedWeight = getRiskAdjustedWeight(question, filterOptions?.riskClassification);
    
    // Apply additional dynamic weighting based on regulatory framework importance
    if (clauseInfo?.riskWeight) {
      adjustedWeight = adjustedWeight * (clauseInfo.riskWeight / 5);
    }
    
    // Ensure adjustedWeight is valid
    adjustedWeight = isNaN(adjustedWeight) || adjustedWeight <= 0 ? question.weight : adjustedWeight;

    const weightedContribution = questionScore * adjustedWeight;
    totalWeightedScore += weightedContribution;
    totalWeight += adjustedWeight;

    // Identify gaps with enhanced deficit calculation
    if (questionScore < 0.9) { // Lower threshold for gap identification
      const deficit = (1 - questionScore) * adjustedWeight;
      gaps.push({
        questionId: question.id,
        prompt: question.prompt,
        clauseRef: question.clauseRef,
        clauseTitle: clauseInfo?.title || 'Unknown Clause',
        deficit,
        suggestedEvidence: evidenceExamples[question.clauseRef] || []
      });
    }
  }

  // Calculate base score with enhanced methodology
  let score = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

  // Enhanced critical failure impact calculation
  if (criticalFailures.length > 0) {
    const criticalPenalty = Math.min(40, criticalFailures.length * 15);
    score = Math.max(0, Math.min(score, 100 - criticalPenalty));
  }

  // Dynamic status determination with nuanced thresholds
  let status: 'red' | 'amber' | 'green';
  if (score < 65 || criticalFailures.length > 2) {
    status = 'red';
  } else if (score < 80 || criticalFailures.length > 0) {
    status = 'amber';
  } else {
    status = 'green';
  }

  // Generate weighted breakdown analysis
  const weightedBreakdown = calculateWeightedBreakdown(questionScores, assessmentQuestions, criticalFailures.length);
  
  // Perform risk assessment
  const riskAssessment = performRiskAssessment(gaps, criticalFailures, score, questionScores);
  
  // Calculate framework-specific scores
  const frameworkScores = calculateFrameworkScores(questionScores, assessmentQuestions);

  // Sort gaps by enhanced priority scoring (deficit + risk weight + critical status)
  const topGaps = gaps
    .sort((a, b) => {
      const aClause = standardsMap[a.clauseRef];
      const bClause = standardsMap[b.clauseRef];
      const aCritical = aClause?.critical ? 2 : 1;
      const bCritical = bClause?.critical ? 2 : 1;
      const aPriority = a.deficit * (aClause?.riskWeight || 1) * aCritical;
      const bPriority = b.deficit * (bClause?.riskWeight || 1) * bCritical;
      return bPriority - aPriority;
    })
    .slice(0, 5);

  return {
    score: Math.round(score),
    status,
    gaps: topGaps,
    criticalFailures,
    weightedBreakdown,
    riskAssessment,
    frameworkScores
  };
  } catch (error) {
    console.error('Error in calculateScore:', error);
    // Return a safe fallback result
    return {
      score: 0,
      status: 'red',
      gaps: [],
      criticalFailures: [],
      weightedBreakdown: {
        totalPossibleWeight: 0,
        actualWeightedScore: 0,
        weightingFactors: [],
        criticalImpact: 0
      },
      riskAssessment: {
        overallRisk: 'critical',
        riskFactors: [],
        mitigationPriority: [],
        complianceMaturity: 'basic'
      },
      frameworkScores: {}
    };
  }
}

/**
 * Calculate detailed weighted breakdown of the assessment
 */
function calculateWeightedBreakdown(
  questionScores: Record<string, any>, 
  assessmentQuestions: any[], 
  criticalFailureCount: number
): WeightedBreakdown {
  const categories: Record<string, WeightingFactor> = {};
  let totalPossibleWeight = 0;
  let actualWeightedScore = 0;

  // Group questions by regulatory area/category
  for (const question of assessmentQuestions) {
    const clauseInfo = standardsMap[question.clauseRef];
    const categoryName = clauseInfo?.title || 'Other';
    
    if (!categories[categoryName]) {
      categories[categoryName] = {
        category: categoryName,
        weight: 0,
        maxScore: 0,
        actualScore: 0,
        performance: 0,
        clauseRefs: []
      };
    }

    const questionData = questionScores[question.id];
    if (questionData) {
      const adjustedWeight = question.weight * (clauseInfo?.riskWeight || 1) / 5;
      categories[categoryName].weight += adjustedWeight;
      categories[categoryName].maxScore += adjustedWeight;
      categories[categoryName].actualScore += questionData.score * adjustedWeight;
      categories[categoryName].clauseRefs.push(question.clauseRef);
      
      totalPossibleWeight += adjustedWeight;
      actualWeightedScore += questionData.score * adjustedWeight;
    }
  }

  // Calculate performance percentages
  Object.values(categories).forEach(category => {
    category.performance = category.maxScore > 0 
      ? (category.actualScore / category.maxScore) * 100 
      : 0;
  });

  const criticalImpact = criticalFailureCount * 10; // 10% penalty per critical failure

  return {
    totalPossibleWeight,
    actualWeightedScore,
    weightingFactors: Object.values(categories).sort((a, b) => b.weight - a.weight),
    criticalImpact
  };
}

/**
 * Perform comprehensive risk assessment
 */
function performRiskAssessment(
  gaps: Gap[], 
  criticalFailures: string[], 
  score: number,
  questionScores: Record<string, any>
): RiskAssessment {
  const riskFactors: RiskFactor[] = [];

  // Critical failure risk factors
  if (criticalFailures.length > 0) {
    riskFactors.push({
      type: 'critical_failure',
      description: `${criticalFailures.length} critical compliance requirement(s) not met`,
      impact: criticalFailures.length * 20,
      likelihood: 'high',
      clauseRefs: criticalFailures.map(id => {
        const questionData = questionScores[id];
        return questionData ? questionData.clauseRef : '';
      }).filter(Boolean)
    });
  }

  // High-weight gap analysis
  const highImpactGaps = gaps.filter(gap => gap.deficit > 3);
  if (highImpactGaps.length > 0) {
    riskFactors.push({
      type: 'high_weight_gap',
      description: `${highImpactGaps.length} high-impact compliance gap(s) identified`,
      impact: Math.min(30, highImpactGaps.length * 10),
      likelihood: 'medium',
      clauseRefs: highImpactGaps.map(gap => gap.clauseRef)
    });
  }

  // Overall risk determination
  let overallRisk: 'critical' | 'high' | 'medium' | 'low';
  if (criticalFailures.length > 2 || score < 50) {
    overallRisk = 'critical';
  } else if (criticalFailures.length > 0 || score < 70) {
    overallRisk = 'high';
  } else if (gaps.length > 5 || score < 85) {
    overallRisk = 'medium';
  } else {
    overallRisk = 'low';
  }

  // Compliance maturity assessment
  let complianceMaturity: 'basic' | 'developing' | 'advanced' | 'optimized';
  if (score < 60) {
    complianceMaturity = 'basic';
  } else if (score < 75) {
    complianceMaturity = 'developing';
  } else if (score < 90) {
    complianceMaturity = 'advanced';
  } else {
    complianceMaturity = 'optimized';
  }

  // Mitigation priority order
  const mitigationPriority = [
    ...(criticalFailures.length > 0 ? ['Address critical compliance failures immediately'] : []),
    ...(highImpactGaps.length > 0 ? ['Resolve high-impact gaps'] : []),
    'Strengthen process documentation',
    'Enhance monitoring and measurement systems',
    'Improve training and competency programs'
  ];

  return {
    overallRisk,
    riskFactors,
    mitigationPriority,
    complianceMaturity
  };
}

/**
 * Calculate framework-specific performance scores
 */
function calculateFrameworkScores(
  questionScores: Record<string, any>,
  assessmentQuestions: any[]
): Record<RegulatoryFramework, FrameworkScore> {
  const frameworks: RegulatoryFramework[] = ['ISO_13485', 'CFR_820', 'MDR', 'ISO_14155'];
  const frameworkScores: Record<RegulatoryFramework, FrameworkScore> = {} as any;

  for (const framework of frameworks) {
    const frameworkQuestions = assessmentQuestions.filter(q => 
      q.frameworks.includes(framework)
    );
    
    if (frameworkQuestions.length === 0) {
      continue;
    }

    let totalScore = 0;
    let maxScore = 0;
    let criticalFailures = 0;
    let gaps = 0;

    for (const question of frameworkQuestions) {
      const questionData = questionScores[question.id];
      if (questionData) {
        totalScore += questionData.score * questionData.weight;
        maxScore += questionData.weight;
        
        if (questionData.critical && questionData.score < 0.5) {
          criticalFailures++;
        }
        
        if (questionData.score < 0.9) {
          gaps++;
        }
      }
    }

    const performance = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    
    let recommendation: string;
    if (performance >= 90) {
      recommendation = 'Excellent compliance posture. Continue monitoring and improvement.';
    } else if (performance >= 80) {
      recommendation = 'Good compliance foundation. Focus on identified gaps.';
    } else if (performance >= 70) {
      recommendation = 'Moderate compliance. Systematic improvement needed.';
    } else {
      recommendation = 'Significant compliance gaps. Immediate action required.';
    }

    frameworkScores[framework] = {
      framework,
      score: Math.round(performance),
      maxPossibleScore: maxScore,
      criticalFailures,
      gaps,
      performance: Math.round(performance),
      recommendation
    };
  }

  return frameworkScores;
}