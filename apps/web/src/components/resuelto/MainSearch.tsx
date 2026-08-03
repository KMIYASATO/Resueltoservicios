"use client";

import { MapPin, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { enabledDistricts, SERVICE_SELECTED_EVENT, serviceOptions } from "@/data/serviceCatalog";
import type { ServiceSelectedDetail } from "@/data/serviceCatalog";
import { cn } from "@/lib/cn";

type Option = {
  value: string;
  label: string;
  meta: string;
  categorySlug?: string;
};

const searchServiceOptions: Option[] = serviceOptions.map((service) => ({
  value: service.slug,
  label: service.label,
  meta: service.categoryLabel,
  categorySlug: service.categorySlug
}));

const districtOptions: Option[] = enabledDistricts.map((district) => ({ value: district.slug, label: district.label, meta: "Lima" }));

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
  inputRef
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
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const resolvedInputRef = inputRef ?? fallbackInputRef;
  const [query, setQuery] = useState(value?.label ?? "");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setQuery(value?.label ?? "");
  }, [value]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && containerRef.current?.contains(event.target)) return;
      onOpenChange(false);
    }

    function handleScroll() {
      onOpenChange(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [onOpenChange, open]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized) || option.meta.toLowerCase().includes(normalized));
  }, [options, query]);

  const listboxId = `${id}-listbox`;
  const activeId = filtered[activeIndex] ? `${id}-option-${activeIndex}` : undefined;

  function selectOption(option: Option) {
    onChange(option);
    setQuery(option.label);
    onOpenChange(false);
    resolvedInputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <label className="grid gap-1 px-4 py-3" htmlFor={id}>
        <span className="text-xs font-semibold text-neutral-700">{label}</span>
        <span className="flex items-center gap-2 text-neutral-950">
          {icon}
          <input
            ref={resolvedInputRef}
            id={id}
            className="w-full bg-transparent text-base font-semibold outline-none placeholder:font-normal placeholder:text-neutral-400"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open ? activeId : undefined}
            placeholder={placeholder}
            value={query}
            onFocus={() => onOpenChange(true)}
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
                  setActiveIndex(0);
                  return;
                }
                setActiveIndex((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!open) {
                  onOpenChange(true);
                  setActiveIndex(Math.max(filtered.length - 1, 0));
                  return;
                }
                setActiveIndex((index) => Math.max(index - 1, 0));
              }
              if (event.key === "Enter" && open && filtered[activeIndex]) {
                event.preventDefault();
                selectOption(filtered[activeIndex]);
              }
              if (event.key === "Escape" && open) {
                event.preventDefault();
                onOpenChange(false);
                resolvedInputRef.current?.focus();
              }
            }}
          />
        </span>
      </label>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg" onMouseDown={(event) => event.preventDefault()}>
          <div id={listboxId} role="listbox" className="max-h-[min(18rem,52vh)] overflow-auto">
            {filtered.length > 0 ? filtered.map((option, index) => (
              <button
                key={`${option.meta}-${option.value}`}
                id={`${id}-option-${index}`}
                type="button"
                role="option"
                aria-selected={value?.value === option.value && value?.meta === option.meta}
                className={cn("flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition-colors duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600", index === activeIndex ? "bg-brand-100 text-brand-700" : "hover:bg-neutral-50")}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span className="font-semibold text-neutral-950">{option.label}</span>
                <span className="text-xs font-medium text-neutral-600">{option.meta}</span>
              </button>
            )) : (
              <div className="rounded-md bg-neutral-50 px-3 py-4 text-sm text-neutral-600">No encontramos ese resultado habilitado.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MainSearch({ className }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pathname = usePathname();
  const districtInputRef = useRef<HTMLInputElement>(null);
  const [service, setService] = useState<Option | null>(null);
  const [district, setDistrict] = useState<Option | null>(null);
  const [openCombobox, setOpenCombobox] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = Boolean(service && district);
  const helperText = !service ? "Elige un servicio para continuar." : !district ? "Selecciona un distrito disponible para buscar." : "Listo para buscar profesionales compatibles.";

  function setComboboxOpen(id: string, nextOpen: boolean) {
    setOpenCombobox((current) => (nextOpen ? id : current === id ? null : current));
  }

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
      requestAnimationFrame(() => districtInputRef.current?.focus());
    }

    window.addEventListener(SERVICE_SELECTED_EVENT, handleSelected);
    return () => window.removeEventListener(SERVICE_SELECTED_EVENT, handleSelected);
  }, []);

  useEffect(() => {
    setOpenCombobox(null);
  }, [pathname]);

  return (
    <form
      className={cn("mx-auto grid w-full max-w-5xl gap-3 rounded-[26px] border border-neutral-200 bg-white p-3 shadow-lg md:min-h-[72px] md:grid-cols-[1.25fr_1fr_auto] md:items-stretch md:gap-0 md:rounded-[20px] md:p-2 md:shadow-md", className)}
      action={`${basePath}/resultados/`}
      onSubmit={(event) => {
        if (!canSubmit) {
          event.preventDefault();
          return;
        }
        setLoading(true);
      }}
    >
      <input type="hidden" name="categoria" value={service?.categorySlug ?? ""} />
      <input type="hidden" name="servicio" value={service?.value ?? ""} />
      <input type="hidden" name="distrito" value={district?.value ?? ""} />

      <div className="rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 md:rounded-r-none md:bg-white md:ring-0 md:[box-shadow:inset_-1px_0_0_#DCE9E5]">
        <SearchCombobox
          id="service-search"
          label="¿Qué servicio estás buscando?"
          icon={<Search aria-hidden="true" className="h-5 w-5 text-brand-600" />}
          options={searchServiceOptions}
          value={service}
          onChange={setService}
          open={openCombobox === "service-search"}
          onOpenChange={(nextOpen) => setComboboxOpen("service-search", nextOpen)}
          placeholder="Ej. Electricidad, limpieza de casa o idiomas"
        />
      </div>

      <div className="rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 md:rounded-none md:bg-white md:ring-0">
        <SearchCombobox
          id="district-search"
          label="¿Dónde necesitas el servicio?"
          icon={<MapPin aria-hidden="true" className="h-5 w-5 text-brand-600" />}
          options={districtOptions}
          value={district}
          onChange={setDistrict}
          open={openCombobox === "district-search"}
          onOpenChange={(nextOpen) => setComboboxOpen("district-search", nextOpen)}
          placeholder="Selecciona tu distrito"
          inputRef={districtInputRef}
        />
      </div>

      <Button className="min-h-[60px] w-full rounded-2xl bg-brand-600 px-7 text-base text-white shadow-sm hover:bg-brand-800 disabled:bg-neutral-200 disabled:text-neutral-700 md:h-full md:min-h-full md:w-auto md:min-w-[216px] md:rounded-lg md:px-8" type="submit" disabled={!canSubmit} loading={loading} aria-describedby="main-search-help">
        Buscar profesionales
      </Button>
      <p id="main-search-help" className="px-2 text-left text-sm font-medium text-neutral-600 md:col-span-3" aria-live="polite">
        {helperText}
      </p>
    </form>
  );
}
