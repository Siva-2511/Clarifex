"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Baby, GraduationCap, Gavel, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export interface ELIModeToggleProps {
  analysisId: string;
  currentLevel: "eli-5" | "eli-10" | "expert";
  onLevelChanged?: (level: "eli-5" | "eli-10" | "expert") => void;
}

export function ELIModeToggle({ analysisId, currentLevel, onLevelChanged }: ELIModeToggleProps) {
  const setLevelMutation = (trpc.analysis.setComprehensionLevel.useMutation as any)({
    onSuccess: (data: any) => {
      onLevelChanged?.(data.comprehensionLevel as any);
    },
  });

  const isLoading = Boolean(setLevelMutation.isLoading || setLevelMutation.isPending);

  const handleSelect = (level: "eli-5" | "eli-10" | "expert") => {
    if (level === currentLevel) return;
    setLevelMutation.mutate({ id: analysisId, level });
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border">
      <Button
        variant={currentLevel === "eli-5" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleSelect("eli-5")}
        disabled={isLoading}
        className="h-8 gap-1.5 text-xs rounded-lg"
      >
        <Baby className="h-3.5 w-3.5" />
        <span>ELI-5</span>
      </Button>

      <Button
        variant={currentLevel === "eli-10" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleSelect("eli-10")}
        disabled={isLoading}
        className="h-8 gap-1.5 text-xs rounded-lg"
      >
        <GraduationCap className="h-3.5 w-3.5" />
        <span>ELI-10</span>
      </Button>

      <Button
        variant={currentLevel === "expert" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleSelect("expert")}
        disabled={isLoading}
        className="h-8 gap-1.5 text-xs rounded-lg"
      >
        <Gavel className="h-3.5 w-3.5" />
        <span>Expert</span>
      </Button>

      {isLoading && (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-1" />
      )}
    </div>
  );
}
