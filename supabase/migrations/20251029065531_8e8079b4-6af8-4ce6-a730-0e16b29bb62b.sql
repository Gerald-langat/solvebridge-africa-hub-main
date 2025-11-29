-- Fix Security Issues and Add Phase 3 Tables (Fixed Order)

-- 1. Create proper role system
CREATE TYPE public.app_role AS ENUM ('super_admin', 'moderator', 'program_manager', 'partner', 'community_ambassador', 'read_only_viewer', 'problem_submitter', 'innovator', 'mentor');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 2. Remove role from profiles and update policies
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS collaboration_mode;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS preferred_sectors;

-- Fix profiles RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'moderator', 'program_manager']::app_role[]));

-- 3. Add input validation constraints
ALTER TABLE public.problems 
  ADD CONSTRAINT title_length CHECK (char_length(title) BETWEEN 10 AND 200),
  ADD CONSTRAINT description_length CHECK (char_length(description) BETWEEN 50 AND 5000);

-- 4. Update problems policies for moderation
DROP POLICY IF EXISTS "Users can update own problems" ON public.problems;

CREATE POLICY "Users can update own unvalidated problems"
  ON public.problems FOR UPDATE
  USING (auth.uid() = submitter_id AND status != 'validated')
  WITH CHECK (auth.uid() = submitter_id AND status != 'validated');

CREATE POLICY "Moderators can update problem status"
  ON public.problems FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'moderator']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'moderator']::app_role[]));

-- 5. Create view for public problems (without submitter_id)
CREATE OR REPLACE VIEW public.validated_problems_public AS
SELECT 
  id, title, description, sector, location, affected_population,
  severity, current_workaround, suggested_solution, 
  open_to_collaborate, status, image_url, views_count,
  created_at, updated_at
FROM public.problems
WHERE status = 'validated';

-- 6. Bounties table
CREATE TABLE public.bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 10 AND 150),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 50 AND 3000),
  reward_amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  deadline TIMESTAMPTZ,
  criteria TEXT,
  tags TEXT[],
  target_regions TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'awarded')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  awarded_to UUID REFERENCES auth.users(id),
  submissions_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bounties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active bounties"
  ON public.bounties FOR SELECT
  USING (status = 'active' OR auth.uid() = created_by);

CREATE POLICY "Program managers can manage bounties"
  ON public.bounties FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'program_manager']::app_role[]));

CREATE TRIGGER update_bounties_updated_at
  BEFORE UPDATE ON public.bounties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  contact_email TEXT,
  contact_name TEXT,
  access_level TEXT DEFAULT 'read_only' CHECK (access_level IN ('read_only', 'reviewer', 'contributor')),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage partners"
  ON public.partners FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'program_manager']::app_role[]));

CREATE POLICY "Partners can view own profile"
  ON public.partners FOR SELECT
  USING (public.has_role(auth.uid(), 'partner'));

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Projects table (for collaboration tracking) - without RLS yet
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ideation' CHECK (status IN ('ideation', 'in_progress', 'prototype', 'testing', 'deployed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  deadline TIMESTAMPTZ,
  budget_allocated DECIMAL(10, 2),
  budget_spent DECIMAL(10, 2) DEFAULT 0,
  people_impacted INT DEFAULT 0,
  jobs_created INT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Project members table - created BEFORE projects RLS
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('lead', 'member', 'contributor', 'observer')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- NOW add projects RLS policies that reference project_members
CREATE POLICY "Users can view projects they're part of"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = created_by OR
    auth.uid() IN (SELECT user_id FROM public.project_members WHERE project_id = id) OR
    public.has_any_role(auth.uid(), ARRAY['super_admin', 'moderator', 'program_manager']::app_role[])
  );

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'program_manager']::app_role[]));

-- Project members RLS
CREATE POLICY "Users can view project members"
  ON public.project_members FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM public.project_members WHERE project_id = project_members.project_id) OR
    public.has_any_role(auth.uid(), ARRAY['super_admin', 'moderator', 'program_manager']::app_role[])
  );

CREATE POLICY "Admins can manage project members"
  ON public.project_members FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'program_manager']::app_role[]));

-- 10. Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'moderator']::app_role[]));

-- Create index for better performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 11. System settings table
CREATE TABLE public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can manage settings"
  ON public.system_settings FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- 12. Update handle_new_user trigger to assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'problem_submitter');
  
  -- Create welcome milestone
  INSERT INTO public.milestones (user_id, title, description)
  VALUES (
    NEW.id,
    'Welcome to SolveBridge Africa!',
    'Your innovation journey begins here.'
  );
  
  RETURN NEW;
END;
$$;

-- 13. Add moderation notes to problems
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS moderator_notes TEXT;
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS duplicate_of UUID REFERENCES public.problems(id);
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 14. Insert initial system settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('platform_name', '"SolveBridge Africa"', 'Platform name'),
  ('moderation_queue_alert_threshold', '50', 'Alert when queue exceeds this number'),
  ('max_submissions_per_user_per_day', '5', 'Rate limit for problem submissions'),
  ('enable_public_explorer', 'true', 'Enable public problem explorer')
ON CONFLICT (key) DO NOTHING;