# Clarifex — Legal AI Assistant · Full PRD & Implementation Plan

> **"Clarity out of legal complexity"**
> A production-grade, GenAI-powered legal assistant that makes legal documents,
> contracts, policies, and agreements accessible and actionable for everyday users —
> without replacing professional legal counsel.

---

## Top-Level Overview

**Project name:** Clarifex
**Tagline:** Clarity out of legal complexity
**Primary host:** Vercel (free tier)
**AI provider:** OpenRouter (free model fallback chain — no paid dependencies)
**Submission type:** IBM Hack2Skill Hackathon — Legal AI vertical

### What makes Clarifex different

Most submissions will follow the basic pattern: *upload → extract → summarise → export*.
Clarifex is designed around an **intelligent conversation and analysis layer** that understands
context across multiple documents and multiple user personas, and offers genuinely novel
features that competitors are unlikely to build:

- **ELI-5 / ELI-10 / Expert mode** — rewrites analysis for any comprehension level
- **Screenshot OCR** — for copy-protected legal pages that block text selection
- **Clause DNA Fingerprint** — detects identical boilerplate across multiple documents
- **Risk Heat-Map** — visual colour-coded danger scoring per clause
- **Obligation Timeline** — Gantt-style calendar of every extracted deadline and renewal date
- **Multi-document Comparison Matrix** — compare 3+ contracts simultaneously
- **6 distinct input methods** — file upload, paste, URL fetch, Google Drive, screenshot, batch

---

## Full Technology Stack

| Layer | Technology | Free tier |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui | ✅ |
| Type-safe API | tRPC v11 + Zod | ✅ |
| AI Gateway | OpenRouter API (Gemini Flash → Llama 3.1 → Mistral → DeepSeek fallback chain) | ✅ |
| Auth | NextAuth.js v5 — Google, GitHub, email/password, TOTP MFA, reCAPTCHA v3 | ✅ |
| Database | Neon (serverless PostgreSQL) + Prisma ORM | ✅ |
| File Storage | Cloudflare R2 (S3-compatible, private bucket + signed URLs) | ✅ |
| OCR / Vision | Google Cloud Vision API | ✅ (1000/mo) |
| Search | Algolia (InstantSearch) | ✅ |
| Cache / Rate-limit | Upstash Redis (sliding-window rate limiter) | ✅ |
| Deployment | Vercel (App + API, Edge runtime where possible) | ✅ |
| CDN / Security | Cloudflare (WAF, DNS) | ✅ |
| Real-time | Firebase Realtime Database (collaboration presence) | ✅ |
| Push Notifications | Firebase Cloud Messaging (FCM) | ✅ |
| Email | Resend (transactional email) | ✅ |
| Export | @react-pdf/renderer + docx package | ✅ |
| Monitoring | Sentry (free tier) | ✅ |
| i18n | next-intl | ✅ |
| Analytics | Google Analytics 4 + Google Tag Manager | ✅ |

---

## Google Services Integration (18 free services)

