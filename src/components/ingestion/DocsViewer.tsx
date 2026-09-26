"use client";

import React from "react";

export interface DocsViewerProps {
  documentUrl: string;
  title?: string;
  className?: string;
}

/**
 * Google Docs Viewer Embed component for rendering legal documents inline
 */
export function DocsViewer({ documentUrl, title = "Document Viewer", className = "h-[600px] w-full" }: DocsViewerProps) {
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`;

  return (
    <div className={`overflow-hidden rounded-xl border bg-card shadow-sm ${className}`}>
      <iframe
        src={viewerUrl}
        title={title}
        width="100%"
        height="100%"
        className="border-none"
        allowFullScreen
      />
    </div>
  );
}
