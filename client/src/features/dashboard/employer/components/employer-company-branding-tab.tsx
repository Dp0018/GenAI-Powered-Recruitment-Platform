"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useMyCompanyQuery,
  useUpdateMyCompanyMutation,
  useUploadCompanyLogoMutation,
  useUploadCompanyBannerMutation,
} from "@/features/companies/hooks/use-companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  UploadCloud,
  Loader2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { COMPANY_BENEFITS } from "@/features/jobs/types/benefits";

export function EmployerCompanyBrandingTab() {
  const { data: company, isLoading } = useMyCompanyQuery();
  const updateMutation = useUpdateMyCompanyMutation();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const logoMutation = useUploadCompanyLogoMutation((url) => setLogoUrl(url));
  const bannerMutation = useUploadCompanyBannerMutation((url) => setBannerUrl(url));

  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setWebsite(company.website || "");
      setIndustry(company.industry || "");
      setCompanySize(company.companySize || "");
      setLocation(company.location || "");
      setDescription(company.description || "");
      setLogoUrl(company.logoUrl || null);
      setBannerUrl(company.bannerUrl || null);
      setSelectedBenefits(company.benefits || []);
    }
  }, [company]);

  const toggleBenefit = (key: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be under 5MB");
      return;
    }
    logoMutation.mutate(file);
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Banner must be under 10MB");
      return;
    }
    bannerMutation.mutate(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Company name is required");
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
      companySize: companySize.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      benefits: selectedBenefits,
    });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center rounded-xl border border-border bg-card/40 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary mx-auto" />
        <div className="text-xs text-muted-foreground font-mono">Loading corporate profile...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header with Public Preview Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-card/70 border border-border">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <span>Corporate Branding & Employer Page</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure how your organization appears on public job requisitions and candidate discovery.
          </p>
        </div>

        {company?.slug && (
          <Link href={`/companies/${company.slug}`} target="_blank">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 border-border font-mono text-xs hover:border-primary/50 text-foreground"
            >
              <span>View Public Page</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </Button>
          </Link>
        )}
      </div>

      {/* Visual Asset Uploaders (ImageKit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cover Banner Upload */}
        <div className="p-5 rounded-xl bg-card/60 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-primary" />
              <span>Cover Banner (1200x400 recommended)</span>
            </Label>
            {bannerUrl && (
              <button
                type="button"
                onClick={() => setBannerUrl(null)}
                className="text-[11px] font-mono text-destructive hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="size-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div
            onClick={() => bannerInputRef.current?.click()}
            className="group relative h-36 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-secondary/30"
          >
            {bannerUrl ? (
              <Image src={bannerUrl} alt="Cover Banner" fill className="object-cover" />
            ) : (
              <div className="text-center p-4 space-y-1">
                {bannerMutation.isPending ? (
                  <Loader2 className="size-6 animate-spin text-primary mx-auto" />
                ) : (
                  <UploadCloud className="size-6 text-muted-foreground group-hover:text-primary transition-colors mx-auto" />
                )}
                <p className="text-xs font-medium text-foreground">
                  {bannerMutation.isPending ? "Uploading to ImageKit CDN..." : "Click or drop banner image"}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">PNG, JPG, WebP up to 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerSelect}
            className="hidden"
          />
        </div>

        {/* Company Logo Upload */}
        <div className="p-5 rounded-xl bg-card/60 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              <span>Square Corporate Logo (400x400)</span>
            </Label>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl(null)}
                className="text-[11px] font-mono text-destructive hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="size-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div
            onClick={() => logoInputRef.current?.click()}
            className="group relative h-36 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-secondary/30"
          >
            {logoUrl ? (
              <div className="size-24 rounded-xl border border-border bg-card relative overflow-hidden shadow-sm">
                <Image src={logoUrl} alt="Company Logo" fill className="object-cover p-1.5" />
              </div>
            ) : (
              <div className="text-center p-4 space-y-1">
                {logoMutation.isPending ? (
                  <Loader2 className="size-6 animate-spin text-primary mx-auto" />
                ) : (
                  <UploadCloud className="size-6 text-muted-foreground group-hover:text-primary transition-colors mx-auto" />
                )}
                <p className="text-xs font-medium text-foreground">
                  {logoMutation.isPending ? "Uploading to ImageKit CDN..." : "Click or drop logo image"}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">PNG, JPG, WebP, SVG up to 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Organization Details Form */}
      <div className="p-6 rounded-xl bg-card/70 border border-border space-y-5">
        <h3 className="text-sm font-bold text-foreground tracking-tight">Organization Profile Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="company-name" className="text-xs font-medium text-foreground">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              required
              className="h-9 bg-secondary/40 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-website" className="text-xs font-medium text-foreground">
              Corporate Website
            </Label>
            <Input
              id="company-website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="h-9 bg-secondary/40 border-border text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-industry" className="text-xs font-medium text-foreground">
              Industry Sector
            </Label>
            <Input
              id="company-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Enterprise Cloud & Security"
              className="h-9 bg-secondary/40 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-size" className="text-xs font-medium text-foreground">
              Company Size / Team Headcount
            </Label>
            <Input
              id="company-size"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              placeholder="e.g. 50-200 employees"
              className="h-9 bg-secondary/40 border-border text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-location" className="text-xs font-medium text-foreground">
              Headquarters / Operating Location
            </Label>
            <Input
              id="company-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA & Remote"
              className="h-9 bg-secondary/40 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-description" className="text-xs font-medium text-foreground">
              About the Company & Mission
            </Label>
            <Textarea
              id="company-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your company's mission, engineering culture, and products..."
              className="bg-secondary/40 border-border text-xs resize-y"
            />
          </div>

          {/* Corporate Perks & Culture Badges */}
          <div className="space-y-2.5 sm:col-span-2 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              <Label className="text-xs font-semibold text-foreground">
                Company Perks & Culture Badges
              </Label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Select company-wide benefits to display prominently on your public company profile and job postings.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {COMPANY_BENEFITS.map((b) => {
                const isSelected = selectedBenefits.includes(b.key);
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => toggleBenefit(b.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-secondary/60 hover:bg-secondary text-muted-foreground border-border"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            type="submit"
            disabled={updateMutation.isPending || logoMutation.isPending || bannerMutation.isPending}
            className="h-9 px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-2 shadow-sm"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Save Company Branding</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