| # | Service | Where used |
|---|---|---|
| 1 | Google OAuth 2.0 | Social sign-in |
| 2 | Google reCAPTCHA v3 | Login, register, forgot-password forms |
| 3 | Google Cloud Vision API | Screenshot OCR for copy-protected legal pages |
| 4 | Google Analytics 4 (GA4) | User behaviour + feature usage tracking |
| 5 | Google Translate API | Auto-translate analysis output to user's language |
| 6 | Google Maps Embed API | Jurisdiction selector widget in analysis setup |
| 7 | Google Fonts (Geist + Inter) | Typography, self-hosted via next/font |
| 8 | Google Safe Browsing API | URL input validation — prevents SSRF/malicious URLs |
| 9 | Google PageSpeed Insights API | Automated perf/accessibility checks in CI |
| 10 | Google Calendar API | One-click "Add to Calendar" for extracted obligation dates |
| 11 | Google Drive Picker API | Import legal documents directly from Google Drive |
| 12 | Google Docs Viewer Embed | Render imported Drive docs inline |
| 13 | Firebase Realtime Database | Real-time collaboration presence cursors |
| 14 | Firebase Cloud Messaging | Push notifications — analysis complete, doc shared |
| 15 | Google Search Console | SEO verification meta tag |
| 16 | Google Tag Manager | Custom event tracking (upload, analysis, export) |
| 17 | Gmail API (OAuth scope) | Send analysis report to user's Gmail |
| 18 | Gemini Flash 1.5 via OpenRouter | Primary AI model (Google's Gemini, free tier) |

---

## Feature Inventory

### TIER 1 — Core / High-Impact (must be fully polished)

| ID | Feature | Description |
|---|---|---|
| F1 | **Multi-Input Document Ingestion** | PDF, DOCX, TXT upload; plain-text paste; URL fetch (SSRF-guarded); Google Drive import; screenshot/image (OCR); multi-file batch queue |
| F2 | **AI Analysis Engine** | Context-aware analysis: clause extraction, obligation mapping, risk scoring, plain-language summary |
| F3 | **ELI-5 / ELI-10 / Expert Mode** | AI rewrites the entire analysis for the selected comprehension level |
| F4 | **Conversational Q&A** | Multi-turn chat over loaded document(s) with full clause/page citation |
| F5 | **Risk Heat-Map** | Animated colour-coded risk score per clause (green/amber/red) with explanation |
| F6 | **Clause DNA Fingerprint** | Detects identical boilerplate across multiple documents with a structural hash |
| F7 | **Side-by-Side Contract Diff** | Semantic + textual diff of two document versions with change-significance rating |
| F8 | **Authentication & Authorization** | Google, GitHub, email/password, TOTP MFA, reCAPTCHA v3, forgot-password, brute-force protection |
| F9 | **Document Vault** | Per-user encrypted document storage in Cloudflare R2 + metadata in Postgres |

### TIER 2 — Differentiators (fully working, polished)

| ID | Feature | Description |
|---|---|---|
| F10 | **Screenshot OCR Mode** | Upload screenshot of copy-protected legal page → Google Vision extracts text |
| F11 | **Checklist Generator** | "Before you sign" and "Questions for your lawyer" interactive checklists |
| F12 | **Multi-Document Comparison Matrix** | Compare 3+ documents in a pivot-table view |
| F13 | **Jurisdiction-Aware Context** | Google Maps jurisdiction selector; AI adjusts analysis to selected legal jurisdiction |
| F14 | **Auto-Translate** | Translate all analysis output to user's native language (Google Translate) |
| F15 | **Obligation Timeline** | Extracts deadlines/renewal dates/notice periods → Gantt-style timeline + Google Calendar export |
| F16 | **Collaboration** | Real-time shared analysis via Firebase Presence; shareable link |
| F17 | **Export Center** | PDF report, DOCX summary, clipboard Markdown, Gmail send |
| F18 | **Notification System** | FCM push + Resend email when async analysis completes |
| F19 | **Google Calendar Integration** | One-click "Add deadline to Google Calendar" for extracted obligation dates |

### TIER 3 — Polish / Accessibility

| ID | Feature | Description |
|---|---|---|
| F20 | Dark/Light/System theme | Full Tailwind dark mode, animated toggle |
| F21 | Keyboard navigation | WCAG 2.1 AA, skip-links, ARIA labels |
| F22 | Screen reader support | Semantic HTML, live regions for streaming AI |
| F23 | Responsive / mobile-first | Fluid typography, touch-friendly |
| F24 | Onboarding tour | Animated step-by-step guide on first login (Driver.js) |
| F25 | Vault search | Algolia-powered full-text search across user documents |
| F26 | Personal analytics | Stats: documents analysed, risks found, clauses flagged (GA4 + custom events) |
| F27 | Error monitoring | Sentry for both frontend and API |

---

## Security Architecture

All mitigations baked in from day one (OWASP Top 10 coverage):

| Vulnerability | Mitigation |
|---|---|
| SQL Injection | Prisma ORM parameterised queries only — zero raw SQL |
| CSRF | NextAuth.js built-in CSRF tokens on all state-mutating auth routes |
| SSRF | URL inputs validated via Google Safe Browsing API + allowlist schema check + private IP block regex |
| XSS | React JSX escaping + DOMPurify on any HTML injection points + strict CSP headers |
| Brute Force | Upstash Redis sliding-window rate limiter — 5 attempts / 15 min / IP on all auth routes |
| Broken Access Control | tRPC middleware enforces session ownership on every procedure; all DB queries scoped to `userId` |
| Insecure File Upload | Magic-byte + MIME type validation, 10 MB cap, files stored in private R2 bucket, signed URLs only |
| Sensitive Data Exposure | Env vars via Vercel secret store; credentials never in client bundle; all transport over TLS |
| Open Redirect | Redirect URLs validated against origin allowlist in NextAuth config |
| Clickjacking | `X-Frame-Options: DENY` + `Content-Security-Policy: frame-ancestors 'none'` |
| Path Traversal | All storage paths are server-generated UUIDs — no user-controlled path segments |
| Secrets Leak | `@t3-oss/env-nextjs` validates all env vars at build time; `.env.local` in `.gitignore` |
| Audit Logging | Every auth event + document action + analysis run written to `AuditLog` table |

---

## Database Schema (Prisma models)

```
User            — id, email, name, image, role, mfaEnabled, mfaSecret, firstLogin, createdAt
Account         — NextAuth OAuth linked accounts
Session         — NextAuth sessions
Document        — id, userId, name, type, storageKey, sizeBytes, checksum, jurisdiction, language, extractedText, createdAt
Analysis        — id, documentIds[], userId, status, modelUsed, comprehensionLevel, resultJson, riskScore, createdAt
Message         — id, analysisId, role, content, citations (JSON), createdAt
Checklist       — id, analysisId, items (JSON array), createdAt
Collaboration   — id, analysisId, inviteeEmail, accessToken, expiresAt
AuditLog        — id, userId, action, resource, ipAddress, userAgent, createdAt
```

---

## OpenRouter Model Fallback Chain (all free)

Runtime auto-selection order — cycles on 429 / 5xx:

1. `google/gemini-flash-1.5` — primary (Google Gemini, fastest)
2. `meta-llama/llama-3.1-8b-instruct:free`
3. `mistralai/mistral-7b-instruct:free`
4. `deepseek/deepseek-chat:free`
5. `microsoft/phi-3-mini-128k-instruct:free`
6. `qwen/qwen-2-7b-instruct:free`

Model used is recorded per-analysis in the database for transparency.

---

## UI/UX Design Language

- **Motion system:** Framer Motion — page transitions, staggered list entries, spring-physics cards, skeleton loaders, micro-interactions
- **Component system:** shadcn/ui (Radix UI primitives) + custom design tokens
- **Colour palette:** Deep navy `#0f172a` + electric violet `#7c3aed` + emerald accent `#10b981`
- **Typography:** Geist Sans (headings) + Inter (body) via `next/font` (Google Fonts, self-hosted)
- **Iconography:** Lucide React
- **Glassmorphism panels** on document cards (backdrop-blur, border-white/10)
- **Canvas particle background** on landing page (legal motif)
- **Streaming AI responses** — token-by-token render via ReadableStream
- **Animated risk heat-map** — Recharts + Framer Motion
- **Diff viewer** — `react-diff-viewer-continued` with syntax-highlighted clause blocks

---

## Implementation Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding & Repository Setup
**Status:** [ ] pending

**Intent:**
Establish the full monorepo structure, install all dependencies, configure environment variable
schema validation, set up Prettier/ESLint/Husky pre-commit hooks, security headers in
`next.config.ts`, and the GitHub Actions CI workflow.

**Expected Outcomes:**
- Next.js 14 TypeScript project initialised with App Router, Tailwind, `src/` directory
- All runtime and dev dependencies installed
- `@t3-oss/env-nextjs` env schema in `src/env.ts` — build fails on missing vars
- Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) in `next.config.ts`
- ESLint + Prettier configured, Husky pre-commit running lint-staged
- GitHub Actions CI: lint + typecheck on every push
- `.env.example` documenting all ~45 required environment variables
- `README.md` skeleton with project name, description, and setup stub
- shadcn/ui initialised with base component set

