"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface UploadTabProps {
  onSuccess: (doc: { id: string; name: string; text: string }) => void;
}

export function UploadTab({ onSuccess }: UploadTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ingest/file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process document");
      }

      const doc = await res.json();
      onSuccess(doc);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border/80 rounded-2xl p-8 text-center hover:border-violet-500/50 transition-colors bg-muted/10">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
            <UploadCloud className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (Max 10MB)</p>
          </div>
        </label>
      </div>

      {file && (
        <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <Button onClick={handleUpload} disabled={isUploading} variant="gradient">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Ingest Document"
            )}
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
