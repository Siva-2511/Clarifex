"use client";

import React from "react";
import { Dna, Copy, Check, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface FingerprintClause {
  id: string;
  title: string;
  type: string;
  fingerprint: string;
  text: string;
  isBoilerplate?: boolean;
}

export interface ClauseFingerprintProps {
  clauses: FingerprintClause[];
}

export function ClauseFingerprint({ clauses = [] }: ClauseFingerprintProps) {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-base">Clause DNA Fingerprint Analysis</h3>
        <p className="text-xs text-muted-foreground">
          Structural cryptographic hashing (SHA-256) of normalized clauses to identify standard boilerplate and detect cross-contract duplication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clauses.map((clause, idx) => (
          <Card key={clause.id || idx} className="glass-panel">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dna className="h-4 w-4 text-violet-500" />
                  <span className="font-semibold text-xs text-foreground">{clause.title}</span>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {clause.type}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 italic font-serif">
                &ldquo;{clause.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                  <span className="text-[10px] uppercase">DNA:</span>
                  <span className="text-foreground font-bold">{clause.fingerprint || "c4a8f921"}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyHash(clause.fingerprint)}
                  className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                >
                  {copiedHash === clause.fingerprint ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedHash === clause.fingerprint ? "Copied" : "Copy Hash"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
