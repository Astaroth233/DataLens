'use server';

/**
 * @fileOverview Suggests relevant chart types based on dataset column data types and statistics.
 *
 * - suggestCharts - A function that takes column data and statistics and suggests chart types.
 * - SuggestChartsInput - The input type for the suggestCharts function.
 * - SuggestChartsOutput - The return type for the suggestCharts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColumnDataTypeSchema = z.enum(['number', 'string', 'boolean', 'date']);

const ColumnStatisticsSchema = z.object({
  dataType: ColumnDataTypeSchema.describe('The data type of the column.'),
  mean: z.number().optional().describe('The mean value of the column (if numeric).'),
  median: z.number().optional().describe('The median value of the column (if numeric).'),
  mode: z.array(z.any()).describe('The mode(s) of the column.'),
  nullValues: z
    .number()
    .describe('The number of null values in the column.'),
  distinctValues: z
    .number()
    .describe('The number of distinct values in the column.'),
  min: z.number().optional().describe('The minimum value of the column (if numeric).'),
  max: z.number().optional().describe('The maximum value of the column (if numeric).'),
});

const SuggestChartsInputSchema = z.array(z.object({
  columnName: z.string().describe('The name of the column.'),
  statistics: ColumnStatisticsSchema,
})).describe('An array of column names with statistics.');

export type SuggestChartsInput = z.infer<typeof SuggestChartsInputSchema>;

const SuggestedChartSchema = z.object({
  chartType: z.string().describe('The suggested chart type.'),
  description: z.string().describe('A description of why this chart type is suitable for the data.'),
});

const SuggestChartsOutputSchema = z.array(SuggestedChartSchema).describe('An array of suggested chart types and their descriptions.');

export type SuggestChartsOutput = z.infer<typeof SuggestChartsOutputSchema>;

export async function suggestCharts(input: SuggestChartsInput): Promise<SuggestChartsOutput> {
  return suggestChartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartsPrompt',
  input: {schema: SuggestChartsInputSchema},
  output: {schema: SuggestChartsOutputSchema},
  prompt: `Given the following column data and statistics, suggest relevant chart types for visualization. Be specific with the suggested chart types.

{{#each this}}
Column Name: {{{columnName}}}
Statistics:
Data Type: {{{statistics.dataType}}}
{{#if statistics.mean}}Mean: {{{statistics.mean}}}{{/if}}
{{#if statistics.median}}Median: {{{statistics.median}}}{{/if}}
Mode: {{{statistics.mode}}}
Null Values: {{{statistics.nullValues}}}
Distinct Values: {{{statistics.distinctValues}}}
{{#if statistics.min}}Min: {{{statistics.min}}}{{/if}}
{{#if statistics.max}}Max: {{{statistics.max}}}{{/if}}

Suggested Chart Types:
{{/each}}`,
});

const suggestChartsFlow = ai.defineFlow(
  {
    name: 'suggestChartsFlow',
    inputSchema: SuggestChartsInputSchema,
    outputSchema: SuggestChartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
