import { createClient } from "@supabase/supabase-js";
import type { AuthIntent, ForgotPasswordValues, LoginValues, RegisterValues } from "../types/auth.types";
import type { AuthService, AuthSession } from "./auth.service";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseAuthIsConfigured = Boolean(supabaseUrl && supabasePublishableKey);

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseAuthIsConfigured) return null;
  supabaseClient ??= createClient(supabaseUrl, supabasePublishableKey);
  return supabaseClient;
}

function mapSession(session: Awaited<ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>["auth"]["getSession"]>>["data"]["session"]): AuthSession | null {
  if (!session?.user.email) return null;
  const metadata = session.user.user_metadata;
  return {
    user: {
      name: typeof metadata.name === "string" && metadata.name.trim() ? metadata.name : session.user.email.split("@")[0],
      email: session.user.email,
      accountIntent: metadata.accountIntent === "professional" ? "professional" : "customer"
    }
  };
}

function authErrorMessage(message?: string) {
  if (!message) return "No pudimos completar la autenticación.";
  if (message.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (message.includes("Email not confirmed")) return "Primero confirma tu correo electrónico.";
  return message;
}

export const supabaseAuthService: AuthService = {
  async signInWithEmail(values: LoginValues) {
    const supabase = getSupabaseClient();
    if (!supabase) return { ok: false, message: "Supabase no está configurado." };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email.trim().toLowerCase(),
      password: values.password
    });

    if (error) return { ok: false, message: authErrorMessage(error.message) };
    const session = mapSession(data.session);
    return { ok: Boolean(session), message: session ? "Sesión iniciada." : "No pudimos obtener la sesión.", session: session ?? undefined };
  },
  async signUpWithEmail(values: RegisterValues, accountIntent: AuthIntent = "customer") {
    const supabase = getSupabaseClient();
    if (!supabase) return { ok: false, message: "Supabase no está configurado." };

    const { data, error } = await supabase.auth.signUp({
      email: values.email.trim().toLowerCase(),
      password: values.password,
      options: {
        data: {
          name: values.name.trim(),
          accountIntent
        }
      }
    });

    if (error) return { ok: false, message: authErrorMessage(error.message) };
    const session = mapSession(data.session);
    return {
      ok: true,
      message: session ? "Cuenta creada y sesión iniciada." : "Cuenta creada. Revisa tu correo para confirmar el acceso.",
      session: session ?? undefined
    };
  },
  async signInWithGoogle() {
    const supabase = getSupabaseClient();
    if (!supabase) return { ok: false, message: "Supabase no está configurado." };

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });

    if (error) return { ok: false, message: authErrorMessage(error.message) };
    return { ok: true, message: "Redirigiendo a Google." };
  },
  async signInWithFacebook() {
    const supabase = getSupabaseClient();
    if (!supabase) return { ok: false, message: "Supabase no está configurado." };

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: window.location.origin }
    });

    if (error) return { ok: false, message: authErrorMessage(error.message) };
    return { ok: true, message: "Redirigiendo a Facebook." };
  },
  async sendPasswordReset(values: ForgotPasswordValues) {
    const supabase = getSupabaseClient();
    if (!supabase) return { ok: false, message: "Supabase no está configurado." };

    const { error } = await supabase.auth.resetPasswordForEmail(values.email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/login/`
    });

    if (error) return { ok: false, message: authErrorMessage(error.message) };
    return { ok: true, message: "Te enviamos instrucciones para recuperar tu contraseña." };
  },
  async signOut() {
    const supabase = getSupabaseClient();
    if (!supabase) return { ok: false, message: "Supabase no está configurado." };
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, message: authErrorMessage(error.message) };
    return { ok: true, message: "Sesión cerrada." };
  },
  async getSession() {
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return mapSession(data.session);
  }
};
