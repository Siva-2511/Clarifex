import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_build";
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@clarifex.app";

export const resend = new Resend(resendApiKey);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
  }[];
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not configured. Email logged to console instead of sending:");
    console.log(`To: ${opts.to}, Subject: ${opts.subject}`);
    return { success: true, id: "simulated-email-id" };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      attachments: opts.attachments,
    });

    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error("Resend email failed:", error);
    return { success: false };
  }
}
