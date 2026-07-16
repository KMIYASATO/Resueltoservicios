export type UserRole = "customer" | "professional" | "admin" | "support";

export type BookingStatus =
  | "draft"
  | "pending_payment"
  | "payment_processing"
  | "confirmed"
  | "accepted"
  | "professional_on_the_way"
  | "in_progress"
  | "completed_by_professional"
  | "completed"
  | "cancelled_by_customer"
  | "cancelled_by_professional"
  | "disputed"
  | "refunded"
  | "closed";

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  iconKey: string;
};
