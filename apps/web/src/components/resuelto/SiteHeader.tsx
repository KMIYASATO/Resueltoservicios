"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PrimaryCategoryNav } from "./PrimaryCategoryNav";
import { ResueltoLogo } from "./ResueltoLogo";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className={cn("sticky top-0 z-40 bg-white/94 backdrop-blur transition-shadow duration-normal ease-standard", scrolled ? "border-b border-neutral-200 shadow-sm" : "border-b border-transparent")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <ResueltoLogo />

        <div className="hidden items-center gap-3 sm:flex">
          <a className="rounded-full px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-100" href="#">Iniciar sesión</a>
          <ButtonLink href="#profesionales" variant="primary">Ofrecer servicios</ButtonLink>
        </div>

        <button
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-neutral-200 bg-white text-brand-700 transition-colors hover:bg-brand-100 sm:hidden"
          type="button"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      <div className="border-t border-neutral-200/70 bg-white/96 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PrimaryCategoryNav listClassName="lg:justify-center" />
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 top-[73px] z-50 sm:hidden" id="mobile-menu">
          <button className="absolute inset-0 bg-brand-700/30" type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-3 top-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-neutral-950">Cuenta</h2>
              <button className="rounded-md p-2 text-brand-700 hover:bg-brand-100" type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}>
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-3">
              <a href="#" onClick={() => setMobileOpen(false)} className="rounded-md px-4 py-3 font-semibold text-neutral-700 transition-colors hover:bg-brand-100 hover:text-brand-700">Iniciar sesión</a>
              <ButtonLink href="#profesionales" className="w-full" onClick={() => setMobileOpen(false)}>Ofrecer servicios</ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
