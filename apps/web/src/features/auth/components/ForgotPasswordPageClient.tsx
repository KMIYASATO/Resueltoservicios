"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { unavailableAuthService } from "../services/unavailable-auth.service";
import type { AuthFeedbackState } from "../types/auth.types";
import { validateForgotPassword } from "../validation/auth.validation";
import { useAuthForm } from "../hooks/useAuthForm";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";
import { AuthSubmitButton } from "./AuthSubmitButton";

export function ForgotPasswordPageClient() {
  const searchParams = useSearchParams();
  const form = useAuthForm({ email: searchParams.get("email") ?? "" });
  const [feedback, setFeedback] = useState<AuthFeedbackState>({ tone: "info", message: "Ingresa tu correo y te indicaremos cómo recuperar el acceso cuando el servicio esté habilitado." });
  const [submitting, setSubmitting] = useState(false);

  async function submitForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateForgotPassword(form.values);
    form.setErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      form.focusFirstError(errors);
      return;
    }

    setSubmitting(true);
    const result = await unavailableAuthService.sendPasswordReset(form.values);
    setSubmitting(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl p-5 sm:p-8">
        <ResueltoLogo />
        <div className="mt-8">
          <p className="text-sm font-semibold text-brand-600">Recuperación de cuenta</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950">Restablece tu contraseña</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">Validaremos el correo antes de enviar instrucciones cuando Supabase Auth esté conectado.</p>
        </div>
        <div className="mt-6"><AuthFeedback feedback={feedback} /></div>
        <form className="mt-6 grid gap-5" noValidate onSubmit={submitForgotPassword}>
          <AuthField
            id="forgot-email"
            label="Correo electrónico"
            inputMode="email"
            autoComplete="email"
            value={form.values.email}
            error={form.errors.email}
            inputRef={form.registerField("email")}
            onBlur={() => form.markTouched("email")}
            onChange={(event) => form.update("email", event.target.value)}
          />
          <AuthSubmitButton type="submit" loading={submitting} loadingLabel="Revisando correo...">Enviar instrucciones</AuthSubmitButton>
        </form>
        <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm font-semibold">
          <Link className="text-brand-600 hover:text-brand-800" href="/auth/login/">Volver a iniciar sesión</Link>
          <Link className="text-neutral-500 hover:text-brand-800" href="/">Inicio</Link>
        </div>
      </Card>
    </main>
  );
}
