export interface SendGmailParams {
  accessToken: string;
  to: string;
  subject: string;
  bodyText: string;
  pdfAttachmentBase64?: string;
  pdfFileName?: string;
}

/**
 * Sends an email with optional PDF attachment via the Gmail API
 */
export async function sendAnalysisViaGmail(params: SendGmailParams): Promise<{ success: boolean; id?: string }> {
  try {
    const boundary = "clarifex_mail_boundary_" + Date.now();
    let rawMessage = "";

    if (params.pdfAttachmentBase64) {
      rawMessage = [
        `To: ${params.to}`,
        `Subject: =?utf-8?B?${Buffer.from(params.subject).toString("base64")}?=`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: 7bit",
        "",
        params.bodyText,
        "",
        `--${boundary}`,
        `Content-Type: application/pdf; name="${params.pdfFileName || "Legal_Analysis.pdf"}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${params.pdfFileName || "Legal_Analysis.pdf"}"`,
        "",
        params.pdfAttachmentBase64,
        "",
        `--${boundary}--`,
      ].join("\r\n");
    } else {
      rawMessage = [
        `To: ${params.to}`,
        `Subject: =?utf-8?B?${Buffer.from(params.subject).toString("base64")}?=`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "",
        params.bodyText,
      ].join("\r\n");
    }

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gmail API failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Gmail sending error:", error);
    return { success: false };
  }
}
