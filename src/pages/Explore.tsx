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
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
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
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (bountyError) console.error("Failed to fetch bounties:", bountyError);

      const bountyList = bountiesData || [];
    const bountyIds = bountyList.map(b => b.id);

    // Fetch view counts for all bounties at once
    const { data: bountyViewsData } = await supabase
    .from("problem_views")
      .select("problem_id", { count: "exact" })
      .in("problem_id", bountyIds);

    // Count views per problem
    const bountyViewsCountMap: Record<string, number> = {};
    bountyIds.forEach(id => (bountyViewsCountMap[id] = 0));
    (bountyViewsData || []).forEach((row: any) => {
      bountyViewsCountMap[row.problem_id] = (bountyViewsCountMap[row.problem_id] || 0) + 1;
    });

    // Combine views with problems
    const bountiesWithViews = bountyList.map(b => ({
      ...b,
      views_count: bountyViewsCountMap[b.id] || 0,
    }));
    setBounties(bountiesWithViews);
  };

  // ------------------------------
  // Fetch Saved Problems
  // ------------------------------
  const fetchSavedItems = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from("saved_problems")
      .select("problem_id")
      .eq("user_id", user.id);

    setSavedItems(new Set(data.map((item) => item.problem_id.toString())));
  };

  // ------------------------------
  // Save / Unsave Problem
  // ------------------------------
const toggleSaveItem = async (itemId: string, type: "problem" | "bounty") => {
  if (!user?.id) return;

  const key = `${type}-${itemId}`;
  const newSet = new Set(savedItems);

  if (newSet.has(key)) {
    await supabase
      .from("saved_problems")
      .delete()
      .eq("user_id", user.id)
      .eq("item_id", itemId)
      .eq("item_type", type);

    newSet.delete(key);
    setSavedItems(newSet);
    toast({ title: `${type === "problem" ? "Problem" : "Bounty"} removed from saved items` });
  } else {
    await supabase
      .from("saved_problems")
      .insert({ user_id: user.id, item_id: itemId, item_type: type });

    newSet.add(key);
    setSavedItems(newSet);
    toast({ title: `${type === "problem" ? "Problem" : "Bounty"} saved successfully` });
  }
};


  // ------------------------------
  // Initial Load
  // ------------------------------
useEffect(() => {
  if (!user?.id) return;

  fetchProblems();
  fetchSavedItems();
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
                    item.type === "bounty" ? "border-[1px] border-yellow-300" : "shadow-soft"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                <CardHeader className="relative">
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-tl-md absolute left-0 top-0 ${
                          item.type === "bounty"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.type}
                      </span>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getStatusColor(item.status)}>
                            {item.status.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {item.sector || item.tags}
                          </Badge>
                           <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveItem(item.id, item.type)}
                        className={savedItems.has(`${item.type}-${item.id}`) ? "text-primary ml-auto" : "ml-auto"}
                      >
                        <Bookmark className={`h-5 w-5 ${savedItems.has(`${item.type}-${item.id}`) ? "fill-current" : ""}`} />
                      </Button>
                        </div>
                         
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
            onClick={() =>
              navigate(
                item.type === "problem"
                  ? `/problem/${item.id}`
                  : `/bounty/${item.id}`
              )
            }
          >
            {item.type === "problem" ? "View Details" : "Submit Solution"}
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
