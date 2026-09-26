"use client";

import React, { useState } from "react";
import { MapPin, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const JURISDICTIONS = [
  { code: "US-California", name: "United States (California Law)", query: "Sacramento, California, USA" },
  { code: "US-Delaware", name: "United States (Delaware Corporate Law)", query: "Dover, Delaware, USA" },
  { code: "US-NewYork", name: "United States (New York Commercial Law)", query: "New York, NY, USA" },
  { code: "UK-England", name: "United Kingdom (England & Wales)", query: "London, UK" },
  { code: "EU-General", name: "European Union (GDPR & Civil Law)", query: "Brussels, Belgium" },
  { code: "IN-General", name: "India (Indian Contract Act 1872)", query: "New Delhi, India" },
  { code: "Global-General", name: "General International Commercial Law", query: "The Hague, Netherlands" },
];

export interface JurisdictionSelectorProps {
  currentJurisdiction?: string;
  onSelect?: (jurisdiction: string) => void;
}

export function JurisdictionSelector({
  currentJurisdiction = "US-California",
  onSelect,
}: JurisdictionSelectorProps) {
  const [selected, setSelected] = useState(currentJurisdiction);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDummyMapsKeyForDev";

  const currentObj = JURISDICTIONS.find((j) => j.code === selected) || JURISDICTIONS[0];

  const handleChange = (code: string) => {
    setSelected(code);
    onSelect?.(code);
  };

  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(currentObj.query)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <MapPin className="h-3.5 w-3.5 text-violet-500" />
          <span>{currentObj.name.split("(")[1]?.replace(")", "") || currentObj.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-violet-500" />
            Legal Jurisdiction & Governing Law
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Select Jurisdiction</label>
            <Select value={selected} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {JURISDICTIONS.map((j) => (
                  <SelectItem key={j.code} value={j.code}>
                    {j.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Google Maps Embed Widget */}
          <div className="overflow-hidden rounded-xl border bg-muted h-52 relative">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jurisdiction Map"
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            Clarifex will evaluate contract enforceability, liability caps, and consumer protections specifically under {currentObj.name}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
