"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Testimonials from "@/components/Testimonials";
import LogoMarquee from "@/components/LogoMarquee";

const CountdownTimer = dynamic(() => import("@/components/CountdownTimer"), {
  ssr: false,
  loading: () => <div className="h-12" />,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Section 1: Urgency Bar ── */}
      <div className="bg-[#ff6b00] text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-4 flex-wrap">
        <span>Free AI Sales Enablement Audit — Limited spots this month</span>
        <CountdownTimer variant="light" size="sm" />
      </div>

      {/* ── Section 2: Header ── */}
      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-[#032d60]">
            Northern Lights Consulting
          </div>
          <Link
            href="/quiz"
            className="px-5 py-2.5 bg-[#0176d3] text-white text-sm font-semibold rounded-lg hover:bg-[#015bb5] transition-colors"
          >
            Start Free Audit
          </Link>
        </div>
      </header>

      {/* ── Section 3: Hero ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        {/* White overlay gradient — heavy on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-5 gap-12 items-center w-full">
          {/* Left: text (3 cols) */}
          <div className="lg:col-span-3">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-[#032d60] bg-[#e8f2ff] rounded-full border border-[#0176d3]/20 uppercase tracking-wider mb-6">
              Trusted by 22+ enterprise sales teams
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#032d60] leading-[1.1] mb-6">
              Is Your Enablement Strategy{" "}
              <span className="text-[#0176d3]">Costing You Deals?</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Take a 2-minute assessment. Get a personalized AI audit showing exactly where your team is leaving revenue on the table — and 3 fixes you can implement this week.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <Link
                href="/quiz"
                className="flex-1 text-center px-8 py-4 bg-[#0176d3] text-white text-base font-semibold rounded-xl hover:bg-[#015bb5] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0176d3]/25"
              >
                Get My Free Audit →
              </Link>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              No credit card · 10 questions · Results in 60 seconds
            </p>
          </div>

          {/* Right: Marc's photo card (2 cols) */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center max-w-xs border border-gray-100">
              <img
                src="/marc.png"
                alt="Marc McNamara"
                className="w-36 h-36 rounded-full object-cover mx-auto mb-4 border-4 border-[#f3f3f3]"
              />
              <h3 className="text-xl font-bold text-[#032d60]">Marc McNamara</h3>
              <p className="text-sm text-[#0176d3] font-medium">
                Sales Enablement & Coaching
              </p>
              <p className="text-xs text-gray-400 mt-1">Northern Lights Consulting</p>
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#032d60]">22+</div>
                  <div className="text-[10px] text-gray-400">Enterprise Clients</div>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <div className="text-lg font-bold text-[#032d60]">28%</div>
                  <div className="text-[10px] text-gray-400">Avg Win Rate Lift</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Logo Strip ── */}
      <section className="py-10 border-y border-gray-100 bg-[#fafafa]">
        <LogoMarquee />
      </section>

      {/* ── Section 5: The Problem ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032d60] text-center mb-4">
            Most Enablement Programs Fail. Here&apos;s Why.
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            You&apos;re investing in training, tools, and content — but is any of it translating into consistent execution?
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#032d60] mb-2">Content Goes Unused</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                <strong className="text-[#032d60]">30-40%</strong> of sales content never gets touched. Reps can&apos;t find what they need, so they build their own — or wing it.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#032d60] mb-2">Coaching Is Reactive</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Managers only step in when deals go sideways. By then, the bad habits are already baked in.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#0176d3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#032d60] mb-2">No Way to Measure Impact</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                You&apos;re spending on training, tools, and content — but can&apos;t connect any of it to revenue outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: What You'll Get ── */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032d60] text-center mb-12">
            Your Personalized Audit Includes
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0176d3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#032d60] mb-2">Your Enablement Score</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Scored across 5 dimensions: strategy, coaching, content delivery, onboarding, and AI readiness.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0176d3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#032d60] mb-2">Gap Analysis</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Specific weak spots with concrete metrics — not generic advice. Based on YOUR answers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0176d3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#032d60] mb-2">AI-Powered Quick Wins</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                3 actionable recommendations you can implement this week, backed by data from teams already ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: How It Works ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#032d60] text-center mb-12">
            How It Works
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-0">
            {[
              { step: "1", title: "Answer 10 Questions", desc: "Quick multiple choice — no typing required" },
              { step: "2", title: "Get Your Report", desc: "AI analyzes your answers and generates a personalized audit" },
              { step: "3", title: "Book a Call", desc: "Optionally discuss your results with Marc — free, no obligation" },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                <div className="w-14 h-14 bg-[#0176d3] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#032d60] mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">The whole thing takes less than 2 minutes.</p>
        </div>
      </section>

      {/* ── Section 8: Testimonials ── */}
      <section className="py-20 px-6 bg-[#f3f3f3]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#032d60] text-center mb-12">
            What Sales Leaders Are Saying
          </h2>
          <Testimonials showAll={true} />
        </div>
      </section>

      {/* ── Section 9: About Marc ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-10">
          <img
            src="/marc.png"
            alt="Marc McNamara"
            className="w-48 h-48 rounded-2xl object-cover flex-shrink-0 shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-[#032d60] mb-4">About Marc McNamara</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Marc has spent his career building enablement systems that actually work — not training programs that get forgotten in a week.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              His Advisor framework has been deployed at <strong className="text-[#032d60]">Bank of America, Novartis, Caterpillar, Palo Alto Networks</strong>, and 20+ enterprise sales teams — driving an average <strong className="text-[#032d60]">28% lift in win rates</strong> and <strong className="text-[#032d60]">40% faster new hire ramp times</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed font-medium">
              He doesn&apos;t just advise. He ensures it shows up in every deal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 10: FAQ ── */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#032d60] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: "How long does this take?", a: "2 minutes. 10 multiple choice questions. No typing required." },
              { q: "Is the report actually personalized?", a: "Yes. AI analyzes your specific answers and generates recommendations based on your team's exact situation." },
              { q: "What happens after I get my report?", a: "You can optionally book a free 30-minute strategy call with Marc to discuss your results. No pressure, no pitch." },
              { q: "Is this really free?", a: "100% free. No credit card, no commitment, no catch." },
              { q: "Who is this for?", a: "Sales leaders, enablement managers, and revenue ops teams who want to know where their enablement program is leaking revenue." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#032d60] mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 11: Final CTA ── */}
      <section className="bg-[#032d60] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Find Out What&apos;s Costing You Deals?
          </h2>
          <p className="text-blue-200 mb-8">
            Join sales leaders from Bank of America, Novartis, and Caterpillar who have already taken the assessment.
          </p>

          <Link
            href="/quiz"
            className="inline-block px-10 py-4 bg-[#ff6b00] text-white text-lg font-bold rounded-xl hover:bg-[#e55f00] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff6b00]/30 mb-6"
          >
            Get My Free Audit →
          </Link>

          <div className="mb-6">
            <CountdownTimer variant="light" size="md" />
          </div>

          <p className="text-blue-300/60 text-sm">
            Or{" "}
            <a
              href="https://calendly.com/mmcnamara-sru/ai-strategy-discussion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white underline transition-colors"
            >
              book a call directly
            </a>{" "}
            with Marc.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Northern Lights Consulting · Sales Enablement & Coaching
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-300">
          <a
            href="https://calendly.com/mmcnamara-sru/ai-strategy-discussion"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition-colors"
          >
            Book a Call
          </a>
          <span>·</span>
          <a href="#" className="hover:text-gray-500 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
