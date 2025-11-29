import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Problem {
  id: string;
  title: string;
  description: string;
  sector: string;
  location: string;
  status: string;
}

export const FeaturedProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const { data, error } = await supabase
        .from("problems")
        .select("id, title, description, sector, location, status")
        .eq("status", "validated")
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && !error) {
        setProblems(data);
      }
    };

    fetchProblems();
  }, []);

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      health: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      education: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      agriculture: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      energy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      infrastructure: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return colors[sector.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Challenges
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real problems from African communities waiting for innovative solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {problems.map((problem, index) => (
              <Card
                key={problem.id}
                className="p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getSectorColor(problem.sector)}>
                    {problem.sector}
                  </Badge>
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {problem.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin size={16} className="mr-1" />
                  <span>{problem.location}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">View All Problems</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
