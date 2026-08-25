export function formatDateLabel(value: string) {
  if (!value) return "Por definir";
  if (value === "Hoy" || value === "Mañana") return value;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function formatShortDate(value: string) {
  if (!value) return "Por definir";
  if (value === "Hoy" || value === "Mañana") return value;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-PE", { weekday: "short", day: "numeric", month: "short" }).format(date);
}

export function formatTime(value: string) {
  if (!value) return "Por definir";
  return value;
}

export function formatEventTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Ahora";
  return new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit" }).format(date);
}

export function todayInputValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}
