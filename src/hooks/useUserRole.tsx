import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = 
  | 'super_admin' 
  | 'moderator' 
  | 'program_manager' 
  | 'partner' 
  | 'community_ambassador' 
  | 'read_only_viewer' 
  | 'problem_submitter' 
  | 'innovator' 
  | 'mentor';

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      } else {
        setRoles(data?.map(r => r.role as UserRole) || []);
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const hasRole = (role: UserRole) => roles.includes(role);
  
  const hasAnyRole = (checkRoles: UserRole[]) => 
    checkRoles.some(role => roles.includes(role));

  const isAdmin = hasAnyRole(['super_admin', 'moderator', 'program_manager']);

  return { roles, loading, hasRole, hasAnyRole, isAdmin };
}
