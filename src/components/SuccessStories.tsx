import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const SuccessStories = () => {
  const stories = [
    {
      quote: "SolveBridge helped me identify a real healthcare challenge in rural Kenya. Today, my telemedicine app serves over 5,000 patients.",
      name: "Amara Okafor",
      role: "Founder, HealthConnect",
      country: "Nigeria",
      impact: "5,000+ patients served",
      color: "from-primary/20 to-primary-light/20"
    },
    {
      quote: "Through the MVP Validation Labs, I refined my agricultural solution and secured $50K in seed funding within 6 months.",
      name: "James Kimani",
      role: "CEO, FarmTech Solutions",
      country: "Kenya",
      impact: "$50K funding secured",
      color: "from-accent/20 to-secondary/20"
    },
    {
      quote: "As a young woman founder, the mentorship and resources I received were transformative. I'm now scaling across three countries.",
      name: "Zara Hassan",
      role: "Founder, EduBridge",
      country: "Ghana",
      impact: "3 countries, 10K+ users",
      color: "from-primary-light/20 to-primary/20"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stories of{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Real Impact
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the innovators who transformed community challenges into thriving solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {stories.map((story, index) => (
            <Card 
              key={index}
              className="hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 animate-fade-in-up relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardContent className="p-8 relative">
                <div className="mb-6">
                  <Quote className="text-primary/30 mb-4" size={48} />
                  <p className="text-lg italic text-foreground leading-relaxed mb-6">
                    "{story.quote}"
                  </p>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-lg">{story.name}</p>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                      <p className="text-sm text-primary mt-1">📍 {story.country}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm font-semibold text-primary">Impact: {story.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up">
          <Button size="lg" asChild className="shadow-glow">
            <Link to="/impact">
              View More Success Stories
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
