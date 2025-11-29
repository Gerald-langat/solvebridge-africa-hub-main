-- Add INSERT policy for audit_logs table
-- This allows authenticated users to create audit logs for their own actions
CREATE POLICY "Authenticated users can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add comment to document the policy
COMMENT ON POLICY "Authenticated users can create audit logs" ON audit_logs IS 
  'Allows users to log their own actions. Used by moderators to track validation/decline activities.';