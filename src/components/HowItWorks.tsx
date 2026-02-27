import { Card } from "@/components/ui/card";
import { MessageSquare, CheckCircle, Rocket } from "lucide-react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


// Counter Component
const Counter = ({ value, inView }) => {
  const rawNumber = Number(value.replace(/\D/g, "")); // extract digits
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      animate(count, rawNumber, {
        duration: 2,
        ease: "easeOut",
      });
    }
  }, [inView, rawNumber]);

  return <motion.span>{rounded}</motion.span>;
};

// Number Formatter (1.2K+, 5.3M+)
const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
  return num.toLocaleString() + "+";
};

export const HowItWorks = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

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

  const [stats, setStats] = useState({
      submittedProblems: 0,
      innovators: 0,
      mvpCount: 0,
      partnersCount: 0,
    });
  
    // Fetch stats from Supabase
    const fetchStats = async () => {
      const { data: problems } = await supabase.from("problems").select("*");
      const { data: mvps } = await supabase.from("projects").select("*");
      const { data: patners } = await supabase.from("partners").select("*");
      const { data: roles } = await supabase.from("user_roles").select("*");
      const innovators = roles?.filter((r:any) => r.role === "Innovator").length || 0;
  
      setStats({
        submittedProblems: problems?.length || 0,
        innovators: innovators,
        mvpCount: mvps?.length || 0,
        partnersCount: patners?.length || 0,
      });
    };
  
    useEffect(() => {
      fetchStats();
    }, []);

   const metrics = [
    { label: "Problems Submitted", value: stats.submittedProblems },
    { label: "Innovators Onboarded", value: stats.innovators },
    { label: "MVPs Built", value: stats.mvpCount },
    { label: "Partnerships Formed", value: stats.partnersCount },
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
            <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.6,
            delay: index * 0.1 + 0.2,
          }}
        >
          <div className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">
            <Counter value={formatNumber(metric.value)} inView={inView} />
          </div>
          <div className="text-sm text-muted-foreground">{metric.label}</div>
        </motion.div>
      ))}
    </div>
          </div>
        </div>
      </div>
    </section>
  );
};
