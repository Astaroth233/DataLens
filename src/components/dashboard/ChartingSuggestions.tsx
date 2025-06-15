"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb, AlertTriangle } from "lucide-react";
import type { ColumnProfile, AISuggestChartsOutput, AISuggestChartsInput } from "@/lib/types";
import { getChartingSuggestions } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export function ChartingSuggestions({ columnProfiles }: { columnProfiles: ColumnProfile[] }) {
  const [suggestions, setSuggestions] = useState<AISuggestChartsOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSuggestCharts = () => {
    if (columnProfiles.length === 0) {
      toast({
        title: "No Data",
        description: "Please load a dataset and generate column statistics first.",
        variant: "destructive",
      });
      return;
    }

    // Prepare input for AI
    const aiInput: AISuggestChartsInput = columnProfiles.map(profile => ({
      columnName: profile.columnName,
      statistics: {
        dataType: profile.statistics.dataType,
        mean: profile.statistics.mean,
        median: profile.statistics.median,
        mode: profile.statistics.mode,
        nullValues: profile.statistics.nullValues,
        distinctValues: profile.statistics.distinctValues,
        min: profile.statistics.min,
        max: profile.statistics.max,
      }
    }));

    startTransition(async () => {
      const result = await getChartingSuggestions(aiInput);
      if ("error" in result) {
        toast({
          title: "Suggestion Error",
          description: result.error,
          variant: "destructive",
        });
        setSuggestions(null);
      } else {
        setSuggestions(result);
         toast({
          title: "Suggestions Generated!",
          description: "Chart suggestions are ready below.",
        });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-primary" />
          Smart Charting Suggestions
        </CardTitle>
        <CardDescription>
          Let AI suggest visualizations based on your data's characteristics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleSuggestCharts} disabled={isPending || columnProfiles.length === 0} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Generate Suggestions
        </Button>
        {suggestions && suggestions.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="font-headline text-lg font-medium">Suggested Charts:</h3>
            <ul className="list-disc space-y-2 pl-5">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">
                  <strong className="text-primary">{suggestion.chartType}:</strong> {suggestion.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        {suggestions && suggestions.length === 0 && !isPending && (
            <div className="flex items-center space-x-2 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-yellow-700">
                <AlertTriangle className="h-5 w-5" />
                <p>No specific chart suggestions could be generated for this dataset.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
