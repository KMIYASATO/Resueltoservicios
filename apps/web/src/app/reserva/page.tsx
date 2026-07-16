import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";

const bookingSteps = ["Servicio", "Ubicacion", "Fecha y hora", "Profesional", "Detalle", "Direccion", "Resumen", "Pago", "Confirmacion"];

export default function BookingPage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/" variant="secondary">Salir</ButtonLink>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6">
          <div>
            <p className="text-sm font-semibold text-brand-600">Flujo de reserva</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">Confirma los datos paso a paso</h1>
          </div>
          <Card className="p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {bookingSteps.map((step, index) => (
                <div key={step} className="rounded-md border border-neutral-200 p-4">
                  <span className="text-xs font-semibold text-brand-600">Paso {index + 1}</span>
                  <p className="mt-1 font-semibold text-neutral-950">{step}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Paso actual: Servicio</h2>
            <p className="mt-2 leading-7 text-neutral-600">En la implementacion conectada, este paso validara servicio, direccion, horario y profesional antes de crear la reserva atomica.</p>
            <ButtonLink href="#" className="mt-6">Continuar</ButtonLink>
          </Card>
        </div>
        <Card className="h-fit p-6 lg:sticky lg:top-8">
          <h2 className="font-display text-2xl font-bold text-neutral-950">Resumen</h2>
          <div className="mt-5 grid gap-3 text-sm text-neutral-700">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-600" />Servicio pendiente de confirmar</span>
            <span>Precio estimado: pendiente</span>
            <span>Pago: simulado en MVP</span>
          </div>
        </Card>
      </section>
    </main>
  );
}
