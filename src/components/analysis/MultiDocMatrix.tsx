"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Layers } from "lucide-react";

export interface MatrixCell {
  docId: string;
  docName: string;
  summary: string;
  risk: "low" | "medium" | "high" | "missing";
}

export interface MatrixRow {
  clauseType: string;
  cells: MatrixCell[];
}

export interface MatrixCategory {
  name: string;
  rows: MatrixRow[];
}

export interface MultiDocMatrixProps {
  documents: { id: string; name: string }[];
  matrix: {
    categories: MatrixCategory[];
  };
}

export function MultiDocMatrix({ documents = [], matrix }: MultiDocMatrixProps) {
  const categories = matrix?.categories || [];

  return (
    <Card className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-56 font-bold text-foreground">Clause Dimension</TableHead>
              {documents.map((doc) => (
                <TableHead key={doc.id} className="min-w-[220px] font-bold text-foreground">
                  <div className="flex items-center gap-1.5 truncate" title={doc.name}>
                    <Layers className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat, catIdx) => (
              <React.Fragment key={catIdx}>
                <TableRow className="bg-muted/30">
                  <TableCell
                    colSpan={documents.length + 1}
                    className="py-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400"
                  >
                    {cat.name}
                  </TableCell>
                </TableRow>

                {cat.rows.map((row, rowIdx) => (
                  <TableRow key={rowIdx} className="hover:bg-muted/20">
                    <TableCell className="font-semibold text-xs text-foreground align-top">
                      {row.clauseType}
                    </TableCell>

                    {row.cells.map((cell, cellIdx) => {
                      const isHigh = cell.risk === "high";
                      const isMed = cell.risk === "medium";
                      const isMissing = cell.risk === "missing";

                      return (
                        <TableCell key={cellIdx} className="align-top space-y-1.5 p-3">
                          <Badge
                            variant={
                              isHigh
                                ? "danger"
                                : isMed
                                  ? "warning"
                                  : isMissing
                                    ? "outline"
                                    : "success"
                            }
                            className="text-[10px]"
                          >
                            {cell.risk.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {cell.summary}
                          </p>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
