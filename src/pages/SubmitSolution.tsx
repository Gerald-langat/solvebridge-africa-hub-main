import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { z } from "zod";

// Validation schema
const solutionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(150, "Title must be less than 150 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters").max(150, "Summary must be less than 150 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(1000, "Description must be less than 1000 characters"),
  approach: z.string().min(1, "Please select an approach type"),
  value_proposition: z.string().min(20, "Value proposition must be at least 20 characters").max(500, "Value proposition must be less than 500 characters"),
  feasibility_level: z.string().min(1, "Please select a feasibility level"),
  key_benefits: z.string().max(500, "Benefits must be less than 500 characters").optional(),
  estimated_cost: z.string().optional(),
  currency: z.string().optional(),
  concept_document_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

export default function SubmitSolution() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    approach: "",
    key_benefits: "",
    value_proposition: "",
    estimated_cost: "",
    currency: "USD",
    feasibility_level: "",
    concept_document_url: "",
    confirmed: false,
  });

  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.title || !formData.summary || !formData.description || !formData.approach)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && (!formData.value_proposition || !formData.feasibility_level)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!formData.confirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that your proposal is original",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate form data
      const validatedData = solutionSchema.parse(formData);

      const benefitsArray = (validatedData.key_benefits || "")
        .split(',')
        .map(b => b.trim())
        .filter(b => b.length > 0);

      const { error } = await supabase.from('projects').insert({
        title: validatedData.title.trim(),
        summary: validatedData.summary.trim(),
        description: validatedData.description.trim(),
        problem_id: problemId,
        approach: validatedData.approach as any,
        key_benefits: benefitsArray,
        value_proposition: validatedData.value_proposition.trim(),
        estimated_cost: validatedData.estimated_cost ? parseFloat(validatedData.estimated_cost) : null,
        currency: validatedData.currency,
        feasibility_level: validatedData.feasibility_level as any,
        concept_document_url: validatedData.concept_document_url || null,
        status: 'Pending',
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Solution Submitted!",
        description: "Your solution has been submitted for evaluation.",
      });

      navigate(`/problem/${problemId}`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation failed",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const progress = (currentStep / 3) * 100;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Propose Your Solution</h1>
            <p className="text-muted-foreground">
              Problem: {problem?.title}
            </p>
          </div>

          <Progress value={progress} className="mb-8" />

          {/* Step 1: Solution Overview */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Solution Overview</CardTitle>
                <CardDescription>Describe your proposed solution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Solution Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Enter solution title"
                  />
                </div>

                <div>
                  <Label htmlFor="summary">Short Summary * (150 characters max)</Label>
                  <Input
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => updateField('summary', e.target.value.slice(0, 150))}
                    placeholder="Brief summary of your solution"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.summary.length}/150 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Full Description * (1000 characters max)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value.slice(0, 1000))}
                    placeholder="Provide a detailed description"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="approach">Approach Type *</Label>
                  <Select value={formData.approach} onValueChange={(val) => updateField('approach', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approach type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Policy">Policy</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="concept_document_url">Concept Document URL (optional)</Label>
                  <Input
                    id="concept_document_url"
                    type="url"
                    value={formData.concept_document_url}
                    onChange={(e) => updateField('concept_document_url', e.target.value)}
                    placeholder="https://example.com/document.pdf"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => navigate(`/problem/${problemId}`)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNext}>
                    Next: Value Proposition
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Value Proposition */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Value Proposition & Feasibility</CardTitle>
                <CardDescription>Describe why this solution works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="key_benefits">Key Benefits (comma-separated)</Label>
                  <Textarea
                    id="key_benefits"
                    value={formData.key_benefits}
                    onChange={(e) => updateField('key_benefits', e.target.value)}
                    placeholder="e.g., Low cost, Scalable, Easy to implement"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="value_proposition">Unique Value Proposition *</Label>
                  <Textarea
                    id="value_proposition"
                    value={formData.value_proposition}
                    onChange={(e) => updateField('value_proposition', e.target.value)}
                    placeholder="What makes your solution unique?"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated_cost">Estimated Implementation Cost</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      value={formData.estimated_cost}
                      onChange={(e) => updateField('estimated_cost', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(val) => updateField('currency', val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="KES">KES</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                        <SelectItem value="ZAR">ZAR</SelectItem>
                        <SelectItem value="GHS">GHS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="feasibility_level">Feasibility Level *</Label>
                  <Select value={formData.feasibility_level} onValueChange={(val) => updateField('feasibility_level', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feasibility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Idea">Idea</SelectItem>
                      <SelectItem value="Prototype">Prototype</SelectItem>
                      <SelectItem value="MVP">MVP</SelectItem>
                      <SelectItem value="Tested Solution">Tested Solution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="bg-accent/50 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium mb-2">Need help evaluating your solution?</p>
                        <p className="text-sm text-muted-foreground">
                          Use SolveAI to evaluate if your idea aligns with real user needs and get feasibility insights.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Next: Review & Submit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Review & Confirmation</CardTitle>
                <CardDescription>Verify your details before submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Solution Title</h3>
                    <p className="text-muted-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Summary</h3>
                    <p className="text-muted-foreground">{formData.summary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Description</h3>
                    <p className="text-muted-foreground">{formData.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Approach</h3>
                    <p className="text-muted-foreground">{formData.approach}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Feasibility Level</h3>
                    <p className="text-muted-foreground">{formData.feasibility_level}</p>
                  </div>
                  {formData.estimated_cost && (
                    <div>
                      <h3 className="font-semibold mb-1">Estimated Cost</h3>
                      <p className="text-muted-foreground">
                        {formData.currency} {parseFloat(formData.estimated_cost).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 pt-4 border-t">
                  <Checkbox
                    id="confirm"
                    checked={formData.confirmed}
                    onCheckedChange={(checked) => updateField('confirmed', checked)}
                  />
                  <Label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
                    I confirm this proposal is original and based on an approved problem. I understand it will be reviewed before publication.
                  </Label>
                </div>

                <div className="flex justify-between gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.confirmed}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Solution for Validation'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
