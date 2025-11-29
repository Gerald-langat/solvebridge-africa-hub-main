import { Card } from "@/components/ui/card";
import { Target, Shield, Sparkles, Globe2, TrendingUp, Heart } from "lucide-react";

export const WhyChooseUs = () => {
  const features = [
    {
      icon: Target,
      title: "Real Problems, Real Impact",
      description: "Every challenge on our platform is verified and comes from actual communities, ensuring your innovation addresses genuine needs.",
      gradient: "from-primary to-primary-light"
    },
    {
      icon: Shield,
      title: "Data-Driven Validation",
      description: "Our rigorous validation process uses data analytics and community feedback to ensure problem authenticity and market potential.",
      gradient: "from-accent to-secondary"
    },
    {
      icon: Sparkles,
      title: "End-to-End Support",
      description: "From problem discovery to MVP validation, we provide mentorship, resources, and connections at every stage of your journey.",
      gradient: "from-primary-light to-primary"
    },
    {
      icon: Globe2,
      title: "Pan-African Network",
      description: "Connect with innovators, mentors, and communities across multiple African countries, expanding your reach and impact.",
      gradient: "from-primary to-accent"
    },
    {
      icon: TrendingUp,
      title: "Proven Track Record",
      description: "Join 200+ innovators who have successfully launched MVPs and secured partnerships through our ecosystem.",
      gradient: "from-secondary to-primary-light"
    },
    {
      icon: Heart,
      title: "Inclusive Innovation",
      description: "We prioritize women and youth-led initiatives, ensuring diverse voices shape Africa's innovation landscape.",
      gradient: "from-accent to-primary"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              SolveBridge Africa?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're not just another innovation hub. We're a bridge connecting authentic community challenges 
            with passionate innovators ready to create lasting change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-8 hover:shadow-elegant transition-all duration-500 hover:-translate-y-3 animate-fade-in-up border-border/50 bg-card/50 backdrop-blur-sm group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
