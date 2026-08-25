import { Badge } from "@/components/ui/Badge";
import { requestStatusLabels } from "../state/request-machine";
import type { RequestStatus } from "../types/request.types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const tone = status === "accepted" || status === "completed" ? "success" : status.includes("cancelled") || status === "rejected" ? "neutral" : "brand";
  return <Badge tone={tone}>{requestStatusLabels[status]}</Badge>;
}
