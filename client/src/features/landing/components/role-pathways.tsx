import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Building2, CheckCircle2, ArrowRight } from "lucide-react";

export function RolePathways() {
  return (
    <section id="workflows" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-card/30 border-b border-border/80">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Choose Your Platform Path
          </h2>
          <p className="text-base text-muted-foreground">
            Select your user profile type to access dedicated workspaces and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Candidate Box */}
          <div className="p-8 sm:p-10 rounded-xl bg-card border border-border flex flex-col justify-between space-y-8 hover:border-primary/40 transition-colors shadow-lg">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary border border-border text-xs font-mono text-foreground font-semibold">
                <Users className="size-3.5 text-primary" />
                <span>For Candidates</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Candidate Profile
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>One unified profile for applications across verified employers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Real-time status tracking on application reviews and interviews</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Email OTP verification to protect account access</span>
                </li>
              </ul>
            </div>

            <Link href="/register">
              <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md text-sm gap-2 transition-colors shadow-sm shadow-primary/20">
                <span>Create Candidate Account</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          {/* Employer Box */}
          <div className="p-8 sm:p-10 rounded-xl bg-card border border-border flex flex-col justify-between space-y-8 hover:border-primary/40 transition-colors shadow-lg">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary border border-border text-xs font-mono text-foreground font-semibold">
                <Building2 className="size-3.5 text-primary" />
                <span>For Hiring Organizations</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Employer Tenant
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Post job openings with compensation and skill specifications</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Invite hiring managers and recruiters to manage candidate pipelines</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>Enterprise verification badge displayed on published requisitions</span>
                </li>
              </ul>
            </div>

            <Link href="/register/employer">
              <Button
                variant="outline"
                className="w-full h-11 border-border bg-card/50 text-foreground hover:bg-secondary font-medium rounded-md text-sm gap-2 transition-colors"
              >
                <span>Register Company Entity</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
