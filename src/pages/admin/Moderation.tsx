import { useEffect, useState } from "react";
import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, XCircle, Search, MapPin, Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Moderation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  useEffect(() => {
    fetchProblems();
  }, [statusFilter]);

  const fetchProblems = async () => {
    let query = supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq('status', statusFilter as 'pending' | 'validated' | 'declined');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching problems:', error);
    } else {
      setProblems(data || []);
    }
  };

  const logAction = async (action: string, problemId: string, details: any) => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action,
      entity_type: 'problem',
      entity_id: problemId,
      details
    });
  };

  const handleValidate = async (problemId: string) => {
    const { error } = await supabase
  .from('problems')
  .update({
    status: 'validated',
    moderated_by: user?.id,
    moderated_at: new Date().toISOString(),
    moderator_notes: moderatorNotes
  })
  .eq('id', problemId);

if (error) {
  console.error("Validate error:", error); // 👈 ADD THIS
  toast({
    title: "Error",
    description: error.message, // 👈 SHOW REAL ERROR
    variant: "destructive"
  });
} else {
      await logAction('validated_problem', problemId, { notes: moderatorNotes });
      toast({
        title: "Success",
        description: "Problem validated successfully"
      });
      setSelectedProblem(null);
      setModeratorNotes("");
      fetchProblems();
    }
  };

  const handleDecline = async (problemId: string) => {
    if (!moderatorNotes) {
      toast({
        title: "Error",
        description: "Please provide a reason for declining",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('problems')
      .update({ 
        status: 'declined' as const,
        moderated_by: user?.id,
        moderated_at: new Date().toISOString(),
        moderator_notes: moderatorNotes
      })
      .eq('id', problemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to decline problem",
        variant: "destructive"
      });
    } else {
      await logAction('declined_problem', problemId, { reason: moderatorNotes });
      toast({
        title: "Success",
        description: "Problem declined"
      });
      setSelectedProblem(null);
      setModeratorNotes("");
      fetchProblems();
    }
  };

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'validated': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Problem Moderation</h1>
              <p className="text-muted-foreground">Review and validate community submissions</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "validated" ? "default" : "outline"}
                  onClick={() => setStatusFilter("validated")}
                >
                  Validated
                </Button>
                <Button
                  variant={statusFilter === "declined" ? "default" : "outline"}
                  onClick={() => setStatusFilter("declined")}
                >
                  Declined
                </Button>
              </div>
            </div>
          </Card>

          {/* Problems List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProblems.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No problems found</p>
              </Card>
            ) : (
              filteredProblems.map((problem) => (
                <Card key={problem.id} className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{problem.title}</h3>
                        <Badge className={getStatusColor(problem.status)}>
                          {problem.status}
                        </Badge>
                        <Badge variant="outline">{problem.sector}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {problem.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {problem.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(problem.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Severity: {problem.severity}/5
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedProblem(problem)}>
                      Review
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Review Dialog */}
          <Dialog open={!!selectedProblem} onOpenChange={() => setSelectedProblem(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Review Problem</DialogTitle>
                <DialogDescription>
                  Review the submission details and take action
                </DialogDescription>
              </DialogHeader>
              
              {selectedProblem && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedProblem.title}</h3>
                    <Badge className={getStatusColor(selectedProblem.status)}>
                      {selectedProblem.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{selectedProblem.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Sector</p>
                      <Badge variant="outline">{selectedProblem.sector}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Location</p>
                      <p className="text-sm text-muted-foreground">{selectedProblem.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Severity</p>
                      <p className="text-sm text-muted-foreground">{selectedProblem.severity}/5</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Open to Collaborate</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProblem.open_to_collaborate ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  {selectedProblem.affected_population && (
                    <div>
                      <p className="text-sm font-medium mb-1">Affected Population</p>
                      <p className="text-sm text-muted-foreground">{selectedProblem.affected_population}</p>
                    </div>
                  )}

                  {selectedProblem.current_workaround && (
                    <div>
                      <p className="text-sm font-medium mb-1">Current Workaround</p>
                      <p className="text-sm text-muted-foreground">{selectedProblem.current_workaround}</p>
                    </div>
                  )}

                  {selectedProblem.suggested_solution && (
                    <div>
                      <p className="text-sm font-medium mb-1">Suggested Solution</p>
                      <p className="text-sm text-muted-foreground">{selectedProblem.suggested_solution}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Moderator Notes
                    </label>
                    <Textarea
                      placeholder="Add notes about your decision..."
                      value={moderatorNotes}
                      onChange={(e) => setModeratorNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProblem(null);
                        setModeratorNotes("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDecline(selectedProblem.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button
                      onClick={() => handleValidate(selectedProblem.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Validate
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}
