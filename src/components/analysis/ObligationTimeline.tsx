"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock, Users, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { generateGoogleCalendarUrl } from "@/lib/google/calendar";

export interface ObligationItem {
  id: string;
  description: string;
  dueDate: string;
  parties?: string[];
  noticePeriod?: string;
  type?: string;
}

export interface ObligationTimelineProps {
  obligations: ObligationItem[];
}

export function ObligationTimeline({ obligations = [] }: ObligationTimelineProps) {
  const handleAddToCalendar = (ob: ObligationItem) => {
    // Generate valid YYYY-MM-DD date or use 30 days from now if relative string
    let formattedDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}$/.test(ob.dueDate)) {
      formattedDate = ob.dueDate;
    }

    const calendarUrl = generateGoogleCalendarUrl({
      title: ob.description,
      description: `Parties: ${(ob.parties || []).join(", ") || "All"}\nNotice Window: ${
        ob.noticePeriod || "N/A"
      }`,
      startDate: formattedDate,
    });

    window.open(calendarUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-base">Obligation & Renewal Timeline</h3>
        <p className="text-xs text-muted-foreground">
          Track contract milestones, auto-renewal notification windows, and delivery dates. Sync any date to Google Calendar.
        </p>
      </div>

      {obligations.length === 0 ? (
        <div className="border border-dashed rounded-2xl py-12 text-center space-y-2">
          <CalendarIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
          <p className="text-xs text-muted-foreground">No specific dates or deadlines extracted.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-violet-500/30 ml-4 space-y-6 pb-2">
          {obligations.map((ob, idx) => (
            <div key={ob.id || idx} className="relative pl-6">
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-violet-600 shadow" />

              <Card className="glass-panel">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-violet-500 shrink-0" />
                      <span className="font-bold text-sm text-foreground">
                        {ob.dueDate || "Contract Milestone"}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCalendar(ob)}
                      className="h-8 gap-1.5 text-xs text-violet-600 hover:text-violet-500"
                    >
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>Add to Google Calendar</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                  </div>

                  <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                    {ob.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    {Array.isArray(ob.parties) && ob.parties.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Parties: {ob.parties.join(", ")}
                      </span>
                    )}
                    {ob.noticePeriod && (
                      <Badge variant="warning" className="text-[10px]">
                        Notice Required: {ob.noticePeriod}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
