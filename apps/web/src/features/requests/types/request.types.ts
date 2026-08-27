export type RequestStatus =
  | "draft"
  | "submitted"
  | "matching"
  | "awaiting_response"
  | "proposals_received"
  | "selected"
  | "scheduled"
  | "in_service"
  | "completed"
  | "cancelled"
  | "expired";

export type OfferStatus = "draft" | "sent" | "viewed" | "negotiating" | "accepted" | "not_selected" | "withdrawn" | "expired";

export type PricingType = "fixed_price" | "price_range" | "diagnostic_visit";

export type RequestMode = "direct" | "multi";

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

export type ExactAddress = {
  query: string;
  formatted: string;
  approximateZone: string;
  lat: number;
  lng: number;
  propertyType: "Casa" | "Departamento" | "Local";
  unit: string;
  reference: string;
  pinAdjusted: boolean;
};

export type EstimatedPriceBand = {
  min: number;
  max: number;
  currency: "PEN";
  label: string;
  explanation: string;
  budgetCap?: string;
};

export type Offer = {
  id: string;
  requestId: string;
  professional: PublicProfessionalData;
  pricingType: PricingType;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  diagnosticFee?: number;
  availability: string;
  proposedDate: string;
  proposedTimeWindow: string;
  scopeIncluded: string;
  note: string;
  etaLabel: string;
  responseLabel: string;
  status: OfferStatus;
  createdAt: string;
  expiresAt: string;
};

export type RequestDraft = {
  professional: PublicProfessionalData;
  requestMode: RequestMode;
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
  address: ExactAddress;
  phone: string;
  estimatedPrice: EstimatedPriceBand;
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
  acceptedOfferId?: string;
  createdAt: string;
  updatedAt: string;
  agreedDate?: string;
  agreedTime?: string;
  timeline: TimelineEvent[];
  messages: ChatMessage[];
  offers: Offer[];
  proposals: ScheduleProposal[];
  cancellationReason?: string;
  reportReason?: string;
  review?: Review;
};
