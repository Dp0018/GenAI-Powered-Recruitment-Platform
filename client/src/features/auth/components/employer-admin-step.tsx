"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";

interface EmployerAdminStepProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  onNext: (e: React.FormEvent) => void;
}

export function EmployerAdminStep({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  phone,
  setPhone,
  onNext,
}: EmployerAdminStepProps) {
  return (
    <form onSubmit={onNext} className="space-y-2.5">
      <div className="space-y-1 text-left">
        <Label htmlFor="admin-name" className="text-xs font-medium text-foreground">
          Administrator Full Name *
        </Label>
        <div className="relative">
          <User className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="admin-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah Jenkins"
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1 text-left">
        <Label htmlFor="admin-email" className="text-xs font-medium text-foreground">
          Work Email Address *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="s.jenkins@company.com"
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1 text-left">
        <Label htmlFor="admin-phone" className="text-xs font-medium text-foreground">
          Direct Contact Phone <span className="text-muted-foreground text-[11px]">(optional)</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="admin-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555-0199"
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-1 text-left">
        <Label htmlFor="admin-password" className="text-xs font-medium text-foreground">
          Password * <span className="text-muted-foreground text-[11px]">(min 8 characters)</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            id="admin-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md transition-colors mt-1 shadow-sm shadow-primary/20"
      >
        <span>Proceed to Company Profile</span>
        <ArrowRight className="size-4 ml-1.5" />
      </Button>
    </form>
  );
}
