import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPageClient } from "@/features/auth/components/AuthPageClient";
import { AuthPageFallback } from "../AuthPageFallback";

export const metadata: Metadata = {
  title: "Iniciar sesión | Queda",
  description: "Accede a tu cuenta de Queda."
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthPageClient mode="login" />
    </Suspense>
  );
}
