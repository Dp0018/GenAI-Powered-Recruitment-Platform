"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpVerificationModal } from "./otp-verification-modal";
import { useRegisterCandidateMutation } from "../hooks/use-auth-mutations";
import { Loader2, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function CandidateRegisterCard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const registerMutation = useRegisterCandidateMutation((data) => {
    setRegisteredEmail(data.user.email);
    setIsOtpOpen(true);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
    });
  };

  const handleOtpVerified = () => {
    router.push("/dashboard/candidate");
  };

  return (
    <>
      <div className="w-full bg-card/90 border border-border rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-3.5">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <User className="size-3 text-primary" />
            <span>Candidate Registration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create Candidate Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Apply directly to verified employers with a unified, verified candidate profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="space-y-1 text-left">
            <Label htmlFor="name" className="text-xs font-medium text-foreground">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="phone" className="text-xs font-medium text-foreground">
              Phone Number <span className="text-muted-foreground text-[11px]">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0100"
                className="pl-10 h-10 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <Label htmlFor="password" className="text-xs font-medium text-foreground">
              Password * <span className="text-muted-foreground text-[11px]">(min 8 characters)</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="password"
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

          <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5 text-left">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md transition-colors shadow-sm shadow-primary/20"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Registering Account...
              </>
            ) : (
              "Create Candidate Account"
            )}
          </Button>
        </form>

        <div className="pt-3 border-t border-border flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Already registered?</span>
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>Hiring organization?</span>
            <Link
              href="/register/employer"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary font-medium hover:underline"
            >
              <span>Register Company Entity</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={isOtpOpen}
        onOpenChange={setIsOtpOpen}
        email={registeredEmail}
        onVerified={handleOtpVerified}
      />
    </>
  );
}
