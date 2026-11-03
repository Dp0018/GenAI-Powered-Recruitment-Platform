"use client";

import React, { useState } from "react";
import {
  useAdminUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
} from "@/features/admin/hooks/use-admin";
import { AdminUser } from "@/features/admin/types/admin";
import { Role } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  ShieldAlert,
  Search,
  Loader2,
  Ban,
  CheckCircle2,
  RotateCcw,
  Mail,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function AdminUserModerationTab() {
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [banModalUser, setBanModalUser] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banDays, setBanDays] = useState<number | "">("");

  const { data, isLoading } = useAdminUsersQuery({
    role: roleFilter,
    banned: bannedFilter,
    search: search.trim() || undefined,
  });

  const banMutation = useBanUserMutation(() => {
    setBanModalUser(null);
    setBanReason("");
    setBanDays("");
  });

  const unbanMutation = useUnbanUserMutation();

  const users = data?.content || [];

  const handleConfirmBan = () => {
    if (!banModalUser || !banReason.trim()) return;
    banMutation.mutate({
      userId: banModalUser.id,
      payload: {
        reason: banReason.trim(),
        durationDays: typeof banDays === "number" && banDays > 0 ? banDays : undefined,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-secondary/60 border border-border">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRoleFilter("")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              roleFilter === "" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            All Roles
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRoleFilter("CANDIDATE")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              roleFilter === "CANDIDATE" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Candidates
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRoleFilter("EMPLOYER_ADMIN")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              roleFilter === "EMPLOYER_ADMIN" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Employers
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setRoleFilter("RECRUITER")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              roleFilter === "RECRUITER" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Recruiters
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setBannedFilter(bannedFilter === true ? undefined : true)}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              bannedFilter === true
                ? "bg-rose-950/60 text-rose-300 border border-rose-800/60"
                : "text-muted-foreground"
            }`}
          >
            Suspended ({users.filter((u) => u.banned).length})
          </Button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 h-8 text-xs bg-card/60 border-border"
          />
        </div>
      </div>

      {/* Users Moderation Table */}
      <div className="rounded-xl border border-border bg-card/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/80 bg-secondary/30 grid grid-cols-12 text-xs font-medium text-muted-foreground">
          <div className="col-span-4">User Account & Identity</div>
          <div className="col-span-3">Role & Affiliation</div>
          <div className="col-span-2">Account State</div>
          <div className="col-span-3 text-right">Moderation Actions</div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-2">
            <Loader2 className="size-6 animate-spin text-primary mx-auto" />
            <div className="text-xs text-muted-foreground font-mono">Loading user directory...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="size-8 text-muted-foreground mx-auto stroke-1" />
            <h3 className="text-sm font-semibold text-foreground">No users found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No registered user matches your filter query.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {users.map((user) => {
              const isSuspended = user.banned;
              const isPlatformAdmin = user.role === "PLATFORM_ADMIN";
              const isUnbanning = unbanMutation.isPending && unbanMutation.variables === user.id;

              return (
                <div
                  key={user.id}
                  className="p-4 grid grid-cols-12 items-center text-xs gap-2 hover:bg-secondary/10 transition-colors"
                >
                  {/* Identity */}
                  <div className="col-span-4 min-w-0 space-y-0.5">
                    <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.emailVerified ? (
                        <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1 py-0.2 rounded border border-amber-800/40">
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground font-mono text-[11px] truncate flex items-center gap-1">
                      <Mail className="size-2.5 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  {/* Role & Affiliation */}
                  <div className="col-span-3 space-y-0.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary border border-border text-secondary-foreground">
                      {user.role}
                    </span>
                    {user.companyName && (
                      <div className="text-[11px] text-muted-foreground font-mono truncate flex items-center gap-1">
                        <Building2 className="size-2.5 text-muted-foreground" />
                        <span>{user.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-span-2">
                    {isSuspended ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/40 text-rose-400 border border-rose-800/60 font-semibold">
                          <Ban className="size-3" />
                          <span>SUSPENDED</span>
                        </span>
                        {user.banReason && (
                          <div className="text-[10px] text-rose-400/80 truncate font-mono max-w-[130px]">
                            {user.banReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-800/60">
                        <CheckCircle2 className="size-3" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    {isPlatformAdmin ? (
                      <span className="text-[11px] font-mono text-muted-foreground italic">
                        Superadmin
                      </span>
                    ) : isSuspended ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUnbanning}
                        onClick={() => unbanMutation.mutate(user.id)}
                        className="h-7 text-xs border-border text-foreground hover:bg-secondary rounded-md gap-1 font-mono"
                      >
                        {isUnbanning ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <RotateCcw className="size-3" />
                        )}
                        <span>Unban Account</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setBanModalUser(user);
                          setBanReason("");
                          setBanDays("");
                        }}
                        className="h-7 text-xs border-border text-muted-foreground hover:text-rose-400 hover:bg-rose-950/30 rounded-md gap-1 font-mono"
                      >
                        <Ban className="size-3" />
                        <span>Suspend</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ban User Dialog */}
      <Dialog
        open={Boolean(banModalUser)}
        onOpenChange={(open) => {
          if (!open) {
            setBanModalUser(null);
            setBanReason("");
            setBanDays("");
          }
        }}
      >
        <DialogContent className="max-w-md sm:max-w-lg bg-card/95 border border-border/80 text-foreground rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <DialogHeader className="text-left">
            <div className="flex items-start gap-4 pb-1">
              <div className="size-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
                <ShieldAlert className="size-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
                  Suspend Account Access
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  Suspending <span className="font-mono text-foreground font-semibold px-1.5 py-0.5 rounded bg-secondary/80 border border-border/60">{banModalUser?.email}</span> will revoke all active JWT sessions and immediately prevent login access.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>
                  Suspension Reason <span className="text-rose-400">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Required for platform audit log
                </span>
              </label>
              <Input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g. Terms of Service violation, automated scraping, spam..."
                className="h-10 text-xs bg-secondary/40 border border-border/80 rounded-xl px-3 transition-all focus-visible:ring-2 focus-visible:ring-rose-500/25 focus-visible:border-rose-500/50 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Duration</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Leave blank for permanent ban
                </span>
              </label>

              {/* Quick Preset Duration Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "7 Days", value: 7 as number | "" },
                  { label: "30 Days", value: 30 as number | "" },
                  { label: "90 Days", value: 90 as number | "" },
                  { label: "Indefinite", value: "" as number | "" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBanDays(preset.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                      banDays === preset.value
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold"
                        : "bg-secondary/40 hover:bg-secondary text-muted-foreground border-border/60"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <Input
                type="number"
                min={1}
                max={365}
                value={banDays}
                onChange={(e) => setBanDays(e.target.value ? Number(e.target.value) : "")}
                placeholder="Custom number of days (e.g. 14, 60)"
                className="h-10 text-xs bg-secondary/40 border border-border/80 rounded-xl px-3 transition-all focus-visible:ring-2 focus-visible:ring-rose-500/25 focus-visible:border-rose-500/50 outline-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBanModalUser(null)}
              className="h-10 px-4 rounded-xl text-xs font-medium border-border/80 bg-secondary/30 hover:bg-secondary cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={banMutation.isPending || !banReason.trim()}
              onClick={handleConfirmBan}
              className="h-10 px-5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {banMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Ban className="size-3.5" />
              )}
              <span>Confirm Suspension</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
