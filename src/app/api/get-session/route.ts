import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = "Quiz Sessions";

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
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}?filterByFormula={Session ID}="${sessionId}"&maxRecords=1`,
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
      email: fields["Email"],
      status: fields["Status"],
      answers: fields["Answers JSON"] ? JSON.parse(fields["Answers JSON"]) : null,
      lastQuestion: fields["Current Question"] || 0,
      scores: fields["Scores JSON"] ? JSON.parse(fields["Scores JSON"]) : null,
    });
  } catch (e) {
    console.error("Get session failed:", e);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}
