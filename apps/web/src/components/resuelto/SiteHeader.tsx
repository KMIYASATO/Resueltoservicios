"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ResueltoLogo } from "./ResueltoLogo";

const navItems = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#populares", label: "Servicios" },
  { href: "#categorias", label: "Categorias" },
  { href: "#profesionales", label: "Profesionales" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 bg-white/92 backdrop-blur transition-shadow duration-normal ease-standard", scrolled ? "border-b border-neutral-200 shadow-sm" : "border-b border-transparent")}> 
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <ResueltoLogo />
        <nav className="hidden items-center gap-2 text-sm font-semibold text-neutral-700 lg:flex" aria-label="Principal">
          {navItems.map((item) => (
            <a key={item.href} className="rounded-full px-4 py-2 transition-colors duration-fast ease-standard hover:bg-brand-100 hover:text-brand-700" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <a className="rounded-full px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-100" href="#">Iniciar sesion</a>
          <ButtonLink href="#profesionales" variant="primary">Ofrecer servicios</ButtonLink>
        </div>
        <button
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-neutral-200 bg-white text-brand-700 transition-colors hover:bg-brand-100 lg:hidden"
          type="button"
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 top-[73px] z-50 lg:hidden" id="mobile-menu">
          <button className="absolute inset-0 bg-brand-700/30" type="button" aria-label="Cerrar menu" onClick={() => setOpen(false)} />
          <div className="absolute right-3 top-3 w-[min(360px,calc(100vw-24px))] rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
            <nav className="grid gap-1" aria-label="Menu movil">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-4 py-3 font-semibold text-neutral-700 transition-colors hover:bg-brand-100 hover:text-brand-700">
                  {item.label}
                </a>
              ))}
              <a href="#" onClick={() => setOpen(false)} className="rounded-md px-4 py-3 font-semibold text-brand-600 hover:bg-brand-100">Iniciar sesion</a>
              <ButtonLink href="#profesionales" className="mt-2 w-full" onClick={() => setOpen(false)}>Ofrecer servicios</ButtonLink>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