**Todo List:**
- [ ] Run `npx create-next-app@latest clarifex --typescript --tailwind --app --src-dir --import-alias "@/*"`
- [ ] Install runtime deps: `@trpc/server @trpc/client @trpc/next @trpc/react-query @tanstack/react-query zod prisma @prisma/client next-auth@beta @auth/prisma-adapter framer-motion @upstash/redis @upstash/ratelimit @aws-sdk/client-s3 resend @sentry/nextjs next-intl algolia @algolia/client-search next-themes lucide-react cmdk otplib qrcode pdf-parse mammoth dompurify @react-pdf/renderer docx firebase firebase-admin react-diff-viewer-continued recharts driver.js @t3-oss/env-nextjs`
- [ ] Install dev deps: `husky lint-staged prettier @types/pdf-parse @types/qrcode @types/dompurify vitest @vitejs/plugin-react @playwright/test @axe-core/playwright`
- [ ] Initialise shadcn/ui: `npx shadcn@latest init` + add button, card, dialog, dropdown-menu, input, label, select, sheet, skeleton, tabs, toast, badge, avatar, command, popover, separator, switch, table, textarea
- [ ] Write `src/env.ts` with full `@t3-oss/env-nextjs` schema for all env vars
- [ ] Write `next.config.ts` with security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy) and Sentry `withSentryConfig` wrapper
- [ ] Configure `eslint.config.mjs` and `.prettierrc`
- [ ] Set up Husky + lint-staged: `npx husky init`; add pre-commit hook running lint-staged
- [ ] Write `.github/workflows/ci.yml` — Node 20, `pnpm install`, lint, typecheck, unit tests
- [ ] Write `.env.example` with all variables documented and grouped
- [ ] Write skeleton `README.md` (to be completed in Sub-Task 10)
- [ ] Commit and push initial scaffold to GitHub public repository

**Relevant Context:** Blank workspace — start from scratch. Use `pnpm` as package manager.

---

### Sub-Task 2 — Database Schema & Prisma Setup
**Status:** [ ] pending

**Intent:**
Define the complete Prisma schema with all models, run the initial migration against Neon
PostgreSQL, and create the Prisma Client singleton to be used across all API routes.

**Expected Outcomes:**
- `prisma/schema.prisma` with all models and correct relations
- `npx prisma migrate dev --name init` succeeds against Neon
- Prisma Client exported as singleton from `src/lib/prisma.ts`
- Seed script at `prisma/seed.ts` for local dev data
- `postinstall` script in `package.json` runs `prisma generate`

**Todo List:**
- [ ] Write full `prisma/schema.prisma` — providers: `postgresql`; models: User, Account, Session, VerificationToken, Document, Analysis, Message, Checklist, Collaboration, AuditLog
- [ ] Add indexes on high-query columns (userId, analysisId, createdAt)
- [ ] Set `DATABASE_URL` in `.env.local` pointing to Neon connection string
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Create `src/lib/prisma.ts` singleton (global object to survive hot-reload)
- [ ] Write `prisma/seed.ts` with a dev user and sample documents
- [ ] Add `"postinstall": "prisma generate"` to `package.json`

**Relevant Context:** Sub-Task 1 must be complete. Neon connection string provided by user.

---

### Sub-Task 3 — Authentication System
**Status:** [ ] pending

**Intent:**
Implement full authentication: NextAuth.js v5 with Google OAuth, GitHub OAuth, email/password
(bcrypt), TOTP MFA, reCAPTCHA v3, forgot-password + signed reset-token email flow,
brute-force rate limiting via Upstash Redis, and AuditLog writes on every auth event.

