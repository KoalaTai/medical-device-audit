import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { useKV } from '@github/spark/hooks';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronRight,
  Download,
  Calendar,
  Target,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from '@phosphor-icons/react';
import { ChecklistItem, PreparationGuide, DeviceCategory, DeviceRiskClass, RegulatoryFramework } from '@/lib/types';
import { getFilteredChecklists, getPreparationGuide, getChecklistsByPriority } from '@/lib/checklists';

interface AuditChecklistProps {
  deviceCategory: DeviceCategory;
  riskClass: DeviceRiskClass;
  frameworks: RegulatoryFramework[];
  onBack: () => void;
}

export const AuditChecklist: React.FC<AuditChecklistProps> = ({
  deviceCategory,
  riskClass,
  frameworks,
  onBack
}) => {
  const [completedItems, setCompletedItems] = useKV<string[]>(`checklist_completed_${deviceCategory}_${riskClass}`, []);
  const [activeTab, setActiveTab] = useState('checklist');
  const [expandedSections, setExpandedSections] = useState<string[]>(['critical']);

  const checklists = getFilteredChecklists(deviceCategory, riskClass, frameworks) || [];
  const preparationGuide = getPreparationGuide(deviceCategory, riskClass);
  const categorizedChecklists = getChecklistsByPriority(checklists) || {};

  const totalItems = checklists.length;
  const completedCount = (completedItems || []).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const toggleItemCompletion = (itemId: string) => {
    setCompletedItems((currentCompleted) => {
      const completed = currentCompleted || [];
      if (completed.includes(itemId)) {
        return completed.filter(id => id !== itemId);
      } else {
        return [...completed, itemId];
      }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(current => {
      if (current.includes(section)) {
        return current.filter(s => s !== section);
      } else {
        return [...current, section];
      }
    });
  };

  const exportChecklist = () => {
    const checklistData = {
      deviceCategory,
      riskClass,
      frameworks,
      totalItems,
      completedCount,
      completionPercentage,
      items: checklists.map(item => ({
        ...item,
        completed: (completedItems || []).includes(item.id)
      })),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-checklist-${deviceCategory}-${riskClass}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const ChecklistSection = ({ title, items, priority }: { title: string, items: ChecklistItem[], priority: string }) => {
    const isExpanded = expandedSections.includes(priority);
    const sectionCompleted = items.filter(item => (completedItems || []).includes(item.id)).length;
    
    return (
      <Card className="mb-4">
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(priority)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(priority)}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {title}
                      <Badge className={getPriorityColor(priority)}>
                        {sectionCompleted}/{items.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {items.length} items • {items.reduce((sum, item) => sum + item.estimatedHours, 0)} hours estimated
                    </CardDescription>
                  </div>
                </div>
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {items.map((item) => {
                  const isCompleted = (completedItems || []).includes(item.id);
                  return (
                    <div key={item.id} className={`border rounded-lg p-4 transition-all ${isCompleted ? 'bg-muted/30 border-success' : 'hover:bg-muted/20'}`}>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => toggleItemCompletion(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {item.estimatedHours}h
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.frameworks.map(framework => (
                              <Badge key={framework} variant="outline" className="text-xs">
                                {framework}
                              </Badge>
                            ))}
                          </div>
                          {item.evidenceTypes && item.evidenceTypes.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Evidence Types: </span>
                              {item.evidenceTypes.join(', ')}
                            </div>
                          )}
                          {item.commonPitfalls && item.commonPitfalls.length > 0 && (
                            <div className="text-xs text-warning-foreground bg-warning/10 p-2 rounded">
                              <div className="flex items-center gap-1 font-medium mb-1">
                                <AlertTriangle className="w-3 h-3" />
                                Common Pitfalls:
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {item.commonPitfalls.map((pitfall, index) => (
                                  <li key={index}>{pitfall}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.tips && item.tips.length > 0 && (
                            <div className="text-xs text-accent-foreground bg-accent/10 p-2 rounded">
                              <div className="flex items-center gap-1 font-medium mb-1">
                                <Lightbulb className="w-3 h-3" />
                                Tips:
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {item.tips.map((tip, index) => (
                                  <li key={index}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Audit Preparation Tools</h1>
            <p className="text-muted-foreground">
              {deviceCategory} devices • {riskClass} • {frameworks.join(', ')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportChecklist}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Results
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Progress</span>
                    <span>{completedCount}/{totalItems} items ({completionPercentage}%)</span>
                  </div>
                  <Progress value={completionPercentage} className="w-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-destructive">{categorizedChecklists.critical.length}</div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">{categorizedChecklists.high.length}</div>
                    <div className="text-xs text-muted-foreground">High</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{categorizedChecklists.medium.length}</div>
                    <div className="text-xs text-muted-foreground">Medium</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-foreground">{categorizedChecklists.low.length}</div>
                    <div className="text-xs text-muted-foreground">Low</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checklist">Audit Checklist</TabsTrigger>
            <TabsTrigger value="guide">Preparation Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="space-y-6">
            <ChecklistSection 
              title="Critical Items" 
              items={categorizedChecklists.critical} 
              priority="critical" 
            />
            <ChecklistSection 
              title="High Priority Items" 
              items={categorizedChecklists.high} 
              priority="high" 
            />
            <ChecklistSection 
              title="Medium Priority Items" 
              items={categorizedChecklists.medium} 
              priority="medium" 
            />
            <ChecklistSection 
              title="Low Priority Items" 
              items={categorizedChecklists.low} 
              priority="low" 
            />
          </TabsContent>

          <TabsContent value="guide">
            {preparationGuide ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {preparationGuide.title}
                    </CardTitle>
                    <CardDescription>{preparationGuide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{preparationGuide.totalEstimatedHours}h</div>
                        <div className="text-sm text-muted-foreground">Total Estimated Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{preparationGuide.sections.length}</div>
                        <div className="text-sm text-muted-foreground">Preparation Phases</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{preparationGuide.keyMilestones.length}</div>
                        <div className="text-sm text-muted-foreground">Key Milestones</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Key Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {preparationGuide.keyMilestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className={`p-2 rounded-full ${milestone.criticalPath ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}>
                            <Target className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <Badge variant={milestone.criticalPath ? 'destructive' : 'secondary'}>
                                Day {milestone.daysFromStart}
                              </Badge>
                              {milestone.criticalPath && (
                                <Badge variant="outline" className="text-xs">Critical Path</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                            <div className="text-xs">
                              <span className="font-medium">Deliverables: </span>
                              {milestone.deliverables.join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {preparationGuide.sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>
                        {section.description} • {section.estimatedHours} hours estimated
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {section.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded">
                            <div className={`p-1 rounded ${getPriorityColor(item.priority)}`}>
                              {getPriorityIcon(item.priority)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.estimatedHours}h
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Preparation Guide Available</h3>
                  <p className="text-muted-foreground">
                    A specific preparation guide for {deviceCategory} {riskClass} devices is not yet available.
                    Please use the checklist items as your preparation guide.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};