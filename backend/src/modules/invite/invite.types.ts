export type InviteStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type InviteRole = "MEMBER"; 
// keep OWNER out for now (security best practice)

export interface InviteDocument {
  _id: string;
  orgId: string;
  email: string;
  role: InviteRole;
  status: InviteStatus;
  invitedBy: string;
  createdAt: Date;
  acceptedAt?: Date;
}
