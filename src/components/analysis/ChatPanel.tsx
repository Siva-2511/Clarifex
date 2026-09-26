"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: any;
  createdAt?: string | Date;
}

export interface ChatPanelProps {
  analysisId: string;
  initialMessages?: MessageItem[];
}

export function ChatPanel({ analysisId, initialMessages = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = (trpc.analysis.chat.useMutation as any)({
    onSuccess: (assistantMsg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsg.id,
          role: "assistant",
          content: assistantMsg.content,
          citations: assistantMsg.citations,
        },
      ]);
      setIsTyping(false);
    },
    onError: (err: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `Error: ${err.message}. Please try again.`,
        },
      ]);
      setIsTyping(false);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMsg: MessageItem = {
      id: Math.random().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    chatMutation.mutate({
      analysisId,
      message: text,
    });
  };

  const quickPrompts = [
    "What is the notice period for non-renewal?",
    "Is the indemnification clause mutual?",
    "Can the provider unilaterally change prices?",
  ];

  return (
    <div className="flex flex-col h-[650px] rounded-xl border bg-card overflow-hidden">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-muted-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <Bot className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-semibold text-sm text-foreground">Contract Q&A Assistant</h4>
              <p className="text-xs">
                Ask any question about this agreement. Every answer cites exact clauses and sections.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-sm ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 space-y-2 ${
                    isUser
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-muted/60 text-foreground rounded-tl-none border"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                    {m.content}
                  </p>

                  {/* Citation chips */}
                  {Array.isArray(m.citations) && m.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/40">
                      {m.citations.map((cite: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] gap-1 bg-background/50">
                          <Quote className="h-2.5 w-2.5 text-violet-400" />
                          {cite}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-muted/60 px-4 py-2 border">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />
              <span>Analyzing contract clauses...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-3 border-t bg-muted/20"
      >
        <Input
          placeholder="Ask a question about this contract..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-1 text-sm bg-background"
        />
        <Button type="submit" size="icon" variant="gradient" disabled={isTyping || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
