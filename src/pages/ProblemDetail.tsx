import { useParams, useNavigate } from "react-router-dom";
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
import { useQuery } from "@tanstack/react-query";

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasRole } = useUserRole();

  const [item, setItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'problem' | 'bounty' | null>(null);

  // ------------------------------
  // Fetch problem or bounty
  // ------------------------------
  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Try problem first
        let { data, error } = await supabase
          .from('problems')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setItem(data);
          setItemType('problem');
          return;
        }

        // If not found, try bounty
        ({ data, error } = await supabase
          .from('bounties')
          .select('*')
          .eq('id', id)
          .single());

        if (data) {
          setItem(data);
          setItemType('bounty');
          return;
        }

        setItem(null);
        setItemType(null);
      } catch (err) {
        console.error(err);
        setItem(null);
        setItemType(null);
      }
    };

    fetchItem();
  }, [id]);

  // ------------------------------
  // Fetch solutions (for problems only)
  // ------------------------------
  const { data: solutions } = useQuery({
    queryKey: ['solutions', id],
    enabled: !!id && itemType === 'problem',
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          creator:profiles (
            first_name,
            last_name,
            image
          )
        `)
        .eq('problem_id', id);

      if (error) throw error;
      return data;
    },
  });

  // ------------------------------
  // Record views for problems only
  // ------------------------------
  useEffect(() => {
    if (item && itemType === 'problem' && user?.id) {
      supabase.from("problem_views").insert({ problem_id: item.id, user_id: user.id });
    }
  }, [item, itemType, user?.id]);

  if (!item) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <Button onClick={() => navigate('/explore')}>Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const canProposeSolution = hasRole('Innovator') || hasRole('Super_admin');

  // ------------------------------
  // Helper for status badge
  // ------------------------------
  const getStatusBadge = () => {
    if (itemType === 'problem') {
      return item.status === 'validated' ? 'default' : 'secondary';
    } else if (itemType === 'bounty') {
      return 'warning';
    }
    return 'default';
  };

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
            Back
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{item.title}</CardTitle>
                  {item.summary && (
                    <CardDescription className="text-lg">{item.summary}</CardDescription>
                  )}
                </div>
                <Badge variant={getStatusBadge()}>
                  {itemType === 'problem' ? item.status : 'Bounty'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {itemType === 'problem' ? item.location : item.target_regions || 'N/A'}
                </div>
                {itemType === 'problem' && item.sector && (
                  <Badge variant="outline">{item.sector}</Badge>
                )}
                {itemType === 'bounty' && item.tags && (
                  <Badge variant="outline">{item.tags.join(", ")}</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              {itemType === 'problem' && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Problem Description</h3>
                    <p className="text-foreground leading-relaxed">{item.description}</p>
                  </div>

                  {item.target_audience && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Target Audience
                      </h3>
                      <p className="text-foreground">{item.target_audience}</p>
                    </div>
                  )}

                  {item.impact_scale && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Impact Scale
                      </h3>
                      <Badge variant="secondary">{item.impact_scale}</Badge>
                    </div>
                  )}

                  {item.stakeholders && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Key Stakeholders</h3>
                      <p className="text-foreground">{item.stakeholders}</p>
                    </div>
                  )}

                  {canProposeSolution && item.status === 'validated' && (
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
                </>
              )}

              {itemType === 'bounty' && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Bounty Details</h3>
                    <p>Reward: {item.reward_amount} {item.currency}</p>
                    {item.deadline && <p>Deadline: {new Date(item.deadline).toLocaleDateString()}</p>}
                    {item.description && <p className="text-foreground leading-relaxed">{item.description}</p>}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Solutions only for problems */}
          {itemType === 'problem' && solutions && solutions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Proposed Solutions ({solutions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solutions.map((solution) => {
                    const creator = solution.creator;
                    return (
                      <Card key={solution.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{solution.title}</CardTitle>
                              <CardDescription className="flex items-center space-x-4">
                                {creator?.image && (
                                  <img
                                    src={creator.image ?? "/avatar-placeholder.png"}
                                    alt="Profile"
                                    className="h-5 w-5 rounded-full"
                                  />
                                )}
                                {creator?.first_name} {creator?.last_name}
                              </CardDescription>
                            </div>
                            <Badge>{solution.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{solution.summary}</p>
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
