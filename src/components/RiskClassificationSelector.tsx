import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info } from '@phosphor-icons/react';
import { RiskClassification, DeviceCategory } from '@/lib/types';
import { determineRiskClassification, getRiskSpecificRecommendations } from '@/lib/data';

interface RiskClassificationSelectorProps {
  value?: RiskClassification;
  onChange: (classification: RiskClassification) => void;
}

export function RiskClassificationSelector({ value, onChange }: RiskClassificationSelectorProps) {
  const [fdaClass, setFdaClass] = useState<'Class I' | 'Class II' | 'Class III' | undefined>(
    value?.fdaClass
  );
  const [euClass, setEuClass] = useState<'Class I' | 'Class IIa' | 'Class IIb' | 'Class III' | undefined>(
    value?.euClass
  );
  const [deviceCategory, setDeviceCategory] = useState<DeviceCategory | undefined>(
    value?.deviceCategory
  );
  const [isSterile, setIsSterile] = useState(value?.isSterile || false);
  const [isMeasuring, setIsMeasuring] = useState(value?.isMeasuring || false);
  const [hasActiveComponents, setHasActiveComponents] = useState(value?.hasActiveComponents || false);
  const [isDrugDevice, setIsDrugDevice] = useState(value?.isDrugDevice || false);

  const updateClassification = (updates: Partial<RiskClassification>) => {
    const newFdaClass = updates.fdaClass !== undefined ? updates.fdaClass : fdaClass;
    const newEuClass = updates.euClass !== undefined ? updates.euClass : euClass;
    const newDeviceCategory = updates.deviceCategory !== undefined ? updates.deviceCategory : deviceCategory;
    const newIsSterile = updates.isSterile !== undefined ? updates.isSterile : isSterile;
    const newIsMeasuring = updates.isMeasuring !== undefined ? updates.isMeasuring : isMeasuring;
    const newHasActiveComponents = updates.hasActiveComponents !== undefined ? updates.hasActiveComponents : hasActiveComponents;
    const newIsDrugDevice = updates.isDrugDevice !== undefined ? updates.isDrugDevice : isDrugDevice;

    const classification = determineRiskClassification(
      newFdaClass,
      newEuClass,
      newIsSterile,
      newIsMeasuring,
      newHasActiveComponents,
      newIsDrugDevice,
      newDeviceCategory
    );

    onChange(classification);
  };

  const handleFdaClassChange = (newClass: string) => {
    const fdaClass = newClass === 'none' ? undefined : (newClass as 'Class I' | 'Class II' | 'Class III');
    setFdaClass(fdaClass);
    updateClassification({ fdaClass });
  };

  const handleEuClassChange = (newClass: string) => {
    const euClass = newClass === 'none' ? undefined : (newClass as 'Class I' | 'Class IIa' | 'Class IIb' | 'Class III');
    setEuClass(euClass);
    updateClassification({ euClass });
  };

  const handleDeviceCategoryChange = (category: string) => {
    const deviceCategory = category === 'none' ? undefined : (category as DeviceCategory);
    setDeviceCategory(deviceCategory);
    updateClassification({ deviceCategory });
  };

  const handleSterileChange = (checked: boolean) => {
    setIsSterile(checked);
    updateClassification({ isSterile: checked });
  };

  const handleMeasuringChange = (checked: boolean) => {
    setIsMeasuring(checked);
    updateClassification({ isMeasuring: checked });
  };

  const handleActiveComponentsChange = (checked: boolean) => {
    setHasActiveComponents(checked);
    updateClassification({ hasActiveComponents: checked });
  };

  const handleDrugDeviceChange = (checked: boolean) => {
    setIsDrugDevice(checked);
    updateClassification({ isDrugDevice: checked });
  };

  const currentClassification = determineRiskClassification(
    fdaClass,
    euClass,
    isSterile,
    isMeasuring,
    hasActiveComponents,
    isDrugDevice,
    deviceCategory
  );

  const recommendations = getRiskSpecificRecommendations(currentClassification);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'destructive';
      case 'High': return 'warning';
      case 'Medium': return 'secondary';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Device Risk Classification
        </CardTitle>
        <CardDescription>
          Customize scoring weights based on your medical device's risk profile. Higher risk devices receive increased emphasis on critical compliance areas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-category">Device Category</Label>
              <Select value={deviceCategory || 'none'} onValueChange={handleDeviceCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  <SelectItem value="surgical">Surgical</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="therapeutic">Therapeutic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fda-class">FDA Classification (US)</Label>
              <Select value={fdaClass || 'none'} onValueChange={handleFdaClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select FDA class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not applicable</SelectItem>
                  <SelectItem value="Class I">Class I - Low Risk</SelectItem>
                  <SelectItem value="Class II">Class II - Moderate Risk</SelectItem>
                  <SelectItem value="Class III">Class III - High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eu-class">EU Classification (MDR)</Label>
              <Select value={euClass || 'none'} onValueChange={handleEuClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select EU class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not applicable</SelectItem>
                  <SelectItem value="Class I">Class I - Low Risk</SelectItem>
                  <SelectItem value="Class IIa">Class IIa - Low-Medium Risk</SelectItem>
                  <SelectItem value="Class IIb">Class IIb - Medium-High Risk</SelectItem>
                  <SelectItem value="Class III">Class III - High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is-sterile">Sterile device</Label>
              <Switch
                id="is-sterile"
                checked={isSterile}
                onCheckedChange={handleSterileChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-measuring">Measuring function</Label>
              <Switch
                id="is-measuring"
                checked={isMeasuring}
                onCheckedChange={handleMeasuringChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="has-active">Active components</Label>
              <Switch
                id="has-active"
                checked={hasActiveComponents}
                onCheckedChange={handleActiveComponentsChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-drug-device">Drug-device combination</Label>
              <Switch
                id="is-drug-device"
                checked={isDrugDevice}
                onCheckedChange={handleDrugDeviceChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Device Category Impact</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                {deviceCategory === 'surgical' && (
                  <div>
                    <span className="font-medium text-foreground">Surgical Devices:</span>
                    <p>Enhanced focus on sterility, biocompatibility, and user training requirements.</p>
                  </div>
                )}
                {deviceCategory === 'diagnostic' && (
                  <div>
                    <span className="font-medium text-foreground">Diagnostic Devices:</span>
                    <p>Emphasis on analytical performance, clinical validation, and quality control.</p>
                  </div>
                )}
                {deviceCategory === 'therapeutic' && (
                  <div>
                    <span className="font-medium text-foreground">Therapeutic Devices:</span>
                    <p>Focus on clinical evidence, risk-benefit analysis, and post-market surveillance.</p>
                  </div>
                )}
                {!deviceCategory && (
                  <div>
                    <span className="font-medium text-foreground">No category selected:</span>
                    <p>Using standard weighting across all compliance areas.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Overall Risk Level:</span>
              <Badge variant={getRiskLevelColor(currentClassification.riskLevel) as any}>
                {currentClassification.riskLevel}
              </Badge>
            </div>
            {deviceCategory && (
              <div className="flex items-center gap-3">
                <span className="font-medium">Device Category:</span>
                <Badge variant="outline" className="capitalize">
                  {deviceCategory}
                </Badge>
              </div>
            )}
          </div>

          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Risk-Specific Recommendations:</h4>
              <ul className="text-sm space-y-1">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}