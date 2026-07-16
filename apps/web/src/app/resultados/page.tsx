import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MainSearch } from "@/components/resuelto/MainSearch";
import { ProfessionalCard } from "@/components/resuelto/ProfessionalCard";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { professionals } from "@/data/home";

export default function ResultsPage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/" variant="secondary">Volver al inicio</ButtonLink>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          <div>
            <Badge tone="brand">Resultados demostrativos</Badge>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">Profesionales disponibles en Lima</h1>
            <p className="mt-3 max-w-2xl leading-7 text-neutral-600">Esta pantalla prepara filtros, comparacion y disponibilidad. La data real vendra desde Supabase con RLS.</p>
          </div>
          <MainSearch />
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Card className="h-fit p-5">
              <div className="flex items-center gap-2 font-semibold text-neutral-950">
                <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-brand-600" />
                Filtros
              </div>
              <div className="mt-5 grid gap-4 text-sm text-neutral-700">
                <label className="flex items-center gap-2"><input type="checkbox" /> Disponible hoy</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Profesional verificado</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Mejor valorado</label>
              </div>
            </Card>
            <div className="grid gap-5 lg:grid-cols-2">
              {professionals.map((professional) => (
                <ProfessionalCard key={professional.name} {...professional} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
