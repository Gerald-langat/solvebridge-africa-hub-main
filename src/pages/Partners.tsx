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
        ...data,
        access_level: null, // always null for public registration
        status: "pending",  // always pending
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
          <div className="container mx-auto px-4 lg:px-8 text-center">
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
        </section>

        {/* Partner Registration Form */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="max-w-2xl mx-auto border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-3xl">Partner Registration</CardTitle>
                <CardDescription className="text-base pt-2">
                  Fill out the form below to start your partnership journey
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
