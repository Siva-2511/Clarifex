"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export interface ScreenshotTabProps {
  onSuccess: (doc: { id: string; name: string; text: string }) => void;
}

export function ScreenshotTab({ onSuccess }: ScreenshotTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createDoc = trpc.document.create.useMutation({
    onSuccess: (doc) => {
      onSuccess({ id: doc.id, name: doc.name, text: doc.extractedText });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setOcrText(null);
      setError(null);
    }
  };

  const handleRunOcr = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process image OCR");
      }

      const data = await res.json();
      setOcrText(data.text);
      setConfidence(data.confidence);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = () => {
    if (!ocrText) return;

    createDoc.mutate({
      name: file ? `Screenshot_${file.name}.txt` : "Screenshot_OCR.txt",
      type: "screenshot",
      sizeBytes: Buffer.byteLength(ocrText, "utf8"),
      extractedText: ocrText,
      jurisdiction: "US-General",
      language: "en",
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border/80 rounded-2xl p-6 text-center hover:border-violet-500/50 transition-colors bg-muted/10">
        <input
          type="file"
          id="screenshot-upload"
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
        />
        <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Camera className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Upload screenshot of copy-protected legal text</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (Max 5MB)</p>
          </div>
        </label>
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <div className="relative aspect-video max-h-48 w-full overflow-hidden rounded-xl border bg-black/5 flex items-center justify-center">
            <img src={previewUrl} alt="Screenshot preview" className="h-full w-full object-contain" />
          </div>

          {!ocrText && (
            <Button
              onClick={handleRunOcr}
              disabled={loading}
              variant="gradient"
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Google Cloud Vision OCR...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Extract Text with Google Cloud Vision
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {ocrText && (
        <div className="space-y-4 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold">OCR Extracted Successfully</span>
            </div>
            {confidence !== null && (
              <Badge variant="success">Confidence: {Math.round(confidence * 100)}%</Badge>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto rounded-lg bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
            {ocrText}
          </div>

          <Button
            onClick={handleSaveDocument}
            disabled={createDoc.isLoading}
            variant="default"
            className="w-full"
          >
            {createDoc.isLoading ? "Saving Document..." : "Confirm & Ingest Extracted Text"}
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
