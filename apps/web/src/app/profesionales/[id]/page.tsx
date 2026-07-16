import { CalendarClock, CheckCircle2, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";

export function generateStaticParams() {
  return [{ id: "demo" }];
}

export default function ProfessionalProfilePage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/resultados" variant="secondary">Ver resultados</ButtonLink>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">CR</div>
              <div>
                <Badge tone="success">Verificado</Badge>
                <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">Carlos R.</h1>
                <p className="mt-2 text-lg text-neutral-600">Electricista domiciliario · Lima Metropolitana</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-700">
                  <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-warning-600 text-warning-600" />4.8 demostrativo</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-600" />82 servicios demostrativos</span>
                  <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand-600" />Disponible hoy</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Servicios y precios estimados</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["Revision electrica", "Desde S/ 55"],
                ["Instalacion de luminaria", "Desde S/ 65"],
                ["Cambio de tomacorriente", "Desde S/ 50"]
              ].map(([service, price]) => (
                <div key={service} className="flex items-center justify-between rounded-md border border-neutral-200 p-4">
                  <span className="font-medium text-neutral-950">{service}</span>
                  <span className="font-semibold text-brand-600">{price}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="h-fit p-6 lg:sticky lg:top-8">
          <h2 className="font-display text-2xl font-bold text-neutral-950">Reserva con Carlos</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">El precio final se calculara en backend antes de confirmar.</p>
          <div className="mt-5 grid gap-3 text-sm text-neutral-700">
            <span>Hoy · 3:00 p. m.</span>
            <span>Miraflores, Lima</span>
            <span>Desde S/ 55</span>
          </div>
          <ButtonLink href="/reserva" className="mt-6 w-full">Reservar ahora</ButtonLink>
        </Card>
      </section>
    </main>
  );
}
