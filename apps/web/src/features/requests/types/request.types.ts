export type RequestStatus =
  | "draft"
  | "review"
  | "sent"
  | "viewed"
  | "information_requested"
  | "reschedule_proposed"
  | "accepted"
  | "rejected"
  | "cancelled_by_customer"
  | "cancelled_by_professional"
  | "completed";

export type ServiceKind = "home" | "cleaning" | "education";

export type AttachmentKind = "photo" | "file";

export type AttachmentDraft = {
  id: string;
  name: string;
  type: AttachmentKind;
  previewLabel: string;
};

export type PublicProfessionalData = {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  rating: string;
  reviews: string;
};

export type PrivateProfessionalContact = {
  phone: string;
  whatsapp: string;
};

export type RequestDraft = {
  professional: PublicProfessionalData;
  categorySlug: string;
  categoryLabel: string;
  serviceSlug: string;
  serviceLabel: string;
  districtSlug: string;
  districtLabel: string;
  returnTo: string;
  scrollPosition: number;
  serviceKind: ServiceKind;
  need: string;
  description: string;
  urgency: string;
  preferredDate: string;
  preferredTime: string;
  modality: "presencial" | "virtual";
  address: string;
  phone: string;
  attachments: AttachmentDraft[];
};

export type TimelineEvent = {
  id: string;
  at: string;
  title: string;
  text?: string;
};

export type MessageStatus = "sending" | "sent" | "read" | "error";

export type ChatMessage = {
  id: string;
  sender: "customer" | "professional" | "system";
  text: string;
  at: string;
  status: MessageStatus;
  attachments?: AttachmentDraft[];
};

export type ScheduleProposal = {
  id: string;
  by: "customer" | "professional";
  date: string;
  startTime: string;
  endTime: string;
  comment?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
};

export type Review = {
  rating: number;
  comment: string;
  createdAt: string;
};

export type ServiceRequest = RequestDraft & {
  id: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  agreedDate?: string;
  agreedTime?: string;
  timeline: TimelineEvent[];
  messages: ChatMessage[];
  proposals: ScheduleProposal[];
  cancellationReason?: string;
  reportReason?: string;
  review?: Review;
};
