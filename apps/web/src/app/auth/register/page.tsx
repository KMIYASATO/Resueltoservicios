import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRouteRedirect } from "@/features/auth/components/AuthRouteRedirect";

export const metadata: Metadata = {
  title: "Crear cuenta | Queda",
  description: "Crea tu cuenta de Queda."
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthRouteRedirect mode="register" />
    </Suspense>
  );
}
