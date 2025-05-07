import { google } from "googleapis";
import { getOAuth2Client } from "../services/oAuth2Client";

/**
 * Googleカレンダーの予定を取得
 * @param {string} calendarId - カレンダーID（デフォルトは 'primary'）
 * @param {string} timeMin - 取得開始日時（ISO8601形式）
 * @param {string} timeMax - 取得終了日時（ISO8601形式）
 */
export async function getCalendarEvents({
  calendarId = "primary",
  timeMin,
  timeMax,
}: {
  calendarId?: string;
  timeMin: string;
  timeMax: string;
}) {
  const auth = await getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  return res.data.items || [];
}
