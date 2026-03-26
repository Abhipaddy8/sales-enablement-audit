import { NextRequest, NextResponse } from "next/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY || "");
}

export async function POST(req: NextRequest) {
  const { email, scores, report, sessionId } = await req.json();

  if (!email || !report) {
    return NextResponse.json(
      { error: "email and report required" },
      { status: 400 }
    );
  }

  const dimensionRows = scores?.dimensions
    ?.map(
      (d: { dimension: string; score: number; maxScore: number; label: string }) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#032d60">${d.dimension}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${d.score}/${d.maxScore}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${d.label}</td>
        </tr>`
    )
    .join("") || "";

  const htmlEmail = `
    <div style="max-width:640px;margin:0 auto;font-family:Inter,system-ui,sans-serif;color:#181818">
      <div style="background:#032d60;color:white;padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="margin:0;font-size:24px">Your Sales Enablement Audit</h1>
        <p style="margin:8px 0 0;color:#93c5fd;font-size:14px">Northern Lights Consulting</p>
      </div>

      <div style="padding:32px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:48px;font-weight:800;color:#0176d3">${scores?.totalScore || "—"}</div>
          <div style="font-size:18px;color:#6b7280">out of ${scores?.maxTotal || 20}</div>
          <div style="font-size:16px;font-weight:600;color:#032d60;margin-top:4px">${scores?.overallLabel || ""}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr style="background:#f3f3f3">
              <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280">Dimension</th>
              <th style="padding:8px 12px;text-align:center;font-size:13px;color:#6b7280">Score</th>
              <th style="padding:8px 12px;text-align:left;font-size:13px;color:#6b7280">Level</th>
            </tr>
          </thead>
          <tbody>
            ${dimensionRows}
          </tbody>
        </table>

        <div style="background:white;padding:24px;border-radius:8px;border:1px solid #e5e7eb">
          ${report}
        </div>

        <div style="text-align:center;margin-top:32px">
          <a href="https://calendly.com/mmcnamara-sru/ai-strategy-discussion"
             style="display:inline-block;padding:14px 32px;background:#0176d3;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
            Book a Free Strategy Call with Marc →
          </a>
        </div>
      </div>

      <div style="padding:16px;text-align:center;font-size:12px;color:#9ca3af">
        Northern Lights Consulting · Sales Enablement & Coaching
      </div>
    </div>
  `;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Northern Lights Consulting <audit@resend.dev>",
      to: email,
      subject: `Your Sales Enablement Score: ${scores?.totalScore}/${scores?.maxTotal} — ${scores?.overallLabel}`,
      html: htmlEmail,
    });

    // Update Airtable: report_sent = true
    if (sessionId) {
      const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
      const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
      if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
        const searchRes = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent("Quiz Sessions")}?filterByFormula={Session ID}="${sessionId}"&maxRecords=1`,
          { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
        );
        const searchData = await searchRes.json();
        if (searchData.records?.length > 0) {
          await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/quiz_sessions/${searchData.records[0].id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ fields: { "Report Sent": true } }),
            }
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Email send failed:", e);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}
