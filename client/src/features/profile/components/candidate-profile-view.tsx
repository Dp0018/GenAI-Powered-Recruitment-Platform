"use client";

import React, { useState, useEffect, useRef } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../hooks/use-profile";
import { profileApi } from "../api/profile-api";
import { applicationsApi } from "@/features/applications/api/applications-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Globe,
  Link2,
  Code,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Plus,
  X,
  Camera,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export function CandidateProfileView() {
  const { data: profile, isLoading, refetch } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | undefined>(undefined);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatarUrl || "");
      setHeadline(profile.headline || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setCurrentRole(profile.currentRole || "");
      setCurrentCompany(profile.currentCompany || "");
      setYearsOfExperience(profile.yearsOfExperience ?? undefined);
      setWebsiteUrl(profile.websiteUrl || "");
      setGithubUrl(profile.githubUrl || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setResumeUrl(profile.resumeUrl || "");
      setResumeFileName(profile.resumeFileName || "");
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file exceeds 5MB limit");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await profileApi.uploadAvatar(file);
      setAvatarUrl(res.url);
      toast.success("Profile photo uploaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo";
      toast.error(msg);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleResumeUpload = async (file: File) => {
    const validExtensions = [".pdf", ".docx", ".doc"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a PDF or Word document (.pdf, .docx, .doc)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume file exceeds 10MB limit");
      return;
    }

    try {
      setIsUploadingResume(true);
      const res = await applicationsApi.uploadResume(file);
      setResumeUrl(res.url);
      setResumeFileName(file.name);
      toast.success("Default resume updated");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload resume";
      toast.error(msg);
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.info("Skill already added");
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate({
      name: name.trim(),
      phone: phone.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      headline: headline.trim() || undefined,
      bio: bio.trim() || undefined,
      location: location.trim() || undefined,
      currentRole: currentRole.trim() || undefined,
      currentCompany: currentCompany.trim() || undefined,
      yearsOfExperience: yearsOfExperience,
      websiteUrl: websiteUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      resumeUrl: resumeUrl.trim() || undefined,
      resumeFileName: resumeFileName.trim() || undefined,
      skills,
    });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center rounded-lg border border-border bg-card/40 space-y-3">
        <Loader2 className="size-6 animate-spin text-primary mx-auto" />
        <div className="text-xs text-muted-foreground font-mono">
          Loading candidate profile...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Header & Avatar Card */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group shrink-0">
          <div className="size-20 rounded-full border-2 border-border overflow-hidden bg-secondary flex items-center justify-center text-muted-foreground relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || "Candidate Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="size-8 text-primary" />
            )}

            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-0 right-0 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
            title="Upload photo"
          >
            <Camera className="size-3.5" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {name || "Your Name"}
            </h2>
            {profile?.emailVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="size-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Unverified Email
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {headline || "No headline set. Add a brief title summarizing your expertise."}
          </p>
          <div className="text-[11px] text-muted-foreground font-mono flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              {profile?.email}
            </span>
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {location}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <Phone className="size-3" />
                {phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Basic & Contact Information */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2 border-b border-border pb-3">
          <UserIcon className="size-4 text-primary" />
          <span>Personal Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="name" className="text-xs font-medium text-foreground">
              Full Legal Name *
            </Label>
            <Input
              id="name"
              required
              placeholder="e.g. Darshan Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="phone" className="text-xs font-medium text-foreground">
              Contact Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left sm:col-span-2">
            <Label htmlFor="location" className="text-xs font-medium text-foreground">
              Current Location
            </Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA or Bangalore, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2 border-b border-border pb-3">
          <Briefcase className="size-4 text-primary" />
          <span>Professional Background</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left sm:col-span-2">
            <Label htmlFor="headline" className="text-xs font-medium text-foreground">
              Professional Headline
            </Label>
            <Input
              id="headline"
              placeholder="e.g. Senior Software Engineer • Distributed Systems & JVM Internals"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="currentRole" className="text-xs font-medium text-foreground">
              Current / Most Recent Role
            </Label>
            <Input
              id="currentRole"
              placeholder="e.g. Staff Platform Engineer"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="currentCompany" className="text-xs font-medium text-foreground">
              Current / Most Recent Company
            </Label>
            <Input
              id="currentCompany"
              placeholder="e.g. Acme Cloud Corp"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left sm:col-span-2">
            <Label htmlFor="years" className="text-xs font-medium text-foreground">
              Years of Professional Experience
            </Label>
            <Input
              id="years"
              type="number"
              min="0"
              max="50"
              placeholder="e.g. 5"
              value={yearsOfExperience ?? ""}
              onChange={(e) =>
                setYearsOfExperience(
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              className="h-10 text-xs bg-background border-border w-32"
            />
          </div>

          <div className="space-y-1.5 text-left sm:col-span-2">
            <Label htmlFor="bio" className="text-xs font-medium text-foreground">
              About & Bio Summary
            </Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Write a concise overview of your background, technical philosophies, and significant milestones..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-xs bg-background border-border resize-none"
            />
          </div>
        </div>
      </div>

      {/* Skills & Competencies */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2 border-b border-border pb-3">
          <FileText className="size-4 text-primary" />
          <span>Skills & Competencies</span>
        </h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add skill (e.g. TypeScript, Spring Boot, PostgreSQL, Docker)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDownSkill}
              className="h-9 text-xs bg-background border-border max-w-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSkill}
              className="h-9 px-3 text-xs border-border gap-1"
            >
              <Plus className="size-3.5" />
              <span>Add</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 rounded-lg border border-border bg-secondary/20">
            {skills.length === 0 ? (
              <span className="text-xs text-muted-foreground font-mono">
                No skills added yet. Type a technology and click Add.
              </span>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary border border-border text-xs text-foreground font-mono"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Online Profiles & Links */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2 border-b border-border pb-3">
          <Globe className="size-4 text-primary" />
          <span>Online Links & Portfolio</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="linkedin" className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Link2 className="size-3 text-primary" />
              <span>LinkedIn Profile</span>
            </Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="github" className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Code className="size-3 text-primary" />
              <span>GitHub Profile</span>
            </Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <Label htmlFor="website" className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Globe className="size-3 text-primary" />
              <span>Portfolio / Website</span>
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://mysite.dev"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="h-10 text-xs bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Default Cloud Resume */}
      <div className="p-6 rounded-lg border border-border bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>Default Cloud Resume (1-Click Apply)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Saved to your ImageKit cloud vault. Auto-fills your job applications automatically.
            </p>
          </div>
        </div>

        {resumeUrl ? (
          <div className="p-4 rounded-lg border border-border bg-secondary/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
                  <span className="truncate">{resumeFileName || "Primary Resume"}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="size-2.5" />
                    Active Default
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  Hosted on ImageKit CDN • Ready for 1-Click Apply
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-secondary border border-border text-xs text-foreground font-mono hover:bg-secondary/80 transition-colors"
              >
                <ExternalLink className="size-3.5" />
                <span>View</span>
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resumeInputRef.current?.click()}
                className="h-8 text-xs border-border"
              >
                Replace
              </Button>
              <button
                type="button"
                onClick={() => {
                  setResumeUrl("");
                  setResumeFileName("");
                }}
                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Remove resume"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => resumeInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-6 text-center cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-colors"
          >
            {isUploadingResume ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="size-6 animate-spin text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Uploading to ImageKit cloud storage...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="size-9 rounded-full bg-secondary border border-border flex items-center justify-center text-primary">
                  <UploadCloud className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-foreground">
                    Upload your master resume
                  </span>{" "}
                  <span className="text-xs text-muted-foreground">to enable 1-Click Apply</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  PDF or Word documents up to 10MB
                </p>
              </div>
            )}
          </div>
        )}

        <input
          ref={resumeInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleResumeUpload(file);
          }}
          className="hidden"
        />
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={updateMutation.isPending || isUploadingAvatar || isUploadingResume}
          size="sm"
          className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow-sm gap-2"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
