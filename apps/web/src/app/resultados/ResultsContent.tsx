"use client";

import { ChevronDown, SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MainSearch } from "@/components/resuelto/MainSearch";
import { ProfessionalCard } from "@/components/resuelto/ProfessionalCard";
import { getPricingForService, matchProfessionals } from "@/data/home";
import { enabledDistricts, serviceOptions } from "@/data/serviceCatalog";
import { cn } from "@/lib/cn";

const filterGroups = [
  { key: "fecha", label: "Fecha", options: ["Hoy", "Mañana", "Esta semana"] },
  { key: "horario", label: "Horario", options: ["Mañana", "Tarde", "Noche"] },
  { key: "precio", label: "Precio", options: ["Menor precio", "Precio medio"] },
  { key: "rating", label: "Rating", options: ["4.8+", "4.7+"] },
  { key: "disponibilidad", label: "Disponibilidad", options: ["Disponible hoy", "Esta semana"] },
  { key: "verificacion", label: "Verificación", options: ["Identidad verificada"] }
] as const;

const sortOptions = [
  { value: "recomendados", label: "Recomendados" },
  { value: "disponibilidad", label: "Próxima disponibilidad" },
  { value: "rating", label: "Mejor valoración" },
  { value: "precio", label: "Menor precio" }
] as const;

function humanize(slug: string | null) {
  if (!slug) return "servicios para el hogar";
  return slug.replace(/-/g, " ").replace(/^\w|\s\w/g, (match) => match.toUpperCase());
}

function priceValue(price: string) {
  return Number(price.replace(/\D/g, "")) || 0;
}

export function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const serviceSlug = searchParams.get("servicio");
  const districtSlug = searchParams.get("distrito");
  const categorySlug = searchParams.get("categoria");
  const sort = searchParams.get("orden") ?? "recomendados";
  const selectedService = serviceOptions.find((service) => service.slug === serviceSlug && (!categorySlug || service.categorySlug === categorySlug));
  const selectedDistrict = enabledDistricts.find((district) => district.slug === districtSlug);
  const serviceName = selectedService?.label ?? humanize(serviceSlug);
  const districtName = selectedDistrict?.label ?? humanize(districtSlug);
  const hasError = !categorySlug || !serviceSlug || !districtSlug;
  const pricing = getPricingForService(serviceSlug);
  const districtEnabled = Boolean(selectedDistrict);
  const matchedProfessionals = useMemo(() => matchProfessionals(districtSlug), [districtSlug]);

  const visibleProfessionals = useMemo(() => {
    const activeFilters = filterGroups.flatMap((group) => searchParams.getAll(group.key));
    let list = districtEnabled ? [...matchedProfessionals] : [];
    if (activeFilters.includes("Disponible hoy")) {
      list = list.filter((professional) => professional.availabilityStatus === "available");
    }
    if (activeFilters.includes("4.8+")) {
      list = list.filter((professional) => Number(professional.rating) >= 4.8);
    }
    if (activeFilters.includes("4.7+")) {
      list = list.filter((professional) => Number(professional.rating) >= 4.7);
    }
    if (sort === "rating") {
      list.sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    if (sort === "disponibilidad") {
      list.sort((a, b) => (a.availabilityStatus === "available" ? 0 : 1) - (b.availabilityStatus === "available" ? 0 : 1) || a.etaMinutes - b.etaMinutes);
    }
    if (sort === "precio") {
      list.sort((a, b) => priceValue(a.price) - priceValue(b.price));
    }
    return list;
  }, [districtEnabled, matchedProfessionals, searchParams, sort]);

  function buildHref(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    const nextValues = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    nextValues.forEach((item) => params.append(key, item));
    return `${basePath}/resultados/?${params.toString()}`;
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orden", value);
    router.replace(`/resultados/?${params.toString()}`, { scroll: false });
  }

  const filters = (
    <Card className="h-fit p-5">
      <div className="flex items-center gap-2 font-semibold text-neutral-950">
        <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-brand-600" />
        Filtros
      </div>
      <div className="mt-5 grid gap-5 text-sm text-neutral-700">
        {filterGroups.map((group) => (
          <div key={group.key}>
            <p className="mb-2 font-semibold text-neutral-950">{group.label}</p>
            <div className="grid gap-2">
              {group.options.map((option) => {
                const checked = searchParams.getAll(group.key).includes(option);
                return (
                  <a key={option} href={buildHref(group.key, option)} className={cn("flex items-center justify-between rounded-md border px-3 py-2 transition-colors duration-fast", checked ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 bg-white hover:border-brand-500")}>
                    {option}
                    <span className={cn("h-2.5 w-2.5 rounded-full", checked ? "bg-brand-600" : "bg-neutral-200")} />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6">
        <div>
          <Badge tone="brand">Resultados</Badge>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">
            Profesionales de {serviceName} en {districtName}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
            {visibleProfessionals.length} profesionales compatibles para revisar opciones y enviar una solicitud.
          </p>
        </div>

        {hasError ? (
          <Card className="border-action-500/40 bg-action-100 p-4 text-neutral-950">
            Completa servicio y distrito para afinar mejor los resultados.
          </Card>
        ) : null}

        {!hasError && !districtEnabled ? (
            <Card className="border-action-500/40 bg-action-100 p-4 text-neutral-950">
            Por ahora recibimos solicitudes en Miraflores, San Isidro y San Borja.
          </Card>
        ) : null}

        <MainSearch />

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <Card className="p-5">
            <p className="text-sm font-semibold text-brand-600">Precio referencial</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-neutral-950">{pricing.baseRange}</h2>
            <div className="mt-4 grid gap-2 text-sm text-neutral-700">
              <span>Ajuste máximo en visita: {pricing.onsiteAdjustmentLimit}</span>
              <span>El precio final depende del detalle revisado por el profesional.</span>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-brand-600 bg-white px-4 py-2 font-semibold text-brand-600 lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
          <label className="flex items-center gap-3 text-sm font-semibold text-neutral-700">
            Ordenar
            <select className="min-h-[44px] rounded-md border border-neutral-200 bg-white px-3 text-neutral-950" value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">{filters}</div>
          <div className="grid gap-5 lg:grid-cols-2">
            {visibleProfessionals.map((professional) => <ProfessionalCard key={professional.id} {...professional} />)}
            {visibleProfessionals.length === 0 ? (
              <Card className="col-span-full grid gap-3 p-8 text-center">
                <SearchX className="mx-auto h-10 w-10 text-brand-600" />
                <h2 className="font-display text-2xl font-bold text-neutral-950">No encontramos coincidencias</h2>
                <p className="text-neutral-600">Prueba quitando un filtro o buscando en un distrito cercano.</p>
              </Card>
            ) : null}
          </div>
        </div>

      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Cerrar filtros" className="absolute inset-0 bg-brand-700/30" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-neutral-950">Filtros</h2>
              <button type="button" className="rounded-full bg-brand-100 p-2 text-brand-700" onClick={() => setMobileFiltersOpen(false)} aria-label="Cerrar filtros">
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            {filters}
          </div>
        </div>
      ) : null}
    </section>
  );
}
