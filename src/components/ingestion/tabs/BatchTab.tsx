"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, FileText, CheckCircle2, AlertCircle, Loader2, Trash2 } from "lucide-react";

export interface BatchTabProps {
  onSuccess: (docs: { id: string; name: string; text: string }[]) => void;
}

interface QueuedFile {
  id: string;
  file: File;
  status: "idle" | "uploading" | "done" | "error";
  error?: string;
  docId?: string;
}

export function BatchTab({ onSuccess }: BatchTabProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        status: "idle" as const,
      }));
      setQueue((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const processBatch = async () => {
    if (queue.length === 0) return;

    setIsProcessing(true);
    const completedDocs: { id: string; name: string; text: string }[] = [];

    for (const item of queue) {
      if (item.status === "done") continue;

      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q)),
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);

        const res = await fetch("/api/ingest/file", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to process file");
        }

        const doc = await res.json();
        completedDocs.push(doc);

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "done", docId: doc.id } : q,
          ),
        );
      } catch (err) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: "error", error: (err as Error).message }
              : q,
          ),
        );
      }
    }

    setIsProcessing(false);
    if (completedDocs.length > 0) {
      onSuccess(completedDocs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border/80 rounded-2xl p-6 text-center hover:border-violet-500/50 transition-colors bg-muted/10">
        <input
          type="file"
          id="batch-upload"
          multiple
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFilesAdded}
        />
        <label htmlFor="batch-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Layers className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Select multiple files for batch queue</p>
            <p className="text-xs text-muted-foreground">Upload 2 to 10 contracts simultaneously</p>
          </div>
        </label>
      </div>

      {queue.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
            <span>Files in Queue ({queue.length})</span>
            <span>Status</span>
          </div>

          <div className="divide-y rounded-xl border bg-card overflow-hidden">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-violet-500" />
                  <div>
                    <p className="text-xs font-medium">{item.file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {(item.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "uploading" && (
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processing
                    </Badge>
                  )}
                  {item.status === "done" && (
                    <Badge variant="success" className="gap-1 text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready
                    </Badge>
                  )}
                  {item.status === "error" && (
                    <Badge variant="danger" className="text-[10px]">
                      Error
                    </Badge>
                  )}
                  {item.status === "idle" && (
                    <Badge variant="outline" className="text-[10px]">
                      Queued
                    </Badge>
                  )}

                  {!isProcessing && item.status !== "done" && (
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={processBatch}
            disabled={isProcessing || queue.every((q) => q.status === "done")}
            variant="gradient"
            className="w-full gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ingesting Batch Documents...
              </>
            ) : (
              "Process All Queued Documents"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
