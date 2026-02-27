// admin/Partners.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Building2, Mail, User, Shield, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPartners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    contact_email: "",
    logo_url: "",
    access_level: "read_only", // default
    notes: "",
  });

  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createPartner = useMutation({
    mutationFn: async (partner: any) => {
      const statusMap: Record<string, string | null> = {
        full_access: "active",
        write_access: "pending",
        read_only: null,
      };

      const { data, error } = await supabase
        .from("partners")
        .insert([{ ...partner, status: statusMap[partner.access_level] }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["partners"]);
      toast({ title: "Partner added successfully" });
      setDialogOpen(false);
      setFormData({
        name: "",
        contact_name: "",
        contact_email: "",
        logo_url: "",
        access_level: "read_only",
        notes: "",
      });
    },
    onError: (error: any) => {
      toast({ title: "Error adding partner", description: error.message, variant: "destructive" });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Partners Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage partner organizations and their access levels
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createPartner.mutate(formData);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Contact Person</Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access_level">Access Level</Label>
                  <Select
                    value={formData.access_level}
                    onValueChange={(value) => setFormData({ ...formData, access_level: value })}
                  >
                    <SelectTrigger id="access_level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read_only">Read Only</SelectItem>
                      <SelectItem value="write_access">Write Access</SelectItem>
                      <SelectItem value="full_access">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-primary">
                    Add Partner
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Partner Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{partners?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {partners?.filter(p => p.status === "active").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {partners?.filter(p => p.status === "pending").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
