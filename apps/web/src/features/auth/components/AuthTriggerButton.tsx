"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { OpenAuthModalOptions } from "../types/auth.types";
import { useAuthModal } from "../hooks/useAuthModal";

type AuthTriggerVariant = "primary" | "secondary" | "tertiary" | "link" | "accountPrimary" | "accountSecondary" | "professional";

const variants: Record<AuthTriggerVariant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900",
  secondary: "border border-brand-600 bg-white text-brand-600 hover:bg-brand-100 active:bg-brand-100",
  tertiary: "text-brand-600 hover:bg-brand-100 hover:text-brand-700 active:bg-brand-100",
  link: "text-brand-600 hover:bg-brand-100",
  accountPrimary: "h-[45px] min-h-[45px] rounded-md border border-brand-600 bg-brand-600 px-4 py-0 text-[15px] text-white shadow-none hover:bg-brand-800",
  accountSecondary: "h-[45px] min-h-[45px] rounded-md border border-[#BFD4CD] bg-white px-4 py-0 text-[15px] text-brand-600 shadow-none hover:border-brand-600 hover:bg-neutral-50",
  professional: "h-[45px] min-h-[45px] rounded-md bg-transparent px-3 py-0 text-left text-brand-700 shadow-none hover:bg-neutral-100"
};

type AuthTriggerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  auth: OpenAuthModalOptions;
  variant?: AuthTriggerVariant;
  children: ReactNode;
};

export function AuthTriggerButton({ auth, variant = "primary", className, children, onClick, ...props }: AuthTriggerButtonProps) {
  const { openAuthModal, session } = useAuthModal();

  return (
    <button
      className={cn("inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-standard active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600", variants[variant], className)}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (session) {
          if (auth.returnTo && auth.returnTo !== "/") window.location.assign(auth.returnTo);
          return;
        }
        openAuthModal(auth);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
