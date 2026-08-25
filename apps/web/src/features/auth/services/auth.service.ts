import type { AuthIntent, AuthProvider, ForgotPasswordValues, LoginValues, RegisterValues } from "../types/auth.types";

export type AuthSession = {
  user: {
    name: string;
    email: string;
    accountIntent: AuthIntent;
  };
};

export type AuthServiceResult = {
  ok: boolean;
  message: string;
  session?: AuthSession;
};

export type AuthService = {
  signInWithEmail(values: LoginValues): Promise<AuthServiceResult>;
  signUpWithEmail(values: RegisterValues): Promise<AuthServiceResult>;
  signInWithGoogle(): Promise<AuthServiceResult>;
  signInWithFacebook(): Promise<AuthServiceResult>;
  sendPasswordReset(values: ForgotPasswordValues): Promise<AuthServiceResult>;
  signOut(): Promise<AuthServiceResult>;
  getSession(): Promise<AuthSession | null>;
};

export function providerLabel(provider: AuthProvider) {
  return provider === "google" ? "Google" : "Facebook";
}
