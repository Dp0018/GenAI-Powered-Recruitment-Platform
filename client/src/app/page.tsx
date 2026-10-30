import React from "react";
import { HeroSection } from "@/features/landing/components/hero-section";
import { ArchitecturePillars } from "@/features/landing/components/architecture-pillars";
import { InteractiveFeatureTabs } from "@/features/landing/components/interactive-feature-tabs";
import { RolePathways } from "@/features/landing/components/role-pathways";
import { Footer } from "@/components/shared/footer";

export const metadata = {
  title: "JobPortal - Multi-Tenant Enterprise Recruitment Platform",
  description:
    "Enterprise recruitment infrastructure featuring multi-tenant company isolation, domain verification, and role-based access control.",
};

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection />
      <ArchitecturePillars />
      <InteractiveFeatureTabs />
      <RolePathways />
      <Footer />
    </div>
  );
}
