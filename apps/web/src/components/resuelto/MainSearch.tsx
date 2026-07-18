"use client";

import { MapPin, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { districts, services } from "@/data/home";
import { cn } from "@/lib/cn";

const serviceOptions = services.map((service) => ({ value: service.slug, label: service.name, meta: service.category }));
const districtOptions = districts.map((district) => ({ value: district.slug, label: district.name, meta: "Lima" }));

type Option = { value: string; label: string; meta: string };

function SearchCombobox({
  id,
  label,
  icon,
  options,
  value,
  onChange,
  placeholder,
  error,
  grouped = false
}: {
  id: string;
  label: string;
  icon: ReactNode;
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
  placeholder: string;
  error?: string;
  grouped?: boolean;
}) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized) || option.meta.toLowerCase().includes(normalized));
  }, [options, query]);

  const listboxId = `${id}-listbox`;
  const activeId = filtered[activeIndex] ? `${id}-option-${activeIndex}` : undefined;
  const groupedOptions = filtered.reduce<Record<string, Option[]>>((groups, option) => {
    const key = grouped ? option.meta : "Sugerencias";
    groups[key] = [...(groups[key] ?? []), option];
    return groups;
  }, {});

  return (
    <div className="relative">
      <label className={cn("grid gap-2 rounded-lg border bg-neutral-50 px-4 py-3 transition-colors duration-fast ease-standard", error ? "border-error-600 bg-error-100" : "border-neutral-200 hover:border-brand-500 focus-within:border-brand-600 focus-within:bg-white")} htmlFor={id}>
        <span className="text-xs font-semibold text-neutral-700">{label}</span>
        <span className="flex items-center gap-2 text-neutral-950">
          {icon}
          <input
            id={id}
            className="w-full bg-transparent text-base outline-none placeholder:text-neutral-400"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open ? activeId : undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={placeholder}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(null);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                setActiveIndex((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              }
              if (event.key === "Enter" && open && filtered[activeIndex]) {
                event.preventDefault();
                const option = filtered[activeIndex];
                onChange(option);
                setQuery(option.label);
                setOpen(false);
              }
              if (event.key === "Escape") setOpen(false);
            }}
          />
        </span>
      </label>
      {error ? <p className="mt-1 text-sm font-medium text-error-600" id={`${id}-error`}>{error}</p> : null}
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg" onMouseDown={(event) => event.preventDefault()}>
          <div className="mb-2 px-3 py-2 text-xs font-semibold text-neutral-600">{query ? "Resultados" : "Servicios populares"}</div>
          <div id={listboxId} role="listbox" className="max-h-64 overflow-auto">
            {filtered.length > 0 ? Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group} className="py-1">
                {grouped ? <p className="px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-400">{group}</p> : null}
                {groupOptions.map((option) => {
                  const index = filtered.findIndex((item) => item.value === option.value);
                  return (
                    <button
                      key={option.value}
                      id={`${id}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={value?.value === option.value}
                      className={cn("flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition-colors duration-fast", index === activeIndex ? "bg-brand-100 text-brand-700" : "hover:bg-neutral-50")}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        onChange(option);
                        setQuery(option.label);
                        setOpen(false);
                      }}
                    >
                      <span className="font-semibold text-neutral-950">{option.label}</span>
                      <span className="text-xs font-medium text-neutral-600">{option.meta}</span>
                    </button>
                  );
                })}
              </div>
            )) : (
              <div className="rounded-md bg-neutral-50 px-3 py-4 text-sm text-neutral-600">No encontramos ese resultado. Prueba con otra palabra.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MainSearch() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [service, setService] = useState<Option | null>(serviceOptions[0]);
  const [district, setDistrict] = useState<Option | null>(districtOptions[0]);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const serviceError = touched && !service ? "Selecciona un servicio." : undefined;
  const districtError = touched && !district ? "Ingresa o selecciona un distrito." : undefined;
  const canSubmit = service && district;

  return (
    <form
      className="grid gap-3 rounded-[24px] border border-white/70 bg-white p-3 shadow-lg lg:grid-cols-[1.25fr_1fr_auto]"
      action={`${basePath}/resultados/`}
      onSubmit={(event) => {
        setTouched(true);
        if (!canSubmit) {
          event.preventDefault();
          return;
        }
        setLoading(true);
      }}
    >
      <input type="hidden" name="servicio" value={service?.value ?? ""} />
      <input type="hidden" name="distrito" value={district?.value ?? ""} />
      <SearchCombobox
        id="service-search"
        label="¿Qué servicio necesitas?"
        icon={<Search aria-hidden="true" className="h-5 w-5 text-brand-600" />}
        options={serviceOptions}
        value={service}
        onChange={setService}
        placeholder="Ej. limpieza, gasfitería..."
        error={serviceError}
        grouped
      />
      <SearchCombobox
        id="district-search"
        label="¿Dónde necesitas el servicio?"
        icon={<MapPin aria-hidden="true" className="h-5 w-5 text-brand-600" />}
        options={districtOptions}
        value={district}
        onChange={setDistrict}
        placeholder="Ej. Miraflores"
        error={districtError}
      />
      <Button className="min-h-[64px] rounded-lg px-8 text-base" type="submit" disabled={!canSubmit} loading={loading}>
        Buscar profesionales
      </Button>
    </form>
  );
}
