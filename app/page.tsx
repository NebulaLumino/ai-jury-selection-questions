"use client";

import { useState } from "react";

export default function JurySelectionPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">AI Jury Selection Question Builder</h1>
          </div>
          <p className="text-gray-400 text-lg">Build voir dire questions tailored to your case, jurisdiction, and jury demographics</p>
        </header>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-300">Case Details and Strategy</label>
          <textarea
            className="w-full h-48 bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none"
            placeholder="Describe your case, jurisdiction, and jury pool to generate tailored voir dire questions...&#10;&#10;Example:&#10;Case: Slip and fall at grocery store, plaintiff claims wet floor without warning sign&#10;Jurisdiction: California state court, Los Angeles County&#10;Client: Defense (grocery store chain)&#10;Key issues: Comparative negligence, store protocols, notice of hazard&#10;Jury profile: Urban/suburban mix, diverse demographics"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Building Questions...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generate Voir Dire Questions
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">Jury Selection Question Bank</h2>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-xs">
          Powered by DeepSeek AI · Voir dire best practices · Not legal advice
        </footer>
      </div>
    </main>
  );
}
