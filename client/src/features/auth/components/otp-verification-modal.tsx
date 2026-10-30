"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation, useSendOtpMutation } from "../hooks/use-auth-mutations";
import { Loader2, MailCheck, RotateCcw } from "lucide-react";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified: () => void;
}

function OtpModalBody({
  email,
  onClose,
  onVerified,
}: {
  email: string;
  onClose: () => void;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyMutation = useVerifyOtpMutation(() => {
    onClose();
    onVerified();
  });

  const sendMutation = useSendOtpMutation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = () => {
    if (otp.length !== 6) return;
    verifyMutation.mutate({
      email,
      otp,
      type: "EMAIL_VERIFICATION",
    });
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    sendMutation.mutate({
      email,
      type: "EMAIL_VERIFICATION",
    });
  };

  return (
    <DialogContent className="sm:max-w-[440px] bg-card border border-border text-foreground p-8 rounded-xl shadow-2xl">
      <DialogHeader className="space-y-3 text-left">
        <div className="size-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <MailCheck className="size-6" />
        </div>
        <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
          Verify Email Address
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
          We sent a 6-digit cryptographic verification code to{" "}
          <span className="font-mono text-foreground font-semibold">{email}</span>. Code is valid for 10 minutes.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center py-5 space-y-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (val.length === 6) {
              verifyMutation.mutate({
                email,
                otp: val,
                type: "EMAIL_VERIFICATION",
              });
            }
          }}
          disabled={verifyMutation.isPending}
        >
          <InputOTPGroup className="gap-2.5">
            <InputOTPSlot index={0} className="size-11 sm:size-12 border-border bg-background text-foreground rounded-lg text-base font-mono font-bold" />
            <InputOTPSlot index={1} className="size-11 sm:size-12 border-border bg-background text-foreground rounded-lg text-base font-mono font-bold" />
            <InputOTPSlot index={2} className="size-11 sm:size-12 border-border bg-background text-foreground rounded-lg text-base font-mono font-bold" />
            <InputOTPSlot index={3} className="size-11 sm:size-12 border-border bg-background text-foreground rounded-lg text-base font-mono font-bold" />
            <InputOTPSlot index={4} className="size-11 sm:size-12 border-border bg-background text-foreground rounded-lg text-base font-mono font-bold" />
            <InputOTPSlot index={5} className="size-11 sm:size-12 border-border bg-background text-foreground rounded-lg text-base font-mono font-bold" />
          </InputOTPGroup>
        </InputOTP>

        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={sendMutation.isPending}
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 underline underline-offset-4 cursor-pointer font-medium"
            >
              <RotateCcw className="size-3.5" />
              <span>Resend verification code</span>
            </button>
          ) : (
            <span className="font-mono text-xs">Resend code in {countdown}s</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-2">
        <Button
          type="button"
          onClick={handleVerify}
          disabled={otp.length !== 6 || verifyMutation.isPending}
          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md text-sm transition-colors shadow-sm shadow-primary/20"
        >
          {verifyMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Verifying token...
            </>
          ) : (
            "Confirm Verification"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onClose();
            onVerified();
          }}
          className="w-full h-10 text-muted-foreground hover:text-foreground hover:bg-secondary text-sm rounded-md"
        >
          Continue and verify later
        </Button>
      </div>
    </DialogContent>
  );
}

export function OtpVerificationModal({
  isOpen,
  onOpenChange,
  email,
  onVerified,
}: OtpVerificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {isOpen && (
        <OtpModalBody
          key={email}
          email={email}
          onClose={() => onOpenChange(false)}
          onVerified={onVerified}
        />
      )}
    </Dialog>
  );
}
