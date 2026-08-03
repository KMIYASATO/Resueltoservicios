import type { FieldErrors, ForgotPasswordValues, LoginValues, PasswordRequirement, RegisterValues } from "../types/auth.types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeReturnTo(value: string | null) {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  if (/^\/\s*javascript:/i.test(value)) return "/";
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return "/";
  return value;
}

export function sanitizeIntent(value: string | null) {
  return value === "professional" ? "professional" : "customer";
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { key: "length", label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { key: "letter", label: "Al menos una letra", met: /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(password) },
    { key: "number", label: "Al menos un número", met: /\d/.test(password) }
  ];
}

export function passwordIsValid(password: string) {
  return getPasswordRequirements(password).every((requirement) => requirement.met);
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};
  const email = values.email.trim();

  if (!email) errors.email = "Ingresa tu correo electrónico.";
  else if (!emailPattern.test(email)) errors.email = "Ingresa un correo electrónico válido.";
  if (!values.password) errors.password = "Ingresa tu contraseña.";

  return errors;
}

export function validateRegister(values: RegisterValues): FieldErrors<RegisterValues> {
  const errors: FieldErrors<RegisterValues> = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name) errors.name = "Ingresa tu nombre.";
  else if (name.length < 2) errors.name = "Ingresa tu nombre.";
  if (!email) errors.email = "Ingresa tu correo electrónico.";
  else if (!emailPattern.test(email)) errors.email = "Ingresa un correo electrónico válido.";
  if (!values.password) errors.password = "Crea una contraseña.";
  else if (values.password.length < 8) errors.password = "La contraseña debe tener al menos 8 caracteres.";
  else if (!passwordIsValid(values.password)) errors.password = "La contraseña debe tener al menos una letra y un número.";
  if (!values.confirmPassword) errors.confirmPassword = "Vuelve a escribir tu contraseña.";
  else if (values.password !== values.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden.";
  if (!values.acceptedTerms) errors.acceptedTerms = "Debes aceptar los Términos y la Política de Privacidad.";

  return errors;
}

export function validateForgotPassword(values: ForgotPasswordValues): FieldErrors<ForgotPasswordValues> {
  const errors: FieldErrors<ForgotPasswordValues> = {};
  const email = values.email.trim();

  if (!email) errors.email = "Ingresa tu correo electrónico.";
  else if (!emailPattern.test(email)) errors.email = "Ingresa un correo electrónico válido.";

  return errors;
}
