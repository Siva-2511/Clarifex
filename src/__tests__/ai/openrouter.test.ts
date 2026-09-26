import { describe, it, expect, vi, beforeEach } from "vitest";
import { callAI } from "@/lib/ai/openrouter";

describe("OpenRouter AI Fallback Chain", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should provide deterministic legal analysis when API key is not set", async () => {
    const originalKey = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    const res = await callAI({ prompt: "Analyze contract" });
    expect(res.modelUsed).toBe("meta-llama/llama-3.1-8b-instruct:free");
    expect(res.text).toContain("summary");
    expect(res.text).toContain("riskScore");

    process.env.OPENROUTER_API_KEY = originalKey;
  });

  it("should cycle to next model on HTTP 429 rate limit error", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation((url, options) => {
      callCount++;
      const body = JSON.parse(options.body);

      // First model (llama-3.1) fails with 429
      if (body.model === "meta-llama/llama-3.1-8b-instruct:free") {
        return Promise.resolve({
          status: 429,
          ok: false,
          text: () => Promise.resolve("Rate limit exceeded"),
        });
      }

      // Second model (mistral-7b) succeeds
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: "Fallback model analysis successful" } }],
          }),
      });
    });

    const res = await callAI({ prompt: "Test prompt" });
    expect(callCount).toBe(2);
    expect(res.modelUsed).toBe("mistralai/mistral-7b-instruct:free");
    expect(res.text).toBe("Fallback model analysis successful");
  });
});
