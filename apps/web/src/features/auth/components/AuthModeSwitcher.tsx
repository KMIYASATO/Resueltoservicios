import Link from "next/link";
import { cn } from "@/lib/cn";
import type { AuthIntent, AuthMode } from "../types/auth.types";

type AuthModeSwitcherProps = {
  mode: AuthMode;
  email: string;
  intent: AuthIntent;
  returnTo: string;
};

function buildHref(mode: AuthMode, email: string, intent: AuthIntent, returnTo: string) {
  const params = new URLSearchParams();
  if (email.trim()) params.set("email", email.trim());
  if (intent === "professional") params.set("intent", "professional");
  if (returnTo !== "/") params.set("returnTo", returnTo);
  const query = params.toString();
  return `/auth/${mode}/${query ? `?${query}` : ""}`;
}

export function AuthModeSwitcher({ mode, email, intent, returnTo }: AuthModeSwitcherProps) {
  return (
    <div className="grid grid-cols-2 rounded-full bg-neutral-100 p-1" aria-label="Elegir acción de cuenta">
      {(["login", "register"] as const).map((item) => (
        <Link
          key={item}
          href={buildHref(item, email, intent, returnTo)}
          className={cn(
            "rounded-full px-4 py-2 text-center text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
            mode === item ? "bg-white text-brand-700 shadow-sm" : "text-neutral-600 hover:text-brand-700"
          )}
          aria-current={mode === item ? "page" : undefined}
        >
          {item === "login" ? "Ingresar" : "Crear cuenta"}
        </Link>
      ))}
    </div>
  );
}