**Expected Outcomes:**
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-mfa` pages — all animated, all validated
- Google + GitHub social login working with profile picture sync
- Email/password with Zod validation, bcrypt hashing (cost factor 12)
- reCAPTCHA v3 on login + register + forgot-password (invisible, score-based)
- TOTP MFA: enrolment page with QR code (otplib + qrcode), verify page, disable flow
- Upstash rate limiter middleware on all `/api/auth/*` routes
- Forgot-password: Resend sends signed token email; `/reset-password?token=` validates + sets new password
- AuditLog entry created on: login, logout, register, password-reset, mfa-enabled, mfa-disabled, failed-login
- JWT session carries `userId`, `role`, `mfaVerified`
- Protected routes: middleware redirects unauthenticated users to `/login`

**Todo List:**
- [ ] Write `src/auth.ts` — NextAuth v5 config with Google, GitHub, Credentials providers; PrismaAdapter; JWT strategy
- [ ] Write `src/middleware.ts` — route protection (all `/dashboard/*` requires session), security headers injection, rate-limit check
- [ ] Write `src/lib/rate-limit.ts` — Upstash sliding-window, exported as `rateLimit(identifier)` helper
- [ ] Write `src/lib/auth/password.ts` — bcrypt hash + compare helpers
- [ ] Write `src/lib/auth/tokens.ts` — signed reset token generation + verification (crypto.randomBytes + HMAC)
- [ ] Write `src/lib/auth/mfa.ts` — otplib TOTP generate/verify + qrcode URI generation
- [ ] Write `src/lib/audit.ts` — `logAuditEvent(userId, action, resource, req)` helper
- [ ] Build `/app/(auth)/login/page.tsx` — animated card, email/password form, Google/GitHub buttons, reCAPTCHA v3 badge, link to register + forgot-password
- [ ] Build `/app/(auth)/register/page.tsx` — animated card, full name + email + password + confirm, reCAPTCHA, redirect to dashboard on success
- [ ] Build `/app/(auth)/forgot-password/page.tsx` — email input, reCAPTCHA, Resend email trigger, success state
- [ ] Build `/app/(auth)/reset-password/page.tsx` — token param, new password + confirm, validation
- [ ] Build `/app/(auth)/verify-mfa/page.tsx` — 6-digit TOTP input with animated digit boxes + countdown timer
- [ ] Build MFA enrolment UI in settings: QR code display + verification step + backup codes
- [ ] Write tRPC procedures: `auth.me`, `auth.enableMfa`, `auth.verifyMfaSetup`, `auth.disableMfa`
- [ ] Write Resend email templates: `PasswordResetEmail`, `WelcomeEmail` using React Email

**Relevant Context:** Sub-Tasks 1 + 2 must be complete. NextAuth v5 uses the new `auth()` function pattern.

---

### Sub-Task 4 — Core Layout, Navigation & Design System
**Status:** [ ] pending

**Intent:**
Build the application shell: landing page, authenticated dashboard layout (sidebar + navbar),
theming system, onboarding tour, and all Google analytics integrations. This sub-task establishes
the visual identity and navigation framework for all subsequent feature pages.

**Expected Outcomes:**
- Stunning animated landing page: hero with particle canvas, feature grid, ELI demo strip, use-case cards, CTA
- Dashboard layout: animated collapsible sidebar, top navbar with user-avatar menu, notification bell, theme toggle
- Command palette (⌘K / Ctrl+K) via `cmdk`
- Dark/Light/System theme with animated toggle (next-themes + Tailwind `darkMode: 'class'`)
- Onboarding tour on first login (Driver.js) — 8-step walkthrough
- Google Fonts (Geist + Inter) via `next/font` (self-hosted, zero CLS)
- GA4 + GTM integrated via `@next/third-parties/google`
- Sentry browser SDK initialised
- Full WCAG 2.1 AA: skip-nav, ARIA landmarks, focus trap in all modals

**Todo List:**
- [ ] Build `src/app/(marketing)/page.tsx` — hero section (animated headline, particle canvas, CTA buttons), features grid (animated on scroll), ELI mode demo strip, 3 use-case scenario cards, footer
- [ ] Build `src/app/(marketing)/layout.tsx` — marketing nav with logo, links, auth CTA
- [ ] Build `src/components/landing/ParticleCanvas.tsx` — canvas-based floating scales/gavel particle system
- [ ] Build `src/app/(dashboard)/layout.tsx` — authenticated shell with Sidebar + Navbar
- [ ] Build `src/components/layout/Sidebar.tsx` — Framer Motion animated collapse, icon+label nav items (Vault, Analyse, Compare, Timeline, Settings), active state with violet indicator
- [ ] Build `src/components/layout/Navbar.tsx` — logo, breadcrumb, ⌘K trigger, notification bell (badge counter), user avatar dropdown (profile, settings, logout), theme toggle
- [ ] Build `src/components/ui/CommandPalette.tsx` — `cmdk` powered, searches documents + runs actions (new upload, new analysis, settings, logout)
- [ ] Build `src/components/ui/ThemeToggle.tsx` — animated sun/moon icon switch
- [ ] Build `src/components/ui/NotificationBell.tsx` — FCM-connected badge + popover list
- [ ] Integrate `next-themes` provider in `src/app/layout.tsx`
- [ ] Integrate `@next/third-parties/google` for GA4 (`GoogleAnalytics`) and GTM (`GoogleTagManager`)
- [ ] Integrate Sentry: `withSentryConfig` in `next.config.ts` + `Sentry.init` in `instrumentation.ts`
- [ ] Build `src/components/onboarding/Tour.tsx` — Driver.js tour initialised on `firstLogin === true`, marks complete on finish
- [ ] Add skip-nav link `<a href="#main-content">`, ARIA landmark roles, focus management utility

**Relevant Context:** Sub-Tasks 1–3 must be complete. All subsequent feature sub-tasks depend on this layout shell.

---

### Sub-Task 5 — Document Ingestion System
**Status:** [ ] pending

**Intent:**
Build the complete document ingestion pipeline supporting all 6 input methods. This is the
front door of every Clarifex analysis and must be robust, secure, and polished.

**Expected Outcomes:**
- `DocumentUploader` component with 6 tabs: Upload / Paste / URL / Drive / Screenshot / Batch
- PDF parsed via `pdf-parse` (server-side only)
- DOCX parsed via `mammoth`
- URL fetching with full SSRF protection (private IP block + Google Safe Browsing API)
- Google Drive Picker modal — OAuth consent + file selection → server-side download
- Screenshot/image → Google Cloud Vision OCR → extracted text with confidence display
- Text paste with character counter, auto-detect language
- Multi-file batch queue with per-file progress bars (Framer Motion)
- Files stored in Cloudflare R2 (private bucket, pre-signed PUT URL)
- Magic-byte validation + MIME-type check on every upload
- `Document` record created in Postgres with checksum (SHA-256), size, type, extracted text
- Document stored in Algolia index for vault search

**Todo List:**
- [ ] Build `src/components/ingestion/DocumentUploader.tsx` — tabbed interface with Framer Motion tab transitions
- [ ] Build `src/components/ingestion/tabs/UploadTab.tsx` — react-dropzone drag-and-drop, file type filter, size limit, animated progress
- [ ] Build `src/components/ingestion/tabs/PasteTab.tsx` — textarea + character counter + language detection badge
- [ ] Build `src/components/ingestion/tabs/UrlTab.tsx` — URL input + loading state + SSRF error messages
- [ ] Build `src/components/ingestion/tabs/DriveTab.tsx` — Google Drive Picker button, OAuth flow, selected file preview
- [ ] Build `src/components/ingestion/tabs/ScreenshotTab.tsx` — image upload + OCR confidence indicator + extracted text preview
- [ ] Build `src/components/ingestion/tabs/BatchTab.tsx` — multi-file queue with status per file
- [ ] Write `src/lib/parsers/pdf.ts` — `pdf-parse` server-side wrapper, returns `{ text, pageCount, metadata }`
- [ ] Write `src/lib/parsers/docx.ts` — `mammoth` wrapper, returns `{ text, html }`
- [ ] Write `src/lib/ingestion/urlFetcher.ts` — SSRF guard (blocks 10.x, 172.16–31.x, 192.168.x, 127.x, ::1, metadata IPs), Google Safe Browsing check, user-agent spoofing prevention, 5s timeout
- [ ] Write `src/lib/ingestion/ocrProcessor.ts` — Google Cloud Vision API call, returns extracted text + confidence
- [ ] Write `src/lib/ingestion/driveImport.ts` — Google Drive API download using user access token from NextAuth session
- [ ] Write `src/lib/storage/r2.ts` — pre-signed PUT URL generation, pre-signed GET URL, object deletion
- [ ] Write `src/lib/security/fileValidator.ts` — magic-byte detection for PDF/DOCX/PNG/JPG/WEBP, MIME mismatch rejection
- [ ] Write `POST /api/upload` — pre-signed URL endpoint (validates auth, file type, calls fileValidator)
- [ ] Write `POST /api/ocr` — Vision API endpoint (auth-gated, rate-limited, file size ≤5MB)
- [ ] Write tRPC procedure `document.create` — saves DB record, indexes in Algolia, returns documentId
- [ ] Write tRPC procedure `document.list` — paginated list for vault
- [ ] Write tRPC procedure `document.delete` — removes R2 object, DB record, Algolia entry
- [ ] Write tRPC procedure `document.getById` — returns document with signed R2 read URL

**Relevant Context:** Sub-Tasks 1–4 complete. All storage via R2. No user-controlled path segments.

---

### Sub-Task 6 — AI Analysis Engine & OpenRouter Gateway
**Status:** [ ] pending

**Intent:**
Build the complete AI backend: OpenRouter gateway with dynamic model selection and full
fallback chain, system prompt engineering for every analysis mode, streaming API route,
and all tRPC analysis procedures.

**Expected Outcomes:**
- `src/lib/ai/openrouter.ts` — model selector, retry with 6-model fallback, streaming passthrough, token counting
- System prompts cover: full-analysis, risk-scoring, ELI-5, ELI-10, expert, Q&A, checklist, diff, timeline, fingerprint, jurisdiction-aware variants
- `POST /api/ai/stream` route — SSE ReadableStream for real-time token delivery
- `analysis.run` tRPC procedure — queues analysis job, updates status polling
- Risk output: structured JSON `{ clauses: [{ text, type, riskLevel, reason, pageRef }] }`
- ELI mode rewrites entire analysis based on comprehension level
- Clause DNA fingerprint: SHA-256 of normalised clause text (lowercased, punctuation stripped)
- Obligation extraction: structured `{ obligations: [{ description, dueDate, parties, noticePeriod }] }`
- Multi-doc diff: `{ changes: [{ type: 'added'|'removed'|'modified', clause, significance, explanation }] }`
- Model used + token counts logged to DB per analysis

**Todo List:**
- [ ] Write `src/lib/ai/openrouter.ts` — `callAI({ prompt, systemPrompt, stream, model? })` with fallback chain, retries on 429/5xx, returns `ReadableStream` or string
- [ ] Write `src/lib/ai/models.ts` — ordered free model list with metadata (name, contextWindow, strengths)
- [ ] Write `src/lib/ai/prompts.ts` — all system prompts as typed constants: `FULL_ANALYSIS_PROMPT`, `RISK_ANALYSIS_PROMPT`, `ELI5_PROMPT`, `ELI10_PROMPT`, `EXPERT_PROMPT`, `QA_PROMPT`, `CHECKLIST_PROMPT`, `DIFF_PROMPT`, `TIMELINE_PROMPT`, `FINGERPRINT_PROMPT`, `JURISDICTION_PREFIX`
- [ ] Write `src/lib/ai/analysisRunner.ts` — orchestrates multi-step pipeline: extract → risk-score → ELI rewrite → checklist → timeline → fingerprint, writes to `Analysis` table progressively
- [ ] Write `src/lib/ai/fingerprint.ts` — normalise clause text + SHA-256 hash, compare across documents
- [ ] Write `POST /api/ai/stream` edge route — auth check, reads `analysisId` from body, streams tokens via SSE, updates DB on completion
- [ ] Write tRPC `analysis.run` — validates documentIds belong to user, creates `Analysis` row with `status: 'pending'`, triggers runner, returns analysisId
- [ ] Write tRPC `analysis.getById` — returns full analysis result including risk JSON, obligations, fingerprints, checklist
- [ ] Write tRPC `analysis.getStatus` — lightweight poll endpoint (status + progress %)
- [ ] Write tRPC `analysis.chat` — multi-turn Q&A: appends user message to `Message` table, calls AI with document context + conversation history, returns answer with citation array
- [ ] Write tRPC `analysis.diff` — validates both documentIds, runs DIFF_PROMPT, returns structured diff JSON
- [ ] Write tRPC `analysis.multiCompare` — takes 3–5 documentIds, builds comparison matrix JSON
- [ ] Write tRPC `analysis.generateChecklist` — generates/regenerates checklist for an analysis
- [ ] Write tRPC `analysis.extractTimeline` — extracts obligations with dates, returns structured timeline JSON
- [ ] Write tRPC `analysis.list` — paginated analysis history for dashboard

**Relevant Context:** Sub-Tasks 1–5 complete. OpenRouter API key from user env var.

---

### Sub-Task 7 — Dashboard Features & Interactive UI
**Status:** [ ] pending

**Intent:**
Build every dashboard page and interactive analysis component. This is the core user-facing
product and must be both fully functional and visually impressive.

**Expected Outcomes:**
- `/dashboard` — animated stats overview (animated counters), recent documents, quick-action launch cards
- `/dashboard/vault` — Algolia InstantSearch document grid with glassmorphism cards + filter sidebar
- `/dashboard/upload` — DocumentUploader (from ST5) embedded in full-page workflow
- `/dashboard/analyse/[analysisId]` — full analysis workspace with all panels
- `/dashboard/compare` — two-document diff workspace
- `/dashboard/timeline` — obligation timeline page
- `/dashboard/settings` — profile, password, MFA, connected accounts, notifications
- All panels are animated, load with skeleton states, and handle empty/error states gracefully
- ELI mode toggle persisted per-analysis in DB

**Todo List:**
- [ ] Build `/app/(dashboard)/page.tsx` — stats cards (total docs, analyses run, risks found, clauses flagged) with Framer Motion count-up animation, recent documents list, quick-action cards (New Upload, Compare, Timeline)
- [ ] Build `/app/(dashboard)/vault/page.tsx` — Algolia InstantSearch + document card grid, filter by type/date/jurisdiction, sort options
- [ ] Build `src/components/vault/DocumentCard.tsx` — glassmorphism card with doc type icon, name, date, risk score badge, action menu (Analyse, Compare, Download, Delete)
- [ ] Build `/app/(dashboard)/upload/page.tsx` — DocumentUploader component in wizard layout, post-upload redirect to analysis
- [ ] Build `/app/(dashboard)/analyse/[analysisId]/page.tsx` — analysis workspace shell with tab navigation: Summary | Risk | Chat | Checklist | Timeline | Fingerprint
- [ ] Build `src/components/analysis/AnalysisSummary.tsx` — AI-generated summary panel with ELI mode toggle, jurisdiction badge, language + translate toggle
- [ ] Build `src/components/analysis/ELIModeToggle.tsx` — 3-level toggle: ELI-5 (child icon), ELI-10 (student icon), Expert (gavel icon); triggers re-analysis at selected level
- [ ] Build `src/components/analysis/RiskHeatMap.tsx` — clause list with colour-coded risk badges (animated on load), expandable detail drawer, Recharts radial chart summarising risk distribution
- [ ] Build `src/components/analysis/ChatPanel.tsx` — streaming chat interface, user message input, AI response with typing indicator, citation chips (click to highlight clause), conversation history
- [ ] Build `src/components/analysis/ChecklistPanel.tsx` — interactive checkbox list grouped by category (Before Signing, Obligations, Questions for Lawyer), exportable
- [ ] Build `src/components/analysis/ObligationTimeline.tsx` — horizontal Gantt chart using Recharts BarChart, each obligation has type, date, parties, Google Calendar add button
- [ ] Build `src/components/analysis/ClauseFingerprint.tsx` — fingerprint badge per clause, "Match found" alert if duplicate detected across vault
- [ ] Build `/app/(dashboard)/compare/page.tsx` — two-document selector + DiffViewer
- [ ] Build `src/components/analysis/DiffViewer.tsx` — react-diff-viewer-continued with clause-level grouping, significance rating badge, side-by-side and unified mode toggle
- [ ] Build `/app/(dashboard)/compare/multi/page.tsx` — multi-doc (3–5) comparison matrix
- [ ] Build `src/components/analysis/MultiDocMatrix.tsx` — pivot table: documents as columns, clause types as rows, risk level + presence indicated per cell
- [ ] Build `/app/(dashboard)/settings/page.tsx` — tabbed: Profile (avatar upload, name, email), Security (password change, MFA enrol/remove, active sessions), Connected Accounts, Notifications
- [ ] Build `src/components/analysis/JurisdictionSelector.tsx` — Google Maps Embed + country/state text selector, selection stored in Analysis
- [ ] Build `src/components/analysis/TranslateToggle.tsx` — language dropdown, calls Google Translate on analysis text, displays translated version in-place
- [ ] Add Google Calendar "Add to Calendar" button in ObligationTimeline using Calendar API OAuth flow
- [ ] Implement Algolia InstantSearch in vault: `useInstantSearch` + `useSearchBox` + `useHits` hooks

**Relevant Context:** Sub-Tasks 1–6 complete. All data via tRPC. Streaming via `/api/ai/stream`.

---

### Sub-Task 8 — Google Services Integration Layer
**Status:** [ ] pending

**Intent:**
Wire up all remaining Google service integrations — Firebase collaboration presence, FCM push
notifications, Gmail report sending, Google Docs Viewer embed, Google Safe Browsing finalisation,
Search Console + GTM event configuration — and verify all 18 integrations work end-to-end.

**Expected Outcomes:**
- Firebase Realtime DB showing live collaborator presence avatars on shared analyses
- FCM push notification received in browser when analysis completes
- Gmail "Send Report" button emails the analysis PDF to the user's Gmail
- Google Docs Viewer renders Drive-imported documents inline
- Google Safe Browsing blocks malicious URLs with user-friendly error
- GTM pushes `analysis_complete`, `document_uploaded`, `feature_used`, `eli_mode_changed` events
- Search Console verification meta tag present in `<head>`
- All 18 services verified working in staging environment

**Todo List:**
- [ ] Initialise Firebase app in `src/lib/firebase/app.ts` (client) and `src/lib/firebase/admin.ts` (server)
- [ ] Write `src/lib/firebase/presence.ts` — `usePresence(analysisId)` hook: writes user cursor to `/presence/{analysisId}/{userId}`, cleans up on disconnect
- [ ] Build `src/components/collaboration/PresenceAvatars.tsx` — live avatar stack showing connected users
- [ ] Build `src/components/collaboration/ShareAnalysisModal.tsx` — generate share link (creates `Collaboration` DB row), invite by email (Resend), copy link button
- [ ] Write `src/lib/firebase/fcm.ts` — `requestPermission()`, `onMessageListener()`, service worker registration
- [ ] Write `public/firebase-messaging-sw.js` — FCM service worker for background notifications
- [ ] Wire FCM notification trigger in `analysisRunner.ts` — calls Firebase Admin SDK `sendToDevice` on analysis completion
- [ ] Write `src/lib/google/gmail.ts` — Gmail API send using user's OAuth access token + base64-encoded PDF attachment
- [ ] Build "Send to Gmail" button in ExportMenu — triggers Gmail send with PDF attachment
- [ ] Build `src/components/ingestion/DocsViewer.tsx` — Google Docs Viewer iframe embed for Drive-imported documents
- [ ] Finalise `src/lib/ingestion/urlFetcher.ts` Safe Browsing check (referenced in ST5, implemented here with API call)
- [ ] Write `src/lib/google/gtm.ts` — typed `pushEvent(eventName, properties)` wrapper around `window.dataLayer`
- [ ] Add GTM `pushEvent` calls at: document upload, analysis run start, analysis complete, ELI mode change, export, share
- [ ] Add Google Search Console verification `<meta>` in `src/app/layout.tsx`
- [ ] Verify all 18 Google service integrations in staging — document in README table

**Relevant Context:** Sub-Tasks 1–7 complete. Firebase Admin credentials in env vars.

---

### Sub-Task 9 — Export Center, Notifications, Email & Settings
**Status:** [ ] pending

**Intent:**
Build the Export Center (PDF, DOCX, Markdown, Gmail send), notification preferences, user
settings (profile, MFA, sessions), and all transactional email templates.

**Expected Outcomes:**
- Styled PDF export of full analysis (cover page, summary, risk table, checklist, timeline, clause fingerprints)
- DOCX export of analysis summary
- Clipboard Markdown copy
- Notification preferences saved per-user (email on complete, push on complete)
- All transactional emails (welcome, password-reset, share invite, analysis-complete) using React Email templates
- Settings page: profile photo update, name/email change, password change, MFA enrol/remove, active session list, notification toggles

**Todo List:**
- [ ] Write `src/lib/export/pdf.tsx` — `@react-pdf/renderer` document template: Clarifex cover, summary section, risk table (colour coded), checklist section, obligation timeline list, clause fingerprint section, disclaimer footer
- [ ] Write `src/lib/export/docx.ts` — `docx` package: heading styles, summary paragraphs, risk table, checklist bullet list
- [ ] Write `src/lib/export/markdown.ts` — plain text markdown generator from analysis JSON
- [ ] Build `src/components/analysis/ExportMenu.tsx` — dropdown: Download PDF, Download DOCX, Copy Markdown, Send to Gmail
- [ ] Write `src/emails/WelcomeEmail.tsx` — React Email template: logo, welcome message, feature highlights, CTA button
- [ ] Write `src/emails/PasswordResetEmail.tsx` — React Email: reset button, expiry warning, security notice
- [ ] Write `src/emails/AnalysisCompleteEmail.tsx` — React Email: doc name, risk summary, CTA to view, attached PDF
- [ ] Write `src/emails/ShareInviteEmail.tsx` — React Email: inviter name, analysis preview, accept link
- [ ] Write `src/lib/email/resend.ts` — typed `sendEmail({ template, to, subject, props })` wrapper
- [ ] Write tRPC `notification.getPreferences` + `notification.updatePreferences`
- [ ] Build notification preferences UI in settings (email toggle, push toggle per event type)
- [ ] Build profile settings: avatar upload (→ R2), display name, email change (re-verify)
- [ ] Build active sessions list in settings — shows all active NextAuth sessions with device/IP, "Revoke" button

**Relevant Context:** Sub-Tasks 1–8 complete. Resend API key in env.

---

### Sub-Task 10 — Security Hardening, Testing, CI/CD & Documentation
**Status:** [ ] pending

**Intent:**
Finalise all security mitigations, write the test suite (Vitest unit + Playwright e2e), configure
Lighthouse CI, and complete the README. This is the final gate before submission.

**Expected Outcomes:**
- All security headers verified with securityheaders.com A+ rating target
- SSRF, XSS, CSRF, brute-force, file upload injection all tested
- Vitest unit tests covering: AI gateway fallback chain, SSRF guard, file validator, rate limiter, auth token helpers
- Playwright e2e tests covering: login flow, Google OAuth mock, document upload, analysis run + poll, export download, MFA enrol
- Lighthouse CI: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 95, SEO ≥ 90
- axe-core WCAG 2.1 AA: zero critical violations
- Complete `README.md` with all sections (see outline)
- `SECURITY.md` with responsible disclosure policy
- Final `.env.example` verified — zero secrets
- GitHub repository: public, single branch (`main`), size < 10 MB, CI green

**Todo List:**
- [ ] Audit and finalise `src/middleware.ts` — auth redirect, rate-limit response headers, `x-forwarded-for` extraction
- [ ] Audit CSP in `next.config.ts` — whitelist all Google API domains, Firebase, Cloudflare, Vercel, Sentry, Algolia
- [ ] Write `src/__tests__/ai/openrouter.test.ts` — mock fetch, verify fallback chain triggers on 429, verify model rotation
- [ ] Write `src/__tests__/security/fileValidator.test.ts` — test magic-byte detection for valid + invalid files
- [ ] Write `src/__tests__/security/urlFetcher.test.ts` — test SSRF block for 127.0.0.1, 169.254.x.x, private ranges
- [ ] Write `src/__tests__/auth/rateLimit.test.ts` — test sliding window blocks after 5 attempts
- [ ] Write `src/__tests__/auth/tokens.test.ts` — test reset token sign + verify + expiry
- [ ] Write `e2e/auth.spec.ts` — register, login, logout, forgot-password flow
- [ ] Write `e2e/upload.spec.ts` — file upload + paste input + URL fetch
- [ ] Write `e2e/analysis.spec.ts` — trigger analysis, poll status, verify risk heat-map renders, chat Q&A
- [ ] Write `e2e/export.spec.ts` — download PDF, copy markdown
- [ ] Configure `vitest.config.ts` and `playwright.config.ts`
- [ ] Add axe-core WCAG check to Playwright tests via `@axe-core/playwright`
- [ ] Configure Lighthouse CI: `.lighthouserc.json`, add to GitHub Actions workflow
- [ ] Write complete `README.md` — title/badges, live demo, problem statement, features with screenshots, architecture diagram, Google services table, tech stack, local setup guide, deployment guide, security notes, accessibility statement, assumptions, license
- [ ] Write `SECURITY.md`
- [ ] Final repo audit: no `.env.local`, no API keys in git history, `.gitignore` complete
- [ ] Tag `v1.0.0` and push

**Relevant Context:** All previous sub-tasks complete. Final submission check.

---

## Environment Variables Reference (`.env.example`)

```bash
# ─── App ─────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://clarifex.vercel.app
NODE_ENV=development

# ─── Database (Neon PostgreSQL) ──────────────────
DATABASE_URL=postgresql://user:password@host/clarifex?sslmode=require

# ─── NextAuth ─────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# ─── Google OAuth ────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── GitHub OAuth ────────────────────────────────
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ─── Google reCAPTCHA v3 ─────────────────────────
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# ─── Google Cloud Vision (OCR) ───────────────────
GOOGLE_CLOUD_API_KEY=

# ─── Google Translate ────────────────────────────
GOOGLE_TRANSLATE_API_KEY=

# ─── Google Safe Browsing ────────────────────────
GOOGLE_SAFE_BROWSING_API_KEY=

# ─── Google Maps ─────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# ─── Google Calendar ─────────────────────────────
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=

# ─── Google Drive ────────────────────────────────
NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_API_KEY=

# ─── Google Analytics 4 ──────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ─── Google Tag Manager ──────────────────────────
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# ─── Firebase ────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=

# ─── OpenRouter ──────────────────────────────────
OPENROUTER_API_KEY=

# ─── Cloudflare R2 ───────────────────────────────
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=clarifex-documents
NEXT_PUBLIC_R2_PUBLIC_URL=

# ─── Upstash Redis ───────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ─── Algolia ─────────────────────────────────────
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# ─── Resend ──────────────────────────────────────
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@clarifex.app

# ─── Sentry ──────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=clarifex
```

---

## Hackathon Evaluation Checklist

| Criterion | Impact | How addressed |
|---|---|---|
| **Code Quality** | High | TypeScript strict mode, tRPC end-to-end type safety, Prisma, ESLint + Prettier, modular architecture, no `any` types, Zod validation on all inputs |
| **Problem Statement Alignment** | High | All 7 listed use-cases covered; 8 genuinely novel features; ELI mode solves the "nobody reads ToS" problem directly; 6 input methods including OCR for copy-protected pages |
| **Security** | Medium | 13 OWASP mitigations, brute-force protection, audit logging, SSRF guard, no raw SQL, signed file URLs, env validation at build time |
| **Efficiency** | Medium | Edge runtime for AI stream route, Upstash Redis caching + rate-limiting, Algolia for O(1) search, R2 CDN for file delivery, Next.js ISR for marketing pages, lazy-loaded heavy components |
| **Testing** | Low | Vitest unit tests (5 test files), Playwright e2e tests (4 spec files), axe-core WCAG audit, Lighthouse CI in GitHub Actions |
| **Accessibility** | Low | WCAG 2.1 AA, full keyboard navigation, ARIA landmarks, skip-nav, screen-reader live regions, multi-language via Google Translate, responsive mobile-first |
| **Google Service Integration** | Key differentiator | 18 distinct Google/Firebase services, all free-tier, each meaningfully integrated and documented in README |

---

## File Structure Overview

```
clarifex/
├── .github/
│   └── workflows/
│       └── ci.yml
├── e2e/
│   ├── auth.spec.ts
│   ├── upload.spec.ts
│   ├── analysis.spec.ts
│   └── export.spec.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── firebase-messaging-sw.js
├── src/
│   ├── app/
│   │   ├── (auth)/          — login, register, forgot-password, reset-password, verify-mfa
│   │   ├── (dashboard)/     — dashboard pages
│   │   ├── (marketing)/     — landing page
│   │   ├── api/             — API routes (auth, upload, ocr, ai/stream, trpc)
│   │   └── layout.tsx       — root layout with providers
│   ├── components/
│   │   ├── analysis/        — RiskHeatMap, ChatPanel, DiffViewer, ObligationTimeline, etc.
│   │   ├── collaboration/   — PresenceAvatars, ShareAnalysisModal
│   │   ├── ingestion/       — DocumentUploader + 6 tabs
│   │   ├── landing/         — ParticleCanvas, feature sections
│   │   ├── layout/          — Sidebar, Navbar
│   │   ├── onboarding/      — Tour
│   │   ├── ui/              — shadcn/ui overrides + CommandPalette, ThemeToggle
│   │   └── vault/           — DocumentCard
│   ├── emails/              — React Email templates
│   ├── lib/
│   │   ├── ai/              — openrouter, prompts, analysisRunner, fingerprint, models
│   │   ├── auth/            — password, tokens, mfa, audit
│   │   ├── export/          — pdf, docx, markdown
│   │   ├── firebase/        — app, admin, presence, fcm
│   │   ├── google/          — translate, gmail, gtm, calendar
│   │   ├── ingestion/       — urlFetcher, ocrProcessor, driveImport
│   │   ├── parsers/         — pdf, docx
│   │   ├── security/        — fileValidator
│   │   ├── storage/         — r2
│   │   ├── email/           — resend wrapper
│   │   ├── prisma.ts        — Prisma Client singleton
│   │   └── rate-limit.ts    — Upstash rate limiter
│   ├── server/
│   │   └── routers/         — tRPC routers: auth, document, analysis, notification
│   ├── __tests__/           — Vitest unit tests
│   ├── auth.ts              — NextAuth v5 config
│   ├── env.ts               — @t3-oss/env-nextjs schema
│   └── middleware.ts        — route protection + rate limit
├── .env.example
├── .gitignore
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── README.md
└── SECURITY.md
```
