import { google } from "googleapis";
import { getOAuth2Client } from "../services/oAuth2Client";

/**
 * Googleカレンダーの予定を削除
 * @param {string} eventId - 削除するイベントのID
 * @param {string} calendarId - カレンダーID（デフォルトは 'primary'）
 */
export async function deleteCalendarEvent({
  eventId,
  calendarId = "primary",
}: {
  eventId: string;
  calendarId?: string;
}) {
  const auth = await getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.delete({
    calendarId,
    eventId,
  });
  return res.status === 204;
}
