import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AuthFeedbackState } from "../types/auth.types";

const toneClasses = {
  info: "border-brand-200 bg-brand-100 text-brand-800",
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800"
};

export function AuthFeedback({ feedback }: { feedback: AuthFeedbackState }) {
  if (!feedback) return null;

  const Icon = feedback.tone === "error" ? AlertCircle : feedback.tone === "success" ? CheckCircle2 : Info;

  return (
    <div className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm font-medium", toneClasses[feedback.tone])} role="status" aria-live="polite">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{feedback.message}</p>
    </div>
  );
}
