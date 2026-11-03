"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Briefcase,
  Calendar,
  CalendarX,
  UserPlus,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "../hooks/use-notifications";
import { NotificationItem, NotificationType } from "../types/notification";

export function NotificationBellDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } =
    useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (n: NotificationItem) => {
    if (!n.read) {
      markAsRead(n.id);
    }
    setIsOpen(false);
    if (n.linkUrl) {
      router.push(n.linkUrl);
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "APPLICATION_STATUS":
        return <Briefcase className="size-4 text-blue-400" />;
      case "INTERVIEW_INVITE":
        return <Calendar className="size-4 text-emerald-400" />;
      case "INTERVIEW_CANCELLED":
        return <CalendarX className="size-4 text-rose-400" />;
      case "NEW_APPLICANT":
        return <UserPlus className="size-4 text-purple-400" />;
      case "COMPANY_VERIFIED":
        return <CheckCircle2 className="size-4 text-amber-400" />;
      default:
        return <Bell className="size-4 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) refresh();
        }}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus:outline-hidden focus:ring-1 focus:ring-primary/40"
        aria-label="Notifications"
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-secondary/20">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Bell className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs font-medium text-foreground">All caught up!</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  No new notifications right now.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left hover:bg-secondary/40 ${
                    !n.read ? "bg-primary/5 font-medium" : "opacity-80"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 rounded-lg p-2 bg-secondary/80 border border-border/50">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`text-xs font-semibold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground/70 shrink-0">
                        {formatTimestamp(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    {n.linkUrl && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-primary/90 font-medium">
                        <span>View details</span>
                        <ExternalLink className="size-3" />
                      </div>
                    )}
                  </div>
                  {!n.read && (
                    <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
