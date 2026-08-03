import type { AuthService } from "./auth.service";

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 520));
}

export const unavailableAuthService: AuthService = {
  async signInWithEmail() {
    await wait();
    return { ok: false, message: "Esta opción estará disponible próximamente." };
  },
  async signUpWithEmail() {
    await wait();
    return { ok: false, message: "Esta opción estará disponible próximamente." };
  },
  async signInWithGoogle() {
    await wait();
    return { ok: false, message: "Esta opción estará disponible próximamente." };
  },
  async signInWithFacebook() {
    await wait();
    return { ok: false, message: "Esta opción estará disponible próximamente." };
  },
  async sendPasswordReset() {
    await wait();
    return { ok: false, message: "Esta opción estará disponible próximamente." };
  },
  async signOut() {
    await wait();
    return { ok: true, message: "Sesión cerrada." };
  },
  async getSession() {
    return null;
  }
};
