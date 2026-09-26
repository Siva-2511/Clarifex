"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc/client";
import { AnalysisSummary } from "@/components/analysis/AnalysisSummary";
import { RiskHeatMap } from "@/components/analysis/RiskHeatMap";
import { ChatPanel } from "@/components/analysis/ChatPanel";
import { ChecklistPanel } from "@/components/analysis/ChecklistPanel";
import { ObligationTimeline } from "@/components/analysis/ObligationTimeline";
import { ClauseFingerprint } from "@/components/analysis/ClauseFingerprint";
import { ExportMenu } from "@/components/analysis/ExportMenu";
import { PresenceAvatars } from "@/components/collaboration/PresenceAvatars";
import { ShareAnalysisModal } from "@/components/collaboration/ShareAnalysisModal";
import {
  FileText,
  ShieldAlert,
  MessageSquare,
  CheckSquare,
  Calendar,
  Dna,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function AnalysisWorkspacePage() {
  const params = useParams();
  const analysisId = params.analysisId as string;
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState("summary");

  const { data: analysis, isLoading, error } = (trpc.analysis.getById.useQuery as any)({
    id: analysisId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold">Running GenAI Legal Analysis...</p>
          <p className="text-xs text-muted-foreground">
            Evaluating clauses, generating risk heat-map, and calculating fingerprints.
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Analysis Not Found</h2>
          <p className="text-xs text-muted-foreground">
            {error?.message || "Could not retrieve the requested analysis session."}
          </p>
        </div>
      </div>
    );
  }

  const result: any = analysis.resultJson || {};
  const docNames = analysis.documents?.map((d: any) => d.name) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Bar with Title, Presence, Share & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Contract Analysis Workspace</h1>
            <span className="text-xs text-muted-foreground font-mono">#{analysisId.slice(-6)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Target Documents: {docNames.join(", ") || "Contract Document"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PresenceAvatars
            analysisId={analysisId}
            currentUser={
              session?.user
                ? {
                    id: (session.user as any).id || "anon",
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                  }
                : undefined
            }
          />
          <ShareAnalysisModal analysisId={analysisId} />
          <ExportMenu analysis={analysis} documentNames={docNames} />
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-1.5 gap-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="summary" className="flex items-center gap-1.5 py-2 text-xs">
            <FileText className="h-3.5 w-3.5" />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-1.5 py-2 text-xs">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Risk Heat-Map</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1.5 py-2 text-xs">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Q&A Chat</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-1.5 py-2 text-xs">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Checklist</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1.5 py-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="fingerprint" className="flex items-center gap-1.5 py-2 text-xs">
            <Dna className="h-3.5 w-3.5" />
            <span>Clause DNA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <AnalysisSummary
            analysisId={analysisId}
            summary={result.summary || "Analysis completed."}
            comprehensionLevel={analysis.comprehensionLevel as any}
            comprehensionContent={result.comprehensionLevelContent}
            modelUsed={analysis.modelUsed}
            documentNames={docNames}
            createdAt={analysis.createdAt}
          />
        </TabsContent>

        <TabsContent value="risk">
          <RiskHeatMap
            clauses={result.clauses || []}
            riskScore={analysis.riskScore || result.riskScore || 5.0}
          />
        </TabsContent>

        <TabsContent value="chat">
          <ChatPanel analysisId={analysisId} initialMessages={analysis.messages as any} />
        </TabsContent>

        <TabsContent value="checklist">
          <ChecklistPanel items={result.checklist || []} />
        </TabsContent>

        <TabsContent value="timeline">
          <ObligationTimeline obligations={result.obligations || []} />
        </TabsContent>

        <TabsContent value="fingerprint">
          <ClauseFingerprint clauses={result.clauses || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
