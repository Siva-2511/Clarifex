"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderLock,
  UploadCloud,
  GitCompare,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Document Vault", href: "/dashboard/vault", icon: FolderLock },
  { label: "New Ingestion", href: "/dashboard/upload", icon: UploadCloud },
  { label: "Contract Diff", href: "/dashboard/compare", icon: GitCompare },
  { label: "Multi-Doc Matrix", href: "/dashboard/compare/multi", icon: Layers },
  { label: "Obligation Timeline", href: "/dashboard/timeline", icon: Calendar },
  { label: "Settings & MFA", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col border-r bg-card/60 backdrop-blur-md"
    >
      <div className="flex h-14 items-center justify-between px-4 border-b">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Navigation
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-violet-600"
                />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
