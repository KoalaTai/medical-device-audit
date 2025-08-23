import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeamSession, TeamMember, FilterOptions, TrainingPhase, TeamRole } from '@/lib/types';
import { TeamSetup } from './team/TeamSetup';
import { TeamQuestionnaire } from './team/TeamQuestionnaire';
import { TeamDiscussion } from './team/TeamDiscussion';
import { TeamResults } from './team/TeamResults';
import { Users, Clock, CheckCircle, AlertCircle, ArrowLeft, Settings } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TeamTrainingPageProps {
  filterOptions?: FilterOptions;
  onBack: () => void;
}

export function TeamTrainingPage({ filterOptions, onBack }: TeamTrainingPageProps) {
  const [sessions, setSessions] = useKV<TeamSession[]>('team_sessions', []);
  const [currentSession, setCurrentSession] = useKV<TeamSession | null>('current_team_session', null);
  const [currentMemberId, setCurrentMemberId] = useKV<string>('current_member_id', '');

  const handleCreateSession = (sessionData: Omit<TeamSession, 'id' | 'createdAt' | 'status'>) => {
    const newSession: TeamSession = {
      ...sessionData,
      id: `session_${Date.now()}`,
      createdAt: new Date(),
      status: 'setup',
      currentPhase: 'role_assignment'
    };

    setSessions(current => [...current, newSession]);
    setCurrentSession(() => newSession);
    toast.success('Team training session created');
  };

  const handleJoinSession = (session: TeamSession, member: TeamMember) => {
    const updatedSession: TeamSession = {
      ...session,
      members: [...session.members, member]
    };

    setSessions(current =>
      current.map(s => s.id === session.id ? updatedSession : s)
    );
    setCurrentSession(() => updatedSession);
    setCurrentMemberId(() => member.id);
    toast.success(`Joined session as ${member.name} (${member.role})`);
  };

  const handlePhaseComplete = (updatedSession: TeamSession) => {
    setSessions(current =>
      current.map(s => s.id === updatedSession.id ? updatedSession : s)
    );
    setCurrentSession(() => updatedSession);
  };

  const handleLeaveSession = () => {
    setCurrentSession(() => null);
    setCurrentMemberId(() => '');
  };

  const getPhaseProgress = (phase: TrainingPhase): number => {
    const phases: TrainingPhase[] = ['role_assignment', 'individual_assessment', 'team_discussion', 'consensus_building', 'results_review'];
    const currentIndex = phases.indexOf(phase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const getPhaseTitle = (phase: TrainingPhase): string => {
    const titles: Record<TrainingPhase, string> = {
      'role_assignment': 'Role Assignment',
      'individual_assessment': 'Individual Assessment',
      'team_discussion': 'Team Discussion',
      'consensus_building': 'Consensus Building',
      'results_review': 'Results & Analysis'
    };
    return titles[phase];
  };

  const currentMember = currentSession?.members.find(m => m.id === currentMemberId);

  if (currentSession && currentMember) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Session Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="sm" onClick={handleLeaveSession}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Leave Session
                </Button>
                <Badge variant="secondary">
                  {currentMember.name} • {currentMember.role.replace('_', ' ')}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground">{currentSession.name}</h1>
              <p className="text-muted-foreground">
                Phase: {getPhaseTitle(currentSession.currentPhase)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentSession.members.length} members</span>
              </div>
              <Progress 
                value={getPhaseProgress(currentSession.currentPhase)} 
                className="w-48"
              />
            </div>
          </div>

          {/* Phase Content */}
          {currentSession.currentPhase === 'role_assignment' && (
            <TeamSetup
              session={currentSession}
              currentMember={currentMember}
              onPhaseComplete={handlePhaseComplete}
            />
          )}

          {currentSession.currentPhase === 'individual_assessment' && (
            <TeamQuestionnaire
              session={currentSession}
              currentMember={currentMember}
              onPhaseComplete={handlePhaseComplete}
            />
          )}

          {(currentSession.currentPhase === 'team_discussion' || 
            currentSession.currentPhase === 'consensus_building') && (
            <TeamDiscussion
              session={currentSession}
              currentMember={currentMember}
              onPhaseComplete={handlePhaseComplete}
            />
          )}

          {currentSession.currentPhase === 'results_review' && (
            <TeamResults
              session={currentSession}
              currentMember={currentMember}
              onBack={handleLeaveSession}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" className="mb-4" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Team Training Mode</h1>
            <p className="text-muted-foreground mt-2">
              Collaborative audit readiness assessment with role-based perspectives and team scoring
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{sessions.length}</div>
            <div className="text-sm text-muted-foreground">Active Sessions</div>
          </div>
        </div>

        <Tabs defaultValue="join" className="space-y-6">
          <TabsList>
            <TabsTrigger value="join">Join Session</TabsTrigger>
            <TabsTrigger value="create">Create New Session</TabsTrigger>
            <TabsTrigger value="manage">Manage Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="join" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Training Sessions</CardTitle>
                <CardDescription>
                  Join an existing team training session and select your role
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.filter(s => s.status === 'setup' || s.status === 'in_progress').length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active sessions available</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create a new session to get started with team training
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === 'setup' || s.status === 'in_progress')
                      .map(session => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          onJoin={handleJoinSession}
                        />
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <TeamSetup
              filterOptions={filterOptions}
              onCreateSession={handleCreateSession}
            />
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  View and manage all training sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No sessions created yet</p>
                    </div>
                  ) : (
                    sessions.map(session => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{session.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created {session.createdAt.toLocaleDateString()} • 
                              {session.members.length} members • 
                              Phase: {getPhaseTitle(session.currentPhase)}
                            </p>
                          </div>
                          <Badge variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'in_progress' ? 'secondary' :
                            session.status === 'archived' ? 'outline' : 'secondary'
                          }>
                            {session.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: TeamSession;
  onJoin: (session: TeamSession, member: TeamMember) => void;
}

function SessionCard({ session, onJoin }: SessionCardProps) {
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const handleJoinClick = () => {
    setShowJoinDialog(true);
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{session.name}</h3>
        <div className="flex items-center gap-2">
          <Badge variant={session.status === 'setup' ? 'secondary' : 'default'}>
            {session.status.replace('_', ' ')}
          </Badge>
          {session.currentPhase === 'role_assignment' && (
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              Waiting for players
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {session.members.length} members
        </div>
        <div>Phase: {getPhaseTitle(session.currentPhase)}</div>
        <div>Created {session.createdAt.toLocaleDateString()}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {session.members.slice(0, 3).map(member => (
            <div
              key={member.id}
              className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-background"
              title={`${member.name} (${member.role.replace('_', ' ')})`}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {session.members.length > 3 && (
            <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs border-2 border-background">
              +{session.members.length - 3}
            </div>
          )}
        </div>
        
        <Button size="sm" onClick={handleJoinClick}>
          Join Session
        </Button>
      </div>

      {showJoinDialog && (
        <JoinSessionDialog
          session={session}
          onJoin={onJoin}
          onCancel={() => setShowJoinDialog(false)}
        />
      )}
    </div>
  );
}

interface JoinSessionDialogProps {
  session: TeamSession;
  onJoin: (session: TeamSession, member: TeamMember) => void;
  onCancel: () => void;
}

interface JoinSessionDialogProps {
  session: TeamSession;
  onJoin: (session: TeamSession, member: TeamMember) => void;
  onCancel: () => void;
}

function JoinSessionDialog({ session, onJoin, onCancel }: JoinSessionDialogProps) {
  const [memberName, setMemberName] = useState('');
  const [selectedRole, setSelectedRole] = useState<TeamRole>('quality_manager');
  const [department, setDepartment] = useState('');

  const availableRoles = [
    'quality_manager',
    'regulatory_affairs', 
    'design_engineer',
    'manufacturing_lead',
    'clinical_specialist'
  ] as TeamRole[];

  const handleJoin = () => {
    if (!memberName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const member: TeamMember = {
      id: `member_${Date.now()}`,
      name: memberName.trim(),
      role: selectedRole,
      department: department.trim() || 'Not specified',
      joinedAt: new Date(),
      isLeader: false
    };

    onJoin(session, member);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Training Session</CardTitle>
          <CardDescription>
            Enter your details to join "{session.name}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="memberName">Your Name</Label>
            <Input
              id="memberName"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="role">Your Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as TeamRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Quality, Engineering, Regulatory"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleJoin} className="flex-1">
              Join Session
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}