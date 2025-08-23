import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentResponse, ScoringResult } from '@/lib/types';
import { calculateScore } from '@/lib/scoring';
import { generateArtifacts } from '@/lib/artifacts';
import { exportResults } from '@/lib/export';
import { Shield, Download, RefreshCw, AlertTriangle, CheckCircle, Clock } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ResultsPageProps {
  responses: AssessmentResponse[];
  onRestartAssessment: () => void;
}

export function ResultsPage({ responses, onRestartAssessment }: ResultsPageProps) {
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [artifacts, setArtifacts] = useState<{ gap_list: string; capa_plan: string; interview_script: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (responses.length > 0) {
      const result = calculateScore(responses);
      setScoring(result);
      const generatedArtifacts = generateArtifacts(result);
      setArtifacts(generatedArtifacts);
    }
  }, [responses]);

  const handleExport = async () => {
    if (!scoring) return;

    setIsExporting(true);
    try {
      await exportResults(scoring);
      toast.success('Results exported successfully!');
    } catch (error) {
      toast.error('Failed to export results. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Green':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'Amber':
        return <Clock className="w-6 h-6 text-warning" />;
      case 'Red':
        return <AlertTriangle className="w-6 h-6 text-destructive" />;
      default:
        return <Shield className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Green':
        return 'bg-success text-success-foreground';
      case 'Amber':
        return 'bg-warning text-warning-foreground';
      case 'Red':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!scoring) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculating your readiness score...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Assessment Results</h1>
          <p className="text-muted-foreground">
            Your ISO 13485 / 21 CFR 820 compliance readiness assessment
          </p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(scoring.status)}
                <div>
                  <CardTitle className="text-2xl">
                    Overall Readiness Score: {scoring.overall_score}%
                  </CardTitle>
                  <CardDescription>
                    Status: <Badge className={getStatusColor(scoring.status)}>{scoring.status}</Badge>
                    {scoring.critical_hit && (
                      <Badge variant="destructive" className="ml-2">Critical Gap Detected</Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">Assessment Date</div>
                <div className="font-medium">
                  {new Date(scoring.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={scoring.overall_score} className="h-4 mb-4" />
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Questions:</span>
                <div className="font-medium">{responses.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Weight:</span>
                <div className="font-medium">{scoring.weights_summary.sum_weights}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Score Obtained:</span>
                <div className="font-medium">{Math.round(scoring.weights_summary.sum_obtained)}</div>
              </div>
            </div>
            {scoring.engine_notes && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> {scoring.engine_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Gaps */}
        {scoring.top_gaps.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Priority Compliance Gaps</CardTitle>
              <CardDescription>
                Areas requiring immediate attention to improve audit readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoring.top_gaps.map((gap, index) => (
                  <div key={gap.question_id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{gap.clause_ref}</Badge>
                        <Badge variant="secondary">
                          Impact: {gap.deficit.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">{gap.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Regulatory Reference: {gap.clause_ref}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Artifacts Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generated Deliverables</CardTitle>
            <CardDescription>
              Professional audit preparation materials based on your assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="gap_list" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gap_list">Gap Analysis</TabsTrigger>
                <TabsTrigger value="capa_plan">CAPA Plan</TabsTrigger>
                <TabsTrigger value="interview_script">Interview Script</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gap_list" className="mt-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64">
                    {artifacts?.gap_list.substring(0, 500)}...
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="capa_plan" className="mt-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64">
                    {artifacts?.capa_plan.substring(0, 500)}...
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="interview_script" className="mt-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64">
                    {artifacts?.interview_script.substring(0, 500)}...
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleExport} disabled={isExporting} size="lg">
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? 'Generating...' : 'Export Results (ZIP)'}
          </Button>
          <Button variant="outline" onClick={onRestartAssessment} size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Interpretation Guide */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Score Interpretation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-success mb-2">Green (85%+)</h3>
                  <p className="text-sm text-muted-foreground">
                    Strong audit readiness with minor improvement opportunities
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <h3 className="font-semibold text-warning mb-2">Amber (70-84%)</h3>
                  <p className="text-sm text-muted-foreground">
                    Moderate readiness requiring focused improvement efforts
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-destructive mb-2">Red (&lt;70%)</h3>
                  <p className="text-sm text-muted-foreground">
                    Significant gaps requiring immediate remediation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}