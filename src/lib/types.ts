import type { SuggestChartsOutput, SuggestChartsInput } from "@/ai/flows/suggest-charts";

export type DatasetRow = Record<string, string | number | boolean | null>;

export type ColumnDataType = 'number' | 'string' | 'boolean' | 'date';

export interface ColumnStatistic {
  dataType: ColumnDataType;
  mean?: number;
  median?: number;
  mode: (string | number | boolean)[];
  nullValues: number;
  distinctValues: number;
  min?: number;
  max?: number;
}

export interface ColumnProfile {
  columnName: string;
  statistics: ColumnStatistic;
}

export type AISuggestChartsInput = SuggestChartsInput;
export type AISuggestChartsOutput = SuggestChartsOutput;

export type PerformanceMetric = {
  metric: string;
  value: string | number;
};

export type Algorithm = 
  | 'KNN' 
  | 'Linear Regression' 
  | 'Support Vector Regression (SVR)' 
  | 'Decision Tree Regression' 
  | 'Random Forest Regression' 
  | 'Logistic Regression' 
  | 'K-Nearest Neighbors (KNN)' // Note: KNN is listed twice, likely a typo in user request. Using one.
  | 'SVM' 
  | 'Naive Bayes';
