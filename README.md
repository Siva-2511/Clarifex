# Clarifex — AI Legal Document Intelligence Platform

> **AI for Legal Assistance & Access** · Built for the Hack2Skill AI Innovation Challenge

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Tests](https://img.shields.io/badge/tests-25%2F25-brightgreen)](#testing)

---

## 🎯 Problem Statement

Access to legal expertise is inequitable. Complex legal documents — NDAs, employment contracts, leases, service agreements — are routinely signed without comprehension by individuals who cannot afford legal counsel. Clarifex bridges this gap using **Generative AI** to democratise legal document understanding.

---

## 🧠 Generative AI Services Utilised

| Service | Where Used |
|---|---|
| **Google Gemini Flash 1.5** (via OpenRouter) | Primary AI engine for clause analysis, risk scoring, ELI summaries |
| **Anthropic Claude 3 Haiku** (via OpenRouter) | Fallback model with automatic failover on rate limits |
| **Google Cloud Vision API** | OCR — extracts text from scanned legal document images |
| **Google Cloud Translate API** | Real-time multilingual translation of analysis results |
| **Google Cloud Natural Language** | Entity extraction for obligation timeline detection |
| **Firebase Realtime Database** | Live collaboration presence (who's viewing which clause) |
| **Firebase Cloud Messaging (FCM V1)** | Push notifications for analysis completion |
| **Google reCAPTCHA v3** | Invisible bot protection on all auth forms |
| **Google Calendar API** | Export obligation deadlines as calendar events |
| **Gmail API** | Send analysis reports directly to collaborators |
| **Google Drive API** | Import documents directly from Google Drive |
| **Algolia AI Search** | Full-text semantic search across document vault |

---

## ✨ Key Features

### 🔍 Core AI Analysis
- **Risk Heat Map** — Colour-coded clause-level risk scoring (Critical / High / Medium / Low)
- **Clause DNA Fingerprinting** — Detect copied or similar clauses across document versions
- **Obligation Timeline** — Auto-extract deadlines and duties into a Gantt-style timeline
- **AI Chat** — Ask natural language questions about any clause
- **Multi-doc Matrix** — Compare up to 5 contracts side-by-side with AI-powered diff

### 📖 ELI (Explain Like I Am) Modes
| Mode | Audience |
|---|---|
| **ELI-5** | Children — metaphor-based explanations |
| **ELI-10** | General public — plain English |
| **Expert** | Lawyers — doctrine, case law, jurisdiction |

### 📄 Document Ingestion (6 Methods)
- **File Upload** (PDF, DOCX, TXT) with virus-check validation
- **Screenshot / Camera** with Google Cloud Vision OCR
- **URL Import** with SSRF-protected content fetching
- **Google Drive** direct import
- **Paste Text** for raw clause input
- **Batch Upload** for bulk contract analysis

### 🔒 Security & Privacy
- Bcrypt password hashing + TOTP MFA (authenticator app)
- Upstash Redis rate limiting (per-IP and per-user)
- Row-level security on Supabase Storage (signed URLs)
- CSRF protection via NextAuth.js
- Full audit trail for all sensitive actions

### 📤 Export & Collaboration
- Export to **PDF**, **DOCX**, **Markdown**
- Send via **Gmail API**
- Real-time **presence avatars** (Firebase RTDB)
- **Share & invite** collaborators with granular access

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ (auth)/  │  │(marketing│  │   /dashboard/*        │  │
│  │ login    │  │  )/      │  │   ├─ /upload          │  │
│  │ register │  │ landing  │  │   ├─ /vault           │  │
│  │ mfa      │  │ /privacy │  │   ├─ /analyse/[id]    │  │
│  └──────────┘  │ /terms   │  │   ├─ /compare         │  │
│                └──────────┘  │   ├─ /timeline        │  │
│                              │   └─ /settings        │  │
│                              └──────────────────────┘  │
├──────────────┬──────────────┬───────────────────────────┤
│  tRPC v10    │  NextAuth.js │  Middleware (edge)        │
│  API Layer   │  JWT sessions│  Rate limiting + auth     │
├──────────────┴──────────────┴───────────────────────────┤
│           External Services                              │
│  Neon PostgreSQL │ Supabase Storage │ Upstash Redis      │
│  OpenRouter AI   │ Firebase         │ Algolia Search     │
│  Resend Email    │ Google APIs      │ Sentry Monitoring  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/Siva-2511/Clarifex.git
cd Clarifex

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your API keys (see .env.example for full list)

# 4. Push database schema
npx prisma db push

# 5. Start development server
pnpm dev
# → http://localhost:3000
```

---

## 🧪 Testing

```bash
pnpm test        # Run all unit tests
pnpm test:watch  # Watch mode
```

**25 tests across 7 suites:**
- `fileValidator` — MIME type and size validation
- `urlFetcher` — SSRF protection
- `tokens` — JWT generation and verification
- `openrouter` — AI model fallback chain
- `rateLimit` — Per-IP rate limiting
- `documentUtils` — Text processing and risk scoring
- `a11y` — Accessibility utility helpers

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register, MFA, Password Reset
│   ├── (marketing)/     # Landing page, Privacy, Terms
│   ├── dashboard/       # All protected app routes
│   └── api/             # REST endpoints + tRPC handler
├── components/
│   ├── analysis/        # RiskHeatMap, ClauseFingerprint, ChatPanel, ELI Toggle…
│   ├── ingestion/       # 6-method document upload tabs
│   ├── collaboration/   # Presence avatars, Share modal
│   └── ui/              # Shadcn/ui primitives + ErrorBoundary
├── lib/
│   ├── ai/              # OpenRouter client, prompts, analysis runner
│   ├── auth/            # Password, MFA, tokens
│   ├── google/          # Calendar, Gmail, Translate, GTM
│   ├── ingestion/       # OCR, URL fetcher, Drive import
│   ├── export/          # PDF, DOCX, Markdown
│   └── storage/         # Supabase Storage adapter
└── server/
    └── routers/         # tRPC routers: analysis, document, auth, notification
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| API Layer | tRPC v10 + React Query v4 |
| Auth | NextAuth.js v5 (Google, GitHub, Credentials, MFA) |
| Database | Neon PostgreSQL + Prisma ORM |
| File Storage | Supabase Storage |
| Cache / Rate Limit | Upstash Redis |
| AI | OpenRouter (Gemini, Claude, Llama fallback chain) |
| Search | Algolia |
| Email | Resend |
| Monitoring | Sentry |
| Realtime | Firebase RTDB + FCM |
| Styling | Tailwind CSS + Shadcn/ui |
| Testing | Vitest |

---

## 📜 Legal Pages

- [Privacy Policy](http://localhost:3000/privacy)
- [Terms of Service](http://localhost:3000/terms)

---

## 👤 Author

**Sivasubramaniyan G** — [sivasubramaniyan.g2511@gmail.com](mailto:sivasubramaniyan.g2511@gmail.com)

---

*Clarifex — Stop signing in the dark.*
