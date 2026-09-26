"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "warning" | "info";
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Analysis Ready",
      message: "SaaS Agreement analysis has finished with 3 risk alerts.",
      time: "10m ago",
      read: false,
      type: "warning",
    },
    {
      id: "2",
      title: "Shared Document",
      message: "Alex Vance invited you to collaborate on NDA_2026.pdf.",
      time: "1h ago",
      read: false,
      type: "info",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-violet-600 hover:text-violet-500 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto divide-y">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 flex gap-3 text-left transition-colors hover:bg-muted/50 ${
                  !n.read ? "bg-violet-50/50 dark:bg-violet-950/20" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {n.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : n.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-violet-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold leading-none">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/80">{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
