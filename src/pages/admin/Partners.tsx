// admin/Partners.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Building2, Mail, User, Shield, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Partners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    contact_email: "",
    logo_url: "",
    access_level: "read_only",
    notes: "",
  });
    const { user } = useAuth();
  
  const uploadImage = async (file: File) => {
    if (!user) throw new Error("Not authenticated");
  
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
  
    const { error } = await supabase.storage
      .from("problem-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
  
    if (error) throw error;
  
    const { data } = supabase.storage
      .from("problem-images")
      .getPublicUrl(fileName);
  
    return data.publicUrl;
  };

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
      const { data, error } = await supabase
        .from("partners")
        .insert([partner])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPartner.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary text-primary-foreground";
      case "pending": return "bg-secondary text-secondary-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "full_access": return "bg-accent text-accent-foreground";
      case "write": return "bg-primary text-primary-foreground";
      case "read_only": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

const approvePartner = async (id: string, access: string) => {
  await supabase
    .from("partners")
    .update({
      status: "active",
      access_level: access,
    })
    .eq("id", id);
};




  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

  {/* Header + Add Partner */}
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
        <Button className="bg-gradient-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Partner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {/* Add Partner Form */}
      </DialogContent>
    </Dialog>
  </div>

  {/* Stats Overview */}
  <div className="grid gap-4 md:grid-cols-4">
    {/* Total Partners */}
    <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
        <Building2 className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{partners?.length || 0}</div>
      </CardContent>
    </Card>

    {/* Active Partners */}
    <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
        <Building2 className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-accent">
          {partners?.filter(p => p.status === "active").length || 0}
        </div>
      </CardContent>
    </Card>

    {/* Pending */}
    <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium">Pending</CardTitle>
        <User className="h-4 w-4 text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-secondary">
          {partners?.filter(p => p.status === "pending").length || 0}
        </div>
      </CardContent>
    </Card>

    {/* Full Access */}
    <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium">Full Access</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {partners?.filter(p => p.access_level === "full_access").length || 0}
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Partners List */}
  <div className="space-y-4">
    {partners?.map(partner => (
      <Card
        key={partner.id}
        className="shadow-soft hover:shadow-medium transition-shadow flex flex-col md:flex-row items-center justify-between p-4 gap-4"
      >
        {/* Logo + Info */}
        <div className="flex items-center gap-4 flex-1">
          {partner.logo_url && (
            <img
              src={partner.logo_url}
              alt={partner.name}
              className="w-16 h-16 object-contain rounded-lg border"
            />
          )}
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{partner.name}</CardTitle>
            <CardDescription className="flex gap-2 text-sm text-muted-foreground">
              {partner.contact_name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{partner.contact_name}</span>}
              {partner.contact_email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{partner.contact_email}</span>}
            </CardDescription>
            {partner.notes && <p className="text-xs text-muted-foreground mt-1">{partner.notes}</p>}
          </div>
        </div>

        {/* Status + Access + Approve */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Badge className={getStatusColor(partner.status || "pending")}>{partner.status || "pending"}</Badge>
          <Badge className={getAccessLevelColor(partner.access_level || "read_only")}>
            {partner.access_level?.replace("_", " ") || "read only"}
          </Badge>
          {(partner.status !== "active" || partner.access_level !== "full_access") && (
            <Button
              size="sm"
              className="bg-gradient-primary"
              onClick={() => approvePartner(partner.id, "full_access")}
            >
              Approve
            </Button>
          )}
        </div>
      </Card>
    ))}
  </div>
</div>
    </DashboardLayout>
  );
}
