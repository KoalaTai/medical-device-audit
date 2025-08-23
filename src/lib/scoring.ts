import { AssessmentResponse, ScoringResult, Gap, Question } from './types';
import { getQuestions, getQuestionById } from './questions';

// Core scoring engine that implements the specified logic
export function calculateScore(responses: AssessmentResponse[]): ScoringResult {
  const questions = getQuestions();
  let totalWeights = 0;
  let obtainedScore = 0;
  let criticalHit = false;
  const gaps: Gap[] = [];

  // Process each response
  responses.forEach(response => {
    const question = getQuestionById(response.question_id);
    if (!question) return;

    totalWeights += question.weight;
    let questionScore = 0;

    // Calculate score based on question type and response
    switch (question.type) {
      case 'boolean':
        if (response.value === true || response.value === 'true') {
          questionScore = question.weight;
        } else {
          // Critical question answered negatively
          if (question.critical) {
            criticalHit = true;
          }
          gaps.push({
            question_id: question.id,
            clause_ref: question.clause_ref,
            deficit: question.weight,
            label: question.text.substring(0, 50) + '...'
          });
        }
        break;
        
      case 'select':
        if (question.options && typeof response.value === 'string') {
          const optionIndex = question.options.indexOf(response.value);
          if (optionIndex >= 0) {
            // Score based on option position (higher index = better score)
            const scoreRatio = optionIndex / (question.options.length - 1);
            questionScore = question.weight * scoreRatio;
            
            // If low score on critical question
            if (question.critical && scoreRatio < 0.5) {
              criticalHit = true;
            }
            
            // Add to gaps if score is below 70%
            if (scoreRatio < 0.7) {
              gaps.push({
                question_id: question.id,
                clause_ref: question.clause_ref,
                deficit: question.weight * (1 - scoreRatio),
                label: question.text.substring(0, 50) + '...'
              });
            }
          }
        }
        break;
        
      case 'slider':
        if (typeof response.value === 'number') {
          // Assuming 1-5 scale, normalize to 0-1
          const normalizedValue = (response.value - 1) / 4;
          questionScore = question.weight * normalizedValue;
          
          if (question.critical && normalizedValue < 0.5) {
            criticalHit = true;
          }
          
          if (normalizedValue < 0.7) {
            gaps.push({
              question_id: question.id,
              clause_ref: question.clause_ref,
              deficit: question.weight * (1 - normalizedValue),
              label: question.text.substring(0, 50) + '...'
            });
          }
        }
        break;
        
      case 'text':
        // For text responses, assume partial credit
        questionScore = question.weight * 0.7;
        break;
    }

    obtainedScore += questionScore;
  });

  // Calculate final percentage score
  const overallScore = totalWeights > 0 ? Math.round((obtainedScore / totalWeights) * 100) : 0;
  
  // Apply critical hit cap
  const finalScore = criticalHit ? Math.min(overallScore, 60) : overallScore;
  
  // Determine status based on final score
  let status: 'Red' | 'Amber' | 'Green';
  if (finalScore < 70) {
    status = 'Red';
  } else if (finalScore < 85) {
    status = 'Amber';
  } else {
    status = 'Green';
  }

  // Sort gaps by deficit (highest first) and take top 5
  const topGaps = gaps
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 5);

  return {
    version: '0.1.0',
    overall_score: finalScore,
    status,
    critical_hit: criticalHit,
    top_gaps: topGaps,
    answers: responses,
    weights_summary: {
      sum_weights: totalWeights,
      sum_obtained: obtainedScore
    },
    timestamp: new Date().toISOString(),
    engine_notes: criticalHit ? 'Critical gap detected - score capped at 60%' : 'Standard scoring applied'
  };
}