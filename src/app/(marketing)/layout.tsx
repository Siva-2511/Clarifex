import React from "react";
import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background selection:bg-violet-500/20 selection:text-violet-400">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/70 px-6 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-xl text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25">
            <Scale className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight">CLARIFEX</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/dashboard" className="gap-2">
              Launch App
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card/40 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-white">
              <Scale className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-foreground">Clarifex</span>
            <span>— Clarity out of legal complexity.</span>
          </div>
          <div className="flex gap-6 text-xs">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/dashboard/upload" className="hover:text-foreground transition-colors">Ingestion</Link>
          </div>
          <p className="text-xs text-center md:text-right">
            Disclaimer: Clarifex provides automated AI analysis for informational purposes only. It is not a substitute for formal legal counsel.
          </p>
        </div>
      </footer>
    </div>
  );
}
