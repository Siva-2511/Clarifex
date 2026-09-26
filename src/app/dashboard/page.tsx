"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldAlert,
  GitCompare,
  Calendar,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

export default function DashboardOverviewPage() {
  const { data: documentsData, isLoading: docsLoading } = (trpc.document.list.useQuery as any)(undefined);
  const { data: analyses, isLoading: analysesLoading } = (trpc.analysis.list.useQuery as any)(undefined);

  const documents = documentsData?.items || [];
  const totalDocs = documents.length;
  const totalAnalyses = analyses?.length || 0;

  // Compute total high risks across analyses
  let highRiskCount = 0;
  let totalClausesFlagged = 0;
  const analysisList = (analyses || []) as any[];
  analysisList.forEach((a) => {
    const json: any = a.resultJson;
    if (json?.clauses) {
      totalClausesFlagged += json.clauses.length;
      highRiskCount += json.clauses.filter((c: any) => c.riskLevel === "high").length;
    }
  });

  const stats = [
    {
      title: "Documents in Vault",
      value: totalDocs,
      change: "+100% encrypted in R2",
      icon: FileText,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Analyses Completed",
      value: totalAnalyses,
      change: "OpenRouter 6-model fallback",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "High Risks Flagged",
      value: highRiskCount,
      change: "Severe indemnities / caps",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Clauses Extracted",
      value: totalClausesFlagged,
      change: "Fingerprinted & scored",
      icon: Layers,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Legal AI Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your contract repository, inspect risk heat-maps, and track critical obligations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/compare" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Compare
            </Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link href="/dashboard/upload" className="gap-2">
              <UploadCloud className="h-4 w-4" />
              New Ingestion
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="glass-panel">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Launch Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="glass-panel hover:border-violet-500/40 transition-all p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">New Ingestion</h3>
            <p className="text-xs text-muted-foreground">
              Upload PDF/DOCX, paste clauses, fetch public URLs, or import from Google Drive.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full justify-between">
            <Link href="/dashboard/upload">
              Launch Uploader
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </Card>

        <Card className="glass-panel hover:border-violet-500/40 transition-all p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <GitCompare className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">Contract Redline & Diff</h3>
            <p className="text-xs text-muted-foreground">
              Compare two versions of an agreement with semantic and textual change significance.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full justify-between">
            <Link href="/dashboard/compare">
              Compare Versions
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </Card>

        <Card className="glass-panel hover:border-violet-500/40 transition-all p-6 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base">Obligation Calendar</h3>
            <p className="text-xs text-muted-foreground">
              View deadlines, auto-renewals, and notice windows. One-click sync to Google Calendar.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full justify-between">
            <Link href="/dashboard/timeline">
              View Milestones
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </Card>
      </div>

      {/* Recent Analyses and Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Analyses */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Recent Analyses</CardTitle>
              <CardDescription>Latest GenAI contract assessments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/vault" className="text-xs">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysesLoading ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Loading analyses...</p>
            ) : !analyses || analyses.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs text-muted-foreground">No analyses performed yet.</p>
                <Button size="sm" variant="gradient" asChild>
                  <Link href="/dashboard/upload">Start First Analysis</Link>
                </Button>
              </div>
            ) : (
              analysisList.slice(0, 4).map((a: any) => {
                const score = a.riskScore ?? 0;
                return (
                  <Link
                    key={a.id}
                    href={`/dashboard/analyse/${a.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border bg-card/60 hover:bg-muted/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        Analysis #{a.id.slice(-6)}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.createdAt).toLocaleDateString()} • {a.comprehensionLevel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={score >= 7 ? "danger" : score >= 4 ? "warning" : "success"}
                      >
                        Risk {score}/10
                      </Badge>
                      <Badge variant="outline">{a.status}</Badge>
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Vault Overview */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Document Vault</CardTitle>
              <CardDescription>Encrypted contract repository in Cloudflare R2</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/vault" className="text-xs">
                View Vault
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {docsLoading ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Loading documents...</p>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs text-muted-foreground">Your vault is empty.</p>
                <Button size="sm" variant="gradient" asChild>
                  <Link href="/dashboard/upload">Upload Document</Link>
                </Button>
              </div>
            ) : (
              documents.slice(0, 4).map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-card/60"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-violet-500" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold max-w-[200px] truncate">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{doc.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/upload?docId=${doc.id}`} className="text-xs">
                      Analyze
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
