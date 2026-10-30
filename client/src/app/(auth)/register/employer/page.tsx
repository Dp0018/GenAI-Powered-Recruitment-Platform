import React from "react";
import { EmployerRegisterWizard } from "@/features/auth/components/employer-register-wizard";

export const metadata = {
  title: "Employer Onboarding - JobPortal",
  description: "Register your company entity and administrator account for verified recruitment.",
};

export default function EmployerRegisterPage() {
  return <EmployerRegisterWizard />;
}
