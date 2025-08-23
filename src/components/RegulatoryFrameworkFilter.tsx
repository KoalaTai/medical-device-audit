import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RegulatoryFramework, FilterOptions } from '@/lib/types';
import { frameworkLabels, frameworkDescriptions, getQuestionCountByFramework } from '@/lib/data';
import { Filter, Info } from '@phosphor-icons/react';

interface RegulatoryFrameworkFilterProps {
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  className?: string;
}

export function RegulatoryFrameworkFilter({ 
  filterOptions, 
  onFilterChange, 
  className = '' 
}: RegulatoryFrameworkFilterProps) {
  const [questionCounts, setQuestionCounts] = useState<Record<RegulatoryFramework, number>>({
    'ISO_13485': 0,
    'CFR_820': 0,
    'MDR': 0,
    'ISO_14155': 0
  });

  useEffect(() => {
    setQuestionCounts(getQuestionCountByFramework());
  }, []);

  const handleFrameworkToggle = (framework: RegulatoryFramework, checked: boolean) => {
    const newSelection = checked 
      ? [...filterOptions.selectedFrameworks, framework]
      : filterOptions.selectedFrameworks.filter(f => f !== framework);
    
    onFilterChange({
      ...filterOptions,
      selectedFrameworks: newSelection
    });
  };

  const handleSelectAll = () => {
    const allFrameworks: RegulatoryFramework[] = ['ISO_13485', 'CFR_820', 'MDR', 'ISO_14155'];
    onFilterChange({
      ...filterOptions,
      selectedFrameworks: allFrameworks
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      ...filterOptions,
      selectedFrameworks: []
    });
  };

  const handleIncludeAllToggle = (checked: boolean) => {
    onFilterChange({
      ...filterOptions,
      includeAllFrameworks: checked
    });
  };

  const totalSelectedQuestions = filterOptions.includeAllFrameworks 
    ? Object.values(questionCounts).reduce((sum, count) => sum + count, 0) / 4 * 3 // Approximate total unique questions
    : filterOptions.selectedFrameworks.reduce((sum, framework) => {
        return sum + questionCounts[framework];
      }, 0);

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter size={20} />
          Focus Assessment on Specific Frameworks
        </CardTitle>
        <CardDescription>
          Select regulatory frameworks to customize your assessment. Questions will be filtered to show only 
          requirements relevant to your selected frameworks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Include All Frameworks Option */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="include-all" className="text-base font-medium">
              Include All Frameworks
            </Label>
            <p className="text-sm text-muted-foreground">
              Complete comprehensive assessment covering all regulatory requirements
            </p>
          </div>
          <Switch
            id="include-all"
            checked={filterOptions.includeAllFrameworks}
            onCheckedChange={handleIncludeAllToggle}
          />
        </div>

        {!filterOptions.includeAllFrameworks && (
          <>
            {/* Framework Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Select Frameworks</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-3">
                {Object.entries(frameworkLabels).map(([key, label]) => {
                  const framework = key as RegulatoryFramework;
                  const isChecked = filterOptions.selectedFrameworks.includes(framework);
                  
                  return (
                    <div key={framework} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={framework}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleFrameworkToggle(framework, checked as boolean)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <Label 
                            htmlFor={framework} 
                            className="text-sm font-medium cursor-pointer"
                          >
                            {label}
                          </Label>
                          <Badge variant="secondary" className="text-xs">
                            {questionCounts[framework]} questions
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {frameworkDescriptions[framework]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Assessment Preview</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {filterOptions.selectedFrameworks.length === 0 ? (
                  <Badge variant="outline">No frameworks selected</Badge>
                ) : (
                  filterOptions.selectedFrameworks.map(framework => (
                    <Badge key={framework} variant="default">
                      {frameworkLabels[framework]}
                    </Badge>
                  ))
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {filterOptions.selectedFrameworks.length === 0 
                  ? 'Please select at least one framework to continue.'
                  : `Your customized assessment will include approximately ${Math.round(totalSelectedQuestions)} questions focused on your selected regulatory requirements.`
                }
              </p>
            </div>
          </>
        )}

        {filterOptions.includeAllFrameworks && (
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Comprehensive Assessment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You'll complete the full 40-question assessment covering all major regulatory frameworks 
              including ISO 13485, 21 CFR 820, EU MDR, and ISO 14155.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}