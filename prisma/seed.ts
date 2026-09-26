import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Clarifex database...");

  const hashedPassword = await bcrypt.hash("ClarifexDemo2026!", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@clarifex.app" },
    update: {},
    create: {
      email: "demo@clarifex.app",
      name: "Alex Vance",
      password: hashedPassword,
      role: "user",
      firstLogin: false,
      mfaEnabled: false,
    },
  });

  const demoDoc = await prisma.document.create({
    data: {
      userId: demoUser.id,
      name: "SaaS_Service_Agreement_Acme.pdf",
      type: "pdf",
      storageKey: "documents/seed/saas_acme.pdf",
      sizeBytes: 245890,
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      jurisdiction: "US-California",
      language: "en",
      extractedText: `SOFTWARE AS A SERVICE (SAAS) AGREEMENT
This Agreement is entered into on January 15, 2026, by and between CloudCore Inc. ("Provider") and Acme Corp ("Customer").
1. TERM AND TERMINATION. This Agreement will commence on the Effective Date and continue for a period of twelve (12) months. It shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.
2. INDEMNIFICATION. Customer agrees to indemnify, defend, and hold harmless Provider from any claims, damages, liabilities, and expenses arising out of Customer's use of the Service, without limitation.
3. LIMITATION OF LIABILITY. IN NO EVENT SHALL PROVIDER'S AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNT PAID BY CUSTOMER IN THE ONE (1) MONTH PRECEDING THE CLAIM. PROVIDER SHALL NOT BE LIABLE FOR ANY CONSEQUENTIAL OR PUNITIVE DAMAGES.
4. DATA OWNERSHIP AND PRIVACY. Customer retains all rights to Customer Data. Provider may use aggregated and anonymized telemetry data for system optimization.`,
    },
  });

  const sampleAnalysis = await prisma.analysis.create({
    data: {
      userId: demoUser.id,
      documentIds: [demoDoc.id],
      status: "completed",
      modelUsed: "google/gemini-flash-1.5",
      comprehensionLevel: "eli-10",
      riskScore: 7.8,
      resultJson: {
        summary: "This is a standard 12-month B2B SaaS agreement with automatic renewals. However, it contains severe, one-sided liability limitations and unlimited customer indemnification obligations that heavily favor the Provider.",
        clauses: [
          {
            id: "clause-1",
            title: "Term & Automatic Renewal",
            type: "term",
            riskLevel: "medium",
            text: "It shall automatically renew for successive 12-month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration...",
            reason: "60-day non-renewal notice period with 1-year auto-lockin requires strict calendar monitoring to prevent unwanted annual renewal.",
            pageRef: 1,
            fingerprint: "c1a2b3d4e5f6",
          },
          {
            id: "clause-2",
            title: "Unilateral Customer Indemnification",
            type: "indemnity",
            riskLevel: "high",
            text: "Customer agrees to indemnify, defend, and hold harmless Provider from any claims, damages, liabilities, and expenses arising out of Customer's use of the Service, without limitation.",
            reason: "Unlimited indemnification creates uncapped financial exposure for customer actions, even in cases of provider negligence.",
            pageRef: 1,
            fingerprint: "f6e5d4c3b2a1",
          },
          {
            id: "clause-3",
            title: "Severe Liability Cap",
            type: "liability",
            riskLevel: "high",
            text: "IN NO EVENT SHALL PROVIDER'S AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNT PAID BY CUSTOMER IN THE ONE (1) MONTH PRECEDING THE CLAIM.",
            reason: "A 1-month fee liability cap is abnormally restrictive and renders provider breach remedies virtually unenforceable.",
            pageRef: 1,
            fingerprint: "112233445566",
          },
        ],
        obligations: [
          {
            id: "ob-1",
            description: "Provide written notice of non-renewal (at least 60 days before Nov 16, 2026)",
            dueDate: "2026-11-16",
            parties: ["Acme Corp"],
            noticePeriod: "60 days",
          },
          {
            id: "ob-2",
            description: "Annual contract renewal date",
            dueDate: "2027-01-15",
            parties: ["CloudCore Inc.", "Acme Corp"],
            noticePeriod: "Annual",
          },
        ],
      },
    },
  });

  await prisma.checklist.create({
    data: {
      analysisId: sampleAnalysis.id,
      items: [
        {
          id: "chk-1",
          category: "Before Signing",
          label: "Negotiate Provider Liability Cap to 12 months fees (currently 1 month)",
          checked: false,
          importance: "critical",
          explanation: "A 1-month cap leaves your business virtually unprotected if the service goes down or suffers a data breach.",
        },
        {
          id: "chk-2",
          category: "Before Signing",
          label: "Make Indemnification Mutual and Cap at Insurance Coverage",
          checked: false,
          importance: "critical",
          explanation: "Provider should indemnify customer for IP infringement and data breaches.",
        },
        {
          id: "chk-3",
          category: "Questions for Lawyer",
          label: "Does California choice of law affect the enforceability of the 1-month liability cap?",
          checked: false,
          importance: "high",
          explanation: "Under California commercial law, unconscionable liability limits can sometimes be challenged.",
        },
      ],
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
