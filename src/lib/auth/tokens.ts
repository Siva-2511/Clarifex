import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "clarifex-secure-fallback-secret-for-tokens-2026";

export interface TokenPayload {
  email: string;
  exp: number; // epoch ms
}

/**
 * Generates an HMAC signed token with expiry for password reset or collaboration invite
 */
export function generateSignedToken(email: string, expiresInMs = 1000 * 60 * 60): string {
  const payload: TokenPayload = {
    email,
    exp: Date.now() + expiresInMs,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadStr)
    .digest("base64url");

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies HMAC signed token and checks if expired
 */
export function verifySignedToken(token: string): { valid: boolean; email?: string; error?: string } {
  try {
    const [payloadStr, signature] = token.split(".");
    if (!payloadStr || !signature) {
      return { valid: false, error: "Malformed token" };
    }

    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(payloadStr)
      .digest("base64url");

    const sigBuf = Buffer.from(signature, "utf-8");
    const expectedBuf = Buffer.from(expectedSignature, "utf-8");

    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return { valid: false, error: "Invalid signature" };
    }

    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadStr, "base64url").toString("utf-8"),
    );

    if (Date.now() > payload.exp) {
      return { valid: false, error: "Token has expired" };
    }

    return { valid: true, email: payload.email };
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
}
