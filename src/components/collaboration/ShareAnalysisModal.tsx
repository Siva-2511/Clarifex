"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, Mail, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export interface ShareAnalysisModalProps {
  analysisId: string;
}

export function ShareAnalysisModal({ analysisId }: ShareAnalysisModalProps) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard/analyse/${analysisId}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setSending(true);
    try {
      const res = await fetch("/api/share/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, email: inviteEmail }),
      });

      if (!res.ok) throw new Error("Failed to send invite");

      setSentSuccess(true);
      setInviteEmail("");
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-violet-500" />
            Share & Collaborate on Analysis
          </DialogTitle>
          <DialogDescription className="text-xs">
            Collaborate in real-time with colleagues or legal counsel with live presence indicators.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Shareable Link</label>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} className="font-mono text-xs bg-muted/40" />
              <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0 gap-1 text-xs">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t">
            <label className="text-xs font-semibold text-muted-foreground">Invite by Email</label>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" size="sm" variant="gradient" disabled={sending || !inviteEmail} className="shrink-0 text-xs">
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Invite"}
              </Button>
            </form>
            {sentSuccess && (
              <p className="text-[11px] text-emerald-500 font-medium">
                Invitation sent successfully!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
