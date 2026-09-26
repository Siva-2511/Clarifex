"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ParticleCanvas } from "@/components/landing/ParticleCanvas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scale,
  ShieldAlert,
  Dna,
  Calendar,
  Layers,
  Camera,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Baby,
  GraduationCap,
  Gavel,
} from "lucide-react";

export default function MarketingPage() {
  const [activeEli, setActiveEli] = useState<"eli5" | "eli10" | "expert">("eli10");

  const eliExcerpts = {
    eli5: {
      title: "ELI-5 (Kid Metaphor)",
      text: "Imagine you lend your favorite toy truck to a friend at recess. This paper says if the wheel breaks while they play with it, you have to buy them a whole new box of toys, and you can never ask for your truck back! Always ask your grown-up before saying yes to this deal.",
      badge: "Simple Metaphor",
    },
    eli10: {
      title: "ELI-10 (Plain English)",
      text: "This contract contains a one-sided indemnification rule. That means if the software company gets sued by someone else because of how you used their app, you are responsible for paying all their legal bills and damages — with zero limit on how much money it could cost you.",
      badge: "Everyday English",
    },
    expert: {
      title: "Expert (Legal Memorandum)",
      text: "Section 8.2 imposes strict, unilateral indemnification obligations without carve-outs for gross negligence, willful misconduct, or independent third-party acts. Given Section 12's one-month aggregate liability limitation, this structure creates severe unconscionability exposure under UCC § 2-302.",
      badge: "Doctrine & Case Law",
    },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <ParticleCanvas />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>GenAI Legal Assistant • IBM Hack2Skill Hackathon</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
          >
            Clarity out of{" "}
            <span className="bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              legal complexity.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground"
          >
            Understand contracts before you sign. Instantly detect hidden liability traps, translate clauses to your comprehension level, and map critical deadlines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" variant="gradient" asChild className="h-12 px-8 text-base">
              <Link href="/dashboard/upload" className="gap-2">
                Analyze Document Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link href="/dashboard">View Live Demo</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ELI Interactive Demonstration Strip */}
      <section className="relative z-10 py-16 px-4 bg-muted/30 border-y">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              One Contract. Three Comprehension Levels.
            </h2>
            <p className="text-sm text-muted-foreground">
              Clarifex adapts its analysis to who is reading: everyday users, founders, or seasoned corporate lawyers.
            </p>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              variant={activeEli === "eli5" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveEli("eli5")}
              className="gap-2"
            >
              <Baby className="h-4 w-4" />
              ELI-5
            </Button>
            <Button
              variant={activeEli === "eli10" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveEli("eli10")}
              className="gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              ELI-10
            </Button>
            <Button
              variant={activeEli === "expert" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveEli("expert")}
              className="gap-2"
            >
              <Gavel className="h-4 w-4" />
              Expert Counsel
            </Button>
          </div>

          <Card className="glass-panel overflow-hidden border-violet-500/20 shadow-xl">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
                  {eliExcerpts[activeEli].title}
                </span>
                <Badge variant="violet">{eliExcerpts[activeEli].badge}</Badge>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
                {eliExcerpts[activeEli].text}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Novel Differentiator Features Grid */}
      <section className="relative z-10 py-24 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="violet">Novel Feature Set</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built Beyond Basic Summarization
          </h2>
          <p className="text-muted-foreground">
            While generic tools stop at plain summaries, Clarifex provides an intelligent legal analysis suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-panel hover:border-violet-500/40 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Risk Heat-Map</h3>
              <p className="text-sm text-muted-foreground">
                Animated color-coded danger scoring per clause (green/amber/red) highlighting uncapped indemnities, one-sided caps, and hidden liabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:border-violet-500/40 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                <Dna className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Clause DNA Fingerprint</h3>
              <p className="text-sm text-muted-foreground">
                Detects identical boilerplate across multiple agreements using structural SHA-256 hashing and Jaccard similarity algorithms.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:border-violet-500/40 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Obligation Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Extracts renewal windows, notice deadlines, and payment schedules into a visual Gantt chart with one-click Google Calendar sync.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:border-violet-500/40 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Screenshot OCR</h3>
              <p className="text-sm text-muted-foreground">
                Copy-protected legal pages that block text selection can be captured and extracted directly with Google Cloud Vision OCR.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:border-violet-500/40 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Multi-Document Matrix</h3>
              <p className="text-sm text-muted-foreground">
                Compare 3 to 5 contracts simultaneously in a comprehensive pivot-table view across standard liability and IP dimensions.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel hover:border-violet-500/40 transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <FileSearch className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">6 Ingestion Methods</h3>
              <p className="text-sm text-muted-foreground">
                Upload PDF/DOCX, paste raw text, fetch live URLs with SSRF protection, import from Google Drive, screenshot OCR, or queue multi-file batches.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3 Use-Case Scenario Cards */}
      <section className="relative z-10 py-20 px-4 bg-muted/20 border-t">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Tailored to Real-World Scenarios</h2>
            <p className="text-sm text-muted-foreground">
              How Clarifex safeguards everyday individuals and businesses alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel p-6 space-y-4">
              <Badge variant="outline">Consultants & Freelancers</Badge>
              <h3 className="font-bold text-lg">Client MSA & IP Ownership</h3>
              <p className="text-sm text-muted-foreground">
                Catch aggressive IP assignment clauses that claim ownership over your background tools or pre-existing code libraries before you sign.
              </p>
            </Card>

            <Card className="glass-panel p-6 space-y-4">
              <Badge variant="outline">Startup Founders</Badge>
              <h3 className="font-bold text-lg">B2B SaaS Vendor Risk</h3>
              <p className="text-sm text-muted-foreground">
                Detect 1-month liability caps, unilateral modification rules, and annual auto-renewal lock-ins to negotiate balanced commercial agreements.
              </p>
            </Card>

            <Card className="glass-panel p-6 space-y-4">
              <Badge variant="outline">Tenants & Consumers</Badge>
              <h3 className="font-bold text-lg">Leases & Terms of Service</h3>
              <p className="text-sm text-muted-foreground">
                Break down 40-page rental leases or terms of service into simple ELI-5 rules with red flags on illegal security deposit clauses.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop Signing in the Dark.
          </h2>
          <p className="text-muted-foreground">
            Experience clarity out of legal complexity. Upload your contract and receive instant, actionable intelligence.
          </p>
          <Button size="lg" variant="gradient" asChild className="h-12 px-8 text-base">
            <Link href="/dashboard/upload">Start Free Analysis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
