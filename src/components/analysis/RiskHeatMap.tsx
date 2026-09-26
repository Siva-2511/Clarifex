"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Dna } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface ClauseRiskItem {
  id: string;
  title: string;
  type: string;
  riskLevel: "low" | "medium" | "high";
  text: string;
  reason: string;
  pageRef?: number;
  fingerprint?: string;
}

export interface RiskHeatMapProps {
  clauses: ClauseRiskItem[];
  riskScore: number;
}

export function RiskHeatMap({ clauses = [], riskScore = 5.0 }: RiskHeatMapProps) {
  const [expandedId, setExpandedId] = useState<string | null>(clauses[0]?.id || null);

  const highRisks = clauses.filter((c) => c.riskLevel === "high").length;
  const medRisks = clauses.filter((c) => c.riskLevel === "medium").length;
  const lowRisks = clauses.filter((c) => c.riskLevel === "low").length;

  const chartData = [
    { name: "High Danger", value: highRisks, color: "#ef4444" },
    { name: "Moderate Risk", value: medRisks, color: "#f59e0b" },
    { name: "Low / Standard", value: lowRisks, color: "#10b981" },
  ].filter((d) => d.value > 0);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Risk Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel p-5 flex flex-col justify-center items-center text-center">
          <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
            Overall Risk Score
          </p>
          <div className="my-2 flex items-baseline gap-1">
            <span
              className={`text-4xl font-extrabold ${
                riskScore >= 7
                  ? "text-red-500"
                  : riskScore >= 4
                    ? "text-amber-500"
                    : "text-emerald-500"
              }`}
            >
              {riskScore}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">/ 10</span>
          </div>
          <Badge
            variant={riskScore >= 7 ? "danger" : riskScore >= 4 ? "warning" : "success"}
          >
            {riskScore >= 7 ? "Critical Risk Exposure" : riskScore >= 4 ? "Moderate Risk" : "Standard Risk Profile"}
          </Badge>
        </Card>

        <Card className="glass-panel p-5 flex items-center justify-between col-span-2">
          <div className="space-y-2">
            <h4 className="font-bold text-sm">Risk Breakdown by Clause</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-red-500">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                {highRisks} High Risk
              </span>
              <span className="flex items-center gap-1.5 font-medium text-amber-500">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                {medRisks} Moderate Risk
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {lowRisks} Standard / Safe
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Total of {clauses.length} distinct clauses parsed and evaluated against market norms.
            </p>
          </div>

          <div className="h-24 w-28 shrink-0">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={22}
                    outerRadius={38}
                    paddingAngle={3}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Clause Heat-Map List */}
      <div className="space-y-3">
        <h3 className="font-bold text-base">Evaluated Clauses & Danger Explanations</h3>

        <div className="space-y-3">
          {clauses.map((clause, idx) => {
            const isExpanded = expandedId === clause.id;
            const isHigh = clause.riskLevel === "high";
            const isMed = clause.riskLevel === "medium";

            return (
              <motion.div
                key={clause.id || idx}
                layout
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isHigh
                    ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
                    : isMed
                      ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                      : "border-border/80 bg-card hover:border-muted-foreground/30"
                }`}
              >
                <button
                  onClick={() => toggleExpand(clause.id)}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {isHigh ? (
                      <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                    ) : isMed ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-semibold text-sm leading-snug">{clause.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{clause.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={isHigh ? "danger" : isMed ? "warning" : "success"}>
                      {clause.riskLevel.toUpperCase()}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t px-4 py-3 bg-muted/20 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Exact Contract Text (Page {clause.pageRef || 1})
                        </span>
                        <blockquote className="mt-1 border-l-2 border-primary/50 pl-3 italic text-xs text-foreground/90 font-serif">
                          &ldquo;{clause.text}&rdquo;
                        </blockquote>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Legal Danger Analysis & Exposure
                        </span>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {clause.reason}
                        </p>
                      </div>

                      {clause.fingerprint && (
                        <div className="flex items-center gap-2 pt-1 border-t border-muted/50">
                          <Dna className="h-3.5 w-3.5 text-violet-500" />
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Clause DNA: {clause.fingerprint}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
