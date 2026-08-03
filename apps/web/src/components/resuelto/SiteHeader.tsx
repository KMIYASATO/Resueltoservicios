"use client";

import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthTriggerButton } from "@/features/auth/components/AuthTriggerButton";
import { cn } from "@/lib/cn";
import { MainSearch } from "./MainSearch";
import { ResueltoLogo } from "./ResueltoLogo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-normal ease-standard", scrolled ? "border-neutral-200 shadow-sm" : "border-neutral-200/70")}>
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:px-8 min-[1100px]:min-h-[84px] min-[1100px]:flex-nowrap min-[1280px]:gap-x-6">
        <div className="shrink-0">
          <ResueltoLogo compact />
        </div>

        <div className="order-3 w-full md:flex md:justify-center min-[1100px]:order-none min-[1100px]:w-auto min-[1100px]:flex-1">
          <MainSearch compact />
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex min-[1100px]:ml-0 min-[1280px]:gap-4">
          <AuthTriggerButton auth={{ mode: "register", accountIntent: "professional", returnTo: "/profesionales/onboarding/", pendingAction: "professional-onboarding" }} variant="professional" className="group">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            <span className="hidden text-left leading-tight min-[1280px]:grid">
              <span className="text-[11px] font-semibold text-neutral-600">Para profesionales</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                Ofrecer servicios <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 min-[1280px]:hidden">
              Ofrecer servicios <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </AuthTriggerButton>

          <div className="hidden h-8 w-px bg-neutral-200 min-[1180px]:block" aria-hidden="true" />

          <div className="flex items-center gap-2">
            <AuthTriggerButton auth={{ mode: "login" }} variant="accountSecondary">Iniciar sesión</AuthTriggerButton>
            <AuthTriggerButton auth={{ mode: "register" }} variant="accountPrimary">Registrarme</AuthTriggerButton>
          </div>
        </div>

        <div className="ml-auto md:hidden">
          <AuthTriggerButton auth={{ mode: "login" }} variant="accountSecondary" className="px-3 text-sm">Cuenta</AuthTriggerButton>
        </div>
      </div>
    </header>
  );
}
