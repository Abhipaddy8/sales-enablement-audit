"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { calculateScores, type ScoreResult } from "@/lib/scoring";

// Dynamic import to avoid SSR issues with SurveyJS
const QuizSurvey = dynamic(() => import("@/components/QuizSurvey"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0176d3] border-t-transparent" />
    </div>
  ),
});

type Phase = "quiz" | "generating" | "results";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0176d3] border-t-transparent" />
        </div>
      }
    >
      <QuizPageInner />
    </Suspense>
  );
}

function GeneratingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    { text: "Analyzing your enablement strategy...", icon: "📊" },
    { text: "Evaluating coaching effectiveness...", icon: "🎯" },
    { text: "Reviewing content delivery systems...", icon: "📚" },
    { text: "Assessing onboarding maturity...", icon: "🚀" },
    { text: "Measuring AI readiness...", icon: "🤖" },
    { text: "Identifying your biggest revenue gaps...", icon: "🔍" },
    { text: "Calculating quick win opportunities...", icon: "⚡" },
    { text: "Benchmarking against top performers...", icon: "📈" },
    { text: "Generating personalized recommendations...", icon: "✨" },
    { text: "Finalizing your custom audit report...", icon: "📋" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev; // Stay on last message
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="space-y-3">
      {/* Current message with fade */}
      <div
        key={messageIndex}
        className="text-lg text-gray-600 animate-pulse"
        style={{ animation: "fadeIn 0.5s ease-in-out" }}
      >
        <span className="mr-2">{messages[messageIndex].icon}</span>
        {messages[messageIndex].text}
      </div>

      {/* Progress dots showing completed steps */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i <= messageIndex
                ? "w-6 bg-[#0176d3]"
                : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Percentage */}
      <p className="text-sm text-gray-400 mt-4">
        {Math.min(Math.round(((messageIndex + 1) / messages.length) * 100), 99)}% complete
      </p>
    </div>
  );
}

