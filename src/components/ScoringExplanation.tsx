import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendUp, 
  Shield, 
  Target, 
  Brain,
  Info,
  Warning,
  CheckCircle,
  Scales,
  ChartBar,
  Gauge
} from '@phosphor-icons/react';
import { ScoreResult, RegulatoryFramework, FilterOptions } from '../lib/types';
import { frameworkLabels } from '../lib/data';

interface ScoringExplanationProps {
  scoreResult: ScoreResult;
  filterOptions?: FilterOptions;
}

export function ScoringExplanation({ scoreResult, filterOptions }: ScoringExplanationProps) {
  const { weightedBreakdown, riskAssessment, frameworkScores } = scoreResult;

  const maturityConfig = {
    basic: { color: 'text-destructive', bg: 'bg-destructive/10', label: 'Basic' },
    developing: { color: 'text-warning', bg: 'bg-warning/10', label: 'Developing' },
    advanced: { color: 'text-success', bg: 'bg-success/10', label: 'Advanced' },
    optimized: { color: 'text-primary', bg: 'bg-primary/10', label: 'Optimized' }
  };

  const riskConfig = {
    critical: { color: 'text-destructive', icon: Warning, label: 'Critical Risk' },
    high: { color: 'text-destructive', icon: Warning, label: 'High Risk' },
    medium: { color: 'text-warning', icon: Info, label: 'Medium Risk' },
    low: { color: 'text-success', icon: CheckCircle, label: 'Low Risk' }
  };

  const maturity = maturityConfig[riskAssessment.complianceMaturity];
  const risk = riskConfig[riskAssessment.overallRisk];
  const RiskIcon = risk.icon;

  return (
    <div className="space-y-6">
      {/* Scoring Methodology Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={20} />
            Enhanced Weighted Scoring Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Scoring Components</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Scales size={14} />
                  <span>Question weight (1-5 scale)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gauge size={14} />
                  <span>Device risk classification multiplier</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} />
                  <span>Regulatory framework risk factor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Warning size={14} />
                  <span>Critical requirement multiplier</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendUp size={14} />
                  <span>Non-linear penalty curves</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Assessment Logic</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Yes/No: Binary scoring (1 or 0)</li>
                <li>• Multiple Choice: Exponential penalty for critical items</li>
                <li>• Text Responses: Progressive scoring by completeness</li>
                <li>• Critical Failures: Automatic risk elevation</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {weightedBreakdown.actualWeightedScore.toFixed(1)}
                </div>
                <div className="text-muted-foreground">Weighted Score</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {weightedBreakdown.totalPossibleWeight.toFixed(1)}
                </div>
                <div className="text-muted-foreground">Maximum Possible</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  -{weightedBreakdown.criticalImpact}%
                </div>
                <div className="text-muted-foreground">Critical Penalty</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <ChartBar size={16} />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield size={16} />
            Risk Profile
          </TabsTrigger>
          <TabsTrigger value="frameworks" className="flex items-center gap-2">
            <Target size={16} />
            Frameworks
          </TabsTrigger>
          <TabsTrigger value="device-risk" className="flex items-center gap-2">
            <Gauge size={16} />
            Device Risk
          </TabsTrigger>
          <TabsTrigger value="maturity" className="flex items-center gap-2">
            <Brain size={16} />
            Maturity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Weighted breakdown by regulatory compliance areas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weightedBreakdown.weightingFactors.map((factor, index) => (
                  <div key={factor.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          #{index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-semibold text-sm">{factor.category}</h4>
                          <p className="text-xs text-muted-foreground">
                            Weight: {factor.weight.toFixed(1)} | Clauses: {factor.clauseRefs.length}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {factor.performance.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {factor.actualScore.toFixed(1)} / {factor.maxScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <Progress value={factor.performance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RiskIcon size={20} className={risk.color} />
                Risk Assessment Profile
              </CardTitle>
              <Badge variant="secondary" className={`${maturity.color} ${maturity.bg}`}>
                {maturity.label} Compliance Maturity
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">Identified Risk Factors</h4>
                  <div className="space-y-2">
                    {riskAssessment.riskFactors.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No significant risk factors identified</p>
                    ) : (
                      riskAssessment.riskFactors.map((factor, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-xs">
                              {factor.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant={factor.likelihood === 'high' ? 'destructive' : 
                              factor.likelihood === 'medium' ? 'secondary' : 'outline'}>
                              {factor.likelihood} likelihood
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-1">{factor.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Impact: {factor.impact}% | Clauses: {factor.clauseRefs.join(', ')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Mitigation Priorities</h4>
                  <div className="space-y-2">
                    {riskAssessment.mitigationPriority.map((priority, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="font-mono">
                          {index + 1}
                        </Badge>
                        <span>{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Framework Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Individual compliance scores by regulatory standard
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(frameworkScores).map(([framework, data]) => (
                  <div key={framework} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold">{frameworkLabels[framework as RegulatoryFramework]}</h4>
                        <p className="text-xs text-muted-foreground">{framework}</p>
                      </div>
                      <Badge variant={data.score >= 80 ? 'default' : data.score >= 70 ? 'secondary' : 'destructive'}>
                        {data.score}%
                      </Badge>
                    </div>
                    <Progress value={data.performance} className="h-2 mb-3" />
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                      <div>Critical Failures: {data.criticalFailures}</div>
                      <div>Total Gaps: {data.gaps}</div>
                    </div>
                    <p className="text-xs">{data.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device-risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge size={20} />
                Device Risk-Adjusted Scoring
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                How device classification affects question weighting and compliance priorities
              </p>
            </CardHeader>
            <CardContent>
              {filterOptions?.riskClassification ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">Device Classification</h4>
                      <div className="space-y-2">
                        {filterOptions.riskClassification.fdaClass && (
                          <div className="flex justify-between">
                            <span className="text-sm">FDA Class:</span>
                            <Badge variant="outline">{filterOptions.riskClassification.fdaClass}</Badge>
                          </div>
                        )}
                        {filterOptions.riskClassification.euClass && (
                          <div className="flex justify-between">
                            <span className="text-sm">EU Class:</span>
                            <Badge variant="outline">{filterOptions.riskClassification.euClass}</Badge>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm">Overall Risk:</span>
                          <Badge variant={
                            filterOptions.riskClassification.riskLevel === 'Very High' ? 'destructive' :
                            filterOptions.riskClassification.riskLevel === 'High' ? 'secondary' :
                            filterOptions.riskClassification.riskLevel === 'Medium' ? 'outline' : 'default'
                          }>
                            {filterOptions.riskClassification.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Device Characteristics</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Sterile Device:</span>
                          <span>{filterOptions.riskClassification.isSterile ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Measuring Function:</span>
                          <span>{filterOptions.riskClassification.isMeasuring ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Components:</span>
                          <span>{filterOptions.riskClassification.hasActiveComponents ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Drug-Device Combination:</span>
                          <span>{filterOptions.riskClassification.isDrugDevice ? '✓' : '✗'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Risk Adjustment Impact</h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {filterOptions.riskClassification.riskLevel === 'Very High' ? '+60%' :
                             filterOptions.riskClassification.riskLevel === 'High' ? '+30%' :
                             filterOptions.riskClassification.riskLevel === 'Medium' ? '+10%' : '±0%'}
                          </div>
                          <div className="text-sm text-muted-foreground">Critical Question Weight</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent">
                            {filterOptions.riskClassification.riskLevel === 'Very High' ? '+40%' :
                             filterOptions.riskClassification.riskLevel === 'High' ? '+20%' :
                             filterOptions.riskClassification.riskLevel === 'Medium' ? '+5%' : '±0%'}
                          </div>
                          <div className="text-sm text-muted-foreground">Design Control Focus</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-warning">
                            {filterOptions.riskClassification.riskLevel === 'Very High' ? '70%' :
                             filterOptions.riskClassification.riskLevel === 'High' ? '75%' :
                             filterOptions.riskClassification.riskLevel === 'Medium' ? '80%' : '85%'}
                          </div>
                          <div className="text-sm text-muted-foreground">Min. Passing Threshold</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Risk-Specific Focus Areas</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Enhanced Requirements:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {filterOptions.riskClassification.riskLevel === 'Very High' && (
                            <>
                              <li>• Clinical evaluation and PMCF</li>
                              <li>• Comprehensive risk management</li>
                              <li>• Enhanced post-market surveillance</li>
                              <li>• Rigorous design controls</li>
                            </>
                          )}
                          {filterOptions.riskClassification.riskLevel === 'High' && (
                            <>
                              <li>• Clinical evaluation or equivalence</li>
                              <li>• Risk management throughout lifecycle</li>
                              <li>• Active post-market monitoring</li>
                              <li>• Thorough design validation</li>
                            </>
                          )}
                          {filterOptions.riskClassification.riskLevel === 'Medium' && (
                            <>
                              <li>• Risk analysis and management</li>
                              <li>• Design verification and validation</li>
                              <li>• Targeted post-market activities</li>
                              <li>• Process validation for critical steps</li>
                            </>
                          )}
                          {filterOptions.riskClassification.riskLevel === 'Low' && (
                            <>
                              <li>• Basic risk management</li>
                              <li>• Essential design controls</li>
                              <li>• Fundamental QMS processes</li>
                              <li>• Basic post-market monitoring</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Additional Considerations:</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {filterOptions.riskClassification.isSterile && (
                            <li>• Sterilization validation and monitoring</li>
                          )}
                          {filterOptions.riskClassification.hasActiveComponents && (
                            <li>• Software lifecycle per IEC 62304</li>
                          )}
                          {filterOptions.riskClassification.isMeasuring && (
                            <li>• Measurement accuracy validation</li>
                          )}
                          {filterOptions.riskClassification.isDrugDevice && (
                            <li>• Drug-device interaction studies</li>
                          )}
                          <li>• Regulatory submission planning</li>
                          <li>• Notified body selection (EU)</li>
                          <li>• Clinical strategy development</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gauge size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-2">No Device Classification Set</h4>
                  <p className="text-sm text-muted-foreground">
                    Device risk classification was not specified during assessment setup. 
                    Standard scoring weights were applied to all questions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maturity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain size={20} />
                Compliance Maturity Assessment
              </CardTitle>
              <Badge variant="secondary" className={`${maturity.color} ${maturity.bg}`}>
                {maturity.label} Level
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Maturity Characteristics</h4>
                  {riskAssessment.complianceMaturity === 'basic' && (
                    <div className="space-y-2 text-sm">
                      <p>• Foundational compliance gaps exist</p>
                      <p>• Limited systematic processes</p>
                      <p>• Reactive approach to quality issues</p>
                      <p>• Minimal documentation and controls</p>
                    </div>
                  )}
                  {riskAssessment.complianceMaturity === 'developing' && (
                    <div className="space-y-2 text-sm">
                      <p>• Basic processes established</p>
                      <p>• Some systematic approaches implemented</p>
                      <p>• Inconsistent execution across areas</p>
                      <p>• Growing documentation and training</p>
                    </div>
                  )}
                  {riskAssessment.complianceMaturity === 'advanced' && (
                    <div className="space-y-2 text-sm">
                      <p>• Comprehensive quality systems</p>
                      <p>• Consistent process execution</p>
                      <p>• Proactive monitoring and improvement</p>
                      <p>• Strong documentation and training</p>
                    </div>
                  )}
                  {riskAssessment.complianceMaturity === 'optimized' && (
                    <div className="space-y-2 text-sm">
                      <p>• Best-in-class compliance posture</p>
                      <p>• Continuous improvement culture</p>
                      <p>• Predictive risk management</p>
                      <p>• Integrated quality excellence</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Next Level Actions</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {riskAssessment.complianceMaturity === 'basic' && (
                      <>
                        <p>• Establish fundamental QMS processes</p>
                        <p>• Implement basic documentation systems</p>
                        <p>• Train personnel on regulatory requirements</p>
                        <p>• Develop internal audit capabilities</p>
                      </>
                    )}
                    {riskAssessment.complianceMaturity === 'developing' && (
                      <>
                        <p>• Standardize processes across organization</p>
                        <p>• Implement CAPA system improvements</p>
                        <p>• Enhance measurement and monitoring</p>
                        <p>• Develop advanced training programs</p>
                      </>
                    )}
                    {riskAssessment.complianceMaturity === 'advanced' && (
                      <>
                        <p>• Optimize process effectiveness</p>
                        <p>• Implement predictive analytics</p>
                        <p>• Enhance supplier partnerships</p>
                        <p>• Benchmark against industry leaders</p>
                      </>
                    )}
                    {riskAssessment.complianceMaturity === 'optimized' && (
                      <>
                        <p>• Maintain excellence through innovation</p>
                        <p>• Share best practices industry-wide</p>
                        <p>• Lead regulatory advocacy efforts</p>
                        <p>• Mentor other organizations</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}