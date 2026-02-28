import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2, MapPin, Users, Target, ArrowLeft, Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasRole } = useUserRole();

  // Fetch problem
  const { data: problem, isLoading } = useQuery({
    queryKey: ['bounty', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bounties')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

// Fetch solutions
const { data: solutions, isLoading: solutionsLoading, error: solutionsError } = useQuery({
  queryKey: ['solutions', id],
  enabled: !!id,
  queryFn: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:profiles (
          first_name,
          last_name
        )
      `)
      .eq('problem_id', id);

    if (error) throw error;
    return data; // ✅ YOU WERE MISSING THIS
  },
});

const recordView = async (problemId: number) => {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;

  if (!uid) return;

  const { error } = await supabase
    .from("problem_views")
    .insert({
      problem_id: problemId,
      user_id: uid,
    });

  if (error) {
    console.error("Insert failed:", error);
  }
};



  // On mount: record view and fetch updated count
  useEffect(() => {
    if (problem?.id && user?.id) {
      recordView(problem.id, user.id).then(() => fetchViews(problem.id));
    }
  }, [problem?.id, user?.id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!problem && !isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Problem Not Found</h2>
          <Button onClick={() => navigate('/explore')}>Back to Problems</Button>
        </div>
      </DashboardLayout>
    );
  }

  const canProposeSolution = hasRole('Innovator') || hasRole('Super_admin');

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/explore')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Problems
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{problem.title}</CardTitle>
                  {(problem as any).summary && (
                    <CardDescription className="text-lg">{(problem as any).summary}</CardDescription>
                  )}
                </div>
                <Badge variant={problem.status === 'validated' ? 'default' : 'secondary'}>
                  {problem.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {problem.location}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{problem.sector}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {problem.image_url && (
                <img
                  src={problem.image_url}
                  alt={problem.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div>
                <h3 className="text-xl font-semibold mb-3">Problem Description</h3>
                <p className="text-foreground leading-relaxed">{problem.description}</p>
              </div>

              {(problem as any).target_audience && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Target Audience
                  </h3>
                  <p className="text-foreground">{(problem as any).target_audience}</p>
                </div>
              )}

              {(problem as any).impact_scale && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Impact Scale
                  </h3>
                  <Badge variant="secondary">{(problem as any).impact_scale}</Badge>
                </div>
              )}

              {(problem as any).stakeholders && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Key Stakeholders</h3>
                  <p className="text-foreground">{(problem as any).stakeholders}</p>
                </div>
              )}

              {canProposeSolution && problem.status === 'validated' && (
                <div className="pt-6 border-t">
                  <Button
                    size="lg"
                    onClick={() => navigate(`/submit-solution/${id}`)}
                    className="w-full sm:w-auto"
                  >
                    Propose Solution
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {solutions && solutions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Proposed Solutions ({solutions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solutions.map((solution) => {
                    const creator = (solution as any).creator;
                    return (
                      <Card key={solution.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{solution.title}</CardTitle>
                              <CardDescription className="flex items-center space-x-4">
                                by{creator.image && <img
                                src={creator.image ?? "/avatar-placeholder.png"}
                                alt="Profile"
                              />} {creator?.first_name} {creator?.last_name}
                              </CardDescription>
                            </div>
                            <Badge>{solution.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{(solution as any).summary}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
