import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Rocket, Globe, Users, ArrowRight, Heart, Lightbulb, Zap, TreePine } from "lucide-react";

const metrics = [
  { icon: CheckCircle, value: "100+", label: "Problems Identified", color: "text-primary" },
  { icon: Rocket, value: "10+", label: "MVPs Validated", color: "text-secondary" },
  { icon: Globe, value: "5+", label: "African Countries Engaged", color: "text-accent" },
  { icon: Users, value: "60%", label: "Women Innovators", color: "text-primary" }
];

const impactStories = [
  {
    quote: "My idea found direction through SolveBridge's validation process.",
    name: "Aisha",
    country: "Nigeria",
    sector: "Health"
  },
  {
    quote: "The mentorship and resources helped us launch our MVP in just 3 months.",
    name: "Kofi",
    country: "Ghana",
    sector: "Agriculture"
  },
  {
    quote: "SolveBridge connected me with the right partners to scale my solution.",
    name: "Amara",
    country: "Kenya",
    sector: "Education"
  }
];

const sectors = [
  { name: "Health", icon: Heart, percentage: 28, color: "bg-primary" },
  { name: "Education", icon: Lightbulb, percentage: 25, color: "bg-secondary" },
  { name: "Agriculture", icon: TreePine, percentage: 22, color: "bg-accent" },
  { name: "Energy", icon: Zap, percentage: 25, color: "bg-primary-light" }
];

export default function Impact() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">Our Impact</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              From Problems to{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Progress
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Animated Metrics Bar */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {metrics.map((metric, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 ${metric.color}`}>
                  <metric.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-accent bg-clip-text text-transparent">
                  {metric.value}
                </h3>
                <p className="text-muted-foreground font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories Carousel */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Impact Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real voices from innovators who are transforming challenges into solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {impactStories.map((story, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300 border-primary/20">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <svg className="w-12 h-12 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-lg italic mb-6 text-foreground">"{story.quote}"</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{story.name}</p>
                      <p className="text-sm text-muted-foreground">{story.country}</p>
                    </div>
                    <Badge variant="outline">{story.sector}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Data Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Sectors of Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our innovators are driving change across Africa's most critical sectors
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {sectors.map((sector, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <sector.icon className="w-6 h-6 text-primary" />
                    <span className="font-semibold text-lg">{sector.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{sector.percentage}%</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sector.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${sector.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Africa Map Placeholder */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="border-primary/20 shadow-elegant overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center">
                  <Globe className="w-24 h-24 mx-auto mb-4 text-primary animate-pulse" />
                  <h3 className="text-2xl font-bold mb-2">Active Across Africa</h3>
                  <p className="text-muted-foreground">
                    From Kenya to Nigeria, Ghana to South Africa — our network spans the continent
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Interested in funding our next cohort or pilot?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Partner with us to scale impact across Africa
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              asChild
              className="shadow-glow hover:scale-105 transition-transform"
            >
              <Link to="/partners#join">
                Become a Partner
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
