"use client";

import { useState, FormEvent } from "react";

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

export default function EmailCapture({ onSubmit, loading }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Proper email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check for common typos in popular domains
    const domain = email.split("@")[1]?.toLowerCase();
    const typoMap: Record<string, string> = {
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "gamil.com": "gmail.com",
      "gmal.com": "gmail.com",
      "gmil.com": "gmail.com",
      "gnail.com": "gmail.com",
      "outloo.com": "outlook.com",
      "outlok.com": "outlook.com",
      "hotmai.com": "hotmail.com",
      "hotmal.com": "hotmail.com",
      "yahooo.com": "yahoo.com",
      "yaho.com": "yahoo.com",
    };

    if (domain && typoMap[domain]) {
      setError(`Did you mean ${email.split("@")[0]}@${typoMap[domain]}?`);
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="mb-6">
        <span className="inline-block px-4 py-1.5 text-sm font-medium text-[#032d60] bg-[#e8f2ff] rounded-full border border-[#0176d3]/20">
          Free • 2 minutes • Personalized Results
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#032d60] leading-tight mb-4">
        Is Your Enablement Strategy Costing You Deals?
      </h1>

      <p className="text-lg text-gray-600 mb-8 max-w-sm mx-auto">
        Get a personalized AI audit showing exactly where your team is leaving
        revenue on the table.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3.5 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#0176d3] focus:border-transparent placeholder:text-gray-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 rounded-xl bg-[#0176d3] text-white font-semibold text-base whitespace-nowrap hover:bg-[#015bb5] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0176d3]/30 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? "Starting..." : "Start My Free Audit →"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <p className="text-xs text-gray-400 mt-4">
        No credit card required. Your results are instant and private.
      </p>
    </div>
  );
}
