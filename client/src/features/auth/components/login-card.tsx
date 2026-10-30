"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "../hooks/use-auth-mutations";
import { Loader2, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation((data) => {
    if (data.user.role === "EMPLOYER_ADMIN" || data.user.role === "RECRUITER") {
      router.push("/dashboard/employer");
    } else if (data.user.role === "PLATFORM_ADMIN") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/candidate");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please provide both email and password");
      return;
    }

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="w-full bg-card/90 border border-border rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
      <div className="space-y-1.5 text-left">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Tenant Portal Auth</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sign In
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your authorized account credentials to access your portal workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5 text-left">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="pl-10 h-11 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pl-10 pr-10 h-11 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground/60 rounded-md focus-visible:ring-primary focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md transition-colors shadow-sm shadow-primary/20"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Authenticating Credentials...
            </>
          ) : (
            "Sign In to Account"
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-border flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-medium hover:underline"
          >
            Create Candidate Account
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <span>Hiring organization?</span>
          <Link
            href="/register/employer"
            className="inline-flex items-center gap-1 text-foreground hover:text-primary font-medium hover:underline"
          >
            <span>Register Company</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
