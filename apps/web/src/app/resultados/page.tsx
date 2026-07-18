import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { ResultsContent } from "./ResultsContent";

export default function ResultsPage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/" variant="secondary">Volver al inicio</ButtonLink>
        </div>
      </header>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">Cargando resultados...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