function QuizPageInner() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");

  const [phase, setPhase] = useState<Phase>("quiz");
  const [email] = useState("");
  const [sessionId, setSessionId] = useState(sessionParam || "");
  const [scores, setScores] = useState<ScoreResult | null>(null);
  const [report, setReport] = useState("");
  const [initialAnswers, setInitialAnswers] = useState<
    Record<string, string> | undefined
  >();
  const [startFromQuestion, setStartFromQuestion] = useState<
    number | undefined
  >();
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

  // Generate session ID on mount (no email capture upfront)
  useEffect(() => {
    if (!sessionParam) {
      setSessionId(crypto.randomUUID());
    }
  }, [sessionParam]);

  // Resume flow: load session from Airtable
  useEffect(() => {
    if (sessionParam) {
      fetch(`/api/get-session?session=${sessionParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.answers) {
            setInitialAnswers(data.answers);
            setStartFromQuestion(data.lastQuestion || 0);
          }
        })
        .catch(() => {
          // Session not found, ignore
        });
    }
  }, [sessionParam]);

  // Evergreen 48-hour countdown timer
  useEffect(() => {
    if (phase !== "results") return;
    let start = localStorage.getItem("sea_timer_start");
    if (!start) {
      start = Date.now().toString();
      localStorage.setItem("sea_timer_start", start);
    }
    const interval = setInterval(() => {
      const elapsed = Date.now() - parseInt(start!);
      const remaining = Math.max(0, 48 * 60 * 60 * 1000 - elapsed);
      setTimeLeft({
        hours: Math.floor(remaining / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleQuestionChanged = useCallback(
    async (questionName: string, questionIndex: number) => {
      if (!sessionId) return;

      // Fire and forget — don't block the UX
      fetch("/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          lastQuestion: questionIndex,
          questionName,
        }),
      }).catch(() => {
        // Silent fail — session tracking is best-effort
      });
    },
    [sessionId]
  );

  const handleQuizComplete = useCallback(
    async (answers: Record<string, string>) => {
      setPhase("generating");

      // Calculate scores locally
      const scoreResult = calculateScores(answers);
      setScores(scoreResult);

      try {
        // Generate personalized report
        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            scores: scoreResult,
            email,
            sessionId,
          }),
        });
        const data = await res.json();
        setReport(data.report || "");

        setPhase("results");
      } catch {
        // Show scores even if report generation fails
        setReport("");
        setPhase("results");
      }
    },
    [email, sessionId]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-lg font-bold text-[#032d60]">
            Northern Lights Consulting
          </div>
          {phase === "quiz" && (
            <div className="text-sm text-gray-400">
              Sales Enablement Audit
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className={`flex-1 flex items-center justify-center ${phase === "results" ? "px-0 py-0" : "px-4 py-12 sm:py-20"}`}>
        {phase === "quiz" && (
          <QuizSurvey
            onComplete={handleQuizComplete}
            onQuestionChanged={handleQuestionChanged}
            initialAnswers={initialAnswers}
            startFromQuestion={startFromQuestion}
          />
        )}

        {phase === "generating" && (
          <div className="text-center py-16 px-4 max-w-lg mx-auto">
            {/* Animated rings */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-[#0176d3]/20 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-2 rounded-full border-4 border-[#0176d3]/30 animate-ping" style={{ animationDuration: "2.5s" }} />
              <div className="absolute inset-4 rounded-full border-4 border-[#0176d3] animate-spin" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0176d3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#032d60] mb-3">
              Building Your Audit...
            </h2>

            <GeneratingMessages />
          </div>
        )}

        {phase === "results" && scores && (
          <div className="w-full max-w-none mx-auto">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes scoreReveal {
                0% { opacity: 0; transform: scale(0.5); }
                100% { opacity: 1; transform: scale(1); }
              }
              @keyframes barGrow {
                0% { width: 0%; }
              }
            `}</style>

            {/* ── Section 1: Score Summary ── */}
            <div className="text-center mb-16 max-w-3xl mx-auto px-4 pt-12 sm:pt-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032d60] mb-2">
                Your Sales Enablement Score
              </h2>
              <div className="relative inline-flex items-center justify-center mt-6 mb-4">
                <svg className="w-40 h-40" viewBox="0 0 160 160">
                  <circle
                    cx="80" cy="80" r="70"
                    fill="none" stroke="#e5e7eb" strokeWidth="12"
                  />
                  <circle
                    cx="80" cy="80" r="70"
                    fill="none" stroke="#0176d3" strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(scores.totalScore / scores.maxTotal) * 440} 440`}
                    transform="rotate(-90 80 80)"
                    style={{ transition: "stroke-dasharray 1.2s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ animation: "scoreReveal 0.8s ease-out" }}>
                  <span className="text-5xl font-extrabold text-[#0176d3]">
                    {scores.totalScore}
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    out of {scores.maxTotal}
                  </span>
                </div>
              </div>
              <p className="text-xl font-semibold text-[#032d60]">
                {scores.overallLabel}
              </p>

              {/* Dimension Bars */}
              {(() => {
                const dimensionDescriptions: Record<string, string> = {
                  "Enablement Strategy": "How well your enablement efforts are planned, resourced, and aligned with revenue goals.",
                  "Coaching & Development": "Whether managers actively coach reps with structured feedback — or just review deals when they stall.",
                  "Knowledge & Content Delivery": "How easily reps can find the right content at the right time, without digging through folders.",
                  "Onboarding & Everboarding": "How fast new hires become productive — and whether tenured reps keep leveling up.",
                  "AI Readiness for Enablement": "How prepared your team is to use AI for coaching, content, and workflow automation.",
                };
                return (
                  <div className="grid gap-5 mt-10 text-left">
                    {scores.dimensions.map((dim) => {
                      const pct = (dim.score / dim.maxScore) * 100;
                      const barColor =
                        dim.score >= 3.5 ? "#2e844a"
                        : dim.score >= 2.5 ? "#0176d3"
                        : dim.score >= 1.5 ? "#d97706"
                        : "#dc2626";
                      return (
                        <div key={dim.dimension} className="bg-[#f3f3f3] rounded-xl p-5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[#032d60]">
                              {dim.dimension}
                            </span>
                            <span
                              className={`text-sm font-medium px-3 py-1 rounded-full ${
                                dim.score >= 3.5
                                  ? "bg-green-100 text-green-700"
                                  : dim.score >= 2.5
                                  ? "bg-blue-100 text-blue-700"
                                  : dim.score >= 1.5
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {dim.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">{dimensionDescriptions[dim.dimension]}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: barColor,
                                  animation: "barGrow 1s ease-out",
                                  transition: "width 0.7s ease-out",
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-[#032d60] w-12 text-right">
                              {dim.score.toFixed(1)}/{dim.maxScore}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* ── Hero CTA: Email Report (disabled until Resend domain verified) ── */}
            {/* TODO: Re-enable when Marc's Resend domain is set up */}

            {/* ── Section 2: AI Report ── */}
            {report && (() => {
              let sections;
              let cleaned = report.trim();
              if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
              }
              try { sections = JSON.parse(cleaned); } catch { sections = null; }

              if (!sections) {
                // Fallback for non-JSON (old format)
                return (
                  <div className="max-w-3xl mx-auto px-4 mb-16">
                    <div className="bg-[#f9fafb] rounded-2xl overflow-hidden shadow-sm">
                      <div className="flex">
                        <div className="w-1.5 bg-[#0176d3] flex-shrink-0" />
                        <div className="p-8 sm:p-10 flex-1 prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: report }} />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="max-w-4xl mx-auto px-4 mb-16 space-y-8">
                  {sections.map((section: any, si: number) => {
                    if (section.type === "stat-row") {
                      return (
                        <div key={si} className="grid grid-cols-3 gap-4">
                          {section.items.map((item: any, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
                              <div className={`text-4xl font-extrabold mb-1 ${
                                item.color === "red" ? "text-red-500" : item.color === "orange" ? "text-[#d97706]" : "text-[#0176d3]"
                              }`}>{item.metric}</div>
                              <div className="text-sm text-gray-500 font-medium">{item.label}</div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    if (section.type === "gap-cards") {
                      return (
                        <div key={si}>
                          <h3 className="text-xl font-bold text-[#032d60] mb-4">{section.title}</h3>
                          <div className="space-y-4">
                            {section.items.map((item: any, i: number) => (
                              <div key={i} className="bg-white border-l-4 border-red-400 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-[#032d60] text-lg">{item.dimension}</span>
                                  <span className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">{item.score}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{item.insight}</p>
                                <div className="bg-[#fff7ed] rounded-lg px-4 py-2 text-sm">
                                  <span className="font-semibold text-[#d97706]">Impact: </span>
                                  <span className="text-gray-700">{item.impact}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (section.type === "quick-wins") {
                      return (
                        <div key={si}>
                          <h3 className="text-xl font-bold text-[#032d60] mb-4">{section.title}</h3>
                          <div className="space-y-3">
                            {section.items.map((item: any, i: number) => (
                              <div key={i} className="bg-[#f0fdf4] border border-green-100 rounded-xl p-5 flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-[#2e844a] text-white rounded-full flex items-center justify-center font-bold text-lg">{i + 1}</div>
                                <div className="flex-1">
                                  <p className="font-semibold text-[#032d60] mb-1">{item.action}</p>
                                  <p className="text-sm text-gray-600 mb-2">{item.detail}</p>
                                  <p className="text-sm font-medium text-[#2e844a]">{item.impact}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (section.type === "ai-opportunity") {
                      return (
                        <div key={si} className="bg-gradient-to-br from-[#032d60] to-[#0a4a8a] rounded-2xl p-8 text-white">
                          <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                          <p className="text-blue-200 text-sm mb-6">{section.insight}</p>
                          <div className="grid sm:grid-cols-3 gap-4">
                            {section.items.map((item: any, i: number) => (
                              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                                <p className="font-semibold text-white mb-1">{item.tool}</p>
                                <p className="text-blue-200 text-xs mb-2">{item.benefit}</p>
                                <p className="text-[#ff6b00] font-bold text-sm">{item.metric}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (section.type === "vision") {
                      return (
                        <div key={si} className="bg-[#f0f7ff] rounded-2xl p-8 text-center">
                          <h3 className="text-xl font-bold text-[#032d60] mb-6">{section.title}</h3>
                          <div className="flex justify-center gap-8 flex-wrap">
                            {section.items.map((item: any, i: number) => (
                              <div key={i}>
                                <div className="text-4xl font-extrabold text-[#0176d3]">{item.metric}</div>
                                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              );
            })()}

            {/* ── Section 3: Marc's Authority ── */}
            <div className="max-w-3xl mx-auto px-4 mb-16">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src="/marc.png"
                  alt="Marc McNamara"
                  className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#032d60]">Marc McNamara</h3>
                  <p className="text-sm font-medium text-[#0176d3] mb-3">
                    Sales Enablement &amp; Coaching Consultant
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Marc has built enablement systems for Bank of America, Novartis, Caterpillar, and 20+ enterprise sales teams. His Advisor framework has driven an average 28% lift in win rates.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section 4: Testimonials ── */}
            <div className="bg-[#f3f3f3] py-14 px-4 mb-16">
              <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border-l-4 border-[#0176d3] shadow-sm">
                  <p className="text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;28% increase in win rates and a 35% reduction in sales cycle time within two quarters.&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-[#032d60]">
                    — Chief Revenue Officer, SaaS ($80M ARR)
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border-l-4 border-[#0176d3] shadow-sm">
                  <p className="text-gray-700 italic leading-relaxed mb-4">
                    &ldquo;New hire ramp time decrease by 40% and first-year quota attainment increase from 52% to 78%.&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-[#032d60]">
                    — SVP of Sales, Healthcare Technology
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section 5: Scrolling Logo Strip ── */}
            <div className="mb-16 px-4">
              <p className="text-center text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">
                Trusted by teams at
              </p>
              <div className="overflow-hidden">
                <div
                  className="flex items-center"
                  style={{ animation: "marquee 20s linear infinite", width: "max-content" }}
                >
                  {[
                    { src: "/logos/2025-03-29_14-35-18.png", alt: "Bank of America" },
                    { src: "/logos/2025-03-29_14-55-05.png", alt: "Novartis" },
                    { src: "/logos/2025-03-29_14-47-15.png", alt: "Caterpillar" },
                    { src: "/logos/2025-03-29_14-49-44.png", alt: "Palo Alto Networks" },
                    { src: "/logos/2025-03-29_14-43-04.png", alt: "Fidelity" },
                    { src: "/logos/2025-03-29_15-05-26.png", alt: "Boston Scientific" },
                    { src: "/logos/2025-03-29_15-09-19.png", alt: "Cigna Healthcare" },
                    { src: "/logos/2025-03-29_15-03-57.png", alt: "Cargill" },
                    { src: "/logos/2025-03-29_14-35-18.png", alt: "Bank of America" },
                    { src: "/logos/2025-03-29_14-55-05.png", alt: "Novartis" },
                    { src: "/logos/2025-03-29_14-47-15.png", alt: "Caterpillar" },
                    { src: "/logos/2025-03-29_14-49-44.png", alt: "Palo Alto Networks" },
                    { src: "/logos/2025-03-29_14-43-04.png", alt: "Fidelity" },
                    { src: "/logos/2025-03-29_15-05-26.png", alt: "Boston Scientific" },
                    { src: "/logos/2025-03-29_15-09-19.png", alt: "Cigna Healthcare" },
                    { src: "/logos/2025-03-29_15-03-57.png", alt: "Cargill" },
                  ].map((logo, i) => (
                    <img
                      key={i}
                      src={logo.src}
                      alt={logo.alt}
                      className="h-10 w-auto grayscale opacity-60 mx-8 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section 6: Book a Call CTA ── */}
            <div className="bg-[#032d60] py-16 px-6">
              <div className="max-w-3xl mx-auto text-center">
                {/* Marc photo centered */}
                <img
                  src="/marc.png"
                  alt="Marc McNamara"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white/20 mx-auto mb-4"
                />
                <p className="text-white font-semibold text-lg">Marc McNamara</p>
                <p className="text-blue-300 text-sm mb-8">Sales Enablement &amp; Coaching Consultant</p>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Let&apos;s Fix These Gaps Together
                </h3>
                <p className="text-blue-200 mb-8 max-w-md mx-auto">
                  Book a free 30-minute strategy call to discuss your results and get a custom action plan.
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <p className="text-[#ff6b00] text-xs font-semibold uppercase tracking-wide mr-3">Offer expires in</p>
                  <div className="bg-white/10 rounded-lg px-3 py-2 min-w-[52px]">
                    <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.hours).padStart(2, "0")}</span>
                    <span className="text-[10px] text-blue-300 block -mt-1">HRS</span>
                  </div>
                  <span className="text-white text-xl font-bold">:</span>
                  <div className="bg-white/10 rounded-lg px-3 py-2 min-w-[52px]">
                    <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span className="text-[10px] text-blue-300 block -mt-1">MIN</span>
                  </div>
                  <span className="text-white text-xl font-bold">:</span>
                  <div className="bg-white/10 rounded-lg px-3 py-2 min-w-[52px]">
                    <span className="text-2xl font-bold text-white tabular-nums">{String(timeLeft.seconds).padStart(2, "0")}</span>
                    <span className="text-[10px] text-blue-300 block -mt-1">SEC</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <a
                  href="https://calendly.com/mmcnamara-sru/ai-strategy-discussion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-[#ff6b00] text-white text-base font-bold rounded-xl hover:bg-[#e55f00] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff6b00]/30"
                >
                  Book My Strategy Call →
                </a>

                <p className="text-blue-300/60 text-xs mt-3 mb-8">Free · 30 minutes · No obligation</p>

                {/* Email Report — Big CTA (disabled until Resend domain verified) */}
                {/* TODO: Re-enable when Marc's Resend domain is set up */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
