"use client";

import { Check, MapPin, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode, RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { enabledDistricts, SERVICE_SELECTED_EVENT, serviceCategories, serviceOptions } from "@/data/serviceCatalog";
import type { ServiceSelectedDetail } from "@/data/serviceCatalog";
import { cn } from "@/lib/cn";

type Option = {
  value: string;
  label: string;
  meta: string;
  categorySlug?: string;
};

type OpenSearchPanel = "service" | "district" | null;

const CATEGORY_PANEL_OPEN_EVENT = "queda:category-panel-open";
const SEARCH_PANEL_OPEN_EVENT = "queda:search-panel-open";

const searchServiceOptions: Option[] = serviceOptions.map((service) => ({
  value: service.slug,
  label: service.label,
  meta: service.categoryLabel,
  categorySlug: service.categorySlug
}));

const districtOptions: Option[] = enabledDistricts.map((district) => ({ value: district.slug, label: district.label, meta: "Lima" }));

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isDesktopViewport() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function SearchCombobox({
  id,
  label,
  icon,
  options,
  value,
  onChange,
  open,
  onOpenChange,
  placeholder,
  inputRef,
  inputName,
  onFocusOpen,
  onSelectComplete,
  compact = false,
  kind
}: {
  id: string;
  label: string;
  icon: ReactNode;
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  inputName: string;
  onFocusOpen?: () => boolean;
  onSelectComplete?: (option: Option) => void;
  compact?: boolean;
  kind: "service" | "district";
}) {
  const triggerRef = useRef<HTMLLabelElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef ?? fallbackInputRef;
  const [query, setQuery] = useState(value?.label ?? "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [popoverStyle, setPopoverStyle] = useState({ top: 12, left: 12, width: 296, maxHeight: 320 });
  const scrollTopRef = useRef(0);
  const previousQueryRef = useRef(query);

  useEffect(() => {
    setQuery(value?.label ?? "");
  }, [value]);

  const filtered = useMemo(() => {
    const normalized = normalizeSearch(query);
    if (!normalized) return options;
    return options.filter((option) => normalizeSearch(option.label).includes(normalized) || normalizeSearch(option.meta).includes(normalized));
  }, [options, query]);

  const listboxId = `${id}-listbox`;
  const activeId = filtered[activeIndex] ? `${id}-option-${activeIndex}` : undefined;
  const groupedServices = serviceCategories.map((category) => ({
    ...category,
    options: filtered.filter((option) => option.categorySlug === category.slug)
  })).filter((category) => category.options.length > 0);

  const updatePopoverPosition = useCallback(() => {
    if (!open || typeof window === "undefined") return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 640;
    const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
    const margin = isMobile ? 12 : 16;
    const maxWidth = viewportWidth - margin * 2;
    const preferredWidth = kind === "service" ? (isMobile ? maxWidth : 420) : compact ? 380 : Math.max(rect.width, 320);
    const width = Math.min(preferredWidth, maxWidth);
    const left = clamp(rect.left, margin, viewportWidth - width - margin);
    const spaceBelow = viewportHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const preferredHeight = isMobile ? Math.min(360, viewportHeight * 0.5) : isTablet ? Math.min(360, viewportHeight * 0.55) : Math.min(380, viewportHeight - margin * 2);
    const openAbove = spaceBelow < Math.min(260, preferredHeight) && spaceAbove > spaceBelow;
    const availableHeight = Math.max(160, (openAbove ? spaceAbove : spaceBelow) - 10);
    const maxHeight = Math.min(preferredHeight, availableHeight);
    const top = openAbove ? Math.max(margin, rect.top - maxHeight - 10) : Math.min(rect.bottom + 10, viewportHeight - margin - maxHeight);

    setPopoverStyle({ top, left, width, maxHeight });
  }, [compact, kind, open]);

  function scrollOptionIntoView(index: number) {
    requestAnimationFrame(() => {
      optionRefs.current[index]?.scrollIntoView({ block: "nearest" });
    });
  }

  function moveActiveIndex(nextIndex: number) {
    const boundedIndex = clamp(nextIndex, 0, Math.max(filtered.length - 1, 0));
    setActiveIndex(boundedIndex);
    scrollOptionIntoView(boundedIndex);
  }

  useLayoutEffect(() => {
    if (!open) return;
    updatePopoverPosition();
  }, [filtered.length, open, updatePopoverPosition]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = filtered.findIndex((option) => value?.value === option.value && value?.meta === option.meta);
    const nextIndex = selectedIndex >= 0 ? selectedIndex : clamp(activeIndex, 0, Math.max(filtered.length - 1, 0));
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => {
      if (selectedIndex >= 0) {
        optionRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
        return;
      }
      if (listboxRef.current) listboxRef.current.scrollTop = scrollTopRef.current;
    });
  // Run only on open so repeated clicks keep active option and scroll stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (previousQueryRef.current === query) return;
    previousQueryRef.current = query;
    setActiveIndex(0);
    scrollTopRef.current = 0;
    if (open) requestAnimationFrame(() => {
      if (listboxRef.current) listboxRef.current.scrollTop = 0;
    });
  }, [open, query]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;
      if (triggerRef.current?.contains(event.target)) return;
      if (popoverRef.current?.contains(event.target)) return;
      onOpenChange(false);
    }

    function handleViewportChange(event: Event) {
      if (event.target instanceof Node && popoverRef.current?.contains(event.target)) return;
      updatePopoverPosition();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [onOpenChange, open, updatePopoverPosition]);

  function selectOption(option: Option) {
    onChange(option);
    setQuery(option.label);
    onOpenChange(false);
    if (onSelectComplete) {
      onSelectComplete(option);
      return;
    }
    resolvedInputRef.current?.focus();
  }

  return (
    <div className="relative min-w-0 flex-1">
      <label ref={triggerRef} className={cn("grid cursor-text", compact ? "gap-0.5 px-3 py-2.5 sm:px-4" : "gap-1 px-4 py-3")} htmlFor={id}>
        <span className={cn("font-semibold text-neutral-600", compact ? "text-[10px] leading-4" : "text-xs")}>{label}</span>
        <span className={cn("flex items-center text-neutral-950", compact ? "gap-1.5" : "gap-2")}>
          {icon}
          <input
            ref={resolvedInputRef}
            id={id}
            className={cn("w-full min-w-0 bg-transparent font-semibold outline-none placeholder:font-normal placeholder:text-neutral-400", compact ? "text-[15px] leading-5 placeholder:text-[#7B9089]" : "text-base")}
            name={inputName}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open ? activeId : undefined}
            placeholder={placeholder}
            value={query}
            onFocus={() => {
              if (onFocusOpen?.() === false) return;
              onOpenChange(true);
            }}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(null);
              onOpenChange(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!open) {
                  onOpenChange(true);
                  return;
                }
                moveActiveIndex(activeIndex + 1);
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!open) {
                  onOpenChange(true);
                  moveActiveIndex(Math.max(filtered.length - 1, 0));
                  return;
                }
                moveActiveIndex(activeIndex - 1);
              }
              if (event.key === "Home" && open) {
                event.preventDefault();
                moveActiveIndex(0);
              }
              if (event.key === "End" && open) {
                event.preventDefault();
                moveActiveIndex(Math.max(filtered.length - 1, 0));
              }
              if (event.key === "Enter" && open && filtered[activeIndex]) {
                event.preventDefault();
                selectOption(filtered[activeIndex]);
              } else if (event.key === "Enter" && !open) {
                event.preventDefault();
                onOpenChange(true);
              }
              if (event.key === "Escape" && open) {
                event.preventDefault();
                onOpenChange(false);
                resolvedInputRef.current?.focus();
              }
              if (event.key === "Tab" && open) onOpenChange(false);
            }}
          />
        </span>
      </label>
      {open ? (
        <div
          ref={popoverRef}
          className="fixed z-[80] rounded-[18px] border border-neutral-200 bg-white p-2 shadow-[0_18px_42px_rgba(22,48,42,0.16)]"
          style={{ top: popoverStyle.top, left: popoverStyle.left, width: popoverStyle.width }}
        >
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            className="queda-service-dropdown-scroll overflow-y-auto overflow-x-hidden pr-1"
            style={{ maxHeight: popoverStyle.maxHeight }}
            onScroll={(event) => {
              scrollTopRef.current = event.currentTarget.scrollTop;
            }}
          >
            {filtered.length > 0 && kind === "service" ? groupedServices.map((group) => {
              const CategoryIcon = group.icon;
              const groupHeadingId = `${id}-group-${group.slug}`;
              return (
                <div key={group.slug} className="py-1.5 first:pt-0" role="group" aria-labelledby={groupHeadingId}>
                  <div id={groupHeadingId} className="sticky top-0 z-10 flex min-h-[46px] w-full items-center gap-3 rounded-[14px] bg-brand-100 px-4 py-2.5 text-neutral-950 shadow-[0_1px_0_rgba(220,233,229,0.8)]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/85" aria-hidden="true">
                      <CategoryIcon className="h-4 w-4" />
                    </span>
                    <p className="text-[13px] font-bold uppercase tracking-[0.08em]">{group.label}</p>
                  </div>
                  {group.options.map((option) => {
                    const index = filtered.findIndex((item) => item.value === option.value && item.categorySlug === option.categorySlug);
                    const selected = value?.value === option.value && value?.meta === option.meta;
                    return (
                      <button
                        key={`${option.meta}-${option.value}`}
                        id={`${id}-option-${index}`}
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        tabIndex={-1}
                        className={cn(
                          "mt-1 flex min-h-11 w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] text-neutral-950 transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                          selected ? "bg-brand-100 font-semibold text-brand-700" : index === activeIndex ? "bg-neutral-50 text-neutral-950 ring-1 ring-brand-100" : "hover:bg-neutral-50"
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectOption(option)}
                      >
                        <span>{option.label}</span>
                        {selected ? <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              );
            }) : null}
            {filtered.length > 0 && kind === "district" ? filtered.map((option, index) => (
              <button
                key={`${option.meta}-${option.value}`}
                id={`${id}-option-${index}`}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={value?.value === option.value && value?.meta === option.meta}
                tabIndex={-1}
                className={cn("flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600", index === activeIndex ? "bg-brand-100 text-brand-700" : "hover:bg-neutral-50")}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span className="font-semibold text-neutral-950">{option.label}</span>
                <span className="text-xs font-medium text-neutral-600">{option.meta}</span>
              </button>
            )) : null}
            {filtered.length === 0 ? (
              <div className="rounded-md bg-neutral-50 px-3 py-4 text-sm text-neutral-600">No encontramos ese resultado habilitado.</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MainSearch({ className, compact = false }: { className?: string; compact?: boolean }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pathname = usePathname();
  const serviceInputRef = useRef<HTMLInputElement>(null);
  const districtInputRef = useRef<HTMLInputElement>(null);
  const suppressNextDistrictOpenRef = useRef(false);
  const [service, setService] = useState<Option | null>(null);
  const [district, setDistrict] = useState<Option | null>(null);
  const [openPanel, setOpenPanel] = useState<OpenSearchPanel>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = Boolean(service && district);
  const helperText = !service ? "Elige un servicio para continuar." : !district ? "Selecciona un distrito disponible para buscar." : "Listo para buscar profesionales compatibles.";

  const openSearchPanel = useCallback((panel: Exclude<OpenSearchPanel, null>) => {
    setOpenPanel(panel);
    window.dispatchEvent(new CustomEvent(SEARCH_PANEL_OPEN_EVENT));
  }, []);

  const closeSearchPanel = useCallback(() => {
    setOpenPanel(null);
  }, []);

  function setComboboxOpen(panel: Exclude<OpenSearchPanel, null>, nextOpen: boolean) {
    if (nextOpen) {
      openSearchPanel(panel);
      return;
    }
    setOpenPanel((current) => (current === panel ? null : current));
  }

  const focusDistrictAfterService = useCallback(() => {
    if (isDesktopViewport()) {
      setOpenPanel("district");
    } else {
      suppressNextDistrictOpenRef.current = true;
      setOpenPanel(null);
    }
    requestAnimationFrame(() => districtInputRef.current?.focus());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get("categoria");
    const serviceSlug = params.get("servicio");
    const districtSlug = params.get("distrito");
    const urlService = searchServiceOptions.find((option) => option.value === serviceSlug && (!categorySlug || option.categorySlug === categorySlug)) ?? null;
    const urlDistrict = districtOptions.find((option) => option.value === districtSlug) ?? null;
    setService(urlService);
    setDistrict(urlDistrict);
  }, []);

  useEffect(() => {
    function handleSelected(event: Event) {
      const detail = (event as CustomEvent<ServiceSelectedDetail>).detail;
      const option = searchServiceOptions.find((item) => item.value === detail.serviceSlug && item.categorySlug === detail.categorySlug);
      if (!option) return;
      setService(option);
      focusDistrictAfterService();
    }

    window.addEventListener(SERVICE_SELECTED_EVENT, handleSelected);
    return () => window.removeEventListener(SERVICE_SELECTED_EVENT, handleSelected);
  }, [focusDistrictAfterService]);

  useEffect(() => {
    closeSearchPanel();
  }, [closeSearchPanel, pathname]);

  useEffect(() => {
    function closeDropdown() {
      closeSearchPanel();
    }

    window.addEventListener("queda:auth-modal-open", closeDropdown);
    window.addEventListener(CATEGORY_PANEL_OPEN_EVENT, closeDropdown);
    return () => {
      window.removeEventListener("queda:auth-modal-open", closeDropdown);
      window.removeEventListener(CATEGORY_PANEL_OPEN_EVENT, closeDropdown);
    };
  }, [closeSearchPanel]);

  return (
    <form
      className={cn(
        compact
          ? "mx-auto grid w-full max-w-[650px] gap-2 rounded-[20px] border border-neutral-200 bg-white p-1.5 shadow-sm md:min-h-[58px] md:grid-cols-[40fr_37fr_23fr] md:items-stretch md:gap-0 lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[650px]"
          : "mx-auto grid w-full max-w-5xl gap-3 rounded-[26px] border border-neutral-200 bg-white p-3 shadow-lg md:min-h-[72px] md:grid-cols-[1.25fr_1fr_auto] md:items-stretch md:gap-0 md:rounded-[20px] md:p-2 md:shadow-md",
        className
      )}
      autoComplete="off"
      action={`${basePath}/resultados/`}
      onSubmit={(event) => {
        if (!canSubmit) {
          event.preventDefault();
          if (!service) {
            openSearchPanel("service");
            requestAnimationFrame(() => serviceInputRef.current?.focus());
          } else if (!district) {
            openSearchPanel("district");
            requestAnimationFrame(() => districtInputRef.current?.focus());
          }
          return;
        }
        closeSearchPanel();
        setLoading(true);
      }}
    >
      <input type="hidden" name="categoria" value={service?.categorySlug ?? ""} />
      <input type="hidden" name="servicio" value={service?.value ?? ""} />
      <input type="hidden" name="distrito" value={district?.value ?? ""} />

      <div className={cn(compact ? "rounded-[16px] bg-neutral-50 md:rounded-l-[16px] md:rounded-r-none md:bg-white md:[box-shadow:inset_-1px_0_0_#DCE9E5]" : "rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 md:rounded-r-none md:bg-white md:ring-0 md:[box-shadow:inset_-1px_0_0_#DCE9E5]")}>
        <SearchCombobox
          id="service-search"
          label={compact ? "SERVICIO" : "¿Qué servicio estás buscando?"}
          icon={<Search aria-hidden="true" className={cn("text-brand-600", compact ? "h-4 w-4" : "h-5 w-5")} />}
          options={searchServiceOptions}
          value={service}
          onChange={setService}
          open={openPanel === "service"}
          onOpenChange={(nextOpen) => setComboboxOpen("service", nextOpen)}
          placeholder={compact ? "¿Qué necesitas?" : "Ej. Electricidad, limpieza de casa o idiomas"}
          inputRef={serviceInputRef}
          inputName="queda-service-search"
          onSelectComplete={focusDistrictAfterService}
          compact={compact}
          kind="service"
        />
      </div>

      <div className={cn(compact ? "rounded-[16px] bg-neutral-50 md:rounded-none md:bg-white" : "rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 md:rounded-none md:bg-white md:ring-0")}>
        <SearchCombobox
          id="district-search"
          label={compact ? "DISTRITO" : "¿Dónde necesitas el servicio?"}
          icon={<MapPin aria-hidden="true" className={cn("text-brand-600", compact ? "h-4 w-4" : "h-5 w-5")} />}
          options={districtOptions}
          value={district}
          onChange={setDistrict}
          open={openPanel === "district"}
          onOpenChange={(nextOpen) => setComboboxOpen("district", nextOpen)}
          placeholder={compact ? "Elige tu distrito" : "Selecciona tu distrito"}
          inputRef={districtInputRef}
          inputName="queda-district-search"
          onFocusOpen={() => {
            if (!suppressNextDistrictOpenRef.current) return true;
            suppressNextDistrictOpenRef.current = false;
            return false;
          }}
          compact={compact}
          kind="district"
        />
      </div>

      <Button className={cn(compact ? "h-[46px] min-h-[46px] w-full rounded-[15px] px-4 text-sm text-white shadow-none md:h-full md:min-h-[46px] md:px-5" : "min-h-[60px] w-full rounded-2xl bg-brand-600 px-7 text-base text-white shadow-sm hover:bg-brand-800 disabled:bg-neutral-200 disabled:text-neutral-700 md:h-full md:min-h-full md:w-auto md:min-w-[216px] md:rounded-lg md:px-8")} type="submit" disabled={loading} loading={loading} aria-describedby="main-search-help">
        {compact ? "Buscar" : "Buscar profesionales"}
      </Button>
      <p id="main-search-help" className={cn("px-2 text-left text-sm font-medium text-neutral-600 md:col-span-3", compact ? "sr-only" : undefined)} aria-live="polite">
        {helperText}
      </p>
    </form>
  );
}
