import type { AuthIntent, ForgotPasswordValues, LoginValues, RegisterValues } from "../types/auth.types";
import type { AuthService, AuthSession } from "./auth.service";

const accountKey = "queda:demo-account";
const sessionKey = "queda:demo-session";

type DemoAccount = {
  name: string;
  email: string;
  password: string;
  accountIntent: AuthIntent;
};

export const defaultDemoAccount: DemoAccount = {
  name: "Cliente Demo",
  email: "cliente@queda.pe",
  password: "Queda1234",
  accountIntent: "customer"
};

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 420));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readAccount() {
  const stored = window.localStorage.getItem(accountKey);
  if (!stored) return defaultDemoAccount;

  try {
    return JSON.parse(stored) as DemoAccount;
  } catch {
    return defaultDemoAccount;
  }
}

function saveSession(account: DemoAccount): AuthSession {
  const session: AuthSession = {
    user: {
      name: account.name,
      email: account.email,
      accountIntent: account.accountIntent
    }
  };
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("queda:auth-session-changed", { detail: session }));
  return session;
}

export const demoAuthService: AuthService = {
  async signInWithEmail(values: LoginValues) {
    await wait();
    const accounts = [readAccount(), defaultDemoAccount];
    const account = accounts.find((item) => normalizeEmail(values.email) === normalizeEmail(item.email) && values.password === item.password);

    if (!account) {
      return { ok: false, message: "Usa la cuenta demo: cliente@queda.pe / Queda1234." };
    }

    return { ok: true, message: "Sesión demo iniciada.", session: saveSession(account) };
  },
  async signUpWithEmail(values: RegisterValues, accountIntent: AuthIntent = "customer") {
    await wait();
    const account: DemoAccount = {
      name: values.name.trim(),
      email: normalizeEmail(values.email),
      password: values.password,
      accountIntent
    };
    window.localStorage.setItem(accountKey, JSON.stringify(account));
    return { ok: true, message: "Cuenta demo creada.", session: saveSession(account) };
  },
  async signInWithGoogle() {
    await wait();
    return { ok: true, message: "Sesión demo iniciada con Google.", session: saveSession(defaultDemoAccount) };
  },
  async signInWithFacebook() {
    await wait();
    return { ok: true, message: "Sesión demo iniciada con Facebook.", session: saveSession(defaultDemoAccount) };
  },
  async sendPasswordReset(values: ForgotPasswordValues) {
    await wait();
    return { ok: true, message: `Demo: enviamos instrucciones a ${values.email.trim() || defaultDemoAccount.email}.` };
  },
  async signOut() {
    await wait();
    window.localStorage.removeItem(sessionKey);
    window.dispatchEvent(new CustomEvent("queda:auth-session-changed", { detail: null }));
    return { ok: true, message: "Sesión demo cerrada." };
  },
  async getSession() {
    const stored = window.localStorage.getItem(sessionKey);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as AuthSession;
    } catch {
      window.localStorage.removeItem(sessionKey);
      return null;
    }
  }
};
