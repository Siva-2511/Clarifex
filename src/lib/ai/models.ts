export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  description: string;
}

export const OPENROUTER_FALLBACK_MODELS: AIModelConfig[] = [
  {
    id: "meta-llama/llama-3.1-8b-instruct:free",
    name: "Llama 3.1 8B Instruct (Free)",
    provider: "Meta",
    contextWindow: 128000,
    description: "High-accuracy open instruction model for clause breakdown (100% Free)",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B Instruct (Free)",
    provider: "Mistral AI",
    contextWindow: 32000,
    description: "Precise European model with excellent reasoning efficiency (100% Free)",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash (Free)",
    provider: "Google",
    contextWindow: 1000000,
    description: "Ultra-fast multimodal legal analysis with high token limit (100% Free)",
  },
  {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek Chat (Free)",
    provider: "DeepSeek",
    contextWindow: 64000,
    description: "Deep semantic understanding and fine-grained legal structure (100% Free)",
  },
  {
    id: "microsoft/phi-3-mini-128k-instruct:free",
    name: "Phi-3 Mini 128K (Free)",
    provider: "Microsoft",
    contextWindow: 128000,
    description: "Compact high-performance reasoning model with extended context (100% Free)",
  },
  {
    id: "qwen/qwen-2-7b-instruct:free",
    name: "Qwen 2 7B Instruct (Free)",
    provider: "Alibaba Cloud",
    contextWindow: 32000,
    description: "Strong multilingual comprehension and structured extraction (100% Free)",
  },
  {
    id: "google/gemini-flash-1.5",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    contextWindow: 1000000,
    description: "Ultra-fast legal reasoning with a 1M token context window",
  },
];
