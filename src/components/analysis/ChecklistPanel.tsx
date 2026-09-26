"use client";

import React, { useState } from "react";
import { CheckSquare, Square, AlertCircle, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface ChecklistItem {
  id: string;
  category: "Before Signing" | "Key Obligations" | "Questions for Lawyer" | string;
  label: string;
  checked?: boolean;
  importance?: "critical" | "high" | "medium";
  explanation?: string;
}

export interface ChecklistPanelProps {
  items: ChecklistItem[];
}

export function ChecklistPanel({ items = [] }: ChecklistPanelProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(items);
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
  };

  const copyAsMarkdown = () => {
    const md = checklist
      .map(
        (c) =>
          `- [${c.checked ? "x" : " "}] [${c.importance?.toUpperCase() || "TODO"}] ${c.label} (${c.category})\n  ${c.explanation || ""}`,
      )
      .join("\n\n");
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ["Before Signing", "Key Obligations", "Questions for Lawyer"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">Execution Checklist & Diligence</h3>
          <p className="text-xs text-muted-foreground">
            Essential verification steps, redline items, and questions for counsel before contract execution.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copyAsMarkdown} className="gap-1.5 text-xs">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy Markdown"}</span>
        </Button>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = checklist.filter((item) => item.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-600" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {cat} ({catItems.length})
                </h4>
              </div>

              <div className="space-y-2.5">
                {catItems.map((item) => {
                  const isChecked = !!item.checked;
                  return (
                    <Card
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`cursor-pointer transition-all duration-150 border ${
                        isChecked
                          ? "bg-muted/40 border-muted opacity-60"
                          : "glass-panel hover:border-violet-500/30"
                      }`}
                    >
                      <CardContent className="p-4 flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-violet-600 hover:text-violet-500"
                        >
                          {isChecked ? (
                            <CheckSquare className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Square className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-sm font-medium leading-snug ${
                                isChecked ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.importance && (
                              <Badge
                                variant={
                                  item.importance === "critical"
                                    ? "danger"
                                    : item.importance === "high"
                                      ? "warning"
                                      : "outline"
                                }
                                className="text-[10px]"
                              >
                                {item.importance.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          {item.explanation && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {item.explanation}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
