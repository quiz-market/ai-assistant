import { google } from "googleapis";
import { getOAuth2Client } from "../services/oAuth2Client";

/**
 * Googleカレンダーに予定を登録
 * @param {object} event - 登録するイベント情報
 * @param {string} calendarId - カレンダーID（デフォルトは 'primary'）
 */
export async function createCalendarEvent({
  event,
  calendarId = "primary",
}: {
  event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [key: string]: any;
  };
  calendarId?: string;
}) {
  const auth = await getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });
  return res.data;
}
