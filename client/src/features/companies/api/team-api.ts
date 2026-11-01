import { apiClient } from "@/lib/api";
import { TeamMember, InviteTeamMemberPayload } from "../types/team";

export const teamApi = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const res = await apiClient<TeamMember[]>("/company/team");
    return res.data || [];
  },

  inviteTeamMember: async (payload: InviteTeamMemberPayload): Promise<TeamMember> => {
    const res = await apiClient<TeamMember>("/company/team/invite", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.data) throw new Error("Failed to invite team member");
    return res.data;
  },

  removeTeamMember: async (userId: string): Promise<void> => {
    await apiClient(`/company/team/${userId}`, {
      method: "DELETE",
    });
  },
};
