import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_members(count)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed": return "bg-primary text-primary-foreground";
      case "pilot": return "bg-accent text-accent-foreground";
      case "development": return "bg-secondary text-secondary-foreground";
      case "ideation": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-accent";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Projects & Collaboration
          </h1>
          <p className="text-muted-foreground mt-2">
            Track MVP development and innovation projects
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{projects?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Development</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {projects?.filter(p => p.status === "development").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployed</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {projects?.filter(p => p.status === "deployed").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${projects?.reduce((sum, p) => sum + (Number(p.budget_allocated) || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People Impacted</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects?.reduce((sum, p) => sum + (p.people_impacted || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Kanban View */}
        <div className="grid gap-4 md:grid-cols-4">
          {["ideation", "development", "pilot", "deployed"].map((status) => (
            <Card key={status} className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg capitalize flex items-center justify-between">
                  {status}
                  <Badge variant="outline">
                    {projects?.filter(p => p.status === status).length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects
                  ?.filter(p => p.status === status)
                  .map((project) => (
                    <Card key={project.id} className="border-l-4 border-l-primary hover:shadow-soft transition-shadow cursor-pointer">
                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-semibold text-sm">{project.title}</h4>
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{project.progress_percentage}%</span>
                          </div>
                          <Progress value={project.progress_percentage || 0} />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${getPriorityColor(project.priority || "medium")}`}>
                            {project.priority || "medium"} priority
                          </span>
                          {project.deadline && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {(!projects || projects.filter(p => p.status === status).length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No projects in this stage
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Projects List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Projects</h2>
          {isLoading ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading projects...
              </CardContent>
            </Card>
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(project.status || "ideation")}>
                        {project.status || "ideation"}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(project.priority || "medium")}>
                        {project.priority || "medium"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-5 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-lg font-bold text-primary">{project.progress_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-bold text-accent">
                        ${Number(project.budget_allocated || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="text-lg font-bold text-secondary">
                        ${Number(project.budget_spent || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">People Impacted</p>
                      <p className="text-lg font-bold">{project.people_impacted || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Jobs Created</p>
                      <p className="text-lg font-bold">{project.jobs_created || 0}</p>
                    </div>
                  </div>
                  <Progress value={project.progress_percentage || 0} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(project.created_at).toLocaleDateString()}
                    {project.deadline && ` • Deadline: ${new Date(project.deadline).toLocaleDateString()}`}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                No projects yet. Projects will appear here once innovation teams start building MVPs.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
