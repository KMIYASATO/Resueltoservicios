import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";

export function AuthPageFallback() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl bg-brand-700 p-6 text-white shadow-lg sm:p-8">
          <ResueltoLogo inverted />
          <div className="mt-12 h-10 w-3/4 animate-pulse rounded bg-white/20" />
          <div className="mt-5 h-20 animate-pulse rounded bg-white/10" />
        </div>
        <Card className="p-5 sm:p-8">
          <div className="h-10 animate-pulse rounded-full bg-neutral-100" />
          <div className="mt-8 h-8 w-2/3 animate-pulse rounded bg-neutral-100" />
          <div className="mt-6 h-36 animate-pulse rounded bg-neutral-100" />
        </Card>
      </div>
    </main>
  );
}
