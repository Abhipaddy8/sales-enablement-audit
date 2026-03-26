import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = "quiz_sessions";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");

  if (!sessionId) {
    return NextResponse.json({ error: "session required" }, { status: 400 });
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return NextResponse.json({ error: "Airtable not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}?filterByFormula={session_id}="${sessionId}"&maxRecords=1`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      }
    );
    const data = await res.json();

    if (!data.records || data.records.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const fields = data.records[0].fields;

    return NextResponse.json({
      email: fields.email,
      status: fields.status,
      answers: fields.answers_json ? JSON.parse(fields.answers_json) : null,
      lastQuestion: fields.last_question || 0,
      scores: fields.score_json ? JSON.parse(fields.score_json) : null,
    });
  } catch (e) {
    console.error("Get session failed:", e);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}
