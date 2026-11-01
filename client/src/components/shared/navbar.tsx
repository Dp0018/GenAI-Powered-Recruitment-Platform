"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { NotificationBellDropdown } from "@/features/notifications/components/notification-bell-dropdown";

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

  const getRoleLabel = () => {
    if (!user) return "";
    switch (user.role) {
      case "EMPLOYER_ADMIN":
        return "Employer";
      case "RECRUITER":
        return "Recruiter";
      case "PLATFORM_ADMIN":
        return "Admin";
      default:
        return "Candidate";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight group"
          >
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Briefcase className="size-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              JobPortal
            </span>
          </Link>

          {/* Real Job Board Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/jobs"
              className="hover:text-foreground transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="/register/employer"
              className="hover:text-foreground transition-colors"
            >
              Post a Job
            </Link>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <NotificationBellDropdown />
              <Link href={getDashboardLink()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-border bg-card/60 text-foreground hover:bg-secondary font-medium text-sm rounded-md"
                >
                  <LayoutDashboard className="size-4 text-muted-foreground" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* Clean Human Profile Info - No AI pulse dot, no mono brackets */}
              <div className="flex items-center gap-2.5 pl-1">
                <div className="size-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-medium text-foreground leading-tight max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {getRoleLabel()}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
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
                  className="h-9 px-3.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md text-sm font-medium"
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
