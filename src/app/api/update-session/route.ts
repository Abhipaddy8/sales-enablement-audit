import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = "Quiz Sessions";

export async function POST(req: NextRequest) {
  const { sessionId, lastQuestion, questionName, answers, completed, scores } =
    await req.json();

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId required" },
      { status: 400 }
    );
  }

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return NextResponse.json({ ok: true }); // Airtable not configured
  }

  try {
    // Find the record by session_id
    const searchRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}?filterByFormula={Session ID}="${sessionId}"&maxRecords=1`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      }
    );
    const searchData = await searchRes.json();

    if (!searchData.records || searchData.records.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const recordId = searchData.records[0].id;
    const existingAnswers = JSON.parse(
      searchData.records[0].fields["Answers JSON"] || "{}"
    );

    // Build update fields
    const fields: Record<string, unknown> = {
      "Last Active": new Date().toISOString(),
    };

    if (lastQuestion !== undefined) {
      fields["Current Question"] = lastQuestion;
    }

    if (answers) {
      fields["Answers JSON"] = JSON.stringify({ ...existingAnswers, ...answers });
    }

    if (completed) {
      fields["Status"] = "completed";
    }

    if (scores) {
      fields["Scores JSON"] = JSON.stringify(scores);
    }

    // Update the record
    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Airtable update failed:", e);
    return NextResponse.json({ ok: true }); // Don't block user
  }
}
