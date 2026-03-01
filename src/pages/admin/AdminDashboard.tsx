import { useEffect, useState } from "react";
import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, CheckCircle, Users, Lightbulb, DollarSign, AlertCircle,
  TrendingUp, Clock, UserPlus, FileCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type UserRole = 'contributor' | 'moderator' | 'admin' | 'super_admin' | 'program_manager';


export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalSubmissions: 0,
    validatedProblems: 0,
    activeCollaborations: 0,
    mvpsInProgress: 0,
    totalUsers: 0,
    pendingModeration: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  // Create user states
  const [role, setRole] = useState<UserRole>("contributor");
    const [users, setUsers] = useState<any[]>([]);
 const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    const [problems, users, collaborations, projects, pending] = await Promise.all([
      supabase.from('problems').select('id, status'),
      supabase.from('profiles').select('id'),
      supabase.from('collaborations').select('id'),
      supabase.from('projects').select('id'),
      supabase.from('problems').select('id').eq('status', 'pending')
    ]);

    setStats({
      totalSubmissions: problems.data?.length || 0,
      validatedProblems: problems.data?.filter(p => p.status === 'validated').length || 0,
      activeCollaborations: collaborations.data?.length || 0,
      mvpsInProgress: projects.data?.length || 0,
      totalUsers: users.data?.length || 0,
      pendingModeration: pending.data?.length || 0
    });
  };

  const fetchRecentActivity = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    setRecentActivity(data || []);
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) return console.log(error);
    setUsers(data || []);
  };

  const logAudit = async ({
  action,
  entityType,
  entityId,
  metadata = {},
}) => {
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
};

console.log("Selected user for promotion:", selectedUser);

  // Create User logic
const handlePromote = async () => {
  if (!selectedUser) return toast({ title: "Error", description: "Select a user", variant: "destructive" });

  // Only super admins can promote to super_admin
  if (role === "super_admin") {
    return toast({ title: "Error", description: "Only super admins can promote to Super Admin", variant: "destructive" });
  }

  try {
    const { data: existingRole, error: fetchError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", selectedUser)
      .maybeSingle(); // safer than single()

    if (fetchError) throw fetchError;

    if (existingRole) {
      // ✅ UPDATE existing role
      const { data, error } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("user_id", selectedUser)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("You are not allowed to change this role");
      }
    }

    // 🔥 Log audit
    await logAudit({
      action: `Updated user role to ${role}`,
      entityType: "user_roles",
      entityId: selectedUser,
      metadata: { new_role: role },
    });

    toast({ title: "Success", description: `User role updated to ${role}` });
    setIsCreateUserOpen(false);
  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  }
};



  const statCards = [
    { label: "Total Submissions", value: stats.totalSubmissions, icon: FileText, color: "text-blue-600" },
    { label: "Validated Problems", value: stats.validatedProblems, icon: CheckCircle, color: "text-green-600" },
    { label: "Active Collaborations", value: stats.activeCollaborations, icon: Users, color: "text-purple-600" },
    { label: "MVPs in Progress", value: stats.mvpsInProgress, icon: Lightbulb, color: "text-amber-600" },
    { label: "Total Users", value: stats.totalUsers, icon: UserPlus, color: "text-teal-600" },
    { label: "Pending Moderation", value: stats.pendingModeration, icon: AlertCircle, color: "text-red-600" },
  ];

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Control Center</h1>
              <p className="text-muted-foreground">Manage platform operations and KPIs</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCreateUserOpen(true)}>
                Promote User
              </Button>

              <Button asChild>
                <Link to="/admin/moderation">Review Problems</Link>
              </Button>

              <Button asChild>
                <Link to="/admin/impact">View Analytics</Link>
              </Button>
            </div>
          </div>

          {/* Create User Modal */}
          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>
                  Create a new user Role (super_admin, moderator, program_manager)
                </DialogDescription>
              </DialogHeader>

            <div>
      <Label>Select User</Label>
      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger>
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.first_name} {u.last_name} ({u.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label className="mt-4">Select Role</Label>
      <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="super_admin">Super Admin</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="program_manager">Program Manager</SelectItem>
        </SelectContent>
      </Select>

    </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Cancel
                </Button>
                      <Button onClick={handlePromote}>Promote User</Button>

              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/moderation">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Validate Problems
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/bounties">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Create Bounty
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/partners">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Partner
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/impact">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Export Report
                </Link>
              </Button>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recent activity to display
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* System Health */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm text-green-800 dark:text-green-200">Platform Status</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Operational</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm text-blue-800 dark:text-blue-200">Queued Items</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pendingModeration}</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
                <p className="text-sm text-amber-800 dark:text-amber-200">Avg Response Time</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">2.4h</p>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}
