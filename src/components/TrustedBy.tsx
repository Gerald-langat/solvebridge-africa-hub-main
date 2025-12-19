import { Card } from "@/components/ui/card";
import {
  animate,
  useMotionValue,
  useTransform,
  motion,
  useInView,
} from "framer-motion";
import { Building2, GraduationCap, Handshake, Rocket } from "lucide-react";
import { useEffect, useRef } from "react";

// Counter Component
const Counter = ({ value, inView }: { value: string; inView: boolean }) => {
  const rawNumber = Number(value.replace(/\D/g, ""));
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    Math.floor(v).toLocaleString()
  );

  useEffect(() => {
    if (inView) {
      animate(count, rawNumber, {
        duration: 2,
        ease: "easeOut",
      });
    }
  }, [inView, rawNumber]);

  return (
    <motion.span>
      <motion.span>{rounded}</motion.span>
      <span className="text-primary">+</span>
    </motion.span>
  );
};

export const TrustedBy = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const partnerTypes = [
    {
      icon: Building2,
      label: "Development Agencies",
      count: "15+",
      gradient: "from-primary to-primary-light",
    },
    {
      icon: GraduationCap,
      label: "Universities",
      count: "20+",
      gradient: "from-accent to-secondary",
    },
    {
      icon: Handshake,
      label: "Corporate Partners",
      count: "12+",
      gradient: "from-primary-light to-primary",
    },
    {
      icon: Rocket,
      label: "Innovation Hubs",
      count: "25+",
      gradient: "from-secondary to-accent",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Leading{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Organizations
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partnering with development agencies, universities, and innovation
            hubs across Africa
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {partnerTypes.map((partner, index) => {
            const Icon = partner.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group">
                  <div
                    className={`bg-gradient-to-br ${partner.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-soft`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>

                  <div className="text-3xl font-bold text-primary mb-2">
                    <Counter value={partner.count} inView={inView} />
                  </div>

                  <p className="text-sm text-muted-foreground font-medium">
                    {partner.label}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
