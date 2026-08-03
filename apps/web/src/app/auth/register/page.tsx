import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPageClient } from "@/features/auth/components/AuthPageClient";
import { AuthPageFallback } from "../AuthPageFallback";

export const metadata: Metadata = {
  title: "Crear cuenta | Queda",
  description: "Crea tu cuenta de Queda."
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthPageClient mode="register" />
    </Suspense>
  );
}
