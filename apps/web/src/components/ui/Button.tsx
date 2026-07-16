import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900 disabled:bg-neutral-100 disabled:text-neutral-400",
  secondary: "border border-brand-600 bg-white text-brand-600 hover:bg-brand-100 active:bg-brand-100 disabled:border-neutral-200 disabled:text-neutral-400",
  tertiary: "text-brand-600 hover:bg-brand-100 hover:text-brand-700 active:bg-brand-100 disabled:text-neutral-400"
};

const baseClass =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-standard active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  loading?: boolean;
};

export function Button({ className, variant = "primary", children, disabled, loading = false, ...props }: ButtonProps) {
  return (
    <button className={cn(baseClass, variants[variant], className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      <span>{loading ? "Buscando..." : children}</span>
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function ButtonLink({ className, variant = "primary", children, ...props }: ButtonLinkProps) {
  return (
    <a className={cn(baseClass, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}
