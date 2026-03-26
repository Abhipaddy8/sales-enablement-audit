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

  // All email layout uses tables — Gmail/Outlook strip flexbox, gap, etc.

  const dimDesc: Record<string, string> = {
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
        return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f3;border-radius:8px;margin-bottom:12px"><tr><td style="padding:16px 20px">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-weight:600;color:#032d60;font-size:15px">${d.dimension}</td>
            <td align="right"><span style="font-size:11px;font-weight:500;padding:3px 10px;border-radius:20px;background:${labelBg};color:${labelColor}">${d.label}</span></td>
          </tr></table>
          <p style="font-size:11px;color:#6b7280;margin:4px 0 10px 0;line-height:1.4">${dimDesc[d.dimension] || ""}</p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="85%"><table width="100%" cellpadding="0" cellspacing="0" style="background:#e5e7eb;border-radius:6px;height:10px"><tr><td style="width:${pct}%;background:${barColor};border-radius:6px;height:10px" height="10"></td><td style="height:10px" height="10"></td></tr></table></td>
            <td width="15%" style="font-size:13px;font-weight:700;color:#032d60;text-align:right;padding-left:10px">${d.score}/${d.maxScore}</td>
          </tr></table>
        </td></tr></table>`;
      }
    )
    .join("") || "";

  // Parse AI report JSON into email-safe HTML (tables only)
  let reportHtml = "";
  try {
    const sections = JSON.parse(report);
    for (const section of sections) {
      if (section.type === "stat-row") {
        reportHtml += `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr>`;
        section.items.forEach((item: { metric: string; label: string; color: string }, i: number) => {
          const color = item.color === "red" ? "#dc2626" : item.color === "orange" ? "#d97706" : "#0176d3";
          reportHtml += `${i > 0 ? '<td width="12"></td>' : ''}<td style="text-align:center;background:white;border:1px solid #e5e7eb;border-radius:8px;padding:16px 8px">
            <div style="font-size:26px;font-weight:800;color:${color}">${item.metric}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">${item.label}</div>
          </td>`;
        });
        reportHtml += `</tr></table>`;
      }
      if (section.type === "gap-cards") {
        reportHtml += `<h3 style="font-size:18px;font-weight:700;color:#032d60;margin:28px 0 12px 0">${section.title}</h3>`;
        for (const item of section.items) {
          reportHtml += `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;border-left:4px solid #f87171;background:white;border-radius:8px"><tr><td style="padding:16px 20px">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-weight:700;color:#032d60;font-size:15px">${item.dimension}</td>
              <td align="right"><span style="font-size:11px;font-weight:600;color:#dc2626;background:#fee2e2;padding:3px 10px;border-radius:20px">${item.score}</span></td>
            </tr></table>
            <p style="font-size:13px;color:#4b5563;margin:8px 0;line-height:1.5">${item.insight}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:6px"><tr><td style="padding:8px 12px;font-size:12px">
              <span style="font-weight:600;color:#d97706">Impact:</span> <span style="color:#4b5563">${item.impact}</span>
            </td></tr></table>
          </td></tr></table>`;
        }
      }
      if (section.type === "quick-wins") {
        reportHtml += `<h3 style="font-size:18px;font-weight:700;color:#032d60;margin:28px 0 12px 0">${section.title}</h3>`;
        section.items.forEach((item: { action: string; detail: string; impact: string }, i: number) => {
          reportHtml += `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin-bottom:10px"><tr>
            <td width="48" style="padding:16px 0 16px 16px;vertical-align:top">
              <table cellpadding="0" cellspacing="0"><tr><td style="width:32px;height:32px;background:#2e844a;color:white;border-radius:16px;text-align:center;font-weight:700;font-size:14px;line-height:32px">${i + 1}</td></tr></table>
            </td>
            <td style="padding:16px 16px 16px 12px;vertical-align:top">
              <p style="font-weight:600;color:#032d60;margin:0 0 4px;font-size:14px">${item.action}</p>
              <p style="font-size:12px;color:#4b5563;margin:0 0 4px;line-height:1.4">${item.detail}</p>
              <p style="font-size:12px;font-weight:500;color:#2e844a;margin:0">${item.impact}</p>
            </td>
          </tr></table>`;
        });
      }
      if (section.type === "ai-opportunity") {
        reportHtml += `<table width="100%" cellpadding="0" cellspacing="0" style="background:#032d60;border-radius:8px;margin:28px 0"><tr><td style="padding:24px">
          <h3 style="font-size:18px;font-weight:700;color:white;margin:0 0 4px">${section.title}</h3>
          <p style="font-size:13px;color:#93c5fd;margin:0 0 16px">${section.insight}</p>`;
        for (const item of section.items) {
          reportHtml += `<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a4a7a;border-radius:6px;margin-bottom:8px"><tr><td style="padding:12px 16px">
            <p style="font-weight:600;color:white;margin:0 0 4px;font-size:14px">${item.tool}</p>
            <p style="font-size:12px;color:#93c5fd;margin:0 0 4px;line-height:1.4">${item.benefit}</p>
            <p style="font-size:12px;font-weight:700;color:#ff6b00;margin:0">${item.metric}</p>
          </td></tr></table>`;
        }
        reportHtml += `</td></tr></table>`;
      }
      if (section.type === "vision") {
        const cols = section.items.length || 3;
        reportHtml += `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border-radius:8px;margin:28px 0"><tr><td style="padding:24px;text-align:center">
          <h3 style="font-size:18px;font-weight:700;color:#032d60;margin:0 0 16px">${section.title}</h3>
          <table width="100%" cellpadding="0" cellspacing="0"><tr>`;
        section.items.forEach((item: { metric: string; label: string }, i: number) => {
          const w = Math.floor(100 / cols);
          reportHtml += `<td width="${w}%" style="text-align:center;padding:0 8px">
            <div style="font-size:28px;font-weight:800;color:#0176d3">${item.metric}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">${item.label}</div>
          </td>`;
        });
        reportHtml += `</tr></table></td></tr></table>`;
      }
    }
  } catch {
    reportHtml = `<div style="font-size:14px;color:#4b5563;line-height:1.6">${report}</div>`;
  }

  const htmlEmail = `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#181818">
      <tr><td style="background:#032d60;color:white;padding:32px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:24px;font-weight:800">Your Sales Enablement Audit</h1>
        <p style="margin:8px 0 0;color:#93c5fd;font-size:14px">Northern Lights Consulting</p>
      </td></tr>
      <tr><td style="padding:32px;background:#f9fafb;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">

        <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;margin-bottom:28px"><tr><td>
          <div style="font-size:48px;font-weight:800;color:#0176d3">${scores?.totalScore || "—"}</div>
          <div style="font-size:18px;color:#6b7280">out of ${scores?.maxTotal || 20}</div>
          <div style="font-size:16px;font-weight:600;color:#032d60;margin-top:4px">${scores?.overallLabel || ""}</div>
        </td></tr></table>

        ${dimensionRows}

        ${reportHtml}

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px"><tr><td align="center">
          <a href="https://calendly.com/mmcnamara-sru/ai-strategy-discussion"
             style="display:inline-block;padding:14px 32px;background:#ff6b00;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">
            Book a Free Strategy Call with Marc &rarr;
          </a>
          <p style="font-size:12px;color:#9ca3af;margin:8px 0 0">Free &middot; 30 minutes &middot; No obligation</p>
        </td></tr></table>

      </td></tr>
      <tr><td style="padding:16px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb">
        Northern Lights Consulting &middot; Sales Enablement &amp; Coaching
      </td></tr>
    </table>
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
