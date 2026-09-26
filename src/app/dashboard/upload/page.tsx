import React from "react";
import { DocumentUploader } from "@/components/ingestion/DocumentUploader";

export const metadata = {
  title: "New Ingestion | Clarifex",
  description: "Upload contracts, paste clauses, or fetch URLs for AI analysis",
};

export default function UploadPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Document Ingestion</h1>
        <p className="text-sm text-muted-foreground">
          Import your contract or policy into Clarifex for instant risk scoring, obligation timeline, and clause DNA analysis.
        </p>
      </div>

      <DocumentUploader />
    </div>
  );
}
