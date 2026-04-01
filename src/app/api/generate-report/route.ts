import { NextRequest, NextResponse } from "next/server";
import type { ScoreResult } from "@/lib/scoring";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4";

function buildPrompt(
  answers: Record<string, string>,
  scores: ScoreResult
): string {
  const dimensionSummary = scores.dimensions
    .map(
      (d) =>
        `- ${d.dimension}: ${d.score}/4 (${d.label})`
    )
    .join("\n");

  const challengeMap: Record<string, string> = {
    adoption: "Reps aren't using the content and training they create",
    ramp_time: "New hires take too long to become productive",
    coaching_gap: "Managers don't coach effectively (or at all)",
    proving_impact: "They can't prove enablement's impact on revenue",
    scattered_knowledge:
      "Knowledge and content is scattered across too many places",
  };

  const challenge =
    challengeMap[answers.biggest_challenge] || answers.biggest_challenge;

  return `You are an expert sales enablement consultant writing a personalized audit report for a company that just completed a sales enablement assessment.

## Their Scores
Overall: ${scores.totalScore}/${scores.maxTotal} (${scores.overallLabel})
${dimensionSummary}

## Their #1 Challenge
${challenge}

## Their Answers
- Team size: ${answers.team_size}
- Enablement function: ${answers.enablement_function}
- Enablement strategy: ${answers.enablement_strategy}
- Content delivery: ${answers.content_delivery}
- Coaching cadence: ${answers.coaching_cadence}
- Coaching quality: ${answers.coaching_quality}
- Onboarding approach: ${answers.onboarding}
- Measuring impact: ${answers.measuring_impact}
- AI in enablement: ${answers.ai_in_enablement}

## Output Format
Generate the report as a JSON array of section objects. Each section has:
- "type": one of "stat-row", "gap-cards", "quick-wins", "ai-opportunity", "vision"
- "title": section or card title
- "items": array of items

### Section 1: stat-row (3 key metrics)
{"type":"stat-row","items":[
  {"metric":"11/20","label":"Overall Score","color":"orange"},
  {"metric":"2.0","label":"Avg Dimension Score","color":"blue"},
  {"metric":"3","label":"Areas Need Attention","color":"red"}
]}

### Section 2: gap-cards (top 2-3 gaps)
{"type":"gap-cards","title":"Your Biggest Gaps","items":[
  {"dimension":"Coaching & Development","score":"2/4","impact":"Teams with structured coaching see 20-30% higher win rates","insight":"Your managers coach reactively — only when deals go sideways. This means reps repeat the same mistakes.","icon":"coaching"},
  ...more gaps
]}

### Section 3: quick-wins (3 actions)
{"type":"quick-wins","title":"This Week's Quick Wins","items":[
  {"action":"Implement weekly 1:1 coaching","detail":"Start with 'What's working, what's not, what's next' framework","impact":"Expected: 15-20% improvement in deal execution within 30 days"},
  ...more wins
]}

### Section 4: ai-opportunity
{"type":"ai-opportunity","title":"The AI Opportunity","insight":"Based on your AI readiness score...","items":[
  {"tool":"Call Coaching AI","benefit":"Analyze recordings, surface coachable moments automatically","metric":"2x coaching coverage without adding managers"},
  ...more tools
]}

### Section 5: vision
{"type":"vision","title":"Your 90-Day Potential","items":[
  {"metric":"30%","label":"faster new hire ramp"},
  {"metric":"20%","label":"higher win rates"},
  {"metric":"2x","label":"coaching coverage"}
]}

Rules:
- Output ONLY the JSON array, no markdown, no code fences, no explanation
- Every insight must reference THEIR specific answers
- Every gap must include a concrete metric/percentage
- Keep text SHORT — max 2 sentences per insight/detail
- Be specific to their answers, not generic`;
}

export async function POST(req: NextRequest) {
  const { answers, scores, email, sessionId } = await req.json();

  if (!answers || !scores) {
    return NextResponse.json(
      { error: "answers and scores required" },
      { status: 400 }
    );
  }

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({
      report:
        "<h3>Report Generation Unavailable</h3><p>Please configure the OPENROUTER_API_KEY environment variable.</p>",
    });
  }

  try {
    const prompt = buildPrompt(answers, scores);

    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content:
              "Generate my personalized sales enablement audit report.",
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    let report =
      data.choices?.[0]?.message?.content || "<p>Report generation failed.</p>";

    // Strip markdown code fences that models sometimes wrap around JSON
    report = report.trim();
    if (report.startsWith("```")) {
      report = report.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    // Update Airtable with completed status + scores
    if (sessionId) {
      const AT_KEY = process.env.AIRTABLE_API_KEY || "";
      const AT_BASE = process.env.AIRTABLE_BASE_ID || "";
      if (AT_KEY && AT_BASE) {
        try {
          const searchRes = await fetch(
            `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent("Quiz Sessions")}?filterByFormula={Session ID}="${sessionId}"&maxRecords=1`,
            { headers: { Authorization: `Bearer ${AT_KEY}` } }
          );
          const searchData = await searchRes.json();
          if (searchData.records?.length > 0) {
            await fetch(
              `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent("Quiz Sessions")}/${searchData.records[0].id}`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${AT_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  fields: {
                    "Status": "completed",
                    "Scores JSON": JSON.stringify(scores),
                    "Answers JSON": JSON.stringify(answers),
                    "Last Active": new Date().toISOString(),
                  },
                }),
              }
            );
          }
        } catch (e) {
          console.error("Airtable update failed:", e);
        }
      }
    }

    return NextResponse.json({ report });
  } catch (e) {
    console.error("Report generation failed:", e);
    return NextResponse.json(
      { error: "Report generation failed" },
      { status: 500 }
    );
  }
}
