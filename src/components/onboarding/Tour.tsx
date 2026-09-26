"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { trpc } from "@/lib/trpc/client";

export function OnboardingTour({ isFirstLogin }: { isFirstLogin?: boolean }) {
  const completeTour = trpc.auth.completeOnboarding.useMutation();

  useEffect(() => {
    if (!isFirstLogin) return;

    const tourDriver = driver({
      showProgress: true,
      animate: true,
      doneBtnText: "Get Started",
      nextBtnText: "Next",
      prevBtnText: "Previous",
      steps: [
        {
          element: "header",
          popover: {
            title: "Welcome to Clarifex",
            description: "Your AI-powered legal copilot designed to demystify complex contracts and agreements.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: 'a[href="/dashboard/upload"]',
          popover: {
            title: "6 Ingestion Methods",
            description: "Upload PDFs/DOCX, paste text, fetch URLs with SSRF protection, import from Google Drive, or run Screenshot OCR on copy-protected pages.",
            side: "right",
            align: "start",
          },
        },
        {
          element: 'a[href="/dashboard/vault"]',
          popover: {
            title: "Document Vault",
            description: "All uploaded contracts are securely encrypted in Cloudflare R2 and indexed for instant search.",
            side: "right",
            align: "start",
          },
        },
        {
          element: 'a[href="/dashboard/compare"]',
          popover: {
            title: "Contract Diff & Comparison",
            description: "Compare two contracts side-by-side or analyze up to 5 agreements in a comprehensive matrix.",
            side: "right",
            align: "start",
          },
        },
        {
          element: 'a[href="/dashboard/timeline"]',
          popover: {
            title: "Obligation Timeline",
            description: "Automatically extract deadlines and sync renewal dates directly into Google Calendar with a single click.",
            side: "right",
            align: "start",
          },
        },
      ],
      onDestroyStarted: () => {
        completeTour.mutate();
        tourDriver.destroy();
      },
    });

    const timer = setTimeout(() => {
      tourDriver.drive();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstLogin]);

  return null;
}
