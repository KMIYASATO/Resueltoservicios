"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { unavailableAuthService } from "../services/unavailable-auth.service";
import type { AuthFeedbackState, AuthIntent, AuthMode, AuthProvider } from "../types/auth.types";
import { sanitizeIntent, sanitizeReturnTo, validateLogin, validateRegister } from "../validation/auth.validation";
import { AuthFeedback } from "./AuthFeedback";
import { AuthField } from "./AuthField";
import { AuthModeSwitcher } from "./AuthModeSwitcher";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { PasswordField } from "./PasswordField";
import { PasswordRequirements } from "./PasswordRequirements";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useAuthForm } from "../hooks/useAuthForm";

type AuthPageClientProps = {
  mode: AuthMode;
};

function AuthIntro({ intent }: { intent: AuthIntent }) {
  const professional = intent === "professional";

  return (
    <div className="rounded-2xl bg-brand-700 p-6 text-white shadow-lg sm:p-8 lg:min-h-[560px]">
      <ResueltoLogo inverted />
      <div className="mt-12 max-w-md">
        <p className="text-sm font-semibold text-brand-100">Cuenta Queda</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
          {professional ? "Empieza a recibir solicitudes mejor detalladas" : "Coordina servicios con más claridad"}
        </h1>
        <p className="mt-5 text-base leading-7 text-brand-100">
          {professional
            ? "Crea tu cuenta profesional para preparar tu perfil, zonas de atención y disponibilidad."
            : "Crea o usa tu cuenta para guardar solicitudes, revisar coordinaciones y contactar profesionales cuando corresponda."}
        </p>
      </div>
      <div className="mt-10 grid gap-3 text-sm text-brand-50">
        {["Datos protegidos", "Acceso con correo o redes", "Sin sesión simulada antes de activar el backend"].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthPageClient({ mode }: AuthPageClientProps) {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const intent = sanitizeIntent(searchParams.get("intent"));
  const returnTo = sanitizeReturnTo(searchParams.get("returnTo"));
  const loginForm = useAuthForm({ email: initialEmail, password: "" });
  const registerForm = useAuthForm({ name: "", email: initialEmail, password: "", confirmPassword: "", acceptedTerms: false });
  const [feedback, setFeedback] = useState<AuthFeedbackState>({ tone: "info", message: "La interfaz está lista. El acceso real se habilitará al conectar Supabase Auth." });
  const [submitting, setSubmitting] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);
  const email = mode === "login" ? loginForm.values.email : registerForm.values.email;

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateLogin(loginForm.values);
    loginForm.setErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      loginForm.focusFirstError(errors);
      return;
    }

    setSubmitting(true);
    const result = await unavailableAuthService.signInWithEmail(loginForm.values);
    setSubmitting(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  async function submitRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateRegister(registerForm.values);
    registerForm.setErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      registerForm.focusFirstError(errors);
      return;
    }

    setSubmitting(true);
    const result = await unavailableAuthService.signUpWithEmail(registerForm.values);
    setSubmitting(false);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  async function handleProvider(provider: AuthProvider) {
    setLoadingProvider(provider);
    const result = provider === "google" ? await unavailableAuthService.signInWithGoogle() : await unavailableAuthService.signInWithFacebook();
    setLoadingProvider(null);
    setFeedback({ tone: result.ok ? "success" : "error", message: result.message });
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <AuthIntro intent={intent} />
        <Card className="p-5 sm:p-8">
          <div className="mb-6">
            <Link className="text-sm font-semibold text-brand-600 hover:text-brand-800" href="/">Volver al inicio</Link>
          </div>

          <AuthModeSwitcher mode={mode} email={email} intent={intent} returnTo={returnTo} />

          <div className="mt-8">
            <p className="text-sm font-semibold text-brand-600">{intent === "professional" ? "Cuenta profesional" : "Cuenta cliente"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950">
              {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {returnTo === "/" ? "Cuando el backend esté conectado, podrás continuar desde aquí." : "Después de autenticarte, podrás continuar hacia la sección solicitada."}
            </p>
          </div>

          <div className="mt-6"><AuthFeedback feedback={feedback} /></div>
          <div className="mt-6"><SocialAuthButtons loadingProvider={loadingProvider} onProvider={handleProvider} /></div>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
            <span className="h-px flex-1 bg-neutral-200" />
            o usa tu correo
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          {mode === "login" ? (
            <form className="grid gap-5" noValidate onSubmit={submitLogin}>
              <AuthField
                id="login-email"
                label="Correo electrónico"
                inputMode="email"
                autoComplete="email"
                value={loginForm.values.email}
                error={loginForm.errors.email}
                inputRef={loginForm.registerField("email")}
                onBlur={() => loginForm.markTouched("email")}
                onChange={(event) => loginForm.update("email", event.target.value)}
              />
              <PasswordField
                id="login-password"
                label="Contraseña"
                autoComplete="current-password"
                value={loginForm.values.password}
                error={loginForm.errors.password}
                inputRef={loginForm.registerField("password")}
                onBlur={() => loginForm.markTouched("password")}
                onChange={(event) => loginForm.update("password", event.target.value)}
              />
              <div className="flex justify-end">
                <Link className="text-sm font-semibold text-brand-600 hover:text-brand-800" href={`/auth/forgot-password/${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`}>Olvidé mi contraseña</Link>
              </div>
              <AuthSubmitButton type="submit" loading={submitting} loadingLabel="Validando acceso...">Iniciar sesión</AuthSubmitButton>
            </form>
          ) : (
            <form className="grid gap-5" noValidate onSubmit={submitRegister}>
              <AuthField
                id="register-name"
                label="Nombre completo"
                autoComplete="name"
                value={registerForm.values.name}
                error={registerForm.errors.name}
                inputRef={registerForm.registerField("name")}
                onBlur={() => registerForm.markTouched("name")}
                onChange={(event) => registerForm.update("name", event.target.value)}
              />
              <AuthField
                id="register-email"
                label="Correo electrónico"
                inputMode="email"
                autoComplete="email"
                value={registerForm.values.email}
                error={registerForm.errors.email}
                inputRef={registerForm.registerField("email")}
                onBlur={() => registerForm.markTouched("email")}
                onChange={(event) => registerForm.update("email", event.target.value)}
              />
              <div>
                <PasswordField
                  id="register-password"
                  label="Contraseña"
                  autoComplete="new-password"
                  value={registerForm.values.password}
                  error={registerForm.errors.password}
                  inputRef={registerForm.registerField("password")}
                  onBlur={() => registerForm.markTouched("password")}
                  onChange={(event) => registerForm.update("password", event.target.value)}
                />
                <PasswordRequirements password={registerForm.values.password} />
              </div>
              <PasswordField
                id="register-confirm-password"
                label="Confirmar contraseña"
                autoComplete="new-password"
                value={registerForm.values.confirmPassword}
                error={registerForm.errors.confirmPassword}
                inputRef={registerForm.registerField("confirmPassword")}
                onBlur={() => registerForm.markTouched("confirmPassword")}
                onChange={(event) => registerForm.update("confirmPassword", event.target.value)}
              />
              <label className="flex gap-3 text-sm leading-6 text-neutral-700">
                <input
                  ref={registerForm.registerField("acceptedTerms")}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-600"
                  type="checkbox"
                  checked={registerForm.values.acceptedTerms}
                  aria-invalid={registerForm.errors.acceptedTerms ? true : undefined}
                  onBlur={() => registerForm.markTouched("acceptedTerms")}
                  onChange={(event) => registerForm.update("acceptedTerms", event.target.checked)}
                />
                <span>Acepto los Términos y la Política de Privacidad de Queda.</span>
              </label>
              {registerForm.errors.acceptedTerms ? <p className="-mt-3 text-sm font-medium text-red-700">{registerForm.errors.acceptedTerms}</p> : null}
              <AuthSubmitButton type="submit" loading={submitting} loadingLabel="Creando cuenta...">Crear cuenta</AuthSubmitButton>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
