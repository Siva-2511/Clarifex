"use client";

import React, { useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Columns, AlignJustify } from "lucide-react";

export interface DiffChangeItem {
  type: "added" | "removed" | "modified";
  clauseTitle: string;
  significance: "critical" | "moderate" | "minor";
  explanation: string;
  oldText?: string;
  newText?: string;
}

export interface DiffViewerProps {
  docA: { id: string; name: string; text: string };
  docB: { id: string; name: string; text: string };
  changes?: DiffChangeItem[];
}

export function DiffViewer({ docA, docB, changes = [] }: DiffViewerProps) {
  const { theme } = useTheme();
  const [splitView, setSplitView] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header with Significance summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="font-bold text-base">Redline & Semantic Comparison</h3>
          <p className="text-xs text-muted-foreground">
            Comparing <span className="font-medium text-foreground">{docA.name}</span> (Original) vs{" "}
            <span className="font-medium text-foreground">{docB.name}</span> (Revised)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSplitView(!splitView)}
            className="h-8 gap-1.5 text-xs"
          >
            {splitView ? <AlignJustify className="h-3.5 w-3.5" /> : <Columns className="h-3.5 w-3.5" />}
            <span>{splitView ? "Unified View" : "Split View"}</span>
          </Button>
        </div>
      </div>

      {/* Semantic Clause Change Breakdown */}
      {changes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Clause Changes & Legal Impact ({changes.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {changes.map((change, idx) => (
              <Card
                key={idx}
                className={`glass-panel border-l-4 ${
                  change.significance === "critical"
                    ? "border-l-red-500"
                    : change.significance === "moderate"
                      ? "border-l-amber-500"
                      : "border-l-blue-500"
                }`}
              >
                <CardContent className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">
                      {change.clauseTitle || "Clause Amendment"}
                    </span>
                    <Badge
                      variant={
                        change.significance === "critical"
                          ? "danger"
                          : change.significance === "moderate"
                            ? "warning"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {change.significance.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {change.explanation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Raw Text Diff Viewer */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm text-xs font-mono">
        <ReactDiffViewer
          oldValue={docA.text}
          newValue={docB.text}
          splitView={splitView}
          useDarkTheme={theme === "dark"}
          leftTitle={docA.name}
          rightTitle={docB.name}
          compareMethod={DiffMethod.WORDS}
          styles={{
            variables: {
              dark: {
                diffViewerBackground: "#0b0f19",
                addedBackground: "rgba(16, 185, 129, 0.15)",
                addedColor: "#34d399",
                removedBackground: "rgba(239, 68, 68, 0.15)",
                removedColor: "#f87171",
              },
              light: {
                diffViewerBackground: "#ffffff",
                addedBackground: "#ecfdf5",
                addedColor: "#059669",
                removedBackground: "#fef2f2",
                removedColor: "#dc2626",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
