"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { DatasetRow } from "@/lib/types";
import { ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react";

const ROWS_PER_PAGE = 5;

export function DatasetPreview({ dataset }: { dataset: DatasetRow[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataset.length / ROWS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return dataset.slice(startIndex, endIndex);
  }, [dataset, currentPage]);

  const headers = useMemo(() => {
    if (dataset.length === 0) return [];
    return Object.keys(dataset[0]);
  }, [dataset]);

  if (dataset.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <FileSpreadsheet className="mr-2 h-6 w-6 text-primary" />
            Dataset Preview
          </CardTitle>
          <CardDescription>
            Upload a dataset to see a preview here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <FileSpreadsheet className="mr-2 h-6 w-6 text-primary" />
          Dataset Preview
        </CardTitle>
        <CardDescription>
          A quick look at the first few rows of your uploaded data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="font-semibold">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`}>{String(row[header])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
