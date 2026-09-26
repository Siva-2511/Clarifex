"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export interface UrlTabProps {
  onSuccess: (doc: { id: string; name: string; text: string }) => void;
}

export function UrlTab({ onSuccess }: UrlTabProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ingest/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch webpage");
      }

      const doc = await res.json();
      onSuccess(doc);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFetch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url-input">Public Terms of Service or Policy URL</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="url-input"
            type="url"
            placeholder="https://example.com/terms"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <span>Protected by Google Safe Browsing and private IPv4/IPv6 SSRF guards.</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" variant="gradient" className="w-full" disabled={loading || !url.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating & Fetching Page...
          </>
        ) : (
          "Fetch & Ingest Legal Page"
        )}
      </Button>
    </form>
  );
}
