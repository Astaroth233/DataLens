"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, ScatterChart as ReScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Scatter } from 'recharts';
import type { ColumnProfile, DatasetRow } from '@/lib/types';
import { BarChartHorizontalBig, ScatterChartIcon, RefreshCw } from "lucide-react";

// Helper to generate distinct colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

export function InteractiveCharts({ dataset, columnProfiles }: { dataset: DatasetRow[], columnProfiles: ColumnProfile[] }) {
  const [selectedHistogramColumn, setSelectedHistogramColumn] = useState<string | null>(null);
  const [scatterXColumn, setScatterXColumn] = useState<string | null>(null);
  const [scatterYColumn, setScatterYColumn] = useState<string | null>(null);

  const numericColumns = useMemo(() => 
    columnProfiles.filter(p => p.statistics.dataType === 'number').map(p => p.columnName),
    [columnProfiles]
  );

  const stringColumns = useMemo(() =>
    columnProfiles.filter(p => p.statistics.dataType === 'string').map(p => p.columnName),
    [columnProfiles]
  );
  
  const histogramData = useMemo(() => {
    if (!selectedHistogramColumn || !dataset.length) return [];
    
    const columnValues = dataset.map(row => row[selectedHistogramColumn]);
    const valueCounts: { [key: string]: number } = {};
    
    columnValues.forEach(value => {
      const key = String(value);
      valueCounts[key] = (valueCounts[key] || 0) + 1;
    });

    return Object.entries(valueCounts).map(([name, value]) => ({ name, value }));

  }, [dataset, selectedHistogramColumn]);

  const scatterData = useMemo(() => {
    if (!scatterXColumn || !scatterYColumn || !dataset.length) return [];
    return dataset.map(row => ({
      x: Number(row[scatterXColumn]),
      y: Number(row[scatterYColumn]),
    })).filter(d => !isNaN(d.x) && !isNaN(d.y));
  }, [dataset, scatterXColumn, scatterYColumn]);

  const resetSelections = () => {
    setSelectedHistogramColumn(null);
    setScatterXColumn(null);
    setScatterYColumn(null);
  };

  if (dataset.length === 0) {
     return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <BarChartHorizontalBig className="mr-2 h-6 w-6 text-primary" />
            Interactive Charts
          </CardTitle>
          <CardDescription>
            Visualize your data with dynamic histograms and scatter plots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Load a dataset to generate interactive charts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl flex items-center">
                <BarChartHorizontalBig className="mr-2 h-6 w-6 text-primary" />
                Interactive Charts
                </CardTitle>
                <CardDescription>
                Visualize your data with dynamic histograms and scatter plots.
                </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetSelections} title="Reset chart selections">
                <RefreshCw className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Histogram Section */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="font-headline text-lg font-medium">Histogram</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="histogram-column">Select Column for Histogram (Categorical/String)</Label>
              <Select value={selectedHistogramColumn || ""} onValueChange={setSelectedHistogramColumn}>
                <SelectTrigger id="histogram-column">
                  <SelectValue placeholder="Choose a column" />
                </SelectTrigger>
                <SelectContent>
                  {stringColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedHistogramColumn && histogramData.length > 0 && (
            <div className="mt-4 h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={histogramData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name={`Count of ${selectedHistogramColumn}`} fill="var(--color-primary)" radius={[4, 4, 0, 0]}>
                    {histogramData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {selectedHistogramColumn && histogramData.length === 0 && <p className="text-muted-foreground text-sm">No data to display for this column or selection.</p>}
        </div>

        {/* Scatter Plot Section */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="font-headline text-lg font-medium">Scatter Plot</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="scatter-x-column">X-Axis (Numeric)</Label>
              <Select value={scatterXColumn || ""} onValueChange={setScatterXColumn}>
                <SelectTrigger id="scatter-x-column">
                  <SelectValue placeholder="X-axis" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scatter-y-column">Y-Axis (Numeric)</Label>
              <Select value={scatterYColumn || ""} onValueChange={setScatterYColumn}>
                <SelectTrigger id="scatter-y-column">
                  <SelectValue placeholder="Y-axis" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {scatterXColumn && scatterYColumn && scatterData.length > 0 && (
            <div className="mt-4 h-[300px] w-full">
              <ResponsiveContainer>
                <ReScatterChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name={scatterXColumn || 'X'} />
                  <YAxis type="number" dataKey="y" name={scatterYColumn || 'Y'} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name={`${scatterXColumn} vs ${scatterYColumn}`} data={scatterData} fill="var(--color-accent)" />
                </ReScatterChart>
              </ResponsiveContainer>
            </div>
          )}
          {scatterXColumn && scatterYColumn && scatterData.length === 0 && <p className="text-muted-foreground text-sm">No data to display for these column selections.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
