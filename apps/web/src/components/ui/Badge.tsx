import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "brand" | "action" | "success" | "neutral";

const toneClass: Record<BadgeTone, string> = {
  brand: "bg-brand-100 text-brand-700",
  action: "bg-action-100 text-neutral-950",
  success: "bg-success-100 text-success-600",
  neutral: "bg-neutral-100 text-neutral-700"
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", toneClass[tone])}>
      {children}
    </span>
  );
}
