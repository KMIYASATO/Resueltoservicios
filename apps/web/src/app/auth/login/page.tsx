import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRouteRedirect } from "@/features/auth/components/AuthRouteRedirect";

export const metadata: Metadata = {
  title: "Iniciar sesión | Queda",
  description: "Accede a tu cuenta de Queda."
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthRouteRedirect mode="login" />
    </Suspense>
  );
}
