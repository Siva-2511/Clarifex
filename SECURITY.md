# Security Policy

Clarifex is built on a "secure by default" architecture adhering to the OWASP Top 10 guidelines for enterprise and consumer legal AI applications.

## Security Architecture & Mitigations

| Vulnerability Area | Mitigation Strategy |
|---|---|
| **SQL Injection** | Prisma ORM parameterised queries only — zero raw SQL execution. |
| **Cross-Site Request Forgery (CSRF)** | NextAuth.js built-in CSRF tokens on all state-mutating authentication and API endpoints. |
| **Server-Side Request Forgery (SSRF)** | Dedicated SSRF filter (`src/lib/ingestion/urlFetcher.ts`) blocking loopback (`127.0.0.0/8`, `::1`), private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud metadata (`169.254.169.254`), supplemented by Google Safe Browsing API checks. |
| **Cross-Site Scripting (XSS)** | React JSX escaping, DOMPurify sanitization, and strict Content Security Policy (CSP) headers in `next.config.mjs`. |
| **Brute Force & Credential Stuffing** | Upstash Redis sliding-window rate limiter enforcing a maximum of 5 attempts per 15 minutes per IP on all authentication routes. |
| **Broken Access Control** | tRPC protected procedures enforce session identity on every procedure; all database queries strictly scoped to `ctx.session.user.id`. |
| **Insecure File Uploads** | Magic-byte validation (`src/lib/security/fileValidator.ts`), MIME type verification, strict 10MB size capping, and isolated storage in private Cloudflare R2 buckets with pre-signed URLs. |
| **Data Protection & Storage** | All storage paths use server-generated UUIDs (preventing path traversal). Transport is strictly TLS 1.3 / HSTS. |
| **Secrets Exposure** | `@t3-oss/env-nextjs` validates environment variables at build-time; `.env*` files are strictly excluded via `.gitignore`. |
| **Audit Logging** | High-security events (login, failed login, MFA updates, document actions, analysis runs, exports) are logged into the `AuditLog` table. |

## Reporting a Vulnerability

If you discover a security vulnerability in Clarifex, please report it responsibly by contacting the maintainers or opening an encrypted issue. We will respond within 48 hours to assess and patch any confirmed issues.
