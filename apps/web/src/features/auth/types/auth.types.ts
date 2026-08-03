export type AuthMode = "login" | "register";

export type AuthIntent = "customer" | "professional";

export type AuthProvider = "google" | "facebook";

export type AuthFeedbackTone = "info" | "error" | "success";

export type AuthFeedbackState = {
  tone: AuthFeedbackTone;
  message: string;
} | null;

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

export type ForgotPasswordValues = {
  email: string;
};

export type FieldErrors<T extends object> = Partial<Record<keyof T, string>>;

export type PasswordRequirement = {
  key: "length" | "letter" | "number";
  label: string;
  met: boolean;
};
