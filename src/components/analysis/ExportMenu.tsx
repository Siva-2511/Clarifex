"use client";

import React, { useState } from "react";
import { Download, FileText, Mail, Check, Copy, Loader2, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { generateMarkdownExport } from "@/lib/export/markdown";

export interface ExportMenuProps {
  analysis: any;
  documentNames?: string[];
}

export function ExportMenu({ analysis, documentNames = [] }: ExportMenuProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [sendingGmail, setSendingGmail] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: analysis.id }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Clarifex_Analysis_${analysis.id.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: analysis.id }),
      });

      if (!res.ok) throw new Error("Failed to generate DOCX");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Clarifex_Summary_${analysis.id.slice(-6)}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("DOCX download error:", err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownExport(analysis, documentNames);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleSendGmail = async () => {
    setSendingGmail(true);
    try {
      const res = await fetch("/api/export/gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: analysis.id }),
      });

      if (!res.ok) throw new Error("Failed to send Gmail");
      alert("Analysis report sent to your Gmail inbox successfully!");
    } catch (err) {
      alert("Gmail sending: please verify Google OAuth Gmail permissions.");
    } finally {
      setSendingGmail(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          <span>Export Center</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleDownloadPdf} disabled={downloadingPdf} className="cursor-pointer text-xs">
          {downloadingPdf ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="mr-2 h-3.5 w-3.5 text-red-500" />
          )}
          <span>Download PDF Report</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDownloadDocx} disabled={downloadingDocx} className="cursor-pointer text-xs">
          {downloadingDocx ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <FileText className="mr-2 h-3.5 w-3.5 text-blue-500" />
          )}
          <span>Download DOCX Summary</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyMarkdown} className="cursor-pointer text-xs">
          {copiedMd ? (
            <Check className="mr-2 h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="mr-2 h-3.5 w-3.5 text-violet-500" />
          )}
          <span>{copiedMd ? "Copied Markdown" : "Copy Markdown"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSendGmail} disabled={sendingGmail} className="cursor-pointer text-xs">
          {sendingGmail ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Mail className="mr-2 h-3.5 w-3.5 text-amber-500" />
          )}
          <span>Send Report to Gmail</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
