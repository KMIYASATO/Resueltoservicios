import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRouteRedirect } from "@/features/auth/components/AuthRouteRedirect";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Queda",
  description: "Recupera el acceso a tu cuenta de Queda."
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthRouteRedirect mode="forgot-password" />
    </Suspense>
  );
}
