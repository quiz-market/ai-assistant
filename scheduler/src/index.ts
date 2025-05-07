import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { z } from "zod";
import { createCalendarEvent } from "./tools/createCalenderEvent.js";
import { deleteCalendarEvent } from "./tools/deleteCalenderEvents.js";
import { getCalendarEvents } from "./tools/getCalenderEvents.js";
import { updateCalendarEvent } from "./tools/updateCalenderEvents.js";

// Create an MCP server

dotenv.config();

const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// カレンダーイベント取得ツールを追加
server.tool(
  "getEvents",
  {
    timeMin: z.string().describe("取得開始日時 (ISO8601形式)"),
    timeMax: z.string().describe("取得終了日時 (ISO8601形式)"),
    calendarId: z
      .string()
      .optional()
      .describe("カレンダーID (省略時は primary)"),
  },
  async ({ timeMin, timeMax, calendarId }) => {
    const events = await getCalendarEvents({ timeMin, timeMax, calendarId });
    return {
      content: [
        {
          type: "text",
          text: events
            .map(
              (event) =>
                `${event.summary}: ${
                  event.start?.dateTime || event.start?.date
                } - ${event.end?.dateTime || event.end?.date} (ID: ${event.id})`
            )
            .join("\n"),
        },
      ],
    };
  }
);

server.tool(
  "createEvent",
  {
    summary: z.string().describe("予定のタイトル"),
    description: z.string().optional().describe("予定の説明"),
    start: z.object({
      dateTime: z.string().describe("開始日時 (ISO8601形式)"),
      timeZone: z.string().optional().describe("タイムゾーン"),
    }),
    end: z.object({
      dateTime: z.string().describe("終了日時 (ISO8601形式)"),
      timeZone: z.string().optional().describe("タイムゾーン"),
    }),
    calendarId: z
      .string()
      .optional()
      .describe("カレンダーID (省略時は primary)"),
  },
  async ({ summary, description, start, end, calendarId }) => {
    const event = {
      summary,
      description,
      start,
      end,
    };
    const result = await createCalendarEvent({ event, calendarId });
    return {
      content: [
        {
          type: "text",
          text: `予定を作成しました: ${result.summary} (${result.id})`,
        },
      ],
    };
  }
);

server.tool(
  "deleteEvent",
  {
    eventId: z.string().describe("削除するイベントのID"),
    calendarId: z
      .string()
      .optional()
      .describe("カレンダーID (省略時は primary)"),
  },
  async ({ eventId, calendarId }) => {
    const result = await deleteCalendarEvent({ eventId, calendarId });
    return {
      content: [
        {
          type: "text",
          text: result
            ? `予定を削除しました: ${eventId}`
            : `削除に失敗しました: ${eventId}`,
        },
      ],
    };
  }
);

server.tool(
  "updateEvent",
  {
    eventId: z.string().describe("更新するイベントのID"),
    summary: z.string().optional().describe("予定のタイトル"),
    description: z.string().optional().describe("予定の説明"),
    start: z
      .object({
        dateTime: z.string().describe("開始日時 (ISO8601形式)"),
        timeZone: z.string().optional().describe("タイムゾーン"),
      })
      .optional(),
    end: z
      .object({
        dateTime: z.string().describe("終了日時 (ISO8601形式)"),
        timeZone: z.string().optional().describe("タイムゾーン"),
      })
      .optional(),
    calendarId: z
      .string()
      .optional()
      .describe("カレンダーID (省略時は primary)"),
  },
  async ({ eventId, summary, description, start, end, calendarId }) => {
    const event: {
      summary?: string;
      description?: string;
      start?: { dateTime: string; timeZone?: string };
      end?: { dateTime: string; timeZone?: string };
    } = {};
    if (summary !== undefined) event.summary = summary;
    if (description !== undefined) event.description = description;
    if (start !== undefined) event.start = start;
    if (end !== undefined) event.end = end;
    const result = await updateCalendarEvent({ eventId, event, calendarId });
    return {
      content: [
        {
          type: "text",
          text: `予定を更新しました: ${result.summary} (${result.id})`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
