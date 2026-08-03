import type { AuthService } from "./auth.service";

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 520));
}

export const unavailableAuthService: AuthService = {
  async signInWithEmail() {
    await wait();
    return { ok: false, message: "El acceso estará disponible cuando finalicemos la conexión segura de Queda." };
  },
  async signUpWithEmail() {
    await wait();
    return { ok: false, message: "El registro estará disponible cuando finalicemos la conexión segura de Queda." };
  },
  async signInWithGoogle() {
    await wait();
    return { ok: false, message: "El acceso con Google estará disponible próximamente." };
  },
  async signInWithFacebook() {
    await wait();
    return { ok: false, message: "El acceso con Facebook estará disponible próximamente." };
  },
  async sendPasswordReset() {
    await wait();
    return { ok: false, message: "La recuperación estará disponible cuando conectemos el servicio de autenticación." };
  },
  async signOut() {
    await wait();
    return { ok: true, message: "Sesión cerrada." };
  },
  async getSession() {
    return null;
  }
};
