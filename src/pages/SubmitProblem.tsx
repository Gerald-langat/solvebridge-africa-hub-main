import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, MessageSquare, Upload } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

const STEPS = ["Problem Overview", "Impact Details & Stakeholders", "Verification & Submission"];
const CATEGORIES = ["Agriculture", "Health", "Education", "Environment", "Governance", "Technology", "Other"];
const IMPACT_SCALES = ["Local", "Regional", "National"];

// Validation schema
const problemSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200, "Title must be less than 200 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters").max(200, "Summary must be less than 200 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(800, "Description must be less than 800 characters"),
  sector: z.string().min(1, "Please select a category"),
  location: z.string().min(2, "Location is required").max(100, "Location must be less than 100 characters"),
  target_audience: z.string().min(2, "Target audience must be at least 10 characters").max(500, "Target audience must be less than 500 characters"),
  impact_scale: z.string().min(1, "Please select an impact scale"),
  stakeholders: z.string().max(500, "Stakeholders must be less than 500 characters").optional(),
  image_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  customSector: z.string().optional(),

});

export default function SubmitProblem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    sector: "",
      customSector: "",
    location: "",
    target_audience: "",
    impact_scale: "",
    stakeholders: "",
    image_url: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async () => {
    if (!confirmed) {
      toast({
        title: "Confirmation required",
        description: "Please confirm the accuracy of your information",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Validate form data
      const validatedData = problemSchema.parse(formData);

      const finalSector =
  formData.sector === "Other"
    ? formData.customSector
    : formData.sector;


      const { error } = await supabase.from("problems").insert([{
        title: validatedData.title.trim(),
        description: validatedData.description.trim(),
        sector: finalSector.toLowerCase() as any,
        location: validatedData.location.trim(),
        affected_population: validatedData.target_audience.trim(),
        image_url: validatedData.image_url || null,
        submitter_id: user?.id,
        status: 'pending' as any,
        open_to_collaborate: true,
      }]);

      if (error) throw error;

      toast({
        title: "Problem submitted successfully! 🎉",
        description: "Your submission has been sent for review. You'll receive an update once approved.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation failed",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Submit a Problem</h1>
            <p className="text-muted-foreground mt-2">
              Help us understand the challenge you're facing
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium mb-2 flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={`${i <= step ? "text-primary" : "text-muted-foreground"} flex items-center`}
                >
                  {i < step ? <CheckCircle className="inline h-4 w-4 mr-1" /> : <span className="mr-1">{i + 1}.</span>}
                  <span className="hidden md:inline">{s}</span>
                  <span className="md:hidden">Step {i + 1}</span>
                </span>
              ))}
            </div>
            <Progress value={(step / (STEPS.length - 1)) * 100} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
              <CardDescription>
                {step === 0 && "Describe the challenge you're facing — be as specific as possible"}
                {step === 1 && "Help us understand who is affected and the scale of impact"}
                {step === 2 && "Review your details before submission"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Problem Title *</Label>
                    <Input
                      id="title"
                      placeholder="Give your problem a short title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Problem Summary *</Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief summary of the challenge (max 200 characters)"
                      rows={2}
                      maxLength={200}
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.summary.length}/200 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the challenge in detail (max 800 characters)"
                      rows={6}
                      maxLength={800}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.description.length}/800 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
  <Label htmlFor="sector">Category *</Label>

  <Select
    value={formData.sector}
    onValueChange={(value) =>
      setFormData({ ...formData, sector: value })
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select category" />
    </SelectTrigger>

    <SelectContent>
      {CATEGORIES.map((category) => (
        <SelectItem key={category} value={category}>
          {category}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>


</div>
  {formData.sector === "Other" && (
  <div className="space-y-2">
    <Label htmlFor="customSector">Enter category *</Label>
    <Input
      id="customSector"
      placeholder="Enter custom category"
      value={formData.customSector}
      onChange={(e) =>
        setFormData({ ...formData, customSector: e.target.value })
      }
      required
    />
  </div>
)}
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (Country + City) *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Kenya, Nairobi"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Supporting Image (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="url"
                        placeholder="Image URL"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Paste an image URL or upload will be available soon
                    </p>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="target_audience">Target Audience *</Label>
                    <Textarea
                      id="target_audience"
                      placeholder="Who does this problem affect? (e.g., local farmers, youth, students)"
                      rows={3}
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact_scale">Estimated Impact Scale *</Label>
                    <Select
                      value={formData.impact_scale}
                      onValueChange={(value) => setFormData({ ...formData, impact_scale: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select impact scale" />
                      </SelectTrigger>
                      <SelectContent>
                        {IMPACT_SCALES.map((scale) => (
                          <SelectItem key={scale} value={scale}>
                            {scale}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stakeholders">Key Stakeholders</Label>
                    <Textarea
                      id="stakeholders"
                      placeholder="List key stakeholders involved or affected (e.g., government agencies, NGOs, community leaders)"
                      rows={3}
                      value={formData.stakeholders}
                      onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
                    />
                  </div>

                  {/* SolveAI Suggestion Panel */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Need help framing your problem?</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Ask SolveAI for improvement suggestions on your submission.
                          </p>
                          <Button variant="outline" size="sm" type="button">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Open SolveAI Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Verify Your Details Before Submission</h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Problem Title</h4>
                        <p className="text-sm">{formData.title || "Not provided"}</p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Summary</h4>
                        <p className="text-sm">{formData.summary || "Not provided"}</p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Description</h4>
                        <p className="text-sm">{formData.description || "Not provided"}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Category</h4>
                          <p className="text-sm">{formData.sector || "Not provided"}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Location</h4>
                          <p className="text-sm">{formData.location || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Target Audience</h4>
                        <p className="text-sm">{formData.target_audience || "Not provided"}</p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Impact Scale</h4>
                        <p className="text-sm">{formData.impact_scale || "Not provided"}</p>
                      </div>

                      {formData.stakeholders && (
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Key Stakeholders</h4>
                          <p className="text-sm">{formData.stakeholders}</p>
                        </div>
                      )}

                      {formData.image_url && (
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">Supporting Image</h4>
                          <img src={formData.image_url} alt="Problem" className="mt-2 rounded-lg max-h-48 object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <Checkbox
                        id="confirm"
                        checked={confirmed}
                        onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                      />
                      <Label htmlFor="confirm" className="cursor-pointer text-sm leading-relaxed">
                        I confirm this information is accurate and I have the right to share it
                      </Label>
                    </div>
                  </div>
                </>
              )}


              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0 || isSubmitting}
                >
                  ← Back
                </Button>
                
                {step < STEPS.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (step === 0 && (!formData.title || !formData.summary || !formData.description || !formData.sector || !formData.location)) ||
                      (step === 1 && (!formData.target_audience || !formData.impact_scale))
                    }
                  >
                    Next → {step === 0 ? "Impact Details" : "Verification"}
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting || !confirmed}>
                    {isSubmitting ? "Submitting..." : "Submit Problem for Review"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
