import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb, Users, Target, Shield, Search, GitBranch, FlaskConical, Heart, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6">About SolveBridge Africa</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in">
              Bridging Problems to{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Purpose
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-primary">Our Origin Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                SolveBridge Africa was founded from a single belief: that true innovation begins with listening. After witnessing many startups fail to meet real community needs, we built a bridge — where people's daily struggles meet innovators ready to design change.
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h2 className="text-3xl font-bold mb-6 text-primary">Structure & Scope</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Operating under SolveBridge Africa LLC (Delaware, U.S.), we combine international transparency with African field operations based in Nairobi. Our hybrid model gives funders global accountability and communities local ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-3xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Connect innovators with real community problems and co-create sustainable solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-elegant">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-3xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Become Africa's most trusted bridge between human challenges and social innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: "Integrity" },
              { icon: Heart, title: "Empathy" },
              { icon: Users, title: "Collaboration" },
              { icon: Target, title: "Transparency" },
              { icon: Lightbulb, title: "Empowerment" }
            ].map((value, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-3">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="max-w-4xl mx-auto border-primary/20 shadow-elegant">
            <CardHeader>
              <Badge className="w-fit mb-4">Our Story</Badge>
              <CardTitle className="text-3xl md:text-4xl">
                Born from a Vision to Transform Africa's Innovation Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg text-muted-foreground">
              <p>
                SolveBridge Africa was founded with a simple yet powerful realization: Africa is full of talented innovators with brilliant ideas, but many struggle to identify real problems worth solving or lack access to the resources needed to bring their solutions to life.
              </p>
              <p>
                We saw firsthand how entrepreneurs would build products no one needed, while critical community challenges remained unsolved. We witnessed the gap between problem owners (communities, organizations, and individuals) and solution builders (innovators, founders, and tech talents).
              </p>
              <p>
                Today, SolveBridge Africa stands as a bridge—connecting those who face challenges with those equipped to solve them. We've created a platform where problems are discovered, innovators collaborate, MVPs are validated, and sustainable impact is achieved.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/team">
                    Meet Our Team
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Programs</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive Support for Every Stage
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From problem discovery to MVP validation, we provide the tools, mentorship, and resources innovators need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Search,
                title: "Problem Discovery Platform",
                description: "Access a curated database of real-world challenges submitted by communities, organizations, and individuals across Africa. Filter by sector, region, and impact potential.",
                features: ["Verified problem statements", "Community insights", "Impact metrics", "Collaboration opportunities"]
              },
              {
                icon: GitBranch,
                title: "Innovator Bridge",
                description: "Connect with fellow founders, technical talents, and domain experts. Build your team and access mentorship from successful entrepreneurs and industry leaders.",
                features: ["Founder matching", "Expert mentorship", "Skill-based networking", "Team formation tools"]
              },
              {
                icon: FlaskConical,
                title: "MVP Validation Labs",
                description: "Get hands-on support to build, test, and validate your MVP. Access technical resources, user testing frameworks, and go-to-market strategies.",
                features: ["Technical workshops", "User feedback sessions", "Pilot program support", "Launch assistance"]
              },
              {
                icon: Heart,
                title: "Women & Youth Empowerment",
                description: "Dedicated programs ensuring underrepresented groups have equal access to opportunities, resources, and support in the innovation ecosystem.",
                features: ["Scholarships & grants", "Leadership training", "Safe spaces", "Success pathways"]
              }
            ].map((program, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <program.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                  <CardDescription className="text-base pt-2">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm text-primary mb-3">Key Features:</p>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-muted-foreground">
                          <span className="text-primary mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/explore">Explore Our Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
