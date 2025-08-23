import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TeamSession, TeamMember, TeamResponse, TeamScoreResult, AssessmentResponse } from '@/lib/types';
import { Trophy, Users, MessageCircle, TrendUp, AlertTriangle, CheckCircle, Download, ArrowLeft } from '@phosphor-icons/react';
import { getFilteredQuestions } from '@/lib/data';
import { calculateTeamScore } from '@/lib/teamScoring';
import { exportTeamAssessment } from '@/lib/export';
import { toast } from 'sonner';

interface TeamResultsProps {
  session: TeamSession;
  currentMember: TeamMember;
  onBack: () => void;
}

export function TeamResults({ session, currentMember, onBack }: TeamResultsProps) {
  const [teamResponses] = useKV<Record<string, TeamResponse>>(`team_responses_${session.id}`, {});
  const [teamScore, setTeamScore] = useState<TeamScoreResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (Object.keys(teamResponses).length > 0) {
      // Convert team responses to assessment responses for scoring
      const assessmentResponses: AssessmentResponse[] = Object.values(teamResponses)
        .filter(response => response.consensusReached && response.finalAnswer !== undefined)
        .map(response => ({
          questionId: response.questionId,
          answer: response.finalAnswer!
        }));

      const questions = getFilteredQuestions(session.selectedFrameworks, session.riskClassification);
      const score = calculateTeamScore(
        assessmentResponses,
        questions,
        teamResponses,
        session.members,
        session.selectedFrameworks,
        session.riskClassification
      );

      setTeamScore(score);
    }
  }, [teamResponses, session]);

  const handleExportResults = async () => {
    if (!teamScore) return;

    setIsExporting(true);
    try {
      const blob = await exportTeamAssessment(teamScore, session, teamResponses);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `team-audit-assessment-${session.name}-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Team assessment exported successfully');
    } catch (error) {
      toast.error('Failed to export assessment');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!teamScore) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Calculating Team Results...</h3>
          <p className="text-muted-foreground">
            Analyzing team responses and collaboration metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      green: 'default' as const,
      amber: 'secondary' as const,
      red: 'destructive' as const
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Button>
          <h1 className="text-3xl font-bold">Team Assessment Results</h1>
          <p className="text-muted-foreground">{session.name}</p>
        </div>
        <Button onClick={handleExportResults} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              Team Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(teamScore.score)}`}>
              {Math.round(teamScore.score)}
            </div>
            <div className="mt-2">
              <Badge variant={getStatusBadge(teamScore.status)} className="text-sm">
                {teamScore.status.toUpperCase()}
              </Badge>
            </div>
            <div className="mt-4">
              <Progress value={teamScore.score} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              Collaboration
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(teamScore.collaborationScore)}`}>
              {Math.round(teamScore.collaborationScore)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Team effectiveness score
            </p>
            <div className="mt-4">
              <Progress value={teamScore.collaborationScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Consensus Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(teamScore.consensusMetrics.overallConsensusRate)}`}>
              {Math.round(teamScore.consensusMetrics.overallConsensusRate)}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Questions resolved by consensus
            </p>
            <div className="mt-4">
              <Progress value={teamScore.consensusMetrics.overallConsensusRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Performance</TabsTrigger>
          <TabsTrigger value="collaboration">Team Dynamics</TabsTrigger>
          <TabsTrigger value="roles">Role Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Risk Level</span>
                    <Badge variant={
                      teamScore.riskAssessment.overallRisk === 'critical' ? 'destructive' :
                      teamScore.riskAssessment.overallRisk === 'high' ? 'secondary' :
                      teamScore.riskAssessment.overallRisk === 'medium' ? 'outline' : 'default'
                    }>
                      {teamScore.riskAssessment.overallRisk.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Risk Factors</h4>
                    {teamScore.riskAssessment.riskFactors.slice(0, 3).map((factor, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                        <div>
                          <p className="font-medium">{factor.type.replace('_', ' ')}</p>
                          <p className="text-muted-foreground">{factor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Gaps */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamScore.gaps.slice(0, 5).map((gap, index) => (
                    <div key={gap.questionId} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {gap.clauseRef}
                        </Badge>
                        <span className="text-sm font-medium text-destructive">
                          -{Math.round(gap.deficit)}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm">{gap.clauseTitle}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {gap.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Framework Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Framework Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(teamScore.frameworkScores).map(framework => (
                  <div key={framework.framework} className="border rounded-lg p-4 text-center">
                    <h3 className="font-medium mb-2">{framework.framework.replace('_', ' ')}</h3>
                    <div className={`text-2xl font-bold ${getScoreColor(framework.performance)}`}>
                      {Math.round(framework.performance)}%
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {framework.criticalFailures} critical issues
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {framework.gaps} gaps identified
                      </div>
                    </div>
                    <Progress value={framework.performance} className="h-1 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid gap-4">
            {session.members.map(member => {
              const individualScore = teamScore.individualScores[member.id];
              if (!individualScore) return null;

              return (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription>{member.role.replace('_', ' ')} • {member.department}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getScoreColor(individualScore.score)}`}>
                          {Math.round(individualScore.score)}
                        </div>
                        <Badge variant={getStatusBadge(individualScore.status)} className="text-xs">
                          {individualScore.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Performance</h4>
                        <Progress value={individualScore.score} className="h-2 mb-1" />
                        <div className="text-xs text-muted-foreground">
                          Individual assessment score
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Critical Issues</h4>
                        <div className="text-lg font-medium text-destructive">
                          {individualScore.criticalFailures.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Issues requiring immediate attention
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Knowledge Gaps</h4>
                        <div className="text-lg font-medium text-warning">
                          {individualScore.gaps.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Areas for improvement
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Dynamics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Communication Effectiveness</span>
                  <div className="flex items-center gap-2">
                    <Progress value={teamScore.teamDynamics.communicationEffectiveness} className="w-20 h-2" />
                    <span className="text-sm font-medium">
                      {Math.round(teamScore.teamDynamics.communicationEffectiveness)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Decision Making Speed</span>
                  <Badge variant="outline">
                    {teamScore.teamDynamics.decisionMakingSpeed}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>Conflict Resolution Style</span>
                  <Badge variant="outline">
                    {teamScore.teamDynamics.conflictResolutionStyle}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participation Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(teamScore.teamDynamics.participationBalance)
                    .sort(([,a], [,b]) => b - a)
                    .map(([memberId, participation]) => {
                      const member = session.members.find(m => m.id === memberId);
                      if (!member) return null;

                      return (
                        <div key={memberId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{member.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={participation} className="w-16 h-2" />
                            <span className="text-xs w-8">{Math.round(participation)}%</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Consensus Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(teamScore.consensusMetrics.overallConsensusRate)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Consensus Rate</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {teamScore.consensusMetrics.votingRoundsRequired}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg. Voting Rounds</p>
                </div>

                <div className="text-center">
                  <Badge variant={
                    teamScore.consensusMetrics.consensusQuality === 'strong' ? 'default' :
                    teamScore.consensusMetrics.consensusQuality === 'moderate' ? 'secondary' :
                    'outline'
                  } className="text-sm">
                    {teamScore.consensusMetrics.consensusQuality} consensus
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Quality Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(teamScore.roleAnalysis).map(([role, analysis]) => (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{role.replace('_', ' ')}</span>
                    <Badge variant="outline">
                      Performance: {Math.round(analysis.actualPerformance)}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Expected Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.expectedStrengths.map(strength => (
                          <Badge key={strength} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommended Training</h4>
                      <div className="space-y-1">
                        {analysis.recommendedTraining.slice(0, 3).map(training => (
                          <div key={training} className="text-sm text-muted-foreground">
                            • {training}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Role-Specific Insights</h4>
                    <div className="space-y-1">
                      {analysis.roleSpecificInsights.map((insight, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {teamScore.recommendedActions.map((recommendation, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{recommendation.description}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        recommendation.priority === 'immediate' ? 'destructive' :
                        recommendation.priority === 'short_term' ? 'secondary' : 'outline'
                      }>
                        {recommendation.priority.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        <TrendUp className="w-3 h-3 mr-1" />
                        {recommendation.estimatedImpact}% impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Target Roles</h4>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.targetRoles.map(role => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Implementation Steps</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {recommendation.implementationSteps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}