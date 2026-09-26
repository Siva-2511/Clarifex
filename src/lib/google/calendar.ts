export interface CalendarEventPayload {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
}

/**
 * Generates a direct Google Calendar web event creation URL for zero-auth one-click calendar addition
 */
export function generateGoogleCalendarUrl(payload: CalendarEventPayload): string {
  const base = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", `[Clarifex] ${payload.title}`);
  params.set("details", `${payload.description}\n\nManaged by Clarifex Legal AI Assistant`);

  // Format date as YYYYMMDD
  const dateFormatted = payload.startDate.replace(/-/g, "");
  params.set("dates", `${dateFormatted}/${dateFormatted}`);

  return `${base}?${params.toString()}`;
}

/**
 * Inserts event directly using Google Calendar REST API when OAuth token has calendar scope
 */
export async function insertGoogleCalendarEvent(
  accessToken: string,
  payload: CalendarEventPayload,
): Promise<{ success: boolean; eventId?: string }> {
  try {
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `[Clarifex Legal] ${payload.title}`,
        description: payload.description,
        start: { date: payload.startDate },
        end: { date: payload.endDate || payload.startDate },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 * 7 }, // 7 days prior
            { method: "popup", minutes: 24 * 60 * 1 }, // 1 day prior
          ],
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Google Calendar API failed: ${res.statusText}`);
    }

    const data = await res.json();
    return { success: true, eventId: data.id };
  } catch (error) {
    console.error("Google Calendar insertion error:", error);
    return { success: false };
  }
}
