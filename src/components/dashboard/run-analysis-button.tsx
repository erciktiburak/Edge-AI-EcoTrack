"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunAnalysisButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function run() {
    try {
      setIsLoading(true);
      await fetch("/api/ai/carbon-analysis", { method: "POST" });
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={isLoading}
      className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? "Running AI analysis..." : "Run AI Carbon Analysis"}
    </button>
  );
}
