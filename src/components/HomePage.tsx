import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Warning, FileText, Shield } from '@phosphor-icons/react';

interface HomePageProps {
  onStartAssessment: () => void;
}

export function HomePage({ onStartAssessment }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Shield size={48} className="text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Medical Device Audit Readiness Assessment
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Evaluate your organization's compliance readiness and identify critical gaps 
          before your next regulatory audit.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={24} className="text-success" />
              Comprehensive Assessment
            </CardTitle>
            <CardDescription>
              40 carefully crafted questions covering ISO 13485, 21 CFR 820, MDR, and ISO 14155 requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Design controls and risk management</li>
              <li>• Process validation and CAPA systems</li>
              <li>• Post-market surveillance and clinical follow-up</li>
              <li>• MDR compliance and UDI implementation</li>
              <li>• Clinical investigation protocols (ISO 14155)</li>
              <li>• Documentation and record keeping</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={24} className="text-primary" />
              Actionable Deliverables
            </CardTitle>
            <CardDescription>
              Professional reports to guide your audit preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Prioritized gap analysis with regulatory references</li>
              <li>• Structured CAPA plan with root cause analysis</li>
              <li>• Role-based audit interview preparation scripts</li>
              <li>• Complete assessment data export package</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assessment Process</CardTitle>
          <CardDescription>
            Complete the evaluation in approximately 20-25 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Answer Questions</h3>
              <p className="text-sm text-muted-foreground">
                Respond to 40 regulatory compliance questions based on your current practices
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Review Score</h3>
              <p className="text-sm text-muted-foreground">
                Get your readiness score with Red/Amber/Green risk assessment and gap analysis
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Export Reports</h3>
              <p className="text-sm text-muted-foreground">
                Download professional documentation package for your audit preparation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-warning/50 bg-warning/5 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning-foreground">
            <Warning size={24} className="text-warning" />
            Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-warning-foreground space-y-2">
          <p>
            This assessment tool is designed for <strong>educational purposes only</strong> and provides 
            general guidance on regulatory compliance readiness.
          </p>
          <p>
            <strong>This is not legal or regulatory advice.</strong> Results should not be considered 
            a substitute for professional regulatory consultation or formal compliance assessment by 
            qualified experts.
          </p>
          <p>
            Always consult with regulatory professionals and legal counsel for specific compliance 
            requirements applicable to your organization and products.
          </p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onStartAssessment} size="lg" className="px-8 py-3 text-lg">
          Begin Assessment
        </Button>
        <div className="mt-4 flex justify-center gap-4">
          <Badge variant="outline">ISO 13485</Badge>
          <Badge variant="outline">21 CFR 820</Badge>
          <Badge variant="outline">MDR</Badge>
          <Badge variant="outline">ISO 14155</Badge>
          <Badge variant="outline">20-25 minutes</Badge>
        </div>
      </div>
    </div>
  );
}