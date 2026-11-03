"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { offersApi } from "@/features/offers/api/offers-api";
import { JobOffer } from "@/features/offers/types/offer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
  Loader2,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignOfferPage() {
  const params = useParams();
  const token = params?.token as string;

  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [signerName, setSignerName] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const loadOffer = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await offersApi.getOfferByToken(token);
      setOffer(data);
    } catch (err: any) {
      setError(err.message || "Invalid, expired, or non-existent offer signature link.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffer();
  }, [token]);

  const handleSign = async () => {
    if (!signerName.trim()) {
      toast.error("Please type your full legal name to execute this signature.");
      return;
    }
    if (!consent) {
      toast.error("You must check the consent box to electronically sign this offer.");
      return;
    }

    try {
      setSubmitting(true);
      const updated = await offersApi.signOffer(token, {
        signerName: signerName.trim(),
        signatureConsent: true,
      });
      setOffer(updated);
      toast.success("Offer successfully signed & accepted! Welcome aboard! 🎉");
    } catch (err: any) {
      toast.error(err.message || "Failed to execute electronic signature.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      toast.error("Please enter a reason for declining.");
      return;
    }

    try {
      setSubmitting(true);
      const updated = await offersApi.declineOffer(token, {
        reason: declineReason.trim(),
      });
      setOffer(updated);
      toast.info("Offer decision logged.");
    } catch (err: any) {
      toast.error(err.message || "Failed to log offer decline.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (!offer) return;
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4 bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground font-mono">
          Verifying cryptographic token & decrypting employment offer...
        </p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full p-8 rounded-2xl bg-card border border-border text-center space-y-4 shadow-xl">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Signature Link Invalid or Expired</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error || "The requested offer letter could not be retrieved. Please check with your recruiting contact for a renewed link."}
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAccepted = offer.status === "ACCEPTED";
  const isDeclined = offer.status === "DECLINED";
  const isSent = offer.status === "SENT";

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-xl space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-secondary text-xs font-mono text-primary font-semibold">
                <Building2 className="size-3.5" />
                <span>{offer.companyName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Official Offer of Employment
              </h1>
              <p className="text-xs text-muted-foreground">
                Prepared specifically for <span className="font-semibold text-foreground">{offer.candidateName}</span> ({offer.candidateEmail}).
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              {isAccepted && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                  <CheckCircle2 className="size-4" />
                  <span>ACCEPTED & E-SIGNED</span>
                </div>
              )}
              {isDeclined && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60">
                  <XCircle className="size-4" />
                  <span>OFFER DECLINED</span>
                </div>
              )}
              {isSent && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60">
                  <Clock className="size-4" />
                  <span>ACTION REQUIRED</span>
                </div>
              )}
            </div>
          </div>

          {/* Compensation Band Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Base Compensation</div>
              <div className="text-base font-bold font-mono text-foreground">
                £{offer.baseSalary.toLocaleString()}{" "}
                <span className="text-[10px] font-normal text-muted-foreground">
                  {offer.currency && offer.currency !== "USD" ? offer.currency : "GBP"} / {offer.payPeriod === "MONTHLY" ? "mo" : "yr"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Equity Grants</div>
              <div className="text-xs font-bold text-emerald-400 truncate" title={offer.equityDetails || "None"}>
                {offer.equityDetails || "None"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Sign-On Bonus</div>
              <div className="text-base font-bold font-mono text-indigo-400">
                {offer.signOnBonus ? `£${offer.signOnBonus.toLocaleString()}` : "—"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border space-y-0.5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Target Start Date</div>
              <div className="text-xs font-semibold text-foreground">
                {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : "To be confirmed"}
              </div>
            </div>
          </div>
        </div>

        {/* Offer Letter Document */}
        <div className="p-8 sm:p-10 rounded-2xl bg-card border border-border shadow-xl space-y-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>APPOINTMENT AGREEMENT</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 text-xs font-mono gap-1.5"
            >
              <Printer className="size-3.5" />
              <span>Print / Save PDF</span>
            </Button>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-sans selection:bg-primary/20">
            {offer.letterBody}
          </div>
        </div>

        {/* Signed Status Audit Trail */}
        {isAccepted && (
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-3 text-left">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="size-5" />
              <span>Cryptographically Verified Electronic Signature</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This document has been fully executed under modern digital signature frameworks. A copy of this executed agreement has been recorded and archived.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-muted-foreground pt-2 border-t border-emerald-900/40">
              <div>
                <span className="text-muted-foreground/60">Legal Signer: </span>
                <span className="text-foreground font-semibold">{offer.signerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground/60">Execution Time: </span>
                <span className="text-foreground">
                  {offer.signedAt ? new Date(offer.signedAt).toLocaleString() : "Verified"}
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
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2 text-left text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <XCircle className="size-5" />
              <span>Offer Declined</span>
            </div>
            <p className="text-muted-foreground">
              Reason provided: <span className="text-foreground italic">"{offer.declinedReason || "No details provided"}"</span>
            </p>
          </div>
        )}

        {/* Candidate E-Signature Pad */}
        {isSent && (
          <div className="p-6 sm:p-8 rounded-2xl bg-card border-2 border-primary/40 shadow-2xl space-y-5 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-extrabold text-base">
                <Lock className="size-5 text-primary" />
                <span>Execute Your Electronic Signature</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By entering your full legal name below and clicking Accept, you confirm your acceptance of the terms above and execute a legally binding contract with {offer.companyName}.
              </p>
            </div>

            {!showDeclineForm ? (
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="sign-legal-name-page" className="text-xs font-semibold text-foreground">
                    Full Legal Name *
                  </Label>
                  <Input
                    id="sign-legal-name-page"
                    placeholder="e.g. Alex Michael Johnson"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    className="h-11 bg-background border-border text-foreground text-sm font-semibold rounded-lg"
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
                    I confirm that I am {offer.candidateName}, that I have thoroughly reviewed the terms of employment, compensation, and contingencies outlined above, and that my typed name constitutes an enforceable legal electronic signature.
                  </span>
                </label>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeclineForm(true)}
                    className="text-xs text-muted-foreground hover:text-rose-400 self-start sm:self-auto"
                  >
                    Decline this offer...
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleSign}
                    disabled={submitting || !signerName.trim() || !consent}
                    className="h-11 px-8 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-lg shadow-lg gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                    <span>Accept & Legally Sign Offer</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-background border border-rose-900/40">
                <Label htmlFor="decline-reason-page" className="text-xs font-medium text-foreground">
                  Reason for declining offer *
                </Label>
                <Textarea
                  id="decline-reason-page"
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
                    Back to Sign
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDecline}
                    disabled={submitting || !declineReason.trim()}
                    className="h-8 px-4 text-xs font-semibold"
                  >
                    {submitting ? (
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
    </div>
  );
}
