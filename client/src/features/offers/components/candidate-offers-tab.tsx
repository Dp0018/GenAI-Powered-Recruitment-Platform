"use client";

import React, { useState } from "react";
import { useCandidateOffersQuery } from "../hooks/use-offers";
import { JobOffer } from "../types/offer";
import { OfferLetterViewModal } from "./offer-letter-view-modal";
import { Button } from "@/components/ui/button";
import {
  FileText,
  DollarSign,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export function CandidateOffersTab() {
  const { data: offers = [], isLoading } = useCandidateOffersQuery();
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenOffer = (offer: JobOffer) => {
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-mono">Loading employment offers...</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-xl bg-card/60 border border-border space-y-3">
        <div className="size-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
          <FileText className="size-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">No Offers Extended Yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          When an employer advances your candidacy to an official offer, you will receive notification and can review terms & execute digital signatures right here.
        </p>
      </div>
    );
  }

  const pendingOffers = offers.filter((o) => o.status === "SENT");
  const completedOffers = offers.filter((o) => o.status !== "SENT");

  return (
    <div className="space-y-6">
      {/* Pending Offers Banner / Cards */}
      {pendingOffers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
              Action Required: Pending Employment Offers ({pendingOffers.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-teal-950/20 to-card border border-emerald-600/40 hover:border-emerald-500 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
                      <Building2 className="size-3.5" />
                      <span>{offer.companyName}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/40 border border-emerald-700/50">
                      <Clock className="size-3" />
                      <span>Awaiting Electronic Signature</span>
                    </span>
                    {offer.expiresAt && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Expires {new Date(offer.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-foreground tracking-tight">
                    {offer.jobTitle}
                  </h4>

                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground flex-wrap">
                    <span className="text-foreground font-bold">
                      ${offer.baseSalary.toLocaleString()}{" "}
                      <span className="font-normal text-muted-foreground">
                        {offer.currency} / {offer.payPeriod === "MONTHLY" ? "mo" : "yr"}
                      </span>
                    </span>
                    {offer.equityDetails && (
                      <span className="text-emerald-400 font-medium">
                        • {offer.equityDetails}
                      </span>
                    )}
                    {offer.signOnBonus && (
                      <span className="text-indigo-400 font-medium">
                        • ${offer.signOnBonus.toLocaleString()} Sign-On
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleOpenOffer(offer)}
                    className="h-9 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-md shadow-md gap-1.5"
                  >
                    <ShieldCheck className="size-3.5" />
                    <span>Review & E-Sign Offer</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed / History Offers */}
      {completedOffers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
            Offer Archive & History ({completedOffers.length})
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {completedOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-xl bg-card/60 border border-border hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary font-mono">
                      {offer.companyName}
                    </span>
                    {offer.status === "ACCEPTED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                        <CheckCircle2 className="size-2.5" />
                        <span>Accepted & Signed</span>
                      </span>
                    )}
                    {offer.status === "DECLINED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-800/40">
                        <XCircle className="size-2.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-foreground">
                    {offer.jobTitle}
                  </h4>

                  <div className="text-xs font-mono text-muted-foreground">
                    ${offer.baseSalary.toLocaleString()} {offer.currency} / {offer.payPeriod === "MONTHLY" ? "mo" : "yr"}
                  </div>
                </div>

                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenOffer(offer)}
                    className="h-8 px-3 text-xs font-medium gap-1.5"
                  >
                    <FileText className="size-3 text-primary" />
                    <span>View Document</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offer Letter View Modal */}
      <OfferLetterViewModal
        offer={selectedOffer}
        open={modalOpen}
        onOpenChange={setModalOpen}
        isCandidate={true}
      />
    </div>
  );
}
