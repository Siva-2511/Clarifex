"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { ObligationTimeline } from "@/components/analysis/ObligationTimeline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";

export default function TimelinePage() {
  const { data: rawAnalyses, isLoading } = (trpc.analysis.list.useQuery as any)(undefined);
  const analyses = (rawAnalyses as any[]) || [];
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>("");

  const activeId = selectedAnalysisId || analyses?.[0]?.id;

  const { data: timelineData, isLoading: timelineLoading } = (trpc.analysis.extractTimeline.useQuery as any)(
    { analysisId: activeId || "" },
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Obligation Timeline</h1>
          <p className="text-sm text-muted-foreground">
            Calendar view of extracted notice periods, contract expiration dates, and milestones.
          </p>
        </div>

        {analyses && analyses.length > 0 && (
          <div className="w-full sm:w-64">
            <Select value={activeId} onValueChange={setSelectedAnalysisId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Analysis..." />
              </SelectTrigger>
              <SelectContent>
                {analyses.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>
                    Analysis #{a.id.slice(-6)} ({new Date(a.createdAt).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {timelineLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          <p className="text-xs text-muted-foreground">Extracting obligations & dates...</p>
        </div>
      ) : (
        <Card className="glass-panel p-6">
          <ObligationTimeline
            obligations={
              (timelineData as any)?.obligations ||
              (timelineData as any)?.timeline ||
              []
            }
          />
        </Card>
      )}
    </div>
  );
}
