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

  const dimensionDescriptions: Record<string, string> = {
    "Enablement Strategy": "How well your enablement efforts are planned, resourced, and aligned with revenue goals.",
    "Coaching & Development": "Whether managers actively coach reps with structured feedback.",
    "Knowledge & Content Delivery": "How easily reps can find the right content at the right time.",
    "Onboarding & Everboarding": "How fast new hires become productive and tenured reps keep leveling up.",
    "AI Readiness for Enablement": "How prepared your team is to use AI for coaching and automation.",
  };

  const dimensionRows = scores?.dimensions
    ?.map(
      (d: { dimension: string; score: number; maxScore: number; label: string }) => {
        const pct = Math.round((d.score / d.maxScore) * 100);
        const barColor = d.score >= 3.5 ? "#2e844a" : d.score >= 2.5 ? "#0176d3" : d.score >= 1.5 ? "#d97706" : "#dc2626";
        const labelBg = d.score >= 3.5 ? "#dcfce7" : d.score >= 2.5 ? "#dbeafe" : d.score >= 1.5 ? "#fef3c7" : "#fee2e2";
        const labelColor = d.score >= 3.5 ? "#166534" : d.score >= 2.5 ? "#1e40af" : d.score >= 1.5 ? "#92400e" : "#991b1b";
        const desc = dimensionDescriptions[d.dimension] || "";
        return `<div style="background:#f3f3f3;border-radius:12px;padding:16px 20px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-weight:600;color:#032d60;font-size:15px">${d.dimension}</span>
            <span style="font-size:12px;font-weight:500;padding:4px 10px;border-radius:20px;background:${labelBg};color:${labelColor}">${d.label}</span>
          </div>
          <p style="font-size:12px;color:#6b7280;margin:0 0 10px 0">${desc}</p>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="flex:1;height:12px;background:#e5e7eb;border-radius:6px;overflow:hidden">
              <div style="width:${pct}%;height:100%;background:${barColor};border-radius:6px"></div>
            </div>
            <span style="font-size:13px;font-weight:700;color:#032d60;min-width:40px;text-align:right">${d.score}/${d.maxScore}</span>
          </div>
        </div>`;
      }
    )
    .join("") || "";

  // Parse AI report JSON into HTML sections
  let reportHtml = "";
  try {
    const sections = JSON.parse(report);
    for (const section of sections) {
      if (section.type === "stat-row") {
        reportHtml += `<div style="display:flex;gap:12px;margin-bottom:24px">`;
        for (const item of section.items) {
          const color = item.color === "red" ? "#dc2626" : item.color === "orange" ? "#d97706" : "#0176d3";
          reportHtml += `<div style="flex:1;text-align:center;background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px">
            <div style="font-size:28px;font-weight:800;color:${color}">${item.metric}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px">${item.label}</div>
          </div>`;
        }
        reportHtml += `</div>`;
      }
      if (section.type === "gap-cards") {
        reportHtml += `<h3 style="font-size:18px;font-weight:700;color:#032d60;margin:24px 0 12px">${section.title}</h3>`;
        for (const item of section.items) {
          reportHtml += `<div style="background:white;border-left:4px solid #f87171;border-radius:12px;padding:16px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-weight:700;color:#032d60;font-size:15px">${item.dimension}</span>
              <span style="font-size:12px;font-weight:600;color:#dc2626;background:#fee2e2;padding:4px 10px;border-radius:20px">${item.score}</span>
            </div>
            <p style="font-size:13px;color:#4b5563;margin:0 0 8px">${item.insight}</p>
            <div style="background:#fff7ed;border-radius:6px;padding:8px 12px;font-size:12px">
              <span style="font-weight:600;color:#d97706">Impact: </span><span style="color:#4b5563">${item.impact}</span>
            </div>
          </div>`;
        }
      }
      if (section.type === "quick-wins") {
        reportHtml += `<h3 style="font-size:18px;font-weight:700;color:#032d60;margin:24px 0 12px">${section.title}</h3>`;
        section.items.forEach((item: { action: string; detail: string; impact: string }, i: number) => {
          reportHtml += `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:10px;display:flex;gap:12px">
            <div style="width:32px;height:32px;background:#2e844a;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${i + 1}</div>
            <div>
              <p style="font-weight:600;color:#032d60;margin:0 0 4px;font-size:14px">${item.action}</p>
              <p style="font-size:12px;color:#4b5563;margin:0 0 4px">${item.detail}</p>
              <p style="font-size:12px;font-weight:500;color:#2e844a;margin:0">${item.impact}</p>
            </div>
          </div>`;
        });
      }
      if (section.type === "ai-opportunity") {
        reportHtml += `<div style="background:#032d60;border-radius:12px;padding:24px;margin:24px 0">
          <h3 style="font-size:18px;font-weight:700;color:white;margin:0 0 4px">${section.title}</h3>
          <p style="font-size:13px;color:#93c5fd;margin:0 0 16px">${section.insight}</p>`;
        for (const item of section.items) {
          reportHtml += `<div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:12px;margin-bottom:8px">
            <p style="font-weight:600;color:white;margin:0 0 4px;font-size:14px">${item.tool}</p>
            <p style="font-size:12px;color:#93c5fd;margin:0 0 4px">${item.benefit}</p>
            <p style="font-size:12px;font-weight:700;color:#ff6b00;margin:0">${item.metric}</p>
          </div>`;
        }
        reportHtml += `</div>`;
      }
      if (section.type === "vision") {
        reportHtml += `<div style="background:#f0f7ff;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <h3 style="font-size:18px;font-weight:700;color:#032d60;margin:0 0 16px">${section.title}</h3>
          <div style="display:flex;justify-content:center;gap:32px">`;
        for (const item of section.items) {
          reportHtml += `<div>
            <div style="font-size:28px;font-weight:800;color:#0176d3">${item.metric}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px">${item.label}</div>
          </div>`;
        }
        reportHtml += `</div></div>`;
      }
    }
  } catch {
    // If report isn't valid JSON, render as-is (fallback)
    reportHtml = `<div style="font-size:14px;color:#4b5563;line-height:1.6">${report}</div>`;
  }

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

        ${dimensionRows}

        ${reportHtml}

        <div style="text-align:center;margin-top:32px">
          <a href="https://calendly.com/mmcnamara-sru/ai-strategy-discussion"
             style="display:inline-block;padding:14px 32px;background:#ff6b00;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
            Book a Free Strategy Call with Marc →
          </a>
          <p style="font-size:12px;color:#9ca3af;margin-top:8px">Free · 30 minutes · No obligation</p>
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
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent("Quiz Sessions")}/${searchData.records[0].id}`,
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
