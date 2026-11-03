"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobOffer } from "../types/offer";
import {
  useSignOfferMutation,
  useDeclineOfferMutation,
} from "../hooks/use-offers";
import {
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface OfferLetterViewModalProps {
  offer: JobOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCandidate?: boolean;
}

export function OfferLetterViewModal({
  offer,
  open,
  onOpenChange,
  isCandidate = false,
}: OfferLetterViewModalProps) {
  const [signerName, setSignerName] = useState("");
  const [consent, setConsent] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const token = offer?.signatureToken || "";

  const signMutation = useSignOfferMutation(token, () => {
    onOpenChange(false);
  });

  const declineMutation = useDeclineOfferMutation(token, () => {
    onOpenChange(false);
  });

  if (!offer) return null;

  const isSent = offer.status === "SENT";
  const isAccepted = offer.status === "ACCEPTED";
  const isDeclined = offer.status === "DECLINED";

  const handleSign = () => {
    if (!signerName.trim()) {
      toast.error("Please type your full legal name to execute this signature.");
      return;
    }
    if (!consent) {
      toast.error("You must check the consent box to electronically sign this offer.");
      return;
    }

    signMutation.mutate({
      signerName: signerName.trim(),
      signatureConsent: true,
    });
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a brief reason for declining.");
      return;
    }

    declineMutation.mutate({
      reason: declineReason.trim(),
    });
  };

  const handlePrint = () => {
    const printWindow = window.open(`/api/v1/offers/${offer.id}/html`, "_blank");
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
              <Building2 className="size-3 text-primary" />
              <span>{offer.companyName}</span>
            </div>
            {isAccepted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                <CheckCircle2 className="size-3.5" />
                <span>OFFER ACCEPTED & SIGNED</span>
              </span>
            )}
            {isDeclined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60">
                <XCircle className="size-3.5" />
                <span>DECLINED</span>
              </span>
            )}
            {isSent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60">
                <Clock className="size-3.5" />
                <span>PENDING SIGNATURE</span>
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Formal Offer of Employment: {offer.jobTitle}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Extended to <span className="font-semibold text-foreground">{offer.candidateName}</span> ({offer.candidateEmail}).
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-3">
          {/* Quick Stats Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="p-3 rounded-lg bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Base Compensation</div>
              <div className="text-sm font-bold font-mono text-foreground">
                £{offer.baseSalary.toLocaleString()}{" "}
                <span className="text-[10px] text-muted-foreground">
                  {offer.currency && offer.currency !== "USD" ? offer.currency : "GBP"} / {offer.payPeriod === "MONTHLY" ? "mo" : "yr"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Equity / Grants</div>
              <div className="text-xs font-semibold text-foreground truncate" title={offer.equityDetails || "None"}>
                {offer.equityDetails || "None"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Sign-On Bonus</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {offer.signOnBonus ? `£${offer.signOnBonus.toLocaleString()}` : "—"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Anticipated Start</div>
              <div className="text-xs font-semibold text-foreground">
                {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : "To be confirmed"}
              </div>
            </div>
          </div>

          {/* Letter Document Body */}
          <div className="p-6 rounded-xl bg-background border border-border text-foreground space-y-4 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                <span>OFFICIAL APPOINTMENT LETTER</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-7 px-2.5 text-[11px] font-mono gap-1.5"
              >
                <Printer className="size-3" />
                <span>Print / Download PDF</span>
              </Button>
            </div>

            <div className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line font-sans selection:bg-primary/20">
              {offer.letterBody}
            </div>
          </div>

          {/* Audit Trail & E-Signature Status */}
          {isAccepted && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="size-4" />
                <span>Legally Binding Electronic Signature Audit Trail</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground pt-1">
                <div>
                  <span className="text-muted-foreground/60">Signer Name: </span>
                  <span className="text-foreground font-semibold">{offer.signerName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground/60">Signed Timestamp: </span>
                  <span className="text-foreground">
                    {offer.signedAt ? new Date(offer.signedAt).toLocaleString() : "Confirmed"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground/60">Token: </span>
                  <span className="text-foreground truncate block" title={offer.signatureToken || ""}>
                    {offer.signatureToken?.substring(0, 16)}...
                  </span>
                </div>
              </div>
            </div>
          )}

          {isDeclined && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1 text-left text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <XCircle className="size-4" />
                <span>Candidate Declined Offer</span>
              </div>
              <p className="text-muted-foreground pt-1">
                Reason given: <span className="text-foreground italic">&ldquo;{offer.declinedReason || "No details provided"}&rdquo;</span>
              </p>
              {offer.declinedAt && (
                <p className="text-[11px] font-mono text-muted-foreground">
                  Timestamp: {new Date(offer.declinedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Candidate Action: Electronic Signature Pad */}
          {isCandidate && isSent && (
            <div className="p-5 rounded-xl bg-secondary/40 border border-primary/30 space-y-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>Execute Electronic Signature (E-Sign)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By entering your full legal name below and checking the consent box, you agree to execute this agreement electronically pursuant to the U.S. Electronic Signatures in Global and National Commerce Act (ESIGN) and Uniform Electronic Transactions Act (UETA).
                </p>
              </div>

              {!showDeclineForm ? (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="sign-legal-name" className="text-xs font-medium text-foreground">
                      Full Legal Name *
                    </Label>
                    <Input
                      id="sign-legal-name"
                      placeholder="e.g. Alex Michael Johnson"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="h-10 bg-background border-border text-foreground text-sm font-semibold rounded-md"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-foreground/90 pt-1">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded border-border text-primary focus:ring-primary size-4"
                    />
                    <span>
                      I acknowledge that I have read, understand, and agree to the terms of employment stated in this offer letter, and confirm that my typed signature constitutes a legally binding agreement.
                    </span>
                  </label>

                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeclineForm(true)}
                      className="text-xs text-muted-foreground hover:text-rose-400"
                    >
                      Decline this offer...
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleSign}
                      disabled={signMutation.isPending || !signerName.trim() || !consent}
                      className="h-10 px-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-md shadow-md gap-2"
                    >
                      {signMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      <span>Accept & Legally Sign Offer</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-3 rounded-lg bg-background border border-rose-900/40">
                  <Label htmlFor="decline-reason" className="text-xs font-medium text-foreground">
                    Reason for declining offer *
                  </Label>
                  <Textarea
                    id="decline-reason"
                    rows={3}
                    placeholder="Accepted another offer, compensation mismatch, location mismatch, etc."
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="bg-card border-border text-foreground text-xs"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeclineForm(false)}
                      className="h-8 text-xs"
                    >
                      Back
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDecline}
                      disabled={declineMutation.isPending || !declineReason.trim()}
                      className="h-8 px-4 text-xs font-semibold"
                    >
                      {declineMutation.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : null}
                      <span>Confirm Decline</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
