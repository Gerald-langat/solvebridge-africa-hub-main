import { Card } from "@/components/ui/card";
import { Building2, GraduationCap, Handshake, Rocket } from "lucide-react";

export const TrustedBy = () => {
  const partnerTypes = [
    {
      icon: Building2,
      label: "Development Agencies",
      count: "15+",
      gradient: "from-primary to-primary-light"
    },
    {
      icon: GraduationCap,
      label: "Universities",
      count: "20+",
      gradient: "from-accent to-secondary"
    },
    {
      icon: Handshake,
      label: "Corporate Partners",
      count: "12+",
      gradient: "from-primary-light to-primary"
    },
    {
      icon: Rocket,
      label: "Innovation Hubs",
      count: "25+",
      gradient: "from-secondary to-accent"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Organizations
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partnering with development agencies, universities, and innovation hubs across Africa
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {partnerTypes.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-br ${partner.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-soft`}>
                  <Icon className="text-white" size={28} />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{partner.count}</div>
                <p className="text-sm text-muted-foreground font-medium">{partner.label}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
