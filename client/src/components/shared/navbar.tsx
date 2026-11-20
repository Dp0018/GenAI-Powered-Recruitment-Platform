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
  CreditCard,
  Crown,
} from "lucide-react";
import { useBilling } from "@/features/billing/hooks/use-billing";
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
  const { subscription } = useBilling();

  const isCandidatePro =
    user?.role === "CANDIDATE" &&
    (subscription?.planType === "PRO" || Boolean(subscription?.isPaid));

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
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-medium">
              <Briefcase className="size-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
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
              href="/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
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
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-secondary/70 transition-colors border border-transparent hover:border-border outline-none cursor-pointer group select-none"
                  aria-label="User profile menu"
                >
                  <div className="relative">
                    <div
                      className={`size-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                        isCandidatePro
                          ? "bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                          : "bg-secondary border border-border text-foreground"
                      }`}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    {isCandidatePro && (
                      <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Crown className="size-2 fill-slate-950 text-slate-950" />
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-medium text-foreground leading-tight max-w-[120px] truncate flex items-center gap-1">
                      {user.name}
                      {isCandidatePro && (
                        <Crown className="size-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-tight flex items-center gap-1">
                      {isCandidatePro ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Pro member</span>
                      ) : (
                        getRoleLabel()
                      )}
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
                      <p className="text-sm font-bold text-foreground leading-none flex items-center gap-1.5">
                        {user.name}
                        {isCandidatePro && (
                          <Crown className="size-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground leading-none truncate">
                        {user.email}
                      </p>
                      <div className="pt-1.5">
                        {isCandidatePro ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-linear-to-r from-amber-500/15 to-yellow-500/10 text-amber-400 border border-amber-500/30 shadow-xs">
                            <Crown className="size-3 fill-amber-400 text-amber-400" />
                            Candidate Pro Member
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            {getRoleLabel()}
                          </span>
                        )}
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

                    <DropdownMenuItem
                      onClick={() => router.push("/pricing")}
                      className="cursor-pointer gap-2.5 py-2 px-2.5 text-xs font-medium rounded-lg"
                    >
                      <CreditCard className="size-4 text-muted-foreground" />
                      <span>Plans & Billing</span>
                    </DropdownMenuItem>
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
