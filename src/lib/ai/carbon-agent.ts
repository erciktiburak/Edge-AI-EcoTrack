import { generateText } from "ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { openai } from "@ai-sdk/openai";

import type { EnergySummary } from "@/lib/energy";

export type CarbonAnalysisResult = {
  recommendation: string;
  savingsPotentialKg: number;
};

const analysisPrompt = PromptTemplate.fromTemplate(`
You are an expert carbon optimization analyst.

Input data:
- Weekly energy usage (kWh): {totalKwh}
- Weekly carbon footprint (kg CO2): {totalCarbonKg}
- Daily trend data: {trend}

Task:
1) Identify one behavior change with the highest impact.
2) Explain the recommendation in practical language.
3) Estimate potential CO2 savings as a single number in kg for next 7 days.

Output format:
Recommendation: <single paragraph>
SavingsKg: <number>
`);

const parser = new StringOutputParser();

const planningChain = RunnableSequence.from([analysisPrompt, parser]);

export async function analyzeCarbonProfile(
  summary: EnergySummary,
): Promise<CarbonAnalysisResult> {
  const prompt = await planningChain.invoke({
    totalKwh: summary.totalKwh.toFixed(2),
    totalCarbonKg: summary.totalCarbonKg.toFixed(2),
    trend: JSON.stringify(summary.trend),
  });

  const { text } = await generateText({
    model: openai("gpt-4.1-mini"),
    prompt,
    temperature: 0.2,
  });

  const recommendationMatch = text.match(/Recommendation:\s*([\s\S]*?)\nSavingsKg:/i);
  const savingsMatch = text.match(/SavingsKg:\s*([\d.]+)/i);

  return {
    recommendation:
      recommendationMatch?.[1]?.trim() ??
      "Shift major appliance usage to lower-carbon grid hours and reduce standby drain.",
    savingsPotentialKg: Number(savingsMatch?.[1] ?? "1.5"),
  };
}
