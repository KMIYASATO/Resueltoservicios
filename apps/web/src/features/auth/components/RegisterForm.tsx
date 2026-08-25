"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { demoAuthService } from "../services/demo-auth.service";
import type { AuthFeedbackState, AuthProvider } from "../types/auth.types";
import { validateRegister } from "../validation/auth.validation";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthModal } from "../hooks/useAuthModal";
import { AuthDivider } from "./AuthDivider";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { PasswordField } from "./PasswordField";
import { SocialAuthButtons } from "./SocialAuthButtons";

type RegisterFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
};

export function RegisterForm({ email, onEmailChange }: RegisterFormProps) {
  const { completeAuth, setAuthMode, setAuthModalBusy } = useAuthModal();
  const form = useAuthForm({ name: "", email, password: "", confirmPassword: "", acceptedTerms: false });
  const [feedback, setFeedback] = useState<AuthFeedbackState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  function validateField(field: "name" | "email" | "password" | "confirmPassword" | "acceptedTerms") {
    const errors = validateRegister(form.values);
    form.setErrors((current) => ({ ...current, [field]: errors[field] }));
  }

  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateRegister(form.values);
    form.setErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      form.focusFirstError(errors);
      return;
    }

    setSubmitting(true);
    setAuthModalBusy(true);
    const result = await demoAuthService.signUpWithEmail(form.values);
    setSubmitting(false);
    setAuthModalBusy(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
    if (result.session) completeAuth(result.session);
  }

  async function handleProvider(provider: AuthProvider) {
    setLoadingProvider(provider);
    setAuthModalBusy(true);
    const result = provider === "google" ? await demoAuthService.signInWithGoogle() : await demoAuthService.signInWithFacebook();
    setLoadingProvider(null);
    setAuthModalBusy(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
    if (result.session) completeAuth(result.session);
  }

  return (
    <div className="mt-5 grid gap-4">
      <SocialAuthButtons loadingProvider={loadingProvider} onProvider={handleProvider} />
      <AuthDivider>o regístrate con tu correo</AuthDivider>
      <form className="grid gap-4" noValidate onSubmit={submitRegister}>
        <AuthField
          id="register-name"
          label="Nombre"
          autoComplete="name"
          placeholder="Tu nombre"
          value={form.values.name}
          error={form.errors.name}
          inputRef={form.registerField("name")}
          onBlur={() => validateField("name")}
          onChange={(event) => form.update("name", event.target.value)}
        />
        <AuthField
          id="register-email"
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
          id="register-password"
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={form.values.password}
          error={form.errors.password}
          inputRef={form.registerField("password")}
          onBlur={() => validateField("password")}
          onChange={(event) => form.update("password", event.target.value)}
        />
        <PasswordField
          id="register-confirm-password"
          label="Confirmar contraseña"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          value={form.values.confirmPassword}
          error={form.errors.confirmPassword}
          inputRef={form.registerField("confirmPassword")}
          onBlur={() => validateField("confirmPassword")}
          onChange={(event) => form.update("confirmPassword", event.target.value)}
        />
        <div>
          <label className="flex gap-3 text-sm leading-6 text-neutral-700">
            <input
              ref={form.registerField("acceptedTerms")}
              className="mt-1 h-4 w-4 rounded border-neutral-200 text-brand-600 focus:ring-brand-600"
              type="checkbox"
              checked={form.values.acceptedTerms}
              aria-invalid={form.errors.acceptedTerms ? true : undefined}
              aria-describedby={form.errors.acceptedTerms ? "register-terms-error" : undefined}
              onBlur={() => validateField("acceptedTerms")}
              onChange={(event) => form.update("acceptedTerms", event.target.checked)}
            />
            <span>He leído y acepto los Términos y Condiciones y la Política de Privacidad.</span>
          </label>
          {form.errors.acceptedTerms ? <p className="mt-1.5 text-sm font-medium text-error-600" id="register-terms-error">{form.errors.acceptedTerms}</p> : null}
        </div>
        <AuthFeedback feedback={feedback} />
        <AuthSubmitButton type="submit" loading={submitting} loadingLabel="Creando cuenta…">Crear cuenta</AuthSubmitButton>
      </form>
      <p className="text-center text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <button className="font-semibold text-brand-600 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" onClick={() => setAuthMode("login")}>Ingresar</button>
      </p>
    </div>
  );
}
