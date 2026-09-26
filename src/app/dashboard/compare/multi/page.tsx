"use client";

import React, { useState } from "react";
import { Layers, Loader2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { MultiDocMatrix } from "@/components/analysis/MultiDocMatrix";

export default function MultiComparePage() {
  const { data: documentsData } = trpc.document.list.useQuery(undefined);
  const documents = documentsData?.items || [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matrixResult, setMatrixResult] = useState<any>(null);

  const multiCompareMutation = trpc.analysis.multiCompare.useMutation({
    onSuccess: (data) => {
      setMatrixResult(data);
    },
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 5) {
        alert("Maximum of 5 documents allowed for matrix comparison");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRunMatrix = () => {
    if (selectedIds.length < 3) return;
    multiCompareMutation.mutate({ documentIds: selectedIds });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Multi-Document Comparison Matrix</h1>
        <p className="text-sm text-muted-foreground">
          Compare 3 to 5 contracts simultaneously in a structured pivot table across standard liability and legal dimensions.
        </p>
      </div>

      <Card className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Select 3 to 5 Contracts ({selectedIds.length} selected)
          </span>
          <Button
            onClick={handleRunMatrix}
            disabled={selectedIds.length < 3 || multiCompareMutation.isLoading}
            variant="gradient"
            size="sm"
            className="gap-2 text-xs"
          >
            {multiCompareMutation.isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating Matrix...
              </>
            ) : (
              <>
                <Layers className="h-3.5 w-3.5" />
                Build Comparison Matrix
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {documents.map((doc) => {
            const isSelected = selectedIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleSelect(doc.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected ? "border-violet-500 bg-violet-500/10 font-semibold" : "border-border/80 bg-card hover:bg-muted/40"
                }`}
              >
                <div className="space-y-0.5 truncate pr-2">
                  <p className="text-xs truncate">{doc.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{doc.type}</p>
                </div>
                {isSelected ? (
                  <CheckSquare className="h-4 w-4 text-violet-600 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {matrixResult && (
        <MultiDocMatrix
          documents={matrixResult.documents}
          matrix={matrixResult.matrix}
        />
      )}
    </div>
  );
}
