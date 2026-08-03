import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel: string;
  children: ReactNode;
};

export function AuthSubmitButton({ className, children, disabled, loading = false, loadingLabel, ...props }: AuthSubmitButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-[background-color,box-shadow,transform] duration-fast ease-standard hover:bg-brand-800 active:scale-[0.98] active:bg-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 disabled:active:scale-100",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      <span>{loading ? loadingLabel : children}</span>
    </button>
  );
}
