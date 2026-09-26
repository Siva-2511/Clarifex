"use client";

import React, { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "en", name: "English (Original)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
];

export interface TranslateToggleProps {
  textToTranslate: string;
  onTranslated: (translated: string) => void;
}

export function TranslateToggle({ textToTranslate, onTranslated }: TranslateToggleProps) {
  const [currentLang, setCurrentLang] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (langCode: string) => {
    if (langCode === "en") {
      setCurrentLang("en");
      onTranslated(textToTranslate);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage: langCode,
        }),
      });

      if (!res.ok) throw new Error("Translation failed");
      const data = await res.json();
      setCurrentLang(langCode);
      onTranslated(data.translatedText);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Languages className="h-3.5 w-3.5" />
          )}
          <span>{LANGUAGES.find((l) => l.code === currentLang)?.name.split(" ")[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleTranslate(lang.code)}
            className="text-xs cursor-pointer"
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
