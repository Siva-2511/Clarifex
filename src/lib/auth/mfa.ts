import { authenticator } from "otplib";
import QRCode from "qrcode";

authenticator.options = {
  window: 1, // Allow 1 step backward/forward for slight clock drifts
};

export function generateMfaSecret(): string {
  return authenticator.generateSecret();
}

export function generateOtpauthUri(email: string, secret: string): string {
  return authenticator.keyuri(email, "Clarifex Legal AI", secret);
}

export async function generateQrCodeDataUrl(otpauthUri: string): Promise<string> {
  return QRCode.toDataURL(otpauthUri);
}

export function verifyTotpToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (e) {
    return false;
  }
}
