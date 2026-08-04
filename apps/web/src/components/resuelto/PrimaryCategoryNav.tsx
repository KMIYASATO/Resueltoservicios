"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICE_SELECTED_EVENT, serviceCategories } from "@/data/serviceCatalog";
import type { ServiceCategory, ServiceSelectedDetail } from "@/data/serviceCatalog";
import { cn } from "@/lib/cn";

const CATEGORY_PANEL_OPEN_EVENT = "queda:category-panel-open";
const SEARCH_PANEL_OPEN_EVENT = "queda:search-panel-open";

function isDesktopViewport() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
}

type PrimaryCategoryNavProps = {
  className?: string;
  listClassName?: string;
  compact?: boolean;
  showLabel?: boolean;
};

export function PrimaryCategoryNav({ className, listClassName, compact = false, showLabel = true }: PrimaryCategoryNavProps) {
  const instanceId = useId().replace(/:/g, "");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mobileSlug, setMobileSlug] = useState<string | null>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 16, width: 340 });
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const openCategory = serviceCategories.find((category) => category.slug === openSlug) ?? null;
  const mobileCategory = serviceCategories.find((category) => category.slug === mobileSlug) ?? null;

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
      window.dispatchEvent(new CustomEvent(CATEGORY_PANEL_OPEN_EVENT));
      setMobileSlug(null);
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

  function closeMobilePanel(returnFocus = false) {
    const currentSlug = mobileSlug;
    setMobileSlug(null);
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
    setMobileSlug(null);
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

    setOpenSlug(null);
    setMobileSlug((currentSlug) => {
      const nextSlug = currentSlug === category.slug ? null : category.slug;
      if (nextSlug) window.dispatchEvent(new CustomEvent(CATEGORY_PANEL_OPEN_EVENT));
      return nextSlug;
    });
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
      } else {
        window.dispatchEvent(new CustomEvent(CATEGORY_PANEL_OPEN_EVENT));
        setOpenSlug(null);
        setMobileSlug(category.slug);
        requestAnimationFrame(() => mobilePanelRef.current?.querySelector<HTMLButtonElement>("[data-category-service]")?.focus());
      }
      return;
    }

    if (event.key === "Escape") {
      closeFlyout(true);
      closeMobilePanel(true);
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
      closeMobilePanel(true);
    }
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
    function closeDropdowns() {
      setOpenSlug(null);
      setMobileSlug(null);
    }

    window.addEventListener("queda:auth-modal-open", closeDropdowns);
    window.addEventListener(SEARCH_PANEL_OPEN_EVENT, closeDropdowns);
    return () => {
      window.removeEventListener("queda:auth-modal-open", closeDropdowns);
      window.removeEventListener(SEARCH_PANEL_OPEN_EVENT, closeDropdowns);
    };
  }, []);

  return (
    <nav className={cn("relative", className)} aria-label="Categorías de servicios">
      {showLabel ? <p className={cn("text-center font-semibold text-brand-600", compact ? "mb-2 text-xs" : "mb-3 text-sm")}>Explora por categoría</p> : null}
      <div className={cn("scrollbar-none flex overflow-x-auto whitespace-nowrap px-1 py-1 lg:justify-center lg:overflow-visible", compact ? "gap-2 sm:gap-3" : "gap-2 sm:gap-3 lg:gap-4", listClassName)}>
        {serviceCategories.map((category, index) => {
          const Icon = category.icon;
          const expanded = openSlug === category.slug || mobileSlug === category.slug;
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
                "inline-flex shrink-0 cursor-pointer items-center rounded-full border font-semibold shadow-xs transition-[background-color,border-color,color,transform] duration-[160ms] ease-standard active:scale-[0.98] active:duration-[90ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-600 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-px [@media(hover:hover)_and_(pointer:fine)]:hover:border-brand-500 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-brand-100",
                compact ? "h-12 min-h-12 gap-2 px-5 text-sm sm:text-base" : "h-12 min-h-12 gap-2 px-4 text-sm sm:h-14 sm:min-h-14 sm:gap-3 sm:px-5 sm:text-base lg:h-16 lg:min-h-16 lg:px-7 lg:text-lg",
                active ? "border-brand-600 bg-brand-600 text-white" : "border-neutral-200 bg-white text-neutral-950"
              )}
              aria-expanded={expanded}
              aria-controls={controls}
              aria-haspopup="menu"
              aria-pressed={active}
              onClick={() => handleTriggerClick(category)}
              onKeyDown={(event) => handleTriggerKeyDown(event, index, category)}
              onMouseEnter={() => {
                if (isDesktopViewport()) openDesktop(category, 110);
              }}
              onMouseLeave={scheduleClose}
            >
              <span className={cn("grid shrink-0 place-items-center rounded-full", compact ? "h-7 w-7" : "h-8 w-8 sm:h-10 sm:w-10", active ? "bg-white/15" : "")} style={active ? undefined : { backgroundColor: `${category.color}24` }} aria-hidden="true">
                <Icon className={compact ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6"} style={active ? { color: "#FFFFFF" } : { color: category.color }} />
              </span>
              <span>{category.label}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-fast", expanded ? "rotate-180" : "")} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className={cn("grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-normal ease-standard lg:hidden", mobileCategory ? "mt-3 grid-rows-[1fr] translate-y-0 opacity-100" : "mt-0 grid-rows-[0fr] -translate-y-1.5 opacity-0")}>
        <div className="min-h-0">
          {mobileCategory ? (
            <div
              ref={mobilePanelRef}
              id={`category-flyout-${instanceId}-${mobileCategory.slug}`}
              className="rounded-lg border border-neutral-200 bg-white p-3"
              role="menu"
              aria-label={mobileCategory.label}
              onKeyDown={(event) => handleServiceKeyDown(event, mobilePanelRef.current)}
            >
              <div className="grid gap-2">
                {mobileCategory.services.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <button key={service.slug} data-category-service="true" type="button" role="menuitem" className="flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-3 text-left font-semibold text-neutral-950 transition-colors active:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" onClick={() => selectService(mobileCategory, service)}>
                      <ServiceIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-600" />
                      {service.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
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

    </nav>
  );
}
