import { describe, it, expect } from 'vitest';
import { generateArtifacts } from '../src/lib/artifacts';
import { ScoringResult } from '../src/lib/types';

describe('Artifact Generation', () => {
  const mockScoringResult: ScoringResult = {
    version: '0.1.0',
    overall_score: 75,
    status: 'Amber',
    critical_hit: false,
    top_gaps: [
      {
        question_id: 'Q1',
        clause_ref: 'QMS.820.30',
        deficit: 5.0,
        label: 'Does your organization have a documented QMS?'
      },
      {
        question_id: 'Q3',
        clause_ref: 'DOC.820.40',
        deficit: 3.5,
        label: 'How comprehensive is your document control system?'
      }
    ],
    answers: [],
    weights_summary: { sum_weights: 100, sum_obtained: 75 },
    timestamp: '2024-01-01T00:00:00Z',
    engine_notes: 'Standard scoring applied'
  };

  it('should generate gap list with proper formatting', () => {
    const artifacts = generateArtifacts(mockScoringResult);
    
    expect(artifacts.gap_list).toContain('# Compliance Gap Analysis Report');
    expect(artifacts.gap_list).toContain('Overall Score**: 75%');
    expect(artifacts.gap_list).toContain('QMS.820.30');
    expect(artifacts.gap_list).toContain('HIGH PRIORITY');
    expect(artifacts.gap_list).toContain('Disclaimer');
  });

  it('should generate CAPA plan with table structure', () => {
    const artifacts = generateArtifacts(mockScoringResult);
    
    expect(artifacts.capa_plan).toContain('# Corrective and Preventive Action Plan');
    expect(artifacts.capa_plan).toContain('| Problem | Root Cause |');
    expect(artifacts.capa_plan).toContain('TBD - Root cause analysis required');
    expect(artifacts.capa_plan).toContain('Instructions for Completion');
  });

  it('should generate interview script with role-based sections', () => {
    const artifacts = generateArtifacts(mockScoringResult);
    
    expect(artifacts.interview_script).toContain('# Audit Interview Preparation Script');
    expect(artifacts.interview_script).toContain('For Quality Manager Role');
    expect(artifacts.interview_script).toContain('Expected Questions');
    expect(artifacts.interview_script).toContain('Mock Questions by Category');
    expect(artifacts.interview_script).toContain('Final Preparation Checklist');
  });

  it('should handle critical gaps appropriately', () => {
    const criticalResult = {
      ...mockScoringResult,
      critical_hit: true,
      overall_score: 55,
      status: 'Red' as const
    };

    const artifacts = generateArtifacts(criticalResult);
    
    expect(artifacts.gap_list).toContain('Critical compliance gaps require immediate attention');
    expect(artifacts.interview_script).toContain('priority areas');
  });
});