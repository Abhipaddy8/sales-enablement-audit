import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = "quiz_sessions";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const sessionId = uuid();

  // Write to Airtable
  if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
    try {
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  session_id: sessionId,
                  email,
                  status: "started",
                  started_at: new Date().toISOString(),
                  last_active: new Date().toISOString(),
                  last_question: 0,
                  answers_json: "{}",
                  score_json: "",
                  reminder_1_sent: false,
                  reminder_2_sent: false,
                  reminder_3_sent: false,
                  report_sent: false,
                },
              },
            ],
          }),
        }
      );
    } catch (e) {
      console.error("Airtable write failed:", e);
      // Don't block the user — Airtable is best-effort
    }
  }

  return NextResponse.json({ sessionId });
}
