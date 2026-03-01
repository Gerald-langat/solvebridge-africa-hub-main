import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole =
  | "super_admin"
  | "moderator"
  | "program_manager"
  | "partner"
  | "community_ambassador"
  | "admin"
  | "contributor"
  | "innovator"
  | "mentor";

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();

  const [roles, setRoles] = useState<UserRole[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to settle
    if (authLoading) return;

    // Not logged in
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

        console.log("user roles:", data);

      if (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      } else {
        setRoles((data ?? []).map(r => r.role as UserRole));
      }

      setLoading(false);
    };

    fetchRoles();
  }, [user, authLoading]);

  // 🟢 Move the log AFTER isAdmin is defined
  const hasRole = (role: UserRole) => !!roles?.includes(role);

  const hasAnyRole = (checkRoles: UserRole[]) =>
    !!roles?.some(role => checkRoles.includes(role));

  const isAdmin =
    roles !== null &&
    hasAnyRole(["super_admin", "moderator", "program_manager", "admin"]);

  return { roles, loading, hasRole, hasAnyRole, isAdmin };
}
