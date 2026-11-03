"use client";

import React, { useState } from "react";
import {
  useTeamMembersQuery,
  useInviteTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/features/companies/hooks/use-team";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Briefcase,
  Mail,
  Loader2,
  Calendar,
} from "lucide-react";

export function EmployerTeamTab() {
  const { user: currentUser } = useAuth();
  const { data: teamMembers = [], isLoading } = useTeamMembersQuery();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"RECRUITER" | "EMPLOYER_ADMIN">("RECRUITER");

  const inviteMutation = useInviteTeamMemberMutation(() => {
    setInviteModalOpen(false);
    setEmail("");
    setName("");
    setRole("RECRUITER");
  });

  const removeMutation = useRemoveTeamMemberMutation();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    inviteMutation.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
      role,
    });
  };

  const handleRemove = (memberId: string, memberEmail: string) => {
    if (confirm(`Are you sure you want to remove ${memberEmail} from your company hiring team?`)) {
      removeMutation.mutate(memberId);
    }
  };

  const adminCount = teamMembers.filter((m) => m.role === "EMPLOYER_ADMIN").length;
  const recruiterCount = teamMembers.filter((m) => m.role === "RECRUITER").length;

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Team & Recruiters
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage hiring team members, assign recruiter seats, and send email invitations.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setInviteModalOpen(true)}
          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs gap-1.5 rounded-md shadow-xs shadow-primary/20 self-start sm:self-auto"
        >
          <UserPlus className="size-3.5" />
          <span>Invite Team Member</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card/70 border border-border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Seats Active</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{teamMembers.length}</div>
          <p className="text-[11px] text-muted-foreground">Authorized platform accounts</p>
        </div>

        <div className="p-4 rounded-lg bg-card/70 border border-border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Employer Admins</span>
            <Shield className="size-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{adminCount}</div>
          <p className="text-[11px] text-muted-foreground">Full billing & hiring authority</p>
        </div>

        <div className="p-4 rounded-lg bg-card/70 border border-border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Recruiters & Sourcing</span>
            <Briefcase className="size-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{recruiterCount}</div>
          <p className="text-[11px] text-muted-foreground">Reviewing applicant submissions</p>
        </div>
      </div>

      {/* Team Member Table */}
      {isLoading ? (
        <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
          <div className="text-xs text-muted-foreground font-mono">
            Loading team roster...
          </div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card/40 p-12 text-center space-y-3">
          <Users className="size-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-medium text-foreground">No team members found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Invite your colleagues to review candidate applications and post jobs.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/60 border-b border-border text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Member</th>
                  <th className="py-3 px-4 font-semibold">Role & Access</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Joined Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teamMembers.map((member) => {
                  const isCurrent = currentUser?.email === member.email;
                  return (
                    <tr key={member.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                            {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <span>{member.name || member.email.split("@")[0]}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {member.id.substring(0, 12)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                            member.role === "EMPLOYER_ADMIN"
                              ? "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                              : "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                          }`}
                        >
                          {member.role === "EMPLOYER_ADMIN" ? (
                            <Shield className="size-3" />
                          ) : (
                            <Briefcase className="size-3" />
                          )}
                          <span>{member.role.replace("_", " ")}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {member.email}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3 text-muted-foreground/70" />
                          <span>
                            {member.joinedAt
                              ? new Date(member.joinedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Active"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={removeMutation.isPending}
                            onClick={() => handleRemove(member.id, member.email)}
                            className="h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs gap-1"
                            title="Remove team member"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Remove</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-foreground p-6 rounded-xl shadow-2xl">
          <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
              <Mail className="size-3 text-primary" />
              <span>Team Invitation</span>
            </div>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Invite Recruiter to Team
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              We&apos;ll send a branded invitation email via Resend to connect them to this company.
            </p>
          </DialogHeader>

          <form onSubmit={handleInvite} className="space-y-4 pt-3">
            <div className="space-y-1 text-left">
              <Label htmlFor="invite-email" className="text-xs font-medium text-foreground">
                Email Address *
              </Label>
              <Input
                id="invite-email"
                type="email"
                required
                placeholder="colleague@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label htmlFor="invite-name" className="text-xs font-medium text-foreground">
                Colleague Name (Optional)
              </Label>
              <Input
                id="invite-name"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 bg-background border-border text-foreground text-xs rounded-md focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1 text-left">
              <Label htmlFor="invite-role" className="text-xs font-medium text-foreground">
                Role & Permissions
              </Label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as "RECRUITER" | "EMPLOYER_ADMIN")}
                className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-hidden focus:border-primary"
              >
                <option value="RECRUITER">Recruiter (Screen & Manage Candidates)</option>
                <option value="EMPLOYER_ADMIN">Employer Admin (Full Control & Invites)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setInviteModalOpen(false)}
                className="h-9 px-4 text-muted-foreground hover:text-foreground text-xs rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={inviteMutation.isPending}
                size="sm"
                className="h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-xs shadow-primary/20"
              >
                {inviteMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    Sending Invite...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
