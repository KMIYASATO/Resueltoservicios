import type { Metadata } from "next";
import { Suspense } from "react";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { ButtonLink } from "@/components/ui/Button";
import { RequestsRouteContent } from "./route-content";

export const metadata: Metadata = {
  title: "Mis solicitudes | Queda",
  description: "Revisa tus solicitudes y coordinación con profesionales."
};

export default function RequestsPage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><ResueltoLogo /><ButtonLink href="/" variant="secondary">Inicio</ButtonLink></div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Suspense fallback={null}><RequestsRouteContent /></Suspense></section>
    </main>
  );
}
