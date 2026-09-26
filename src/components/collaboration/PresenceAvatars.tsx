"use client";

import React from "react";
import { usePresence, Collaborator } from "@/lib/firebase/presence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PresenceAvatarsProps {
  analysisId: string;
  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function PresenceAvatars({ analysisId, currentUser }: PresenceAvatarsProps) {
  const collaborators = usePresence(analysisId, currentUser);

  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {collaborators.map((c) => {
        const initials = c.name
          ? c.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "U";

        return (
          <div
            key={c.userId}
            title={`${c.name} (Viewing now)`}
            className="relative ring-2 ring-background rounded-full transition-transform hover:scale-110 hover:z-10"
          >
            <Avatar className="h-7 w-7 border border-violet-500/30">
              <AvatarImage src={c.image || ""} alt={c.name} />
              <AvatarFallback className="bg-violet-600 text-white text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-background" />
          </div>
        );
      })}
    </div>
  );
}
