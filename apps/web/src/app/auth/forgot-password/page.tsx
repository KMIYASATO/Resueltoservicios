import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordPageClient } from "@/features/auth/components/ForgotPasswordPageClient";
import { AuthPageFallback } from "../AuthPageFallback";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Queda",
  description: "Recupera el acceso a tu cuenta de Queda."
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <ForgotPasswordPageClient />
    </Suspense>
  );
}
