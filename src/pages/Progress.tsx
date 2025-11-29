import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Progress() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [problemStats, setProblemStats] = useState({ validated: 0, pending: 0, declined: 0 });

  useEffect(() => {
    if (user) {
      fetchMilestones();
      fetchGoals();
      fetchProblemStats();
    }
  }, [user]);

  const fetchMilestones = async () => {
    const { data } = await supabase
      .from("milestones")
      .select("*")
      .eq("user_id", user?.id)
      .order("achieved_at", { ascending: false });
    setMilestones(data || []);
  };

  const fetchGoals = async () => {
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    setGoals(data || []);
  };

  const fetchProblemStats = async () => {
    const { data } = await supabase
      .from("problems")
      .select("status")
      .eq("submitter_id", user?.id);

    const validated = data?.filter(p => p.status === "validated").length || 0;
    const pending = data?.filter(p => p.status === "pending").length || 0;
    const declined = data?.filter(p => p.status === "declined").length || 0;

    setProblemStats({ validated, pending, declined });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground mt-2">
              Visualize your innovation activity and growth
            </p>
          </div>

          {/* Problem Validation Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Validation Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Validated</span>
                  <Badge variant="default">{problemStats.validated}</Badge>
                </div>
                <ProgressBar
                  value={(problemStats.validated / (problemStats.validated + problemStats.pending + problemStats.declined || 1)) * 100}
                  className="h-3"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Pending</span>
                  <Badge variant="secondary">{problemStats.pending}</Badge>
                </div>
                <ProgressBar
                  value={(problemStats.pending / (problemStats.validated + problemStats.pending + problemStats.declined || 1)) * 100}
                  className="h-3"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Declined</span>
                  <Badge variant="destructive">{problemStats.declined}</Badge>
                </div>
                <ProgressBar
                  value={(problemStats.declined / (problemStats.validated + problemStats.pending + problemStats.declined || 1)) * 100}
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {goals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No goals set yet. Create your first goal to start tracking!
                </p>
              ) : (
                goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{goal.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {goal.current_value} / {goal.target_value}
                      </span>
                    </div>
                    <ProgressBar
                      value={(goal.current_value / goal.target_value) * 100}
                      className="h-2"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Milestones Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Career Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="flex gap-4 items-start animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mt-1">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{milestone.title}</h3>
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(milestone.achieved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
