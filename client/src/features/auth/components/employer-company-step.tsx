"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Building2,
  Globe,
  MapPin,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export const INDUSTRIES = [
  "Software & Technology",
  "Financial Services & FinTech",
  "Healthcare & Life Sciences",
  "E-Commerce & Retail",
  "Manufacturing & Robotics",
  "Education & EdTech",
  "Media & Entertainment",
  "Professional Services",
  "Other",
];

export const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

interface EmployerCompanyStepProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  companyWebsite: string;
  setCompanyWebsite: (val: string) => void;
  industry: string;
  setIndustry: (val: string) => void;
  companySize: string;
  setCompanySize: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  isPending?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmployerCompanyStep({
  companyName,
  setCompanyName,
  companyWebsite,
  setCompanyWebsite,
  industry,
  setIndustry,
  companySize,
  setCompanySize,
  location,
  setLocation,
  isPending,
  isSubmitting,
  onBack,
  onSubmit,
}: EmployerCompanyStepProps) {
  const loading = isPending || isSubmitting;

  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      <div className="flex items-center justify-between pb-0.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Admin credentials</span>
        </button>
      </div>

      <div className="space-y-1 text-left">
        <Label htmlFor="company-name" className="text-xs font-medium text-foreground">
          Company Legal Name *
        </Label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="company-name"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Technologies Inc."
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1 text-left">
        <Label htmlFor="company-website" className="text-xs font-medium text-foreground">
          Corporate Website URL *
        </Label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="company-website"
            type="url"
            required
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            placeholder="https://acme.com"
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1 text-left">
        <Label htmlFor="company-location" className="text-xs font-medium text-foreground">
          Headquarters Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="company-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA, USA"
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
        <div className="space-y-1">
          <Label htmlFor="company-industry" className="text-xs font-medium text-foreground">
            Industry
          </Label>
          <select
            id="company-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind} className="bg-card text-foreground">
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="company-size" className="text-xs font-medium text-foreground">
            Company Size
          </Label>
          <select
            id="company-size"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            className="w-full h-10 bg-background border border-border text-foreground text-xs rounded-md px-3 focus:outline-none focus:border-primary"
          >
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size} className="bg-card text-foreground">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Disclaimer */}
      <div className="p-3 bg-secondary/50 border border-border rounded-md flex items-start gap-2.5 text-xs text-muted-foreground text-left leading-relaxed">
        <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
        <span>
          New organizations register with <strong className="text-foreground">Pending Verification</strong> status. You can configure your team immediately, but public visibility requires administrative domain verification.
        </span>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md transition-colors mt-1 shadow-sm shadow-primary/20"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Submitting company profile...
          </>
        ) : (
          "Complete Employer Registration"
        )}
      </Button>
    </form>
  );
}
