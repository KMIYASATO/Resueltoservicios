import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRouteRedirect } from "@/features/auth/components/AuthRouteRedirect";

export const metadata: Metadata = {
  title: "Cuenta | Queda",
  description: "Ingresa o crea tu cuenta de Queda."
};

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthRouteRedirect mode="login" />
    </Suspense>
  );
}
