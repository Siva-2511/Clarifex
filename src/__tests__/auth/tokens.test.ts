import { describe, it, expect } from "vitest";
import { generateSignedToken, verifySignedToken } from "@/lib/auth/tokens";

describe("Signed Authentication Tokens", () => {
  it("should generate and verify valid tokens", () => {
    const email = "user@clarifex.app";
    const token = generateSignedToken(email, 1000 * 60 * 10); // 10 mins

    const result = verifySignedToken(token);
    expect(result.valid).toBe(true);
    expect(result.email).toBe(email);
  });

  it("should reject tampered token signatures", () => {
    const token = generateSignedToken("user@clarifex.app");
    const [payload, signature] = token.split(".");
    const tampered = `${payload}.${signature}tampered`;

    const result = verifySignedToken(tampered);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Invalid signature");
  });

  it("should reject expired tokens", async () => {
    // Generate token with 1ms expiry
    const token = generateSignedToken("user@clarifex.app", 1);
    await new Promise((r) => setTimeout(r, 20));

    const result = verifySignedToken(token);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("expired");
  });
});
