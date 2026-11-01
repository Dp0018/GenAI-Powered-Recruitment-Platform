"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "../api/team-api";
import { InviteTeamMemberPayload } from "../types/team";
import { toast } from "sonner";

export function useTeamMembersQuery(enabled = true) {
  return useQuery({
    queryKey: ["company-team"],
    queryFn: () => teamApi.getTeamMembers(),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useInviteTeamMemberMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteTeamMemberPayload) => teamApi.inviteTeamMember(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company-team"] });
      toast.success(`Invitation sent to ${data.email} via email!`);
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to invite team member");
    },
  });
}

export function useRemoveTeamMemberMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => teamApi.removeTeamMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-team"] });
      toast.success("Team member removed from organization");
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to remove team member");
    },
  });
}
