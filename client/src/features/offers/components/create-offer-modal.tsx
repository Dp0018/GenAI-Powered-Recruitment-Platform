"use client";

import React, { useState, useEffect } from "react";
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
import {
  useCreateOfferMutation,
  useOfferByApplicationQuery,
  useSendOfferMutation,
  useUpdateOfferMutation,
} from "../hooks/use-offers";
import {
  FileText,
  Send,
  Loader2,
  PoundSterling,
} from "lucide-react";
import { toast } from "sonner";

interface CreateOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
}

export function CreateOfferModal({
  open,
  onOpenChange,
  applicationId,
  candidateName,
  jobTitle: initialJobTitle,
  companyName,
}: CreateOfferModalProps) {
  const { data: existingOffer, isLoading: loadingExisting } =
    useOfferByApplicationQuery(open ? applicationId : null);

  const [jobTitle, setJobTitle] = useState(initialJobTitle || "");
  const [baseSalary, setBaseSalary] = useState<string>("160000");
  const [currency, setCurrency] = useState("GBP");
  const [payPeriod, setPayPeriod] = useState("YEARLY");
  const [equityDetails, setEquityDetails] = useState("");
  const [signOnBonus, setSignOnBonus] = useState("");
  const [annualBonusDetails, setAnnualBonusDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expirationDays, setExpirationDays] = useState("7");
  const [benefitsSummary, setBenefitsSummary] = useState(
    "Full medical, dental, and vision insurance; pension matching up to 5%; flexible paid time off; £2,500 annual home office & learning stipend."
  );
  const [letterBody, setLetterBody] = useState("");

  useEffect(() => {
    if (existingOffer) {
      setJobTitle(existingOffer.jobTitle);
      setBaseSalary(String(existingOffer.baseSalary));
      setCurrency(existingOffer.currency && existingOffer.currency !== "USD" ? existingOffer.currency : "GBP");
      setPayPeriod(existingOffer.payPeriod || "YEARLY");
      setEquityDetails(existingOffer.equityDetails || "");
      setSignOnBonus(existingOffer.signOnBonus ? String(existingOffer.signOnBonus) : "");
      setAnnualBonusDetails(existingOffer.annualBonusDetails || "");
      setStartDate(existingOffer.startDate || "");
      setBenefitsSummary(existingOffer.benefitsSummary || "");
      setLetterBody(existingOffer.letterBody || "");
    } else {
      setJobTitle(initialJobTitle || "");
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setStartDate(defaultDate.toISOString().split("T")[0]);
    }
  }, [existingOffer, initialJobTitle, open]);

  // Generate automated template if letterBody is empty
  useEffect(() => {
    if (!letterBody && !existingOffer) {
      setLetterBody(
`Dear ${candidateName},

On behalf of ${companyName}, we are thrilled to extend this formal offer of employment for the position of ${jobTitle || initialJobTitle}.

We were exceptionally impressed by your background, experience, and the expertise you demonstrated throughout our interview rounds. In this capacity, you will play a pivotal role in driving our engineering roadmap and organizational impact.

1. Position & Reporting:
You will serve as ${jobTitle || initialJobTitle}, reporting to engineering leadership.

2. Total Compensation:
- Base Salary: ${currency} ${Number(baseSalary || 0).toLocaleString()} per ${payPeriod.toLowerCase()} cycle.
${equityDetails ? `- Equity / Incentive: ${equityDetails}\n` : ""}${signOnBonus ? `- Sign-On Bonus: ${currency} ${Number(signOnBonus).toLocaleString()}\n` : ""}${annualBonusDetails ? `- Target Annual Incentive: ${annualBonusDetails}\n` : ""}
3. Benefits & Paid Time Off:
${benefitsSummary}

4. Employment Contingencies:
This offer is contingent upon successful completion of standard reference checks and employment verification.

We are immensely excited about the prospect of having you on our team!

Sincerely,
${companyName} Talent Acquisition Team`
      );
    }
  }, [candidateName, companyName, jobTitle, initialJobTitle, baseSalary, currency, payPeriod, equityDetails, signOnBonus, annualBonusDetails, benefitsSummary, existingOffer]);

  const createMutation = useCreateOfferMutation();
  const updateMutation = useUpdateOfferMutation();
  const sendMutation = useSendOfferMutation(() => {
    onOpenChange(false);
  });

  const isSaving =
    createMutation.isPending || updateMutation.isPending || sendMutation.isPending;

  const handleSaveDraft = async () => {
    if (!baseSalary || isNaN(Number(baseSalary))) {
      toast.error("Please enter a valid base salary");
      return;
    }

    const payload = {
      applicationId,
      jobTitle: jobTitle.trim(),
      baseSalary: parseInt(baseSalary, 10),
      currency,
      payPeriod,
      equityDetails: equityDetails.trim() || undefined,
      signOnBonus: signOnBonus ? parseInt(signOnBonus, 10) : undefined,
      annualBonusDetails: annualBonusDetails.trim() || undefined,
      startDate: startDate || undefined,
      expirationDays: parseInt(expirationDays, 10) || 7,
      benefitsSummary: benefitsSummary.trim() || undefined,
      letterBody: letterBody.trim() || undefined,
    };

    if (existingOffer) {
      await updateMutation.mutateAsync({ id: existingOffer.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleSendToCandidate = async () => {
    if (!baseSalary || isNaN(Number(baseSalary))) {
      toast.error("Please enter a valid base salary");
      return;
    }

    const payload = {
      applicationId,
      jobTitle: jobTitle.trim(),
      baseSalary: parseInt(baseSalary, 10),
      currency,
      payPeriod,
      equityDetails: equityDetails.trim() || undefined,
      signOnBonus: signOnBonus ? parseInt(signOnBonus, 10) : undefined,
      annualBonusDetails: annualBonusDetails.trim() || undefined,
      startDate: startDate || undefined,
      expirationDays: parseInt(expirationDays, 10) || 7,
      benefitsSummary: benefitsSummary.trim() || undefined,
      letterBody: letterBody.trim() || undefined,
    };

    try {
      let offerId = existingOffer?.id;
      if (!offerId) {
        const created = await createMutation.mutateAsync(payload);
        offerId = created.id;
      } else {
        await updateMutation.mutateAsync({ id: offerId, payload });
      }

      await sendMutation.mutateAsync(offerId);
    } catch {
      // Error handled by react-query mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-card border border-border text-foreground p-6 sm:p-8 rounded-xl shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
              <FileText className="size-3 text-primary" />
              <span>Offer Management Module</span>
            </div>
            {existingOffer?.status && (
              <span className="text-xs font-mono px-2 py-0.5 rounded font-semibold bg-primary/10 text-primary border border-primary/20">
                Status: {existingOffer.status}
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Generate Formal Offer Letter
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Draft compensation terms, start date, equity grants, and generate an electronic signing workflow for{" "}
            <span className="font-semibold text-foreground">{candidateName}</span>.
          </p>
        </DialogHeader>

        {loadingExisting ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading offer data...</p>
          </div>
        ) : (
          <div className="space-y-5 pt-3">
            {/* Compensation & Structure */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <PoundSterling className="size-3.5 text-primary" />
                  <span>Compensation & Band Breakdown</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  Pay Transparency Compliant
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="offer-title" className="text-xs font-medium text-foreground">
                    Offer Position Title *
                  </Label>
                  <Input
                    id="offer-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                    placeholder="Position Title"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="offer-salary" className="text-xs font-medium text-foreground">
                    Base Salary *
                  </Label>
                  <Input
                    id="offer-salary"
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                    placeholder="e.g. 175000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="offer-currency" className="text-xs font-medium text-foreground">
                      Currency
                    </Label>
                    <select
                      id="offer-currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-9 bg-background border border-border text-foreground text-xs rounded-md px-2 focus:outline-hidden focus:border-primary"
                    >
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="offer-period" className="text-xs font-medium text-foreground">
                      Frequency
                    </Label>
                    <select
                      id="offer-period"
                      value={payPeriod}
                      onChange={(e) => setPayPeriod(e.target.value)}
                      className="w-full h-9 bg-background border border-border text-foreground text-xs rounded-md px-2 focus:outline-hidden focus:border-primary"
                    >
                      <option value="YEARLY">Yearly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Equity & Bonuses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
                <div className="space-y-1">
                  <Label htmlFor="offer-equity" className="text-xs font-medium text-foreground">
                    Equity Incentive / RSUs
                  </Label>
                  <Input
                    id="offer-equity"
                    value={equityDetails}
                    onChange={(e) => setEquityDetails(e.target.value)}
                    className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                    placeholder="e.g. 0.15% (15,000 RSUs over 4-year schedule)"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="offer-signon" className="text-xs font-medium text-foreground">
                    Sign-On Cash Bonus
                  </Label>
                  <Input
                    id="offer-signon"
                    type="number"
                    value={signOnBonus}
                    onChange={(e) => setSignOnBonus(e.target.value)}
                    className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                    placeholder="e.g. 25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border/50">
                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="offer-annualbonus" className="text-xs font-medium text-foreground">
                    Target Annual Bonus
                  </Label>
                  <Input
                    id="offer-annualbonus"
                    value={annualBonusDetails}
                    onChange={(e) => setAnnualBonusDetails(e.target.value)}
                    className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                    placeholder="e.g. 15% annual target"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="offer-startdate" className="text-xs font-medium text-foreground">
                    Target Start Date
                  </Label>
                  <Input
                    id="offer-startdate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <Label htmlFor="offer-expiration" className="text-xs font-medium text-foreground">
                    Offer Expiration
                  </Label>
                  <select
                    id="offer-expiration"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(e.target.value)}
                    className="w-full h-9 bg-background border border-border text-foreground text-xs rounded-md px-2 focus:outline-hidden focus:border-primary"
                  >
                    <option value="2">2 Days (Urgent)</option>
                    <option value="3">3 Calendar Days</option>
                    <option value="5">5 Business Days</option>
                    <option value="7">7 Days (Standard)</option>
                    <option value="14">14 Days (Extended)</option>
                    <option value="17">17 Days (Custom)</option>
                    <option value="30">30 Days (1 Month)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Benefits Summary */}
            <div className="space-y-1 text-left">
              <Label htmlFor="offer-benefits" className="text-xs font-medium text-foreground">
                Benefits & Perks Summary
              </Label>
              <Input
                id="offer-benefits"
                value={benefitsSummary}
                onChange={(e) => setBenefitsSummary(e.target.value)}
                className="h-9 bg-background border-border text-foreground text-xs rounded-md"
                placeholder="Health, Dental, 401(k), Flexible PTO, etc."
              />
            </div>

            {/* Formal Offer Letter Body */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <Label htmlFor="offer-letter" className="text-xs font-semibold text-foreground">
                  Formal Employment Offer Agreement (Editable Template)
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Markdown & Plain Text formatted
                </span>
              </div>
              <Textarea
                id="offer-letter"
                rows={10}
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                className="bg-background border-border text-foreground text-xs font-mono leading-relaxed rounded-md p-3"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-border flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="h-9 px-4 text-xs font-medium"
              >
                Cancel
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="h-9 px-4 text-xs font-medium gap-1.5"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                <span>Save Draft</span>
              </Button>

              <Button
                size="sm"
                onClick={handleSendToCandidate}
                disabled={isSaving}
                className="h-9 px-5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs rounded-md shadow-md gap-2"
              >
                {sendMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
                <span>Send Formal Offer with E-Sign</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
