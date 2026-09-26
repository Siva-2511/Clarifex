import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("Sliding Window Rate Limiter", () => {
  it("should allow first 5 attempts and block the 6th", async () => {
    const testId = `test-ip-${Date.now()}`;

    for (let i = 1; i <= 5; i++) {
      const res = await rateLimit(testId);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(5 - i);
    }

    // 6th attempt must be blocked
    const blockedRes = await rateLimit(testId);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});
