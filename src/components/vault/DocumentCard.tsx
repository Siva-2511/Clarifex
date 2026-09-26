"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Trash2,
  Download,
  Sparkles,
  GitCompare,
  MoreVertical,
  Globe,
  Camera,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc/client";

export interface DocumentCardProps {
  document: {
    id: string;
    name: string;
    type: string;
    sizeBytes: number;
    jurisdiction?: string | null;
    createdAt: string | Date;
  };
  onDelete?: () => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const deleteDoc = trpc.document.delete.useMutation({
    onSuccess: () => {
      onDelete?.();
    },
  });

  const getIcon = () => {
    switch (document.type) {
      case "url":
        return <Globe className="h-5 w-5 text-blue-500" />;
      case "screenshot":
        return <Camera className="h-5 w-5 text-indigo-500" />;
      case "docx":
        return <FileText className="h-5 w-5 text-emerald-500" />;
      default:
        return <FileText className="h-5 w-5 text-violet-500" />;
    }
  };

  return (
    <Card className="glass-panel hover:border-violet-500/40 transition-all flex flex-col justify-between">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
            {getIcon()}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/upload?docId=${document.id}`} className="cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4 text-violet-500" />
                  Run Full Analysis
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/compare?docA=${document.id}`} className="cursor-pointer">
                  <GitCompare className="mr-2 h-4 w-4 text-emerald-500" />
                  Compare as Doc A
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={() => deleteDoc.mutate({ id: document.id })}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete from Vault
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2" title={document.name}>
            {document.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {(document.sizeBytes / 1024).toFixed(1)} KB • {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline" className="text-[10px] uppercase font-mono">
            {document.type}
          </Badge>
          {document.jurisdiction && (
            <Badge variant="violet" className="text-[10px]">
              {document.jurisdiction}
            </Badge>
          )}
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" asChild className="w-full text-xs gap-1.5">
            <Link href={`/dashboard/upload?docId=${document.id}`}>
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              Analyze Document
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
