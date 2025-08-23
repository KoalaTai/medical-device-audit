import { AssessmentResponse, ScoreResult, Gap, FilterOptions } from './types';
import { getFilteredQuestions, standardsMap, evidenceExamples } from './data';

export function calculateScore(responses: AssessmentResponse[], filterOptions?: FilterOptions): ScoreResult {
  // Get the filtered questions that were used for this assessment
  const assessmentQuestions = filterOptions 
    ? getFilteredQuestions(filterOptions.selectedFrameworks, filterOptions.includeAllFrameworks)
    : getFilteredQuestions([], true); // fallback to all questions
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  const gaps: Gap[] = [];
  const criticalFailures: string[] = [];

  // Process each response, but only for questions that were part of the filtered assessment
  for (const response of responses) {
    const question = assessmentQuestions.find(q => q.id === response.questionId);
    if (!question) continue;

    const clauseInfo = standardsMap[question.clauseRef];
    let questionScore = 0;

    // Calculate question score based on type and answer
    if (question.type === 'yesno') {
      questionScore = response.answer === true ? 1 : 0;
    } else if (question.type === 'select') {
      const answerIndex = question.options?.indexOf(response.answer as string) ?? -1;
      if (answerIndex >= 0 && question.options) {
        // Score decreases with option index (first option = best score)
        questionScore = Math.max(0, (question.options.length - answerIndex - 1) / (question.options.length - 1));
      }
    } else if (question.type === 'text') {
      // For text responses, assume filled = 1, empty = 0
      questionScore = (response.answer as string).trim().length > 0 ? 1 : 0;
    }

    // Check for critical failures
    if (question.critical && questionScore === 0) {
      criticalFailures.push(question.id);
    }

    // Calculate weighted contribution
    const weightedContribution = questionScore * question.weight;
    totalWeightedScore += weightedContribution;
    totalWeight += question.weight;

    // Identify gaps (questions with score < 1)
    if (questionScore < 1) {
      const deficit = (1 - questionScore) * question.weight;
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

  // Calculate base score (0-100)
  let score = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

  // Apply critical failure cap
  if (criticalFailures.length > 0) {
    score = Math.min(score, 60);
  }

  // Determine status
  let status: 'red' | 'amber' | 'green';
  if (score < 70) {
    status = 'red';
  } else if (score < 85) {
    status = 'amber';
  } else {
    status = 'green';
  }

  // Sort gaps by deficit (highest impact first) and take top 5
  const topGaps = gaps
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 5);

  return {
    score: Math.round(score),
    status,
    gaps: topGaps,
    criticalFailures
  };
}