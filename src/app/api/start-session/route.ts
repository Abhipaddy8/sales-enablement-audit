import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = "Quiz Sessions";

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
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
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
                  "Session ID": sessionId,
                  "Email": email,
                  "Status": "started",
                  "Started At": new Date().toISOString(),
                  "Last Active": new Date().toISOString(),
                  "Current Question": 0,
                  "Answers JSON": "{}",
                  "Scores JSON": "",
                  "Report Sent": false,
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
