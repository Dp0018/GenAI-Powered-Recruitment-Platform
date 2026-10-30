import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-10 text-sm text-muted-foreground bg-card/40">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="size-3.5" />
          </div>
          <span className="text-foreground font-semibold">JobPortal Enterprise</span>
          <span className="text-muted-foreground/60">|</span>
          <span className="text-xs">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
