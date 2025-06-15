"use server";

import { suggestCharts, type SuggestChartsInput, type SuggestChartsOutput } from "@/ai/flows/suggest-charts";

export async function getChartingSuggestions(input: SuggestChartsInput): Promise<SuggestChartsOutput | { error: string }> {
  try {
    const suggestions = await suggestCharts(input);
    return suggestions;
  } catch (error) {
    console.error("Error getting charting suggestions:", error);
    return { error: "Failed to generate charting suggestions. Please try again." };
  }
}
