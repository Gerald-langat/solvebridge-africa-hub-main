import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, TrendingUp, Users, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/mode-toggle";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    submittedProblems: 0,
    validatedProblems: 0,
    collaborations: 0,
    impactScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoaded(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    setProfile(data);
    setLoaded(false);
  };


  const fetchStats = async () => {
    const { data: problems } = await supabase
      .from("problems")
      .select("*")
      .eq("submitter_id", user?.id);

    const { data: collaborations } = await supabase
      .from("collaborations")
      .select("*")
      .eq("user_id", user?.id);

    const validated = problems?.filter(p => p.status === "validated").length || 0;
    const impactScore = (validated * 10) + ((collaborations?.length || 0) * 5);

    setStats({
      submittedProblems: problems?.length || 0,
      validatedProblems: validated,
      collaborations: collaborations?.length || 0,
      impactScore,
    });
  };

  const fetchRecentActivity = async () => {
    if (!user) return;

    const { data: problems } = await supabase
      .from("problems")
      .select("id, title, created_at, status")
      .eq("submitter_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (problems) {
      setRecentActivity(problems);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      validated: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Welcome Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome, {loaded ? "..." : profile?.first_name} 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's your progress so far
            </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-medium transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <TrendingUp className="text-primary" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.submittedProblems}</div>
              <div className="text-sm text-muted-foreground">Problems Submitted</div>
            </Card>

            <Card className="p-6 hover:shadow-medium transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Users className="text-accent" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.collaborations}</div>
              <div className="text-sm text-muted-foreground">Collaborations</div>
            </Card>

            <Card className="p-6 hover:shadow-medium transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary-light/10 p-3 rounded-lg">
                  <Award className="text-primary-light" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.impactScore}</div>
              <div className="text-sm text-muted-foreground">Impact Score</div>
            </Card>

            <Card className="p-6 hover:shadow-medium transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Users className="text-secondary" size={24} />
                </div>
              </div>
              <div className="2xl:text-3xl font-bold mb-1">{loaded ? "..." : profile?.role}</div>
              <div className="text-sm text-muted-foreground">Your Role</div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="flex-1">
                <Link to="/submit-problem">
                  <PlusCircle className="mr-2" size={20} />
                  Submit a Problem
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="flex-1">
                <Link to="/dashboard/explore">
                  <Search className="mr-2" size={20} />
                  Explore Challenges
                </Link>
              </Button>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto mb-3 text-muted-foreground" size={48} />
                <p>No activity yet. Start by submitting your first problem!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item, index) => (
                  <div
                    key={item.id}
                    
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted {formatDate(item.created_at)}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
