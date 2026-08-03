"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { unavailableAuthService } from "../services/unavailable-auth.service";
import type { AuthFeedbackState, AuthProvider } from "../types/auth.types";
import { validateLogin } from "../validation/auth.validation";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthModal } from "../hooks/useAuthModal";
import { AuthDivider } from "./AuthDivider";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { PasswordField } from "./PasswordField";
import { SocialAuthButtons } from "./SocialAuthButtons";

type LoginFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
};

export function LoginForm({ email, onEmailChange }: LoginFormProps) {
  const { setAuthMode, setAuthModalBusy } = useAuthModal();
  const form = useAuthForm({ email, password: "" });
  const [feedback, setFeedback] = useState<AuthFeedbackState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  function validateField(field: "email" | "password") {
    const errors = validateLogin(form.values);
    form.setErrors((current) => ({ ...current, [field]: errors[field] }));
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateLogin(form.values);
    form.setErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      form.focusFirstError(errors);
      return;
    }

    setSubmitting(true);
    setAuthModalBusy(true);
    const result = await unavailableAuthService.signInWithEmail(form.values);
    setSubmitting(false);
    setAuthModalBusy(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  async function handleProvider(provider: AuthProvider) {
    setLoadingProvider(provider);
    setAuthModalBusy(true);
    const result = provider === "google" ? await unavailableAuthService.signInWithGoogle() : await unavailableAuthService.signInWithFacebook();
    setLoadingProvider(null);
    setAuthModalBusy(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  return (
    <div className="mt-5 grid gap-4">
      <SocialAuthButtons loadingProvider={loadingProvider} onProvider={handleProvider} />
      <AuthDivider>o continúa con tu correo</AuthDivider>
      <form className="grid gap-4" noValidate onSubmit={submitLogin}>
        <AuthField
          id="login-email"
          label="Correo electrónico"
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={form.values.email}
          error={form.errors.email}
          inputRef={form.registerField("email")}
          onBlur={() => validateField("email")}
          onChange={(event) => {
            form.update("email", event.target.value);
            onEmailChange(event.target.value);
          }}
        />
        <PasswordField
          id="login-password"
          label="Contraseña"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          value={form.values.password}
          error={form.errors.password}
          inputRef={form.registerField("password")}
          onBlur={() => validateField("password")}
          onChange={(event) => form.update("password", event.target.value)}
        />
        <div className="flex justify-end">
          <button className="text-sm font-semibold text-brand-600 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" onClick={() => setAuthMode("forgot-password")}>Olvidé mi contraseña</button>
        </div>
        <AuthFeedback feedback={feedback} />
        <AuthSubmitButton type="submit" loading={submitting} loadingLabel="Iniciando sesión…">Iniciar sesión</AuthSubmitButton>
      </form>
      <p className="text-center text-sm text-neutral-600">
        ¿Aún no tienes cuenta?{" "}
        <button className="font-semibold text-brand-600 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" onClick={() => setAuthMode("register")}>Crear cuenta</button>
      </p>
    </div>
  );
}
