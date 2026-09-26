"use client";

import { useEffect, useState } from "react";
import { rtdb } from "./app";
import { ref, onValue, set, onDisconnect } from "firebase/database";

export interface Collaborator {
  userId: string;
  name: string;
  email: string;
  image?: string;
  joinedAt: number;
}

export function usePresence(analysisId: string, currentUser?: { id: string; name?: string | null; email?: string | null; image?: string | null }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    if (!analysisId || !currentUser?.id) return;

    try {
      const presenceRef = ref(rtdb, `presence/${analysisId}/${currentUser.id}`);
      const allPresenceRef = ref(rtdb, `presence/${analysisId}`);

      const myData: Collaborator = {
        userId: currentUser.id,
        name: currentUser.name || "Anonymous Collaborator",
        email: currentUser.email || "",
        image: currentUser.image || undefined,
        joinedAt: Date.now(),
      };

      // Set user presence
      set(presenceRef, myData);
      onDisconnect(presenceRef).remove();

      // Listen for all users viewing this analysis
      const unsubscribe = onValue(allPresenceRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const list = Object.values(val) as Collaborator[];
          setCollaborators(list);
        } else {
          setCollaborators([]);
        }
      });

      return () => {
        set(presenceRef, null);
        unsubscribe();
      };
    } catch (e) {
      console.warn("Firebase presence not connected:", e);
    }
  }, [analysisId, currentUser]);

  return collaborators;
}
