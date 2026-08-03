"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { unavailableAuthService } from "../services/unavailable-auth.service";
import type { AuthFeedbackState } from "../types/auth.types";
import { validateForgotPassword } from "../validation/auth.validation";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthModal } from "../hooks/useAuthModal";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";
import { AuthSubmitButton } from "./AuthSubmitButton";

type ForgotPasswordFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
};

export function ForgotPasswordForm({ email, onEmailChange }: ForgotPasswordFormProps) {
  const { setAuthMode, setAuthModalBusy } = useAuthModal();
  const form = useAuthForm({ email });
  const [feedback, setFeedback] = useState<AuthFeedbackState>(null);
  const [submitting, setSubmitting] = useState(false);

  function validateField() {
    const errors = validateForgotPassword(form.values);
    form.setErrors((current) => ({ ...current, email: errors.email }));
  }

  async function submitForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateForgotPassword(form.values);
    form.setErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      form.focusFirstError(errors);
      return;
    }

    setSubmitting(true);
    setAuthModalBusy(true);
    const result = await unavailableAuthService.sendPasswordReset(form.values);
    setSubmitting(false);
    setAuthModalBusy(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  return (
    <div className="mt-5 grid gap-4">
      <form className="grid gap-4" noValidate onSubmit={submitForgotPassword}>
        <AuthField
          id="forgot-email"
          label="Correo electrónico"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={form.values.email}
          error={form.errors.email}
          inputRef={form.registerField("email")}
          data-auth-initial
          onBlur={validateField}
          onChange={(event) => {
            form.update("email", event.target.value);
            onEmailChange(event.target.value);
          }}
        />
        <AuthFeedback feedback={feedback} />
        <AuthSubmitButton type="submit" loading={submitting} loadingLabel="Enviando instrucciones…">Enviar instrucciones</AuthSubmitButton>
      </form>
      <button className="mx-auto min-h-[44px] px-3 text-sm font-semibold text-brand-600 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" onClick={() => setAuthMode("login")}>Volver a iniciar sesión</button>
    </div>
  );
}
