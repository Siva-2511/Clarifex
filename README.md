# Clarifex — Legal AI Assistant

> **"Clarity out of legal complexity"**  
> A production-grade, GenAI-powered legal assistant that makes legal documents, contracts, policies, and agreements accessible and actionable for everyday users — without replacing professional legal counsel.

[![CI](https://github.com/clarifex/clarifex/actions/workflows/ci.yml/badge.svg)](https://github.com/clarifex/clarifex/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![WCAG](https://img.shields.io/badge/WCAG-2.1_AA-emerald)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## Top-Level Overview

- **Project name:** Clarifex
- **Tagline:** Clarity out of legal complexity
- **Submission:** IBM Hack2Skill Hackathon — Legal AI Vertical
- **Primary host:** Vercel (Edge & Serverless Runtime)
- **AI Gateway:** OpenRouter API (Gemini 1.5 Flash → Llama 3.1 → Mistral → DeepSeek fallback chain)

### What Makes Clarifex Different

Most submissions follow the basic pattern: *upload → extract → summarise → export*.  
Clarifex is designed around an **intelligent conversation and analysis layer** that understands context across multiple documents, adapts to different comprehension levels, and provides novel capabilities:

1. **ELI-5 / ELI-10 / Expert Mode:** Rewrites the entire contract analysis dynamically for any comprehension level — from playground metaphors to formal legal memorandums.
2. **Screenshot OCR:** Uses Google Cloud Vision OCR for copy-protected legal pages that block text selection or scraping.
3. **Clause DNA Fingerprint:** Computes structural cryptographic hashes (SHA-256) and token-based similarity to identify standard boilerplate and cross-contract duplication.
4. **Risk Heat-Map:** Animated color-coded danger scoring per clause (green/amber/red) with detailed rationale and Recharts distribution visualization.
5. **Obligation Timeline:** Chronological timeline of extracted deadlines, auto-renewal windows, and notice requirements with one-click Google Calendar sync.
6. **Multi-Document Comparison Matrix:** Compares 3 to 5 contracts simultaneously in a structured pivot-table view.
7. **6 Ingestion Channels:** File upload (PDF/DOCX/TXT), plain-text paste, SSRF-guarded URL fetch, Google Drive import, screenshot OCR, and multi-file batch queue.

---

## 18 Google & Firebase Services Integration

Clarifex deeply integrates 18 distinct Google and Firebase services across its workflow:

| # | Google / Firebase Service | Code Location | Purpose in Clarifex |
|---|---|---|---|
| 1 | **Google OAuth 2.0** | `src/auth.ts` | One-click social sign-in with profile synchronization |
| 2 | **Google reCAPTCHA v3** | `src/app/(auth)/login/page.tsx` | Invisible bot protection against credential stuffing and brute force |
| 3 | **Google Cloud Vision API** | `src/lib/ingestion/ocrProcessor.ts` | High-accuracy OCR on copy-protected screenshots |
| 4 | **Google Analytics 4 (GA4)** | `src/app/layout.tsx` | User behavior, page view, and feature engagement metrics |
| 5 | **Google Translate API** | `src/lib/google/translate.ts` | In-place multilingual translation of analysis summaries |
| 6 | **Google Maps Embed API** | `src/components/analysis/JurisdictionSelector.tsx` | Visual jurisdiction selection widget with statutory context |
| 7 | **Google Fonts (Geist + Inter)** | `src/app/layout.tsx` | Zero-CLS typography self-hosted via `next/font` |
| 8 | **Google Safe Browsing API** | `src/lib/ingestion/urlFetcher.ts` | Pre-fetch URL safety check against phishing and malware |
| 9 | **Google PageSpeed Insights** | `.lighthouserc.json` | Automated performance and accessibility compliance in CI |
| 10 | **Google Calendar API** | `src/lib/google/calendar.ts` | One-click calendar sync for extracted contract obligations |
| 11 | **Google Drive Picker API** | `src/components/ingestion/tabs/DriveTab.tsx` | Direct document import from Google Drive storage |
| 12 | **Google Docs Viewer Embed** | `src/components/ingestion/DocsViewer.tsx` | Inline document preview for imported Drive agreements |
| 13 | **Firebase Realtime Database** | `src/lib/firebase/presence.ts` | Live collaborator presence avatars and multi-user viewing |
| 14 | **Firebase Cloud Messaging (FCM)** | `src/lib/firebase/fcm.ts`, `public/firebase-messaging-sw.js` | Desktop and background push notifications for analysis completion |
| 15 | **Google Search Console** | `src/app/layout.tsx` | Search index verification meta tag |
| 16 | **Google Tag Manager** | `src/lib/google/gtm.ts` | Custom analytics event tracking for upload, analysis, and exports |
| 17 | **Gmail API** | `src/lib/google/gmail.ts` | Direct email delivery of generated PDF reports via user Gmail |
| 18 | **Gemini 1.5 Flash via OpenRouter** | `src/lib/ai/models.ts` | Primary AI model delivering sub-second legal reasoning |

---

## Full Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend Framework** | Next.js 14 (App Router) | Server components, edge routing, streaming SSR |
| **Language & Typing** | TypeScript 5 (Strict Mode) | End-to-end type safety |
| **Styling & Design System** | Tailwind CSS + shadcn/ui | Tokens: Deep Navy `#0f172a`, Electric Violet `#7c3aed`, Emerald `#10b981` |
| **Animations** | Framer Motion | Smooth accordion expansions, tab transitions, particle canvas |
| **Type-Safe API** | tRPC v10/v11 + Zod | Type-safe RPC with client React Query hooks |
| **Database & ORM** | Neon PostgreSQL + Prisma ORM | Relational models with indexes on high-query foreign keys |
| **Document Storage** | Cloudflare R2 | S3-compatible private bucket with signed URLs |
| **Rate Limiting** | Upstash Redis | Sliding-window limiter (5 attempts / 15 mins / IP) |
| **Authentication** | NextAuth.js v5 | Google, GitHub, Credentials (bcryptjs), TOTP MFA |
| **Report Generation** | `@react-pdf/renderer` + `docx` | Formatted PDF memos and DOCX executive summaries |
| **Diff Viewer** | `react-diff-viewer-continued` | Side-by-side and unified redline diff with semantic badges |
| **Testing** | Vitest + Playwright + axe-core | Automated unit tests and accessibility audits |

---

## Security Architecture & OWASP Top 10

All mitigations are enforced across every route and component:

- **SQL Injection:** Exclusively parameterized queries through Prisma ORM.
- **SSRF Prevention:** Private IP blocking (`10.x`, `172.16-31.x`, `192.168.x`, `127.x`, `169.254.x.x`, `::1`), internal hostname prohibition, and Google Safe Browsing verification.
- **Brute Force Defense:** Sliding-window rate limiting on all authentication and API endpoints.
- **XSS & Content Injection:** React escaping, DOMPurify sanitization, and strict Content-Security-Policy headers in `next.config.mjs`.
- **File Validation:** Magic-byte inspection for PDF (`%PDF-`), DOCX (`PK\x03\x04`), and images, rejecting spoofed MIME extensions.
- **Access Control:** All procedures verify session credentials and scope database queries strictly to `ctx.session.user.id`.

---

## Local Development Setup

### Prerequisites
- Node.js >= 20.0.0 (Node 22 recommended)
- pnpm >= 9.0.0

### Installation

1. Clone repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

3. Generate Prisma client:
   ```bash
   pnpm run postinstall
   ```

4. Run unit tests:
   ```bash
   pnpm test
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view Clarifex.

---

## Verification & Testing Commands

- **Unit Tests (Vitest):**
  ```bash
  pnpm test
  ```
  Runs tests for OpenRouter fallback chain, fileValidator magic bytes, SSRF guard, rate limiter, and auth tokens.

- **Type Checking:**
  ```bash
  pnpm run typecheck
  ```

- **Production Build:**
  ```bash
  pnpm run build
  ```

---

## Disclaimer

Clarifex provides automated AI analysis for informational purposes only. It is not a law firm and does not provide formal legal advice or representation. Users should always consult a licensed attorney for formal legal matters.
