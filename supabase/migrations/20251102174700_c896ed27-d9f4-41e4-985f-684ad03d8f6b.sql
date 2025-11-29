-- Add missing fields to problems table that were used in the submit problem form
ALTER TABLE problems
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS impact_scale TEXT CHECK (impact_scale IN ('Local', 'Regional', 'National')),
ADD COLUMN IF NOT EXISTS stakeholders TEXT;