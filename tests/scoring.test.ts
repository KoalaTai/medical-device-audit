import { describe, it, expect } from 'vitest';
import { calculateScore } from '../src/lib/scoring';
import { AssessmentResponse } from '../src/lib/types';

describe('Scoring Engine', () => {
  it('should calculate correct score for perfect responses', () => {
    const responses: AssessmentResponse[] = [
      { question_id: 'Q1', value: true, timestamp: '2024-01-01T00:00:00Z' },
      { question_id: 'Q2', value: true, timestamp: '2024-01-01T00:00:00Z' },
      { question_id: 'Q3', value: 'Fully automated system', timestamp: '2024-01-01T00:00:00Z' },
      { question_id: 'Q4', value: true, timestamp: '2024-01-01T00:00:00Z' },
      { question_id: 'Q5', value: 5, timestamp: '2024-01-01T00:00:00Z' }
    ];

    const result = calculateScore(responses);
    
    expect(result.overall_score).toBe(100);
    expect(result.status).toBe('Green');
    expect(result.critical_hit).toBe(false);
  });

  it('should detect critical hits and cap score', () => {
    const responses: AssessmentResponse[] = [
      { question_id: 'Q1', value: false, timestamp: '2024-01-01T00:00:00Z' }, // Critical question
      { question_id: 'Q2', value: true, timestamp: '2024-01-01T00:00:00Z' },
      { question_id: 'Q3', value: 'Comprehensive system', timestamp: '2024-01-01T00:00:00Z' }
    ];

    const result = calculateScore(responses);
    
    expect(result.critical_hit).toBe(true);
    expect(result.overall_score).toBeLessThanOrEqual(60);
    expect(result.status).toBe('Red');
  });

  it('should handle select questions correctly', () => {
    const responses: AssessmentResponse[] = [
      { question_id: 'Q3', value: 'Basic procedures', timestamp: '2024-01-01T00:00:00Z' },
      { question_id: 'Q7', value: 'Advanced analytics', timestamp: '2024-01-01T00:00:00Z' }
    ];

    const result = calculateScore(responses);
    
    expect(result.top_gaps.length).toBeGreaterThan(0);
    expect(result.weights_summary.sum_weights).toBeGreaterThan(0);
  });

  it('should generate proper JSON structure', () => {
    const responses: AssessmentResponse[] = [
      { question_id: 'Q1', value: true, timestamp: '2024-01-01T00:00:00Z' }
    ];

    const result = calculateScore(responses);
    
    expect(result.version).toBe('0.1.0');
    expect(result.timestamp).toBeDefined();
    expect(result.answers).toEqual(responses);
    expect(result.weights_summary).toHaveProperty('sum_weights');
    expect(result.weights_summary).toHaveProperty('sum_obtained');
  });
});