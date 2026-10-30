"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmployerAdminStep } from "./employer-admin-step";
import {
  EmployerCompanyStep,
  INDUSTRIES,
  COMPANY_SIZES,
} from "./employer-company-step";
import { OtpVerificationModal } from "./otp-verification-modal";
import { useRegisterEmployerMutation } from "../hooks/use-auth-mutations";
import { Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function EmployerRegisterWizard() {
  const router = useRouter();

  // Wizard step state
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Admin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Company
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [companySize, setCompanySize] = useState(COMPANY_SIZES[1]);
  const [location, setLocation] = useState("");

  // OTP Dialog state
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const registerMutation = useRegisterEmployerMutation((data) => {
    setRegisteredEmail(data.user.email);
    setIsOtpOpen(true);
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all administrator credentials");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim() || !companyWebsite.trim()) {
      toast.error("Please provide company name and official website URL");
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      companyName: companyName.trim(),
      companyWebsite: companyWebsite.trim(),
      industry: industry || undefined,
      companySize: companySize || undefined,
      location: location.trim() || undefined,
    });
  };

  const handleOtpVerified = () => {
    router.push("/dashboard/employer");
  };

  return (
    <>
      <div className="w-full bg-card/90 border border-border rounded-xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-3.5">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <Building2 className="size-3 text-primary" />
            <span>Employer Onboarding</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Register Company Entity
          </h1>
          <p className="text-xs text-muted-foreground">
            Create an isolated employer tenant with team recruiter management and verified hiring.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2.5 py-1.5 border-b border-border">
          <div
            className={`flex items-center gap-2 text-xs font-medium ${
              step === 1 ? "text-foreground font-semibold" : "text-primary"
            }`}
          >
            <div
              className={`size-5 rounded-full flex items-center justify-center text-[11px] font-mono border ${
                step === 1
                  ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/30"
                  : "border-primary/50 bg-primary/10 text-primary"
              }`}
            >
              {step > 1 ? <CheckCircle2 className="size-3" /> : "1"}
            </div>
            <span>Admin Account</span>
          </div>

          <div className="h-px flex-1 bg-border" />

          <div
            className={`flex items-center gap-2 text-xs font-medium ${
              step === 2 ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
          >
            <div
              className={`size-5 rounded-full flex items-center justify-center text-[11px] font-mono border ${
                step === 2
                  ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/30"
                  : "border-border bg-secondary text-muted-foreground"
              }`}
            >
              2
            </div>
            <span>Company Details</span>
          </div>
        </div>

        {step === 1 ? (
          <EmployerAdminStep
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            phone={phone}
            setPhone={setPhone}
            onNext={handleNextStep}
          />
        ) : (
          <EmployerCompanyStep
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyWebsite={companyWebsite}
            setCompanyWebsite={setCompanyWebsite}
            industry={industry}
            setIndustry={setIndustry}
            companySize={companySize}
            setCompanySize={setCompanySize}
            location={location}
            setLocation={setLocation}
            isPending={registerMutation.isPending}
            onBack={() => setStep(1)}
            onSubmit={handleFinalSubmit}
          />
        )}

        <div className="pt-3 border-t border-border flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Already have a company account?</span>
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>Looking for job opportunities?</span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 text-foreground hover:text-primary font-medium hover:underline"
            >
              <span>Register as Candidate</span>
              <ArrowRight className="size-3" />
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
