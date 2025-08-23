import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TeamSession, TeamMember, TeamRole, FilterOptions, RegulatoryFramework, DeviceCategory } from '@/lib/types';
import { Plus, Users, Settings, CheckCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TeamSetupProps {
  session?: TeamSession;
  currentMember?: TeamMember;
  filterOptions?: FilterOptions;
  onCreateSession?: (session: Omit<TeamSession, 'id' | 'createdAt' | 'status'>) => void;
  onPhaseComplete?: (session: TeamSession) => void;
}

const TEAM_ROLES: { value: TeamRole; label: string; description: string; expertise: string[] }[] = [
  {
    value: 'quality_manager',
    label: 'Quality Manager',
    description: 'Oversees quality systems and compliance',
    expertise: ['Quality Systems', 'CAPA', 'Management Review', 'Supplier Control']
  },
  {
    value: 'regulatory_affairs',
    label: 'Regulatory Affairs',
    description: 'Ensures regulatory compliance and submissions',
    expertise: ['Regulatory Strategy', 'Submissions', 'Post-Market Surveillance', 'Global Regulations']
  },
  {
    value: 'design_engineer',
    label: 'Design Engineer',
    description: 'Responsible for design controls and validation',
    expertise: ['Design Controls', 'Risk Management', 'Design Validation', 'Change Control']
  },
  {
    value: 'manufacturing_lead',
    label: 'Manufacturing Lead',
    description: 'Manages production and process controls',
    expertise: ['Production Controls', 'Process Validation', 'Equipment Maintenance', 'Batch Records']
  },
  {
    value: 'clinical_specialist',
    label: 'Clinical Specialist',
    description: 'Handles clinical data and post-market activities',
    expertise: ['Clinical Evaluation', 'Post-Market Data', 'Adverse Event Reporting', 'Clinical Studies']
  }
];

export function TeamSetup({ 
  session, 
  currentMember, 
  filterOptions, 
  onCreateSession, 
  onPhaseComplete 
}: TeamSetupProps) {
  const [sessionName, setSessionName] = useState(session?.name || '');
  const [selectedFrameworks, setSelectedFrameworks] = useState<RegulatoryFramework[]>(
    session?.selectedFrameworks || filterOptions?.selectedFrameworks || ['ISO_13485', 'CFR_820']
  );
  const [deviceCategory, setDeviceCategory] = useState<DeviceCategory>(
    session?.riskClassification?.deviceCategory || 'diagnostic'
  );
  const [sessionSettings, setSessionSettings] = useState(session?.settings || {
    allowRoleDiscussion: true,
    requireConsensus: true,
    showIndividualScores: false,
    enablePeerReview: true,
    discussionTimeLimit: 10,
    votingMethod: 'majority' as const,
    anonymousVoting: false
  });
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'quality_manager' as TeamRole,
    department: ''
  });

  const handleCreateSession = () => {
    if (!sessionName.trim()) {
      toast.error('Please enter a session name');
      return;
    }

    const sessionData = {
      name: sessionName,
      createdBy: 'current_user', // In real app, would get from auth
      members: [],
      selectedFrameworks,
      riskClassification: {
        deviceCategory,
        fdaClass: 'Class II' as const,
        riskLevel: 'Medium' as const
      },
      currentPhase: 'role_assignment' as const,
      settings: sessionSettings
    };

    onCreateSession?.(sessionData);
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      toast.error('Please enter member name');
      return;
    }

    if (session && onPhaseComplete) {
      const member: TeamMember = {
        id: `member_${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        department: newMember.department,
        joinedAt: new Date(),
        isLeader: session.members.length === 0
      };

      const updatedSession = {
        ...session,
        members: [...session.members, member]
      };

      onPhaseComplete(updatedSession);
      setNewMember({ name: '', role: 'quality_manager', department: '' });
      toast.success('Member added to session');
    }
  };

  const handleStartAssessment = () => {
    if (!session || !onPhaseComplete) return;

    if (session.members.length < 2) {
      toast.error('At least 2 members are required for team training');
      return;
    }

    const updatedSession = {
      ...session,
      status: 'in_progress' as const,
      currentPhase: 'individual_assessment' as const
    };

    onPhaseComplete(updatedSession);
  };

  if (session && currentMember) {
    // Session management view for existing sessions
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members & Roles</CardTitle>
            <CardDescription>
              Assign roles and prepare for collaborative assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.members.map(member => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.department}</div>
                    </div>
                    {member.isLeader && (
                      <Badge variant="secondary">Leader</Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="w-full">
                    {TEAM_ROLES.find(r => r.value === member.role)?.label || member.role}
                  </Badge>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Joined {member.joinedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}

              {/* Add new member card */}
              <div className="border rounded-lg p-4 border-dashed">
                <div className="space-y-3">
                  <Input
                    placeholder="Member name"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value as TeamRole }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_ROLES.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Department"
                    value={newMember.department}
                    onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                  />
                  <Button size="sm" onClick={handleAddMember} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </div>
            </div>

            {session.members.length >= 2 && (
              <div className="pt-4 border-t">
                <Button onClick={handleStartAssessment} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Team Assessment ({session.members.length} members)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role expertise guide */}
        <Card>
          <CardHeader>
            <CardTitle>Role Expertise Guide</CardTitle>
            <CardDescription>
              Understanding each role's areas of focus for the assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TEAM_ROLES.map(role => (
                <div key={role.value} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{role.label}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    {session.members.some(m => m.role === role.value) && (
                      <Badge variant="secondary">Assigned</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.expertise.map(area => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create new session view
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Team Training Session</CardTitle>
        <CardDescription>
          Set up a collaborative audit readiness assessment with multiple participants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sessionName">Session Name</Label>
            <Input
              id="sessionName"
              placeholder="e.g., Q3 Audit Readiness Training"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>

          <div>
            <Label>Regulatory Frameworks</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(['ISO_13485', 'CFR_820', 'MDR', 'ISO_14155'] as RegulatoryFramework[]).map(framework => (
                <div key={framework} className="flex items-center space-x-2">
                  <Switch
                    checked={selectedFrameworks.includes(framework)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFrameworks(prev => [...prev, framework]);
                      } else {
                        setSelectedFrameworks(prev => prev.filter(f => f !== framework));
                      }
                    }}
                  />
                  <Label className="text-sm">{framework.replace('_', ' ')}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Device Category</Label>
            <Select value={deviceCategory} onValueChange={(value) => setDeviceCategory(value as DeviceCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diagnostic">Diagnostic</SelectItem>
                <SelectItem value="surgical">Surgical</SelectItem>
                <SelectItem value="therapeutic">Therapeutic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Session Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Allow role-based discussion</Label>
              <Switch
                checked={sessionSettings.allowRoleDiscussion}
                onCheckedChange={(checked) => 
                  setSessionSettings(prev => ({ ...prev, allowRoleDiscussion: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Require consensus for final answers</Label>
              <Switch
                checked={sessionSettings.requireConsensus}
                onCheckedChange={(checked) => 
                  setSessionSettings(prev => ({ ...prev, requireConsensus: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show individual scores to team</Label>
              <Switch
                checked={sessionSettings.showIndividualScores}
                onCheckedChange={(checked) => 
                  setSessionSettings(prev => ({ ...prev, showIndividualScores: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable peer review</Label>
              <Switch
                checked={sessionSettings.enablePeerReview}
                onCheckedChange={(checked) => 
                  setSessionSettings(prev => ({ ...prev, enablePeerReview: checked }))
                }
              />
            </div>
          </div>
        </div>

        <Button onClick={handleCreateSession} className="w-full">
          <Users className="w-4 h-4 mr-2" />
          Create Team Session
        </Button>
      </CardContent>
    </Card>
  );
}