-- Add solution-related fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS approach TEXT CHECK (approach IN ('Product', 'Service', 'Policy', 'Research', 'Hybrid')),
ADD COLUMN IF NOT EXISTS feasibility_level TEXT CHECK (feasibility_level IN ('Idea', 'Prototype', 'MVP', 'Tested Solution')),
ADD COLUMN IF NOT EXISTS key_benefits TEXT[],
ADD COLUMN IF NOT EXISTS value_proposition TEXT,
ADD COLUMN IF NOT EXISTS estimated_cost NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS concept_document_url TEXT;

-- Update status enum to include solution-specific statuses
ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE projects
ADD CONSTRAINT projects_status_check 
CHECK (status IN ('ideation', 'Draft', 'Pending', 'Approved', 'In Progress', 'Implemented', 'Completed'));

-- Add RLS policy for innovators to submit solutions
CREATE POLICY "Innovators can create solutions"
ON projects
FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  has_any_role(auth.uid(), ARRAY['innovator'::app_role, 'super_admin'::app_role])
);

-- Add RLS policy for innovators to view their own solutions
CREATE POLICY "Innovators can view own solutions"
ON projects
FOR SELECT
USING (
  auth.uid() = created_by OR
  has_any_role(auth.uid(), ARRAY['super_admin'::app_role, 'moderator'::app_role, 'program_manager'::app_role])
);

-- Add RLS policy for innovators to update their draft solutions
CREATE POLICY "Innovators can update own draft solutions"
ON projects
FOR UPDATE
USING (
  auth.uid() = created_by AND status IN ('Draft', 'ideation')
)
WITH CHECK (
  auth.uid() = created_by AND status IN ('Draft', 'ideation')
);