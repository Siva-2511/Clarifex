import React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Clarifex",
  description: "Terms and conditions governing the use of the Clarifex AI legal document analysis platform.",
};

export default function TermsPage() {
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
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: September 27, 2026 · Effective immediately</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-700 dark:text-amber-400">
          <strong>Important Notice:</strong> Clarifex is an AI-powered document analysis tool and does
          <strong> not provide legal advice</strong>. Analysis results are informational only. Always consult a
          qualified attorney before making legal decisions.
        </div>

        {[
          {
            title: "1. Acceptance of Terms",
            body: `By accessing or using Clarifex ("Service", "Platform"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree, do not use the Service. These Terms apply to all visitors, users, and registered account holders.`,
          },
          {
            title: "2. Description of Service",
            body: `Clarifex provides AI-powered analysis of legal documents including contracts, agreements, leases, terms of service, and similar instruments. Features include clause risk detection, ELI-5/ELI-10/Expert plain-language summaries, contract comparison (diff/redline), obligation timeline extraction, multi-document matrix comparison, clause DNA fingerprinting, and export to PDF/DOCX. The Service is provided on an "as is" and "as available" basis.`,
          },
          {
            title: "3. Not Legal Advice",
            body: `Clarifex is an informational tool, not a law firm. Nothing produced by the Service constitutes legal advice, creates an attorney-client relationship, or should be relied upon as a substitute for consultation with a qualified legal professional. AI-generated analysis may contain errors, omissions, or misinterpretations. You assume all risk associated with reliance on analysis results.`,
          },
          {
            title: "4. Account Registration",
            body: `You must be at least 18 years of age to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You agree to provide accurate information and to notify us immediately of any unauthorised access. We reserve the right to suspend or terminate accounts that violate these Terms.`,
          },
          {
            title: "5. Acceptable Use",
            body: `You agree not to: (a) upload documents you do not own or have permission to analyse; (b) use the Service to process illegal, harmful, or fraudulent content; (c) attempt to reverse-engineer, scrape, or circumvent any security measures; (d) use automated bots or scripts to access the Service; (e) resell or sublicense access to the Service; (f) use the Service to violate any applicable law or regulation.`,
          },
          {
            title: "6. Your Content",
            body: `You retain full ownership of all documents and data you upload to Clarifex. By uploading content, you grant us a limited, non-exclusive, royalty-free licence to process that content solely for the purpose of providing the Service to you. We do not claim any ownership over your documents. We do not use your documents to train AI models.`,
          },
          {
            title: "7. Intellectual Property",
            body: `The Clarifex platform, interface, branding, and all software components are the intellectual property of Clarifex and its licensors. You may not copy, modify, distribute, or create derivative works based on the platform without express written consent. Analysis reports you generate from your own documents may be used by you without restriction.`,
          },
          {
            title: "8. Disclaimer of Warranties",
            body: `THE SERVICE IS PROVIDED WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM HARMFUL COMPONENTS. AI-GENERATED ANALYSIS MAY BE INACCURATE OR INCOMPLETE.`,
          },
          {
            title: "9. Limitation of Liability",
            body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLARIFEX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE. OUR AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF (A) THE FEES YOU PAID IN THE 12 MONTHS PRIOR TO THE CLAIM OR (B) £100 GBP.`,
          },
          {
            title: "10. Indemnification",
            body: `You agree to indemnify, defend, and hold harmless Clarifex and its officers, directors, and employees from any claims, damages, losses, costs, and expenses (including attorneys' fees) arising from your use of the Service, your violation of these Terms, or your infringement of any third-party rights.`,
          },
          {
            title: "11. Privacy",
            body: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at clarifex.app/privacy to understand our data practices.`,
          },
          {
            title: "12. Termination",
            body: `We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. You may delete your account at any time through the Settings page. Upon termination, your data will be deleted in accordance with our Privacy Policy. Sections 3, 8, 9, and 10 survive termination.`,
          },
          {
            title: "13. Modifications to Terms",
            body: `We may update these Terms at any time. Material changes will be communicated via email or an in-app notice at least 14 days before taking effect. Your continued use of the Service after changes take effect constitutes acceptance of the new Terms.`,
          },
          {
            title: "14. Governing Law",
            body: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Service shall be resolved through good-faith negotiation, followed by binding arbitration if necessary.`,
          },
          {
            title: "15. Contact Us",
            body: `For questions about these Terms, contact us at: sivasubramaniyan.g2511@gmail.com`,
          },
        ].map(({ title, body }) => (
          <section key={title} className="space-y-3">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/40 py-8 px-6 text-center text-xs text-muted-foreground mt-10">
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
