import { supabase } from "@/integrations/supabase/client";

type ValidationStatus = "validated" | "declined";

export async function validateProblem({
  problemId,
  status,
  adminId,
}: {
  problemId: string;
  status: ValidationStatus;
  adminId: string;
}) {
  if (!problemId || !status) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase
    .from("problems")
    .update({
      status,
      validated_at: new Date().toISOString(),
      validated_by: adminId,
    })
    .eq("id", problemId);

  if (error) {
    console.error("Validation error:", error);
    throw error;
  }

  return true;
}
