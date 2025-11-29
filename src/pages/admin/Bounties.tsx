import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, DollarSign, Calendar, Target, Users } from "lucide-react";

export default function Bounties() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_amount: "",
    currency: "USD",
    deadline: "",
    criteria: "",
    tags: "",
    target_regions: "",
  });

  const { data: bounties, isLoading } = useQuery({
    queryKey: ["bounties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bounties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createBounty = useMutation({
    mutationFn: async (bounty: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.from("bounties").insert([{
        ...bounty,
        created_by: user.id,
        tags: bounty.tags ? bounty.tags.split(",").map((t: string) => t.trim()) : [],
        target_regions: bounty.target_regions ? bounty.target_regions.split(",").map((r: string) => r.trim()) : [],
      }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bounties"] });
      toast({ title: "Bounty created successfully" });
      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        reward_amount: "",
        currency: "USD",
        deadline: "",
        criteria: "",
        tags: "",
        target_regions: "",
      });
    },
    onError: (error: any) => {
      toast({ title: "Error creating bounty", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBounty.mutate({
      ...formData,
      reward_amount: parseFloat(formData.reward_amount),
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary text-primary-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Bounties Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and manage innovation bounties and challenges
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Bounty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Bounty</DialogTitle>
                <DialogDescription>
                  Launch a new innovation challenge with rewards
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Bounty Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AgriTech Innovation Challenge"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the challenge and what you're looking for..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward Amount *</Label>
                    <Input
                      id="reward"
                      type="number"
                      required
                      value={formData.reward_amount}
                      onChange={(e) => setFormData({ ...formData, reward_amount: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="KES">KES</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criteria">Evaluation Criteria</Label>
                  <Textarea
                    id="criteria"
                    value={formData.criteria}
                    onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                    placeholder="What criteria will be used to evaluate submissions?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="agriculture, innovation, sustainability"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regions">Target Regions (comma-separated)</Label>
                  <Input
                    id="regions"
                    value={formData.target_regions}
                    onChange={(e) => setFormData({ ...formData, target_regions: e.target.value })}
                    placeholder="Kenya, Nigeria, South Africa"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-primary">
                    Create Bounty
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bounties</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {bounties?.filter(b => b.status === "active").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ${bounties?.reduce((sum, b) => sum + (Number(b.reward_amount) || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {bounties?.reduce((sum, b) => sum + (b.submissions_count || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bounties?.filter(b => b.status === "completed").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bounties List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading bounties...
              </CardContent>
            </Card>
          ) : bounties && bounties.length > 0 ? (
            bounties.map((bounty) => (
              <Card key={bounty.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{bounty.title}</CardTitle>
                      <CardDescription>{bounty.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(bounty.status || "active")}>
                      {bounty.status || "active"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Reward</p>
                      <p className="text-lg font-bold text-accent">
                        {bounty.currency} {Number(bounty.reward_amount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submissions</p>
                      <p className="text-lg font-bold">{bounty.submissions_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-lg font-bold">
                        {bounty.deadline ? new Date(bounty.deadline).toLocaleDateString() : "No deadline"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-lg font-bold">
                        {new Date(bounty.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {bounty.tags && bounty.tags.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {bounty.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                No bounties yet. Create your first innovation challenge!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
