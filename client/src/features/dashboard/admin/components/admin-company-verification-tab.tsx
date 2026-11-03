"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useAdminCompaniesQuery,
  useVerifyCompanyMutation,
  useRejectCompanyMutation,
} from "@/features/admin/hooks/use-admin";
import { Company, VerificationStatus } from "@/features/companies/types/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Loader2,
  Globe,
  MapPin,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function AdminCompanyVerificationTab() {
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "">("");
  const [search, setSearch] = useState("");
  const [rejectModalCompany, setRejectModalCompany] = useState<Company | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading } = useAdminCompaniesQuery({
    status: statusFilter,
    search: search.trim() || undefined,
  });

  const verifyMutation = useVerifyCompanyMutation();
  const rejectMutation = useRejectCompanyMutation(() => {
    setRejectModalCompany(null);
    setRejectReason("");
  });

  const companies = data?.content || [];

  const handleConfirmReject = () => {
    if (!rejectModalCompany) return;
    rejectMutation.mutate({
      companyId: rejectModalCompany.id,
      payload: { reason: rejectReason.trim() },
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/60 border border-border">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter("")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              statusFilter === "" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            All Entities
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter("PENDING")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              statusFilter === "PENDING"
                ? "bg-amber-950/60 text-amber-300 border border-amber-800/60"
                : "text-muted-foreground"
            }`}
          >
            Pending KYC
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter("VERIFIED")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              statusFilter === "VERIFIED"
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                : "text-muted-foreground"
            }`}
          >
            Verified
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setStatusFilter("REJECTED")}
            className={`h-7 text-xs font-mono rounded px-2.5 ${
              statusFilter === "REJECTED"
                ? "bg-rose-950/60 text-rose-300 border border-rose-800/60"
                : "text-muted-foreground"
            }`}
          >
            Rejected
          </Button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company name..."
            className="pl-8 h-8 text-xs bg-card/60 border-border"
          />
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="rounded-xl border border-border bg-card/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/80 bg-secondary/30 grid grid-cols-12 text-xs font-medium text-muted-foreground">
          <div className="col-span-4">Company Entity & Domain</div>
          <div className="col-span-3">Industry & Details</div>
          <div className="col-span-2">Verification Status</div>
          <div className="col-span-3 text-right">KYC Actions</div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-2">
            <Loader2 className="size-6 animate-spin text-primary mx-auto" />
            <div className="text-xs text-muted-foreground font-mono">Loading verification queue...</div>
          </div>
        ) : companies.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Building2 className="size-8 text-muted-foreground mx-auto stroke-1" />
            <h3 className="text-sm font-semibold text-foreground">No companies found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are no employer companies matching the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {companies.map((company) => {
              const isPending = company.verificationStatus === "PENDING";
              const isVerified = company.verificationStatus === "VERIFIED";
              const isRejected = company.verificationStatus === "REJECTED";
              const isVerifying = verifyMutation.isPending && verifyMutation.variables === company.id;

              return (
                <div key={company.id} className="p-4 grid grid-cols-12 items-center text-xs gap-2 hover:bg-secondary/10 transition-colors">
                  {/* Entity info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="size-9 rounded-lg border border-border bg-secondary flex items-center justify-center shrink-0 overflow-hidden font-mono font-bold text-xs text-primary">
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        company.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                        <span>{company.name}</span>
                        <Link
                          href={`/companies/${company.slug}`}
                          target="_blank"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                      <div className="text-muted-foreground font-mono text-[11px] truncate flex items-center gap-1">
                        <Globe className="size-2.5 text-muted-foreground" />
                        <span>{company.website || `portal/companies/${company.slug}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Industry & Details */}
                  <div className="col-span-3 space-y-0.5">
                    <div className="text-foreground/90 font-medium">
                      {company.industry || "General Enterprise"}
                    </div>
                    <div className="text-muted-foreground text-[11px] flex items-center gap-2">
                      <span>{company.companySize || "N/A employees"}</span>
                      {company.location && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="size-2.5 text-muted-foreground" />
                          {company.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-400 border border-amber-800/60">
                        <Clock className="size-3" />
                        <span>PENDING</span>
                      </span>
                    )}
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-800/60">
                        <CheckCircle2 className="size-3" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/40 text-rose-400 border border-rose-800/60">
                        <XCircle className="size-3" />
                        <span>REJECTED</span>
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          disabled={isVerifying}
                          onClick={() => verifyMutation.mutate(company.id)}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-md gap-1 shadow-sm"
                        >
                          {isVerifying ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="size-3" />
                          )}
                          <span>Approve KYC</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRejectModalCompany(company);
                            setRejectReason("");
                          }}
                          className="h-7 text-xs border-border text-muted-foreground hover:text-rose-400 hover:bg-rose-950/30 rounded-md gap-1"
                        >
                          <XCircle className="size-3" />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}

                    {isVerified && (
                      <div className="flex items-center gap-2">
                        <Link href={`/companies/${company.slug}`} target="_blank">
                          <Button variant="outline" size="sm" className="h-7 text-xs border-border gap-1 font-mono">
                            <span>Public View</span>
                            <ExternalLink className="size-3" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setRejectModalCompany(company);
                            setRejectReason("");
                          }}
                          className="h-7 text-xs text-muted-foreground hover:text-rose-400 font-mono"
                        >
                          Revoke
                        </Button>
                      </div>
                    )}

                    {isRejected && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isVerifying}
                        onClick={() => verifyMutation.mutate(company.id)}
                        className="h-7 text-xs border-border text-foreground hover:bg-secondary rounded-md gap-1 font-mono"
                      >
                        {isVerifying ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <RotateCcw className="size-3" />
                        )}
                        <span>Re-Verify</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal Dialog */}
      <Dialog
        open={Boolean(rejectModalCompany)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectModalCompany(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="max-w-md bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-400">
              <AlertCircle className="size-4" />
              <span>Reject KYC Verification</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide feedback for {rejectModalCompany?.name}. An automated compliance notification email will be dispatched to the employer admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-medium text-foreground block">
              Rejection Reason & Compliance Notes
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete corporate registration documentation, unverifiable business address..."
              className="w-full text-xs rounded-md border border-border bg-secondary/50 p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalCompany(null)}
              className="text-xs border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={rejectMutation.isPending}
              onClick={handleConfirmReject}
              className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <XCircle className="size-3" />
              )}
              <span>Confirm Rejection</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
