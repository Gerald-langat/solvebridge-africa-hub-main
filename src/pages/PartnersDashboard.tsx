import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Award, Target, TrendingUp, Users } from "lucide-react";

export default function PartnersDashboard() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [challengeData, setChallengeData] = useState({
    title: "",
    description: "",
    reward_amount: "",
    currency: "USD",
    deadline: "",
    target_category: "Education",
  });

  const { data: challenges } = useQuery({
    queryKey: ["innovation-challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_challenges")
        .select("*, partners(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { label: "Active Challenges", value: "8", icon: Target, color: "text-blue-500" },
    { label: "Partnered Innovators", value: "156", icon: Users, color: "text-green-500" },
    { label: "Active MVPs", value: "12", icon: TrendingUp, color: "text-orange-500" },
    { label: "Total Rewards", value: "$45K", icon: Award, color: "text-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Partner Dashboard</h1>
            <p className="text-muted-foreground">Manage your innovation challenges and partnerships</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Launch Innovation Challenge</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Innovation Challenge</DialogTitle>
                <DialogDescription>Set up a new challenge for innovators</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Challenge Title</label>
                  <Input
                    value={challengeData.title}
                    onChange={(e) => setChallengeData({ ...challengeData, title: e.target.value })}
                    placeholder="E.g., Clean Water Solutions"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={challengeData.description}
                    onChange={(e) => setChallengeData({ ...challengeData, description: e.target.value })}
                    rows={4}
                    placeholder="Describe the challenge and requirements..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Reward Amount</label>
                    <Input
                      type="number"
                      value={challengeData.reward_amount}
                      onChange={(e) => setChallengeData({ ...challengeData, reward_amount: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Currency</label>
                    <Input
                      value={challengeData.currency}
                      onChange={(e) => setChallengeData({ ...challengeData, currency: e.target.value })}
                      placeholder="USD"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={challengeData.deadline}
                    onChange={(e) => setChallengeData({ ...challengeData, deadline: e.target.value })}
                  />
                </div>
                <Button className="w-full">Create Challenge</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Innovation Challenges</CardTitle>
            <CardDescription>Track the progress of your active challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges?.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {challenge.partners?.name}
                      </p>
                    </div>
                    <Badge variant={challenge.status === "active" ? "default" : "secondary"}>
                      {challenge.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {challenge.description.slice(0, 150)}...
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary font-medium">
                      Reward: {challenge.currency} {challenge.reward_amount}
                    </span>
                    {challenge.deadline && (
                      <span className="text-muted-foreground">
                        Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}