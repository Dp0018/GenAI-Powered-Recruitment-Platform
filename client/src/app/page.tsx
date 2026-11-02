import React from "react";
import { HeroSection } from "@/features/landing/components/hero-section";
import { TrustedCompaniesMarquee } from "@/features/landing/components/trusted-companies-marquee";
import { JobCategoriesBento } from "@/features/landing/components/job-categories-bento";
import { FeaturedJobsPreview } from "@/features/landing/components/featured-jobs-preview";
import { WhyChooseUs } from "@/features/landing/components/why-choose-us";
import { DualPathwaySection } from "@/features/landing/components/dual-pathway-section";
import { CandidateTestimonials } from "@/features/landing/components/candidate-testimonials";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { Footer } from "@/components/shared/footer";

export const metadata = {
  title: "JobPortal - Find Your Next Role with Upfront Pay Transparency",
  description:
    "Discover 15,000+ verified engineering, product, and leadership jobs with guaranteed upfront salary ranges, direct recruiter access, and 1-click apply.",
};

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection />
      <TrustedCompaniesMarquee />
      <JobCategoriesBento />
      <FeaturedJobsPreview />
      <WhyChooseUs />
      <DualPathwaySection />
      <CandidateTestimonials />
      <LandingCta />
      <Footer />
    </div>
  );
}
