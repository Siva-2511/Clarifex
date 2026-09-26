"use client";

import React, { useState } from "react";
import { Sparkles, Bot, ShieldCheck, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ELIModeToggle } from "./ELIModeToggle";
import { TranslateToggle } from "./TranslateToggle";
import { JurisdictionSelector } from "./JurisdictionSelector";

export interface AnalysisSummaryProps {
  analysisId: string;
  summary: string;
  comprehensionLevel: "eli-5" | "eli-10" | "expert";
  comprehensionContent?: string;
  modelUsed?: string;
  jurisdiction?: string;
  documentNames?: string[];
  createdAt?: string | Date;
}

export function AnalysisSummary({
  analysisId,
  summary,
  comprehensionLevel: initialLevel,
  comprehensionContent,
  modelUsed = "google/gemini-flash-1.5",
  jurisdiction = "US-California",
  documentNames = [],
  createdAt,
}: AnalysisSummaryProps) {
  const [level, setLevel] = useState<"eli-5" | "eli-10" | "expert">(initialLevel);
  const [displayText, setDisplayText] = useState(comprehensionContent || summary);

  return (
    <Card className="glass-panel border-border/80 shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <CardTitle className="text-base font-bold">Executive AI Summary</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Target: {documentNames.join(", ") || "Contract Document"}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <JurisdictionSelector currentJurisdiction={jurisdiction} />
          <TranslateToggle textToTranslate={displayText} onTranslated={setDisplayText} />
          <ELIModeToggle
            analysisId={analysisId}
            currentLevel={level}
            onLevelChanged={(newLevel) => setLevel(newLevel)}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pb-2 border-b border-border/40">
          <Badge variant="outline" className="text-[10px] gap-1">
            <Bot className="h-3 w-3 text-violet-500" />
            {modelUsed}
          </Badge>
          <Badge variant="violet" className="text-[10px] uppercase font-mono">
            Mode: {level}
          </Badge>
          {createdAt && (
            <span className="flex items-center gap-1 text-[11px] ml-auto">
              <Clock className="h-3 w-3" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground/90">
          {displayText}
        </div>
      </CardContent>
    </Card>
  );
}
