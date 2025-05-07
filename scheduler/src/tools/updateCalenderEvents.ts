import { google } from "googleapis";
import { getOAuth2Client } from "../services/oAuth2Client";

/**
 * Googleカレンダーの予定を更新
 * @param {string} eventId - 更新するイベントのID
 * @param {object} event - 更新内容
 * @param {string} calendarId - カレンダーID（デフォルトは 'primary'）
 */
export async function updateCalendarEvent({
  eventId,
  event,
  calendarId = "primary",
}: {
  eventId: string;
  event: {
    summary?: string;
    description?: string;
    start?: { dateTime: string; timeZone?: string };
    end?: { dateTime: string; timeZone?: string };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [key: string]: any;
  };
  calendarId?: string;
}) {
  const auth = await getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.update({
    calendarId,
    eventId,
    requestBody: event,
  });
  return res.data;
}
