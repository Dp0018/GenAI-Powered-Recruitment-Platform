import { Role } from "@/types/auth";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  joinedAt?: string;
}

export interface InviteTeamMemberPayload {
  email: string;
  name?: string;
  role?: Role;
}
