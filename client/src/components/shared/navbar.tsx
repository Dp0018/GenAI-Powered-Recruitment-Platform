"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  User,
  ArrowRight,
  Terminal,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/dashboard/candidate";
    if (user.role === "EMPLOYER_ADMIN" || user.role === "RECRUITER") {
      return "/dashboard/employer";
    }
    if (user.role === "PLATFORM_ADMIN") {
      return "/dashboard/admin";
    }
    return "/dashboard/candidate";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold text-foreground tracking-tight group"
          >
            <div className="size-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight">JobPortal</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-secondary border border-border text-muted-foreground">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/#security"
              className="hover:text-foreground transition-colors"
            >
              Security
            </Link>
            <Link
              href="/#workflows"
              className="hover:text-foreground transition-colors"
            >
              Workflows
            </Link>
            <Link
              href="/register/employer"
              className="hover:text-foreground transition-colors"
            >
              For Employers
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Compliance
            </Link>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href={getDashboardLink()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-border bg-card/60 text-foreground hover:bg-secondary font-medium text-sm rounded-md"
                >
                  <LayoutDashboard className="size-4 text-primary" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border text-xs font-mono">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-foreground font-semibold max-w-[130px] truncate">
                  {user.name}
                </span>
                <span className="text-primary font-bold">
                  [{user.role.replace("_", " ")}]
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-9 px-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md text-sm font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md shadow-sm shadow-primary/20 transition-colors"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
