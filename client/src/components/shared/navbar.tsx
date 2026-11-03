"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  User,
  Building2,
} from "lucide-react";
import { NotificationBellDropdown } from "@/features/notifications/components/notification-bell-dropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
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
        return "Employer Admin";
      case "RECRUITER":
        return "Recruiter";
      case "PLATFORM_ADMIN":
        return "Platform Admin";
      default:
        return "Candidate";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight group"
          >
            <div className="size-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 shadow-sm font-bold">
              <Briefcase className="size-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              JobPortal
            </span>
          </Link>

          {/* Job Board Navigation */}
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

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-secondary/70 transition-colors border border-transparent hover:border-border/60 outline-none cursor-pointer group select-none"
                  aria-label="User profile menu"
                >
                  <div className="size-8 rounded-full bg-linear-to-br from-sky-500/20 via-sky-500/10 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-400 shrink-0 shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-foreground leading-tight max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {getRoleLabel()}
                    </span>
                  </div>
                  <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 p-2 rounded-2xl bg-card/95 border border-border shadow-xl backdrop-blur-xl space-y-1 z-50"
                >
                  <div className="px-3 py-2.5">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-foreground leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground leading-none truncate">
                        {user.email}
                      </p>
                      <div className="pt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {getRoleLabel()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push(getDashboardLink())}
                      className="cursor-pointer gap-2.5 py-2 px-2.5 text-xs font-medium rounded-lg"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>

                    {user.role === "CANDIDATE" && (
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard/candidate")}
                        className="cursor-pointer gap-2.5 py-2 px-2.5 text-xs font-medium rounded-lg"
                      >
                        <User className="size-4 text-muted-foreground" />
                        <span>Profile & Resume</span>
                      </DropdownMenuItem>
                    )}

                    {(user.role === "EMPLOYER_ADMIN" || user.role === "RECRUITER") && (
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard/employer")}
                        className="cursor-pointer gap-2.5 py-2 px-2.5 text-xs font-medium rounded-lg"
                      >
                        <Building2 className="size-4 text-muted-foreground" />
                        <span>Company Profile</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={logout}
                    className="cursor-pointer gap-2.5 py-2 px-2.5 text-xs font-medium rounded-lg text-rose-400 hover:text-rose-300 focus:text-rose-300"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
