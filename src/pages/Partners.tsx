// app/pages/Partners.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, GraduationCap, Heart, Briefcase } from "lucide-react";

const partnerTypes = [
  { value: "university", label: "University", icon: GraduationCap },
  { value: "ngo", label: "NGO", icon: Heart },
  { value: "accelerator", label: "Accelerator", icon: Briefcase },
  { value: "corporate", label: "Corporate", icon: Building2 },
];

export default function Partners() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    contact_name: "",
    contact_email: "",
    notes: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("partners").insert({
        name: data.name,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        notes: data.notes,
        type: data.type,
        status: "pending",
          read_only: null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Partner registration submitted successfully!");
      setFormData({ name: "", type: "", contact_name: "", contact_email: "", notes: "" });
    },
    onError: () => {
      toast.error("Failed to submit registration");
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-subtle">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Collaboration
                </span>{" "}
                Drives Impact
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                SolveBridge Africa works with development agencies, universities, innovation hubs, and corporate partners to bridge ideas to implementation.
              </p>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Partners</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Working together to transform Africa's innovation ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
              {partnerTypes.map((type) => (
                <Card key={type.value} className="group text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-primary/20">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <type.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{type.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Partner with us as a {type.label.toLowerCase()}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Panel */}
        <section className="py-20 bg-muted/30" id="join">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="max-w-4xl mx-auto border-primary/20 shadow-elegant">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Support Real-World Innovation?
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Partner with us to drive sustainable impact across Africa
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button size="lg" variant="default" className="shadow-glow">
                    Launch a Challenge
                  </Button>
                  <Button size="lg" variant="outline">
                    Sponsor a Lab
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="mailto:partnerships@solvebridge.africa">
                      Contact Partnership Team
                    </a>
                  </Button>
                </div>

                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Get in touch with our partnerships team</p>
                  <a 
                    href="mailto:partnerships@solvebridge.africa" 
                    className="text-primary font-semibold hover:underline"
                  >
                    partnerships@solvebridge.africa
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">

            <Card className="max-w-2xl mx-auto border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-3xl">Partner Registration</CardTitle>
                <CardDescription className="text-base pt-2">
                  Fill out the form below to start your partnership journey with SolveBridge Africa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    registerMutation.mutate(formData);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium">Organization Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Organization Type</label>
                    <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {partnerTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Contact Person</label>
                    <Input
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message / Focus Area</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      placeholder="Tell us about your organization and focus areas..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}