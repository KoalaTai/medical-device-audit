import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Warning, 
  XCircle, 
  FileText, 
  Download,
  ArrowClockwise,
  TrendUp,
  ClipboardText,
  Users,
  Calculator,
  CheckSquare
} from '@phosphor-icons/react';
import { AssessmentResponse, FilterOptions } from '../lib/types';
import { calculateScore } from '../lib/scoring';
import { createExportPackage, downloadExportPackage } from '../lib/export';
import { frameworkLabels, getFilteredQuestions } from '../lib/data';
import { ScoringExplanation } from './ScoringExplanation';
import { toast } from 'sonner';

interface ResultsPageProps {
  responses: AssessmentResponse[];
  onRestartAssessment: () => void;
  filterOptions: FilterOptions;
  onShowAuditChecklist?: () => void;
}

export function ResultsPage({ responses, onRestartAssessment, filterOptions, onShowAuditChecklist }: ResultsPageProps) {
  const scoreResult = useMemo(() => calculateScore(responses, filterOptions), [responses, filterOptions]);
  const assessmentQuestions = useMemo(() => {
    return filterOptions 
      ? getFilteredQuestions(filterOptions.selectedFrameworks, filterOptions.includeAllFrameworks)
      : getFilteredQuestions([], true);
  }, [filterOptions]);
  
  const statusConfig = {
    red: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      title: 'HIGH RISK',
      description: 'Immediate action required to address critical gaps'
    },
    amber: {
      icon: Warning,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      title: 'MEDIUM RISK',
      description: 'Several areas need improvement before audit'
    },
    green: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      title: 'LOW RISK',
      description: 'Good compliance posture with minor improvements needed'
    }
  };

  const config = statusConfig[scoreResult.status];
  const StatusIcon = config.icon;

  const handleExport = () => {
    try {
      const exportData = createExportPackage(scoreResult, responses, filterOptions);
      downloadExportPackage(exportData);
      toast.success('Assessment package exported successfully');
    } catch (error) {
      toast.error('Failed to export assessment package');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Assessment Results
        </h1>
        <p className="text-muted-foreground">
          Your audit readiness evaluation is complete
        </p>
        {/* Framework summary */}
        <div className="mt-4 flex justify-center flex-wrap gap-2">
          {filterOptions.includeAllFrameworks ? (
            <>
              <Badge variant="outline">Complete Assessment</Badge>
              <Badge variant="secondary">All Frameworks</Badge>
            </>
          ) : (
            <>
              <Badge variant="outline">Focused Assessment</Badge>
              {filterOptions.selectedFrameworks.map(framework => (
                <Badge key={framework} variant="secondary">
                  {frameworkLabels[framework]}
                </Badge>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className={`lg:col-span-1 ${config.borderColor} ${config.bgColor}`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <StatusIcon size={48} className={config.color} />
            </div>
            <CardTitle className="text-2xl">
              Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold mb-2 text-foreground">
              {scoreResult.score}
            </div>
            <div className="text-lg text-muted-foreground mb-4">
              out of 100
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-1">
              {config.title}
            </Badge>
            <p className="text-sm text-muted-foreground mt-3">
              {config.description}
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={20} />
                Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Questions Answered</span>
                <span className="font-semibold">{responses.length} / {assessmentQuestions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Critical Failures</span>
                <Badge variant={scoreResult.criticalFailures.length > 0 ? "destructive" : "secondary"}>
                  {scoreResult.criticalFailures.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Priority Gaps Identified</span>
                <span className="font-semibold">{scoreResult.gaps.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Compliance Maturity</span>
                <Badge variant="outline" className="capitalize">
                  {scoreResult.riskAssessment.complianceMaturity}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant={scoreResult.riskAssessment.overallRisk === 'critical' || scoreResult.riskAssessment.overallRisk === 'high' ? 'destructive' : 
                  scoreResult.riskAssessment.overallRisk === 'medium' ? 'secondary' : 'outline'} 
                  className="capitalize">
                  {scoreResult.riskAssessment.overallRisk}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Compliance</span>
                  <span>{scoreResult.score}%</span>
                </div>
                <Progress value={scoreResult.score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weighted Performance</span>
                  <span>{((scoreResult.weightedBreakdown.actualWeightedScore / scoreResult.weightedBreakdown.totalPossibleWeight) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(scoreResult.weightedBreakdown.actualWeightedScore / scoreResult.weightedBreakdown.totalPossibleWeight) * 100} className="h-1" />
              </div>
            </CardContent>
          </Card>

          {scoreResult.criticalFailures.length > 0 && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle size={20} />
                  Critical Compliance Failures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive mb-3">
                  The following critical requirements must be addressed immediately:
                </p>
                <div className="space-y-2">
                  {scoreResult.criticalFailures.map(failure => (
                    <Badge key={failure} variant="destructive" className="mr-2">
                      {failure}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detailed Results */}
      <Tabs defaultValue="gaps" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gaps" className="flex items-center gap-2">
            <ClipboardText size={16} />
            Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Calculator size={16} />
            Scoring Details
          </TabsTrigger>
          <TabsTrigger value="capa" className="flex items-center gap-2">
            <FileText size={16} />
            CAPA Planning
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <Users size={16} />
            Interview Prep
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority Compliance Gaps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top {scoreResult.gaps.length} areas requiring attention, ranked by enhanced impact scoring
              </p>
            </CardHeader>
            <CardContent>
              {scoreResult.gaps.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-success mx-auto mb-4" />
                  <h3 className="font-semibold text-success mb-2">No Critical Gaps Identified</h3>
                  <p className="text-muted-foreground">
                    Your assessment shows strong compliance across all evaluated areas.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scoreResult.gaps.map((gap, index) => (
                    <div key={gap.questionId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            #{index + 1}
                          </Badge>
                          <div>
                            <h4 className="font-semibold text-sm">{gap.clauseTitle}</h4>
                            <p className="text-xs text-muted-foreground">{gap.clauseRef}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          Impact: {gap.deficit.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {gap.prompt}
                      </p>
                      {gap.suggestedEvidence.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-2">
                            Required Evidence:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {gap.suggestedEvidence.slice(0, 3).map(evidence => (
                              <Badge key={evidence} variant="outline" className="text-xs">
                                {evidence}
                              </Badge>
                            ))}
                            {gap.suggestedEvidence.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{gap.suggestedEvidence.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          <ScoringExplanation scoreResult={scoreResult} filterOptions={filterOptions} />
        </TabsContent>

        <TabsContent value="capa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CAPA Planning Guidance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Systematic approach to addressing identified gaps through corrective and preventive actions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Immediate Actions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Document current state of identified gaps</li>
                      <li>• Implement temporary risk controls</li>
                      <li>• Assign ownership for each gap</li>
                      <li>• Establish timeline for resolution</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Long-term Strategy</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Develop systematic processes</li>
                      <li>• Implement ongoing monitoring</li>
                      <li>• Establish performance metrics</li>
                      <li>• Plan effectiveness verification</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The exported CAPA plan includes detailed templates with 
                    5-Whys root cause analysis, specific actions for each gap, and verification methods.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Interview Preparation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Role-based question sets to help your team prepare for regulatory interviews
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Management Interviews</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Quality policy and objectives</li>
                    <li>• Resource allocation decisions</li>
                    <li>• Management review effectiveness</li>
                    <li>• Strategic quality planning</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Technical Interviews</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Design control implementation</li>
                    <li>• Process validation evidence</li>
                    <li>• Risk management activities</li>
                    <li>• CAPA system operation</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Quality Assurance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Monitoring and measurement</li>
                    <li>• Nonconforming product control</li>
                    <li>• Internal audit program</li>
                    <li>• Document control systems</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Production Teams</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Process control procedures</li>
                    <li>• Material handling practices</li>
                    <li>• Equipment calibration</li>
                    <li>• Training and competency</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button onClick={handleExport} size="lg" className="flex items-center gap-2">
          <Download size={20} />
          Export Assessment Package
        </Button>
        {onShowAuditChecklist && filterOptions.riskClassification && (
          <Button 
            onClick={onShowAuditChecklist} 
            size="lg" 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <CheckSquare size={20} />
            View Audit Checklist
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={onRestartAssessment} 
          size="lg" 
          className="flex items-center gap-2"
        >
          <ArrowClockwise size={20} />
          New Assessment
        </Button>
      </div>
    </div>
  );
}