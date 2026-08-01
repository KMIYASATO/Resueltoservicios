"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { SERVICE_SELECTED_EVENT, serviceCategories } from "@/data/serviceCatalog";
import type { ServiceCategory, ServiceSelectedDetail } from "@/data/serviceCatalog";
import { cn } from "@/lib/cn";

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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sheetSlug, setSheetSlug] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 16, width: 340 });
  const [dragOffset, setDragOffset] = useState(0);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef<number | null>(null);

  const openCategory = serviceCategories.find((category) => category.slug === openSlug) ?? null;
  const sheetCategory = serviceCategories.find((category) => category.slug === sheetSlug) ?? null;

  function updatePanelPosition(slug: string) {
    if (typeof window === "undefined") return;
    const trigger = triggerRefs.current[slug];
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 32);
    const left = Math.min(Math.max(16, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 16);
    setPanelPosition({ top: rect.bottom + 10, left, width });
  }

  function clearTimers() {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function openDesktop(category: ServiceCategory, delay = 0) {
    clearTimers();
    openTimer.current = setTimeout(() => {
      setOpenSlug(category.slug);
      requestAnimationFrame(() => updatePanelPosition(category.slug));
    }, delay);
  }

  function closeFlyout(returnFocus = false) {
    const currentSlug = openSlug;
    clearTimers();
    setOpenSlug(null);
    if (returnFocus && currentSlug) requestAnimationFrame(() => triggerRefs.current[currentSlug]?.focus());
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => closeFlyout(false), 200);
  }

  function closeSheet(returnFocus = false) {
    const currentSlug = sheetSlug;
    setSheetSlug(null);
    setDragOffset(0);
    if (returnFocus && currentSlug) requestAnimationFrame(() => triggerRefs.current[currentSlug]?.focus());
  }

  function selectService(category: ServiceCategory, service: ServiceCategory["services"][number]) {
    const detail: ServiceSelectedDetail = {
      categorySlug: category.slug,
      categoryLabel: category.label,
      serviceSlug: service.slug,
      serviceLabel: service.label
    };
    setSelectedSlug(category.slug);
    setOpenSlug(null);
    setSheetSlug(null);
    setDragOffset(0);
    window.dispatchEvent(new CustomEvent<ServiceSelectedDetail>(SERVICE_SELECTED_EVENT, { detail }));
  }

  function focusService(container: HTMLElement | null, direction: 1 | -1) {
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-category-service]"));
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  function handleTriggerClick(category: ServiceCategory) {
    if (isDesktopViewport()) {
      if (openSlug === category.slug) closeFlyout(false);
      else openDesktop(category);
      return;
    }

    setSheetSlug(category.slug);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number, category: ServiceCategory) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + offset + serviceCategories.length) % serviceCategories.length;
      triggerRefs.current[serviceCategories[nextIndex].slug]?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (isDesktopViewport()) {
        openDesktop(category);
        requestAnimationFrame(() => panelRef.current?.querySelector<HTMLButtonElement>("[data-category-service]")?.focus());
      }
      return;
    }

    if (event.key === "Escape") {
      closeFlyout(true);
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
      closeFlyout(true);
      closeSheet(true);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (touchStartY.current === null) return;
    setDragOffset(Math.max(0, event.touches[0].clientY - touchStartY.current));
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
      updatePanelPosition(currentSlug);
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
    <nav className={cn("relative", className)} aria-label="Categorías de servicios">
      <p className="mb-3 text-center text-sm font-semibold text-brand-600">Explora por categoría</p>
      <div className={cn("scrollbar-none flex gap-2 overflow-x-auto whitespace-nowrap px-1 py-1 sm:gap-3 lg:justify-center lg:gap-4 lg:overflow-visible", listClassName)}>
        {serviceCategories.map((category, index) => {
          const Icon = category.icon;
          const expanded = openSlug === category.slug || sheetSlug === category.slug;
          const active = expanded || selectedSlug === category.slug;
          const controls = `category-flyout-${instanceId}-${category.slug}`;

          return (
            <button
              key={category.slug}
              ref={(node) => {
                triggerRefs.current[category.slug] = node;
              }}
              type="button"
              className={cn(
                "inline-flex h-12 min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold shadow-xs transition-[background-color,border-color,color,transform] duration-[160ms] ease-standard active:scale-[0.98] active:duration-[90ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-600 sm:h-14 sm:min-h-14 sm:gap-3 sm:px-5 sm:text-base lg:h-16 lg:min-h-16 lg:px-7 lg:text-lg [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-px [@media(hover:hover)_and_(pointer:fine)]:hover:border-brand-500 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-brand-100",
                active ? "border-brand-600 bg-brand-600 text-white" : "border-neutral-200 bg-white text-neutral-950"
              )}
              aria-expanded={expanded}
              aria-controls={controls}
              aria-haspopup="menu"
              onClick={() => handleTriggerClick(category)}
              onKeyDown={(event) => handleTriggerKeyDown(event, index, category)}
              onMouseEnter={() => {
                if (isDesktopViewport()) openDesktop(category, 110);
              }}
              onMouseLeave={scheduleClose}
            >
              <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full sm:h-10 sm:w-10", active ? "bg-white/15" : "")} style={active ? undefined : { backgroundColor: `${category.color}24` }} aria-hidden="true">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={active ? { color: "#FFFFFF" } : { color: category.color }} />
              </span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {openCategory ? (
        <div
          ref={panelRef}
          id={`category-flyout-${instanceId}-${openCategory.slug}`}
          className="fixed z-[70] hidden rounded-lg border border-neutral-200 bg-white py-3 shadow-[0_12px_30px_rgba(22,48,42,0.14)] lg:block"
          style={{ top: panelPosition.top, left: panelPosition.left, width: panelPosition.width }}
          role="menu"
          aria-label={openCategory.label}
          onMouseEnter={clearTimers}
          onMouseLeave={scheduleClose}
          onKeyDown={(event) => handleServiceKeyDown(event, panelRef.current)}
        >
          {openCategory.services.map((service) => {
            const ServiceIcon = service.icon;
            return (
              <button
                key={service.slug}
                data-category-service="true"
                type="button"
                role="menuitem"
                className="group mx-2 flex min-h-12 w-[calc(100%-16px)] items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold text-neutral-950 transition-colors duration-fast [@media(hover:hover)_and_(pointer:fine)]:hover:bg-brand-100 [@media(hover:hover)_and_(pointer:fine)]:hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                onClick={() => selectService(openCategory, service)}
              >
                <ServiceIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-neutral-600 transition-colors duration-fast group-hover:text-brand-600" />
                {service.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {sheetCategory ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <button className="absolute inset-0 bg-brand-700/35" type="button" aria-label="Cerrar categoría" onClick={() => closeSheet(true)} />
          <div
            ref={sheetRef}
            id={`category-flyout-${instanceId}-${sheetCategory.slug}`}
            className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] border border-neutral-200 bg-white px-5 pt-3 shadow-lg"
            style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))", transform: `translateY(${dragOffset}px)` }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`category-sheet-title-${instanceId}-${sheetCategory.slug}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={(event) => handleServiceKeyDown(event, sheetRef.current)}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <h2 id={`category-sheet-title-${instanceId}-${sheetCategory.slug}`} className="font-display text-2xl font-bold text-neutral-950">{sheetCategory.sheetTitle}</h2>
              <button ref={sheetCloseRef} type="button" className="grid min-h-12 min-w-12 place-items-center rounded-full text-brand-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-600" aria-label="Cerrar categoría" onClick={() => closeSheet(true)}>
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid gap-2">
              {sheetCategory.services.map((service) => {
                const ServiceIcon = service.icon;
                return (
                  <button key={service.slug} data-category-service="true" type="button" className="flex min-h-12 items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-left font-semibold text-neutral-950 transition-colors active:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" onClick={() => selectService(sheetCategory, service)}>
                    <ServiceIcon aria-hidden="true" className="h-5 w-5 text-brand-600" />
                    {service.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
