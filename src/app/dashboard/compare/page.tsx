"use client";

import React, { useState } from "react";
import { GitCompare, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";
import { DiffViewer } from "@/components/analysis/DiffViewer";

export default function ComparePage() {
  const { data: documentsData, isLoading: docsLoading } = trpc.document.list.useQuery(undefined);
  const documents = documentsData?.items || [];

  const [docAId, setDocAId] = useState<string>("");
  const [docBId, setDocBId] = useState<string>("");
  const [diffResult, setDiffResult] = useState<any>(null);

  const diffMutation = trpc.analysis.diff.useMutation({
    onSuccess: (data) => {
      setDiffResult(data);
    },
  });

  const handleRunDiff = () => {
    if (!docAId || !docBId || docAId === docBId) return;
    diffMutation.mutate({ docAId, docBId });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Contract Diff & Redline</h1>
          <p className="text-sm text-muted-foreground">
            Perform semantic and word-level diff between two contract versions with legal impact analysis.
          </p>
        </div>
      </div>

      {/* Selector Card */}
      <Card className="glass-panel p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Original Document (Version A)</label>
            <Select value={docAId} onValueChange={setDocAId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Document A..." />
              </SelectTrigger>
              <SelectContent>
                {documents.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <GitCompare className="h-4 w-4" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Revised Document (Version B)</label>
            <Select value={docBId} onValueChange={setDocBId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Document B..." />
              </SelectTrigger>
              <SelectContent>
                {documents.map((d) => (
                  <SelectItem key={d.id} value={d.id} disabled={d.id === docAId}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleRunDiff}
            disabled={!docAId || !docBId || docAId === docBId || diffMutation.isLoading}
            variant="gradient"
            className="gap-2"
          >
            {diffMutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Redline...
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4" />
                Run Redline Comparison
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results View */}
      {diffResult && (
        <DiffViewer
          docA={diffResult.docA}
          docB={diffResult.docB}
          changes={diffResult.changes}
        />
      )}
    </div>
  );
}
