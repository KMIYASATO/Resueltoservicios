import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { getPasswordRequirements } from "../validation/auth.validation";

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="mt-3 grid gap-2 text-sm" aria-label="Requisitos de contraseña">
      {getPasswordRequirements(password).map((requirement) => (
        <li key={requirement.key} className={cn("flex items-center gap-2", requirement.met ? "text-brand-700" : "text-neutral-500")}>
          <CheckCircle2 className={cn("h-4 w-4", requirement.met ? "text-brand-600" : "text-neutral-300")} aria-hidden="true" />
          {requirement.label}
        </li>
      ))}
    </ul>
  );
}
