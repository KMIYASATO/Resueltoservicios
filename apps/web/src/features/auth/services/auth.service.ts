import type { AuthProvider, ForgotPasswordValues, LoginValues, RegisterValues } from "../types/auth.types";

export type AuthServiceResult = {
  ok: boolean;
  message: string;
};

export type AuthService = {
  signInWithEmail(values: LoginValues): Promise<AuthServiceResult>;
  signUpWithEmail(values: RegisterValues): Promise<AuthServiceResult>;
  signInWithGoogle(): Promise<AuthServiceResult>;
  signInWithFacebook(): Promise<AuthServiceResult>;
  sendPasswordReset(values: ForgotPasswordValues): Promise<AuthServiceResult>;
  signOut(): Promise<AuthServiceResult>;
  getSession(): Promise<null>;
};

export function providerLabel(provider: AuthProvider) {
  return provider === "google" ? "Google" : "Facebook";
}
