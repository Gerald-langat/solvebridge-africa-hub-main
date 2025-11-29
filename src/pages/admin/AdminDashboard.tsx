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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    validatedProblems: 0,
    activeCollaborations: 0,
    mvpsInProgress: 0,
    totalUsers: 0,
    pendingModeration: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Control Center</h1>
              <p className="text-muted-foreground">Manage platform operations and KPIs</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/admin/moderation">Review Problems</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/impact">View Analytics</Link>
              </Button>
            </div>
          </div>

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
