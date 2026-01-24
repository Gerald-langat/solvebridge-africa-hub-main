import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { CheckCircle2, Users, Rocket, Target, Download, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";

export default function ImpactDashboard() {
  const { data: problems } = useQuery({
    queryKey: ["problems-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["profiles-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Sector breakdown data
  const sectorData = problems?.reduce((acc: any[], problem) => {
    const existing = acc.find(item => item.name === problem.sector);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: problem.sector || "Other", value: 1 });
    }
    return acc;
  }, []) || [];

  // Status breakdown for problems
  const statusData = problems?.reduce((acc: any[], problem) => {
    const status = problem.status || "pending";
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []) || [];

  // Time series data (last 6 months)
  const timeSeriesData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleString("default", { month: "short" });
    
    const problemCount = problems?.filter(p => {
      const pDate = new Date(p.created_at);
      return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
    }).length || 0;

    return {
      month: monthName,
      problems: problemCount,
      projects: Math.floor(problemCount * 0.3),
    };
  });

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--muted))"];

  const totalPeopleImpacted = projects?.reduce((sum, p) => sum + (p.people_impacted || 0), 0) || 0;
  const totalJobsCreated = projects?.reduce((sum, p) => sum + (p.jobs_created || 0), 0) || 0;
  const validatedProblems = problems?.filter(p => p.status === "validated").length || 0;
  const activeMVPs = projects?.filter(p => p.status === "development" || p.status === "pilot").length || 0;

const handleExport = (format: "csv" | "pdf") => {
  if (format === "csv") {
    const csvData = problems?.map(p => ({
      title: p.title,
      sector: p.sector,
      status: p.status,
      created_at: p.created_at,
    })) || [];

    exportToCSV("problems-report.csv", csvData);
  }

  if (format === "pdf") {
    exportToPDF();
  }
};


  const exportToCSV = (filename: string, rows: any[]) => {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","), // header row
    ...rows.map(row =>
      headers.map(field =>
        JSON.stringify(row[field] ?? "")
      ).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Impact Analytics Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  let y = 45;

  doc.setFontSize(14);
  doc.text("Key Metrics", 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Validated Problems: ${validatedProblems}`, 14, y); y += 8;
  doc.text(`Active Innovators: ${profiles?.length || 0}`, 14, y); y += 8;
  doc.text(`Active MVPs: ${activeMVPs}`, 14, y); y += 8;
  doc.text(`People Impacted: ${totalPeopleImpacted}`, 14, y); y += 8;
  doc.text(`Jobs Created: ${totalJobsCreated}`, 14, y); y += 12;

  doc.setFontSize(14);
  doc.text("Problems by Sector", 14, y);
  y += 10;

  doc.setFontSize(11);
  sectorData.forEach((sector) => {
    doc.text(`${sector.name}: ${sector.value}`, 14, y);
    y += 7;
  });

  doc.save("impact-report.pdf");
};



  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Impact Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Measure program outcomes and visualize impact
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button className="bg-gradient-primary" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validated Problems</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{validatedProblems}</div>
              <p className="text-xs text-muted-foreground">
                {((validatedProblems / (problems?.length || 1)) * 100).toFixed(1)}% validation rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Innovators</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{profiles?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MVPs in Progress</CardTitle>
              <Rocket className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{activeMVPs}</div>
              <p className="text-xs text-muted-foreground">
                Active development projects
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People Impacted</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalPeopleImpacted.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalJobsCreated} jobs created
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Submissions Over Time</CardTitle>
              <CardDescription>Problem and project submissions by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                  <Line type="monotone" dataKey="problems" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="projects" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Problem Status Distribution</CardTitle>
              <CardDescription>Current status of all problems</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Problems by Sector</CardTitle>
            <CardDescription>Distribution across different sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impact Attribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Impact Attribution
            </CardTitle>
            <CardDescription>MVP outcomes and community impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.filter(p => p.people_impacted && p.people_impacted > 0).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{project.people_impacted?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">people impacted</p>
                    {project.jobs_created && project.jobs_created > 0 && (
                      <p className="text-sm font-medium text-accent mt-1">{project.jobs_created} jobs created</p>
                    )}
                  </div>
                </div>
              ))}
              {!projects?.some(p => p.people_impacted && p.people_impacted > 0) && (
                <p className="text-center text-muted-foreground py-8">
                  Impact data will appear as projects report outcomes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
