"use client";

import { GraduationCap, PaintRoller, Sparkles, Wrench, X, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { cn } from "@/lib/cn";

type PrimaryCategory = {
  label: string;
  name: string;
  slug: string;
  color: string;
  icon: LucideIcon;
  services: string[];
};

const categories: PrimaryCategory[] = [
  {
    label: "Clases",
    name: "Clases y aprendizaje",
    slug: "clases",
    color: "#F18D9E",
    icon: GraduationCap,
    services: ["Clases de idiomas", "Clases escolares", "Clases universitarias", "Música", "Arte y manualidades", "Computación", "Baile", "Entrenamiento personal"]
  },
  {
    label: "Limpieza",
    name: "Limpieza del hogar",
    slug: "limpieza",
    color: "#98DBC6",
    icon: Sparkles,
    services: ["Limpieza del hogar", "Limpieza profunda", "Limpieza de oficinas", "Limpieza postobra", "Limpieza de ventanas", "Limpieza de muebles"]
  },
  {
    label: "Pintura",
    name: "Pintura y acabados",
    slug: "pintura",
    color: "#E6D72A",
    icon: PaintRoller,
    services: ["Pintura de interiores", "Pintura de exteriores", "Pintura de departamentos", "Pintura de oficinas", "Resane de paredes", "Acabados y retoques"]
  },
  {
    label: "Electricidad",
    name: "Servicios eléctricos",
    slug: "electricidad",
    color: "#5BC8AC",
    icon: Zap,
    services: ["Revisión eléctrica", "Cambio de tomacorrientes", "Instalación de luminarias", "Reparación de interruptores", "Problemas de cortocircuito", "Instalación de tableros"]
  },
  {
    label: "Instalación",
    name: "Instalación de equipos",
    slug: "instalacion-equipos",
    color: "#236A5B",
    icon: Wrench,
    services: ["Instalación de televisores", "Instalación de lavadoras", "Instalación de cocinas", "Instalación de campanas", "Instalación de termas", "Instalación de aire acondicionado", "Armado de muebles"]
  }
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function serviceHref(categorySlug: string, service: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}/resultados/?categoria=${categorySlug}&servicio=${slugify(service)}`;
}

function isDesktopViewport() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
}

type PrimaryCategoryNavProps = {
  className?: string;
  listClassName?: string;
};

export function PrimaryCategoryNav({ className, listClassName }: PrimaryCategoryNavProps) {
  const instanceId = useId().replace(/:/g, "");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [sheetSlug, setSheetSlug] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 16, width: 360 });
  const [dragOffset, setDragOffset] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef<number | null>(null);

  const openCategory = categories.find((category) => category.slug === openSlug) ?? null;
  const sheetCategory = categories.find((category) => category.slug === sheetSlug) ?? null;

  function updatePanelPosition(slug = openSlug) {
    if (!slug || typeof window === "undefined") return;
    const trigger = triggerRefs.current[slug];
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 32);
    const left = Math.min(Math.max(16, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 16);
    setPanelPosition({ top: rect.bottom + 12, left, width });
  }

  function clearCloseTimer() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function openDropdown(slug: string) {
    clearCloseTimer();
    setOpenSlug(slug);
    requestAnimationFrame(() => updatePanelPosition(slug));
  }

  function closeDropdown(returnFocus = false) {
    const slug = openSlug;
    setOpenSlug(null);
    if (returnFocus && slug) requestAnimationFrame(() => triggerRefs.current[slug]?.focus());
  }

  function scheduleDropdownClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => closeDropdown(false), 180);
  }

  function closeSheet(returnFocus = false) {
    const slug = sheetSlug;
    setSheetSlug(null);
    setDragOffset(0);
    if (returnFocus && slug) requestAnimationFrame(() => triggerRefs.current[slug]?.focus());
  }

  function focusService(container: HTMLElement | null, direction: 1 | -1) {
    if (!container) return;
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>("[data-category-service]"));
    const currentIndex = links.findIndex((link) => link === document.activeElement);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + links.length) % links.length;
    links[nextIndex]?.focus();
  }

  function handleTriggerClick(category: PrimaryCategory) {
    if (isDesktopViewport()) {
      if (openSlug === category.slug) closeDropdown(false);
      else openDropdown(category.slug);
      return;
    }
    setOpenSlug(null);
    setSheetSlug(category.slug);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number, category: PrimaryCategory) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + offset + categories.length) % categories.length;
      triggerRefs.current[categories[nextIndex].slug]?.focus();
      return;
    }

    if (event.key === "ArrowDown" && isDesktopViewport()) {
      event.preventDefault();
      openDropdown(category.slug);
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLAnchorElement>("[data-category-service]")?.focus());
      return;
    }

    if (event.key === "Escape") {
      closeDropdown(true);
      closeSheet(true);
    }
  }

  function handleServiceKeyDown(event: KeyboardEvent<HTMLElement>, container: HTMLElement | null) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusService(container, event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown(true);
      closeSheet(true);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (touchStartY.current === null) return;
    const nextOffset = Math.max(0, event.touches[0].clientY - touchStartY.current);
    setDragOffset(nextOffset);
  }

  function handleTouchEnd() {
    if (dragOffset > 80) closeSheet(true);
    else setDragOffset(0);
    touchStartY.current = null;
  }

  useEffect(() => {
    if (!openSlug) return;
    const currentSlug = openSlug;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const trigger = triggerRefs.current[currentSlug];
      if (panelRef.current?.contains(target) || trigger?.contains(target)) return;
      setOpenSlug(null);
      requestAnimationFrame(() => triggerRefs.current[currentSlug]?.focus());
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenSlug(null);
        requestAnimationFrame(() => triggerRefs.current[currentSlug]?.focus());
      }
    }

    function handleReposition() {
      if (typeof window === "undefined") return;
      const trigger = triggerRefs.current[currentSlug];
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(360, window.innerWidth - 32);
      const left = Math.min(Math.max(16, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 16);
      setPanelPosition({ top: rect.bottom + 12, left, width });
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [openSlug]);

  useEffect(() => {
    if (!sheetSlug) return;
    const currentSlug = sheetSlug;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => sheetCloseRef.current?.focus());

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSheetSlug(null);
        setDragOffset(0);
        requestAnimationFrame(() => triggerRefs.current[currentSlug]?.focus());
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sheetSlug]);

  return (
    <nav className={cn("relative", className)} aria-label="Categorías principales">
      <div className={cn("scrollbar-none flex gap-3 overflow-x-auto whitespace-nowrap px-1 py-1 lg:flex-wrap lg:overflow-visible", listClassName)}>
        {categories.map((category, index) => {
          const Icon = category.icon;
          const selected = openSlug === category.slug || sheetSlug === category.slug;
          const controls = `primary-category-${instanceId}-${category.slug}`;

          return (
            <button
              key={category.slug}
              ref={(node) => {
                triggerRefs.current[category.slug] = node;
              }}
              type="button"
              className={cn(
                "inline-flex h-14 min-h-14 shrink-0 items-center gap-3 rounded-full border px-5 text-base font-semibold transition-[background-color,border-color,color,transform] duration-[160ms] ease-standard active:scale-[0.98] active:duration-[90ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-600 lg:hover:-translate-y-0.5 lg:hover:border-brand-500 lg:hover:bg-brand-100",
                selected ? "border-brand-600 bg-brand-600 text-white" : "border-neutral-200 bg-white text-neutral-950"
              )}
              aria-expanded={selected}
              aria-controls={controls}
              aria-pressed={selected}
              onClick={() => handleTriggerClick(category)}
              onKeyDown={(event) => handleTriggerKeyDown(event, index, category)}
              onMouseEnter={() => {
                if (isDesktopViewport()) openDropdown(category.slug);
              }}
              onMouseLeave={scheduleDropdownClose}
            >
              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", selected ? "bg-white/15" : "")} style={selected ? undefined : { backgroundColor: `${category.color}22` }} aria-hidden="true">
                <Icon className="h-6 w-6" style={selected ? { color: "#FFFFFF" } : { color: category.color }} />
              </span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {openCategory ? (
        <div
          ref={panelRef}
          id={`primary-category-${instanceId}-${openCategory.slug}`}
          className="fixed z-[60] hidden max-h-[65vh] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-5 shadow-md lg:block"
          style={{ top: panelPosition.top, left: panelPosition.left, width: panelPosition.width }}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleDropdownClose}
          onKeyDown={(event) => handleServiceKeyDown(event, panelRef.current)}
        >
          <p className="text-sm font-semibold text-brand-600">{openCategory.name}</p>
          <div className="mt-4 grid gap-2" role="menu" aria-label={openCategory.name}>
            {openCategory.services.map((service) => (
              <a
                key={service}
                data-category-service="true"
                role="menuitem"
                href={serviceHref(openCategory.slug, service)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-neutral-700 transition-colors duration-fast hover:bg-brand-100 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                onClick={() => closeDropdown(false)}
              >
                {service}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {sheetCategory ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <button className="absolute inset-0 bg-brand-700/35" type="button" aria-label="Cerrar categoría" onClick={() => closeSheet(true)} />
          <div
            ref={sheetRef}
            id={`primary-category-${instanceId}-${sheetCategory.slug}`}
            className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] border border-neutral-200 bg-white px-5 pt-3 shadow-lg"
            style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))", transform: `translateY(${dragOffset}px)` }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`primary-category-title-${instanceId}-${sheetCategory.slug}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={(event) => handleServiceKeyDown(event, sheetRef.current)}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-brand-600">Categoría</p>
                <h2 id={`primary-category-title-${instanceId}-${sheetCategory.slug}`} className="font-display text-2xl font-bold text-neutral-950">
                  {sheetCategory.name}
                </h2>
              </div>
              <button
                ref={sheetCloseRef}
                type="button"
                className="grid min-h-12 min-w-12 place-items-center rounded-full text-brand-700 transition-colors lg:hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-600"
                aria-label="Cerrar categoría"
                onClick={() => closeSheet(true)}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-2">
              {sheetCategory.services.map((service) => (
                <a
                  key={service}
                  data-category-service="true"
                  href={serviceHref(sheetCategory.slug, service)}
                  className="flex min-h-12 items-center rounded-lg border border-neutral-200 px-4 py-3 font-semibold text-neutral-950 transition-colors active:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  onClick={() => closeSheet(false)}
                >
                  {service}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
