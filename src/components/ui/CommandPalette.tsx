"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  FileText,
  Search,
  Upload,
  GitCompare,
  Calendar,
  Settings,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-input bg-background/60 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted"
        aria-label="Search or run commands"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search actions or docs...</span>
        <span className="inline sm:hidden">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-2xl sm:max-w-xl">
          <Command className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Type a command or search..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="Navigation">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard/vault"))}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent"
                >
                  <FileText className="h-4 w-4 text-violet-500" />
                  <span>Document Vault</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard/upload"))}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent"
                >
                  <Upload className="h-4 w-4 text-indigo-500" />
                  <span>New Ingestion / Upload</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard/compare"))}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent"
                >
                  <GitCompare className="h-4 w-4 text-emerald-500" />
                  <span>Contract Diff & Comparison</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard/timeline"))}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent"
                >
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>Obligation Timeline</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Account">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard/settings"))}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-accent"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Settings & MFA</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
