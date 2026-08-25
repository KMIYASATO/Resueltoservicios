import type { Metadata } from "next";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { ButtonLink } from "@/components/ui/Button";
import { ProfessionalRequestPreview } from "@/features/requests/components/ProfessionalRequestPreview";

export const metadata: Metadata = {
  title: "Panel profesional mock | Queda",
  description: "Vista de desarrollo para simular respuestas del profesional."
};

export default function ProfessionalPreviewPage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><ResueltoLogo /><ButtonLink href="/solicitudes" variant="secondary">Mis solicitudes</ButtonLink></div></header>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><ProfessionalRequestPreview /></section>
    </main>
  );
}
