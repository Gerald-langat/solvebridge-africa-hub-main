import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Bookmark, Eye, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [problems, setProblems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [savedProblems, setSavedProblems] = useState<Set<string>>(new Set());
  const [bounties, setBounties] = useState<any[]>([]);


  // ------------------------------
  // Fetch Problems + Views
  // ------------------------------
  const fetchProblems = async () => {
    let query = supabase
      .from("problems")
      .select("*")
      .eq("status", "validated")
      .order("created_at", { ascending: false });

    if (sectorFilter !== "all") query = query.eq("sector", sectorFilter as any);

    const { data: problemsData, error } = await query;
    if (error) return console.error("Failed to fetch problems:", error);

    const problemsList = problemsData || [];
    const problemIds = problemsList.map(p => p.id);

    // Fetch view counts for all problems at once
    const { data: viewsData } = await supabase
    .from("problem_views")
      .select("problem_id", { count: "exact" })
      .in("problem_id", problemIds);

    // Count views per problem
    const viewsCountMap: Record<string, number> = {};
    problemIds.forEach(id => (viewsCountMap[id] = 0));
    (viewsData || []).forEach((row: any) => {
      viewsCountMap[row.problem_id] = (viewsCountMap[row.problem_id] || 0) + 1;
    });

    // Combine views with problems
    const problemsWithViews = problemsList.map(p => ({
      ...p,
      views_count: viewsCountMap[p.id] || 0,
    }));

    setProblems(problemsWithViews);
    // Bounties
    const { data: bountiesData, error: bountyError } = await supabase
      .from("bounties")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (bountyError) console.error("Failed to fetch bounties:", bountyError);
    setBounties(bountiesData || []);
  };

  // ------------------------------
  // Fetch Saved Problems
  // ------------------------------
  const fetchSavedProblems = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from("saved_problems")
      .select("problem_id")
      .eq("user_id", user.id);

    setSavedProblems(new Set(data.map((item) => item.problem_id.toString())));
  };

  // ------------------------------
  // Save / Unsave Problem
  // ------------------------------
  const toggleSaveProblem = async (problemId: string) => {
    if (!user?.id) return;

    if (savedProblems.has(problemId)) {
      await supabase
        .from("saved_problems")
        .delete()
        .eq("user_id", user.id)
        .eq("problem_id", problemId);

      setSavedProblems(prev => {
        const newSet = new Set(prev);
        newSet.delete(problemId);
        return newSet;
      });

      toast({ title: "Removed from saved problems" });
    } else {
      await supabase
        .from("saved_problems")
        .insert({ user_id: user.id, problem_id: problemId });

      setSavedProblems(prev => new Set([...prev, problemId]));
      toast({ title: "Problem saved successfully" });
    }
  };

  // ------------------------------
  // Initial Load
  // ------------------------------
useEffect(() => {
  if (!user?.id) return;

  fetchProblems();
  fetchSavedProblems();
}, [user?.id, sectorFilter]);

  // Merge problems and bounties into one feed
  const exploreItems = [
    ...problems.map(p => ({ ...p, type: "problem" })),
    ...bounties.map(b => ({ ...b, type: "bounty" })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter by search term
  const filteredItems = exploreItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated": return "default";
      case "in_collaboration": return "secondary";
      case "pending": return "outline";
      default: return "destructive";
    }
  };


  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Explore Problems/Bounties</h1>
            <p className="text-muted-foreground mt-2">
              Browse validated problems and Bounties and find collaboration opportunities
            </p>
          </div>

          {/* Search & Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problems Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => (
                <Card
                  key={item.id}
                  className={`hover-scale animate-scale-in transition-all ${
                    item.type === "bounty" ? "border-2 border-yellow-400" : "shadow-soft"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{item.sector}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaveProblem(item.id)}
                      className={savedProblems.has(item.id) ? "text-primary" : ""}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${savedProblems.has(item.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">{item.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {item.location || item.target_regions}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {item.views_count || 0} views
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => navigate(`/problem/${item.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No validated problems or bounties found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
