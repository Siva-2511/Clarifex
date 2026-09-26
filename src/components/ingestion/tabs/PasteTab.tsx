"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { Loader2, AlertCircle } from "lucide-react";

export interface PasteTabProps {
  onSuccess: (doc: { id: string; name: string; text: string }) => void;
}

export function PasteTab({ onSuccess }: PasteTabProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createDoc = trpc.document.create.useMutation({
    onSuccess: (doc) => {
      onSuccess({ id: doc.id, name: doc.name, text: doc.extractedText });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please paste contract or clause text");
      return;
    }

    createDoc.mutate({
      name: title.trim() || `Pasted_Agreement_${new Date().toISOString().slice(0, 10)}.txt`,
      type: "paste",
      sizeBytes: Buffer.byteLength(content, "utf8"),
      extractedText: content,
      jurisdiction: "US-General",
      language: "en",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="paste-title">Document Title (Optional)</Label>
        <Input
          id="paste-title"
          placeholder="e.g. Master Services Agreement v2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="paste-content">Contract Text</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              {wordCount} words
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {charCount} chars
            </Badge>
            <Badge variant="violet" className="text-[10px]">
              Auto-Detect: EN
            </Badge>
          </div>
        </div>
        <Textarea
          id="paste-content"
          placeholder="Paste full contract clauses, terms of service, or lease agreements here..."
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="font-mono text-xs leading-relaxed"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        disabled={createDoc.isLoading || !content.trim()}
      >
        {createDoc.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Document...
          </>
        ) : (
          "Ingest Pasted Text"
        )}
      </Button>
    </form>
  );
}
