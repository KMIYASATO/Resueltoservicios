export type RequestAnalyticsEvent =
  | "request_started"
  | "request_details_completed"
  | "address_confirmed"
  | "estimate_viewed"
  | "request_mode_selected"
  | "request_step_completed"
  | "request_submitted"
  | "matching_started"
  | "offer_received"
  | "offer_viewed"
  | "offers_compared"
  | "preaccept_chat_sent"
  | "offer_selected"
  | "contact_revealed"
  | "request_viewed"
  | "chat_message_sent"
  | "request_info_requested"
  | "schedule_proposed"
  | "schedule_accepted"
  | "request_accepted"
  | "contact_call_clicked"
  | "contact_whatsapp_clicked"
  | "request_cancelled"
  | "request_reopened"
  | "request_completed"
  | "review_submitted";

export function trackRequestEvent(event: RequestAnalyticsEvent, data: Record<string, string | number | boolean | undefined> = {}) {
  window.dispatchEvent(new CustomEvent("queda:request-analytics", { detail: { event, data } }));
}
