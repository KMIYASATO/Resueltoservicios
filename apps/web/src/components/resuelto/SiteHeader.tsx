"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { categoryGroups, services } from "@/data/home";
import { cn } from "@/lib/cn";
import { PrimaryCategoryNav } from "./PrimaryCategoryNav";
import { ResueltoLogo } from "./ResueltoLogo";

const navItems = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#profesionales", label: "Profesionales" }
];

function serviceHref(slug: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/resultados/?servicio=${slug}&distrito=miraflores`;
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(categoryGroups[0].title);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const source = normalized
      ? services.filter((service) => service.name.toLowerCase().includes(normalized) || service.category.toLowerCase().includes(normalized))
      : services.filter((service) => service.category === activeCategory);
    return source;
  }, [activeCategory, query]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!megaOpen) return;
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setMegaOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [megaOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function scheduleOpen() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setMegaOpen(true), 110);
  }

  function scheduleClose() {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 200);
  }

  return (
    <header className={cn("sticky top-0 z-40 bg-white/94 backdrop-blur transition-shadow duration-normal ease-standard", scrolled ? "border-b border-neutral-200 shadow-sm" : "border-b border-transparent")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <ResueltoLogo />
        <nav className="hidden items-center gap-2 text-sm font-semibold text-neutral-700 lg:flex" aria-label="Principal">
          <div className="relative" onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
            <button
              ref={buttonRef}
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-fast ease-standard hover:bg-brand-100 hover:text-brand-700"
              aria-expanded={megaOpen}
              aria-controls="services-mega-menu"
              onClick={() => setMegaOpen((value) => !value)}
            >
              Servicios
              <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform duration-fast", megaOpen ? "rotate-180" : "")} />
            </button>
          </div>
          {navItems.map((item) => (
            <a key={item.href} className="rounded-full px-4 py-2 transition-colors duration-fast ease-standard hover:bg-brand-100 hover:text-brand-700" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <a className="rounded-full px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-100" href="#">Iniciar sesión</a>
          <ButtonLink href="#profesionales" variant="primary">Ofrecer servicios</ButtonLink>
        </div>
        <button
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-neutral-200 bg-white text-brand-700 transition-colors hover:bg-brand-100 lg:hidden"
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

      {megaOpen ? (
        <div className="absolute inset-x-0 top-[73px] z-50 hidden px-4 lg:block" onMouseEnter={scheduleOpen} onMouseLeave={scheduleClose}>
          <div
            ref={menuRef}
            id="services-mega-menu"
            className="mx-auto grid max-h-[70vh] max-w-6xl grid-cols-[280px_1fr] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
          >
            <div className="border-r border-neutral-200 bg-neutral-50 p-4">
              <label className="mb-4 flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus-within:border-brand-600">
                <Search aria-hidden="true" className="h-4 w-4 text-brand-600" />
                <input className="w-full bg-transparent outline-none" placeholder="Buscar servicio" value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
              <div className="grid gap-1" role="tablist" aria-label="Categorías de servicios">
                {categoryGroups.map((group) => (
                  <button
                    key={group.title}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === group.title}
                    className={cn("rounded-md px-3 py-3 text-left font-semibold transition-colors duration-fast", activeCategory === group.title ? "bg-brand-100 text-brand-700" : "text-neutral-700 hover:bg-white hover:text-brand-700")}
                    onMouseEnter={() => setActiveCategory(group.title)}
                    onFocus={() => setActiveCategory(group.title)}
                    onClick={() => setActiveCategory(group.title)}
                  >
                    {group.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-600">Servicios</p>
                  <h2 className="font-display text-2xl font-bold text-neutral-950">{query ? "Resultados de búsqueda" : activeCategory}</h2>
                </div>
                <a className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800" href="#catalogo" onClick={() => setMegaOpen(false)}>
                  Ver todos los servicios
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <a key={service.slug} href={serviceHref(service.slug)} onClick={() => setMegaOpen(false)} className="rounded-lg border border-neutral-200 p-4 transition-[border-color,background-color,transform] duration-fast hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-100">
                    <span className="font-semibold text-neutral-950">{service.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-neutral-600">{service.description}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 top-[153px] z-50 lg:hidden" id="mobile-menu">
          <button className="absolute inset-0 bg-brand-700/30" type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-3 top-3 max-h-[calc(100vh-176px)] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-neutral-950">Servicios</h2>
              <button className="rounded-md p-2 text-brand-700 hover:bg-brand-100" type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}>
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <label className="mb-4 flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-700 focus-within:border-brand-600">
              <Search aria-hidden="true" className="h-4 w-4 text-brand-600" />
              <input className="w-full bg-transparent outline-none" placeholder="Buscar servicio" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="grid gap-3">
              {categoryGroups.map((group) => {
                const open = activeCategory === group.title;
                return (
                  <div key={group.title} className="rounded-lg border border-neutral-200">
                    <button className="flex w-full items-center justify-between px-4 py-3 font-semibold text-neutral-950" type="button" aria-expanded={open} onClick={() => setActiveCategory(open ? "" : group.title)}>
                      {group.title}
                      <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
                    </button>
                    {open ? (
                      <div className="grid gap-1 border-t border-neutral-200 p-2">
                        {services.filter((service) => service.category === group.title).map((service) => (
                          <a key={service.slug} href={serviceHref(service.slug)} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-neutral-700 hover:bg-brand-100 hover:text-brand-700">
                            {service.name}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-md px-4 py-3 font-semibold text-neutral-700 transition-colors hover:bg-brand-100 hover:text-brand-700">
                  {item.label}
                </a>
              ))}
              <ButtonLink href="#profesionales" className="mt-2 w-full" onClick={() => setMobileOpen(false)}>Ofrecer servicios</ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
