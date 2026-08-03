import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPageClient } from "@/features/auth/components/AuthPageClient";
import { AuthPageFallback } from "./AuthPageFallback";

export const metadata: Metadata = {
  title: "Cuenta | Queda",
  description: "Ingresa o crea tu cuenta de Queda."
};

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthPageClient mode="login" />
    </Suspense>
  );
}
