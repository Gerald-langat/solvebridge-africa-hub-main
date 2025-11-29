import { Card } from "@/components/ui/card";
import { MessageSquare, CheckCircle, Rocket } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Share a Problem",
      description:
        "Anyone can submit a real challenge they face in daily life — from education to agriculture.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      title: "Validate & Analyze",
      description:
        "Our team and data tools verify and categorize challenges to ensure they represent real needs.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Rocket,
      title: "Build & Solve",
      description:
        "Innovators browse validated problems, collaborate with communities, and co-create real solutions.",
      color: "text-primary-light",
      bgColor: "bg-primary-light/10",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Innovation Begins with{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Listening
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            SolveBridge Africa connects real human challenges to innovators
            ready to solve them. Our mission is to empower communities to voice
            their problems and help founders turn those insights into impactful,
            data-backed startups.
          </p>
        </div>

        {/* How It Works Steps */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="relative p-8 hover:shadow-medium transition-all duration-300 hover:-translate-y-2 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-soft">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`${step.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`${step.color}`} size={32} />
                  </div>

                  {/* Content */}
                  <h4 className="text-2xl font-bold mb-3">{step.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Impact Metrics */}
          <div className="bg-card rounded-2xl p-8 shadow-medium">
            <h3 className="text-2xl font-bold text-center mb-8">
              Our Impact So Far
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Problems Submitted", value: "1,000", suffix: "+" },
                { label: "Innovators Onboarded", value: "200", suffix: "+" },
                { label: "MVPs Built", value: "20", suffix: "+" },
                { label: "Partnerships Formed", value: "50", suffix: "+" },
              ].map((metric, index) => (
                <div
                  key={metric.label}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">
                    {metric.value}
                    {metric.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
