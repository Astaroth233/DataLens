"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ColumnProfile } from "@/lib/types";
import { BarChart2, ListChecks } from "lucide-react";

export function ColumnStatistics({ statistics }: { statistics: ColumnProfile[] }) {
  if (statistics.length === 0) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <BarChart2 className="mr-2 h-6 w-6 text-primary" />
            Column Statistics
          </CardTitle>
          <CardDescription>
            Detailed statistics for each column in your dataset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Load a dataset to view column statistics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <BarChart2 className="mr-2 h-6 w-6 text-primary" />
          Column Statistics
        </CardTitle>
        <CardDescription>
          Detailed statistics for each column in your dataset.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Column Name</TableHead>
                <TableHead className="font-semibold">Data Type</TableHead>
                <TableHead className="font-semibold">Mean</TableHead>
                <TableHead className="font-semibold">Median</TableHead>
                <TableHead className="font-semibold">Mode</TableHead>
                <TableHead className="font-semibold">Null Values</TableHead>
                <TableHead className="font-semibold">Distinct Values</TableHead>
                <TableHead className="font-semibold">Min</TableHead>
                <TableHead className="font-semibold">Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((col) => (
                <TableRow key={col.columnName}>
                  <TableCell className="font-medium">{col.columnName}</TableCell>
                  <TableCell>{col.statistics.dataType}</TableCell>
                  <TableCell>{col.statistics.mean?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>{col.statistics.median?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>{col.statistics.mode.join(', ')}</TableCell>
                  <TableCell>{col.statistics.nullValues}</TableCell>
                  <TableCell>{col.statistics.distinctValues}</TableCell>
                  <TableCell>{col.statistics.min?.toFixed(2) ?? 'N/A'}</TableCell>
                  <TableCell>{col.statistics.max?.toFixed(2) ?? 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
