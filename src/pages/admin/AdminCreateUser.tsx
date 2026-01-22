import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";

export default function AdminCreateUser() {
  const { user } = useAuth();
  const { roles, isAdmin, loading } = useUserRole();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("moderator");

useEffect(() => {
  if (!loading) {
    if (!user) {
      navigate("/auth");
    } else if (!isAdmin) {
      navigate("/dashboard");
    }
  }
}, [user, isAdmin, loading, navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow super_admin to create admins
    if (!roles.includes("super_admin")) {
      alert("Only Super Admin can create admin users.");
      return;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (error) {
      return alert(error.message);
    }

    const newUser = data.user;

    await supabase.from("user_roles").insert([
      {
        user_id: newUser.id,
        role: role,
      },
    ]);

    alert("Admin user created successfully!");
    navigate("/admin");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Create Admin User</h1>

      <form onSubmit={handleCreate} className="space-y-4 mt-6">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          <option value="super_admin">Super Admin</option>
          <option value="moderator">Moderator</option>
          <option value="program_manager">Program Manager</option>
        </select>

        <button type="submit" className="btn">
          Create Admin
        </button>
      </form>
    </div>
  );
}
