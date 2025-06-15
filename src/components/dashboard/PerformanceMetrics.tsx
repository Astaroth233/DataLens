"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PerformanceMetric } from "@/lib/types";
import { Gauge } from "lucide-react";

export function PerformanceMetrics({ metrics }: { metrics: PerformanceMetric[] }) {
  const hasMetrics = metrics && metrics.length > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Gauge className="mr-2 h-6 w-6 text-primary" />
          Performance Metrics
        </CardTitle>
        <CardDescription>
          Review the performance of your trained model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasMetrics ? (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Metric</TableHead>
                  <TableHead className="font-semibold">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.metric}>
                    <TableCell className="font-medium">{metric.metric}</TableCell>
                    <TableCell>{typeof metric.value === 'number' ? metric.value.toFixed(4) : metric.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground">Train a model to see its performance metrics here.</p>
        )}
      </CardContent>
    </Card>
  );
}
