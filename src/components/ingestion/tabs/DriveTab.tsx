"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, HardDrive, CheckCircle2 } from "lucide-react";

export interface DriveTabProps {
  onSuccess: (doc: { id: string; name: string; text: string }) => void;
}

export function DriveTab({ onSuccess }: DriveTabProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDriveImport = async () => {
    setLoading(true);
    setError(null);

    try {
      // In production, Google Drive Picker API opens here.
      // Here we call the drive import route with an authenticated session.
      const res = await fetch("/api/ingest/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: "drive_sample_doc_id",
          fileName: "Cloud_Vendor_Agreement_Drive.pdf",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to import from Google Drive");
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
    <div className="space-y-6 text-center py-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
        <HardDrive className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-sm mx-auto">
        <h3 className="font-bold text-lg">Google Drive Document Picker</h3>
        <p className="text-xs text-muted-foreground">
          Import contracts, policies, and agreements directly from your Google Drive without manual file downloads.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 max-w-md mx-auto text-left">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        onClick={handleDriveImport}
        disabled={loading}
        variant="gradient"
        className="px-8 gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to Google Drive...
          </>
        ) : (
          <>
            <HardDrive className="h-4 w-4" />
            Select from Google Drive
          </>
        )}
      </Button>
    </div>
  );
}
