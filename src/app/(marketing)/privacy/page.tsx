import React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Clarifex",
  description: "How Clarifex collects, uses, and protects your personal data and legal documents.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
              <Scale className="h-4 w-4" />
            </div>
            CLARIFEX
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-sm dark:prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: September 27, 2026 · Effective immediately</p>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">1. Who We Are</h2>
          <p className="text-muted-foreground leading-relaxed">
            Clarifex (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an AI-powered legal document analysis
            platform. Our registered contact email is{" "}
            <a href="mailto:sivasubramaniyan.g2511@gmail.com" className="text-violet-500 underline">
              sivasubramaniyan.g2511@gmail.com
            </a>
            . This Privacy Policy explains how we collect, use, store, and protect information when you use
            Clarifex at{" "}
            <a href="https://clarifex.app" className="text-violet-500 underline">
              clarifex.app
            </a>{" "}
            (the &ldquo;Service&rdquo;).
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">2. Information We Collect</h2>
          <h3 className="font-semibold">2.1 Account Information</h3>
          <p className="text-muted-foreground leading-relaxed">
            When you register, we collect your name, email address, and (if using password login) a securely
            hashed version of your password using bcrypt. If you sign in with Google or GitHub, we receive
            your public profile information from those providers.
          </p>
          <h3 className="font-semibold">2.2 Documents You Upload</h3>
          <p className="text-muted-foreground leading-relaxed">
            You may upload legal documents (PDFs, DOCX files, plain text, images, or URLs) for AI analysis.
            These documents are stored encrypted in Supabase Storage. We process their text content solely
            to provide the analysis features you request. <strong>We do not use your documents to train
            AI models.</strong>
          </p>
          <h3 className="font-semibold">2.3 Usage Data</h3>
          <p className="text-muted-foreground leading-relaxed">
            We automatically collect log data such as IP address, browser type, pages visited, and timestamps
            for security, rate-limiting, and service improvement purposes. This data is retained for 90 days.
          </p>
          <h3 className="font-semibold">2.4 AI Analysis Data</h3>
          <p className="text-muted-foreground leading-relaxed">
            Text extracted from your documents is sent to OpenRouter AI inference services to generate analysis
            results. We transmit only the minimum text necessary. Analysis results are stored in our database
            and linked to your account.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>To provide, operate, and maintain the Clarifex service</li>
            <li>To perform AI-powered legal analysis on documents you submit</li>
            <li>To authenticate your identity and secure your account (including optional MFA)</li>
            <li>To send transactional emails (account creation, password reset, shared analysis invitations)</li>
            <li>To detect and prevent fraud, abuse, and security threats</li>
            <li>To comply with applicable legal obligations</li>
            <li>To improve service quality through aggregate, anonymised usage analytics</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We <strong>do not sell</strong> your personal data or documents to third parties. We do not use
            your documents for advertising purposes.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">4. Data Storage &amp; Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data is stored in the following locations:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Database:</strong> Neon PostgreSQL (encrypted at rest, TLS in transit)</li>
            <li><strong>File Storage:</strong> Supabase Storage (row-level security enforced, signed URLs)</li>
            <li><strong>Session Data:</strong> Upstash Redis (encrypted, auto-expiring tokens)</li>
            <li><strong>Presence &amp; Notifications:</strong> Firebase Realtime Database (Google Cloud)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security controls: HTTPS/TLS everywhere, CSRF protection, rate
            limiting, bcrypt password hashing, short-lived JWT sessions, and audit logging for all sensitive
            actions.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">5. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the following third-party providers. Each is bound by their own privacy policies:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Provider</th>
                  <th className="text-left px-4 py-2 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["OpenRouter / Google Gemini / Anthropic", "AI legal analysis inference"],
                  ["Google OAuth", "Social sign-in"],
                  ["GitHub OAuth", "Social sign-in"],
                  ["Google reCAPTCHA", "Bot protection on auth forms"],
                  ["Firebase (Google)", "Real-time collaboration, push notifications"],
                  ["Resend", "Transactional email delivery"],
                  ["Algolia", "Full-text document search"],
                  ["Supabase", "File storage"],
                  ["Neon", "Relational database"],
                  ["Upstash", "Rate limiting and session caching"],
                  ["Sentry", "Error monitoring (anonymised)"],
                ].map(([provider, purpose]) => (
                  <tr key={provider} className="bg-card/40">
                    <td className="px-4 py-2 font-medium">{provider}</td>
                    <td className="px-4 py-2 text-muted-foreground">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">6. Data Retention</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Account data is retained while your account is active.</li>
            <li>Uploaded documents are retained until you delete them or close your account.</li>
            <li>Audit logs are retained for 12 months for security compliance.</li>
            <li>Upon account deletion, all your data is permanently erased within 30 days.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Correct</strong> inaccurate data via your account settings</li>
            <li><strong>Delete</strong> your account and all associated data</li>
            <li><strong>Export</strong> your documents and analysis results at any time</li>
            <li><strong>Object</strong> to certain processing activities</li>
            <li><strong>Withdraw consent</strong> for optional processing</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:sivasubramaniyan.g2511@gmail.com" className="text-violet-500 underline">
              sivasubramaniyan.g2511@gmail.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">8. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use only essential cookies required to operate the service: session tokens (HTTP-only, Secure,
            SameSite=Lax) and theme preference (local storage). We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Clarifex is not directed to individuals under the age of 18. We do not knowingly collect personal
            data from children. If you believe a child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-bold">10. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material changes by
            email or by a prominent notice in the application at least 14 days before the changes take effect.
            Your continued use of the Service after that date constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-4 mb-16">
          <h2 className="text-xl font-bold">11. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related questions or requests, contact us at:
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:sivasubramaniyan.g2511@gmail.com" className="text-violet-500 underline">
              sivasubramaniyan.g2511@gmail.com
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/40 py-8 px-6 text-center text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} Clarifex. All rights reserved.</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
