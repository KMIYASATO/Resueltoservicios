import { cn } from "@/lib/cn";
import type { AuthMode } from "../types/auth.types";

type AuthModeSwitcherProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};

export function AuthModeSwitcher({ mode, onModeChange }: AuthModeSwitcherProps) {
  return (
    <div className="grid min-h-[44px] grid-cols-2 rounded-md bg-neutral-100 p-1" aria-label="Elegir acción de cuenta" role="tablist">
      {(["login", "register"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            "min-h-9 rounded-[10px] px-3 text-center text-sm font-semibold transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
            mode === item ? "bg-white text-brand-700 shadow-xs" : "bg-transparent text-neutral-600 hover:text-brand-700"
          )}
          aria-selected={mode === item}
          role="tab"
          onClick={() => onModeChange(item)}
        >
          {item === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
      ))}
    </div>
  );
}
