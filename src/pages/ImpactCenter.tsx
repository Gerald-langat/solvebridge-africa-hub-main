import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function ImpactCenter() {
  const { data: problems } = useQuery({
    queryKey: ["problems-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("sector, status, created_at")
        .eq("status", "validated");

      if (error) throw error;
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("status, people_impacted, jobs_created");

      if (error) throw error;
      return data;
    },
  });

  // Process data for charts
  const categoryData = problems?.reduce((acc: any[], problem) => {
    const existing = acc.find((item) => item.name === problem.sector);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: problem.sector, value: 1 });
    }
    return acc;
  }, []);

  const growthData = problems?.reduce((acc: any[], problem) => {
    const month = new Date(problem.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.problems++;
    } else {
      acc.push({ month, problems: 1 });
    }
    return acc;
  }, []);

  const totalImpact = projects?.reduce((sum, p) => sum + (p.people_impacted || 0), 0) || 0;
  const totalJobs = projects?.reduce((sum, p) => sum + (p.jobs_created || 0), 0) || 0;

  const generateReport = () => {
    toast.success("Generating AI Impact Report...");
    // This would integrate with SolveAI
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Impact Analytics Center</h1>
            <p className="text-muted-foreground">Visualize platform progress and outcomes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate AI Report
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Problems</CardTitle>
              <CardDescription>Validated community challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{problems?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>People Impacted</CardTitle>
              <CardDescription>Across all solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalImpact.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Jobs Created</CardTitle>
              <CardDescription>Through innovations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{totalJobs}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Problems by Category</CardTitle>
              <CardDescription>Distribution across sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Growth</CardTitle>
              <CardDescription>Problems submitted over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="problems" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Impact Summary</CardTitle>
            <CardDescription>Automated insights from platform data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-muted-foreground">
                Click "Generate AI Report" to create a comprehensive analysis of platform impact,
                trends, and recommendations powered by SolveAI.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}