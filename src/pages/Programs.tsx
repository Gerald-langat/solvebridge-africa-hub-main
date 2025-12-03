import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, GitBranch, FlaskConical, Heart, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: Search,
    title: "Problem Discovery",
    description: "We listen first — collecting on-the-ground insights through surveys, interviews, and digital submissions to identify authentic community challenges.",
    color: "from-primary/20 to-primary/10"
  },
  {
    icon: GitBranch,
    title: "Innovator Bridge",
    description: "We connect verified problems with founders, researchers, and technologists equipped to solve them. Collaboration tools and mentorship support the journey.",
    color: "from-secondary/20 to-secondary/10"
  },
  {
    icon: FlaskConical,
    title: "MVP Validation Labs",
    description: "Rapid-testing spaces where innovators prototype, receive user feedback, and measure early impact before scaling.",
    color: "from-accent/20 to-accent/10",
    link: "/MVP_Validation"
  },
  {
    icon: Heart,
    title: "Women & Youth Empowerment",
    description: "We prioritize capacity-building, leadership, and funding access for women- and youth-led innovations.",
    color: "from-primary/20 to-secondary/10",
    link: "/WomenYouth"
  }
];

export default function Programs() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">Our Programs</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Turning Insight into{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Impact
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Every SolveBridge program transforms a real-world problem into an opportunity for innovation. Explore how each bridge works below.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
           {programs.map((program, index) => (
  <Card 
    key={index} 
    className="group hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 overflow-hidden border-primary/20"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    <CardHeader className="relative">
      <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <program.icon className="w-8 h-8 text-primary-foreground" />
      </div>
      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
        {program.title}
      </CardTitle>
    </CardHeader>

    <CardContent className="relative">
      <CardDescription className="text-base mb-4 leading-relaxed">
        {program.description}
      </CardDescription>

      {program.link && (
        <Link to ={program.link}>
          <Button 
            variant="ghost"                 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary hover:text-primary"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      )}
    </CardContent>
  </Card>
))}

          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Want to co-host a SolveBridge Lab in your region?
            </h2>
            <Button 
              size="lg" 
              variant="secondary"
              asChild
              className="shadow-glow hover:scale-105 transition-transform"
            >
              <Link to="/partners">
                Partner With Us
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
