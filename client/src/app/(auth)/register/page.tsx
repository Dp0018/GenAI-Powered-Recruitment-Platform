import React from "react";
import { CandidateRegisterCard } from "@/features/auth/components/candidate-register-card";

export const metadata = {
  title: "Candidate Registration - JobPortal",
  description: "Create a verified candidate account to apply directly to top employers.",
};

export default function RegisterPage() {
  return <CandidateRegisterCard />;
}
