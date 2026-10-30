import React from "react";
import { LoginCard } from "@/features/auth/components/login-card";

export const metadata = {
  title: "Sign In - JobPortal",
  description: "Sign in to your candidate or employer account.",
};

export default function LoginPage() {
  return <LoginCard />;
}
