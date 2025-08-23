import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Users, AlertTriangle } from '@phosphor-icons/react';

interface HomePageProps {
  onStartAssessment: () => void;
}

export function HomePage({ onStartAssessment }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Medical Device Audit Readiness Assessment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evaluate your ISO 13485 and 21 CFR 820 compliance readiness with our comprehensive assessment tool
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Comprehensive Assessment</CardTitle>
              <CardDescription>
                20 structured questions covering key regulatory requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Quality Management System</li>
                <li>• Design Controls</li>
                <li>• CAPA System</li>
                <li>• Risk Management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Intelligent Scoring</CardTitle>
              <CardDescription>
                Weighted assessment with critical gap detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 0-100 readiness score</li>
                <li>• RAG status classification</li>
                <li>• Critical gap identification</li>
                <li>• Priority gap ranking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Professional Deliverables</CardTitle>
              <CardDescription>
                Export-ready audit preparation materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gap analysis report</li>
                <li>• CAPA plan template</li>
                <li>• Interview preparation script</li>
                <li>• Export ZIP package</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ready to Start?</CardTitle>
              <CardDescription>
                Complete the assessment in approximately 15-20 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onStartAssessment} size="lg" className="w-full">
                Begin Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold mb-2 text-foreground">Important Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This assessment tool is for educational and planning purposes only. It does not constitute 
              legal or regulatory advice. Results should not be considered as definitive compliance 
              statements. Always consult with qualified regulatory professionals for authoritative 
              guidance on medical device compliance requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}