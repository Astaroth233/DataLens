
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/AppLogo";
import { DatasetUpload } from "@/components/dashboard/DatasetUpload";
import { DatasetPreview } from "@/components/dashboard/DatasetPreview";
import { ColumnStatistics } from "@/components/dashboard/ColumnStatistics";
import { ChartingSuggestions } from "@/components/dashboard/ChartingSuggestions";
import { InteractiveCharts } from "@/components/dashboard/InteractiveCharts";
import { AlgorithmSelection } from "@/components/dashboard/AlgorithmSelection";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { DownloadModel } from "@/components/dashboard/DownloadModel";
import type { DatasetRow, ColumnProfile, ColumnStatistic, Algorithm, PerformanceMetric, ColumnDataType } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, BarChartBig, BrainCircuit, DownloadCloud, FileText, Activity, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse'; // For CSV parsing

// Mock data generation functions
const generateMockDataset = (rowCount = 50, colCount = 5): DatasetRow[] => {
  const data: DatasetRow[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: DatasetRow = {};
    for (let j = 0; j < colCount; j++) {
      if (j % 3 === 0) row[`CategoryCol${j + 1}`] = String.fromCharCode(65 + Math.floor(Math.random() * 5)); // A-E
      else if (j % 3 === 1) row[`NumericCol${j + 1}`] = parseFloat((Math.random() * 100).toFixed(2));
      else row[`BoolCol${j + 1}`] = Math.random() > 0.5;
    }
    data.push(row);
  }
  return data;
};

const calculateColumnProfiles = (dataset: DatasetRow[]): ColumnProfile[] => {
  if (dataset.length === 0) return [];
  const headers = Object.keys(dataset[0]);
  return headers.map(header => {
    const values = dataset.map(row => row[header]);
    let dataType: ColumnDataType = 'string';
    const numericValues: number[] = [];
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

    if (nonNullValues.every(v => typeof v === 'boolean')) {
      dataType = 'boolean';
    } else if (nonNullValues.every(v => !isNaN(Number(v)))) {
      dataType = 'number';
      nonNullValues.forEach(v => numericValues.push(Number(v)));
    } else if (nonNullValues.every(v => !isNaN(Date.parse(String(v))))) {
       // Basic date check, can be improved
      const allDates = nonNullValues.map(v => new Date(String(v)));
      if (allDates.every(d => !isNaN(d.getTime()))) {
         dataType = 'date';
      }
    }


    const stats: Partial<ColumnStatistic> = {
      dataType,
      nullValues: values.length - nonNullValues.length,
      distinctValues: new Set(nonNullValues).size,
      mode: [], // Calculate mode properly below
    };

    if (dataType === 'number' && numericValues.length > 0) {
      stats.mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      numericValues.sort((a, b) => a - b);
      const mid = Math.floor(numericValues.length / 2);
      stats.median = numericValues.length % 2 !== 0 ? numericValues[mid] : (numericValues[mid - 1] + numericValues[mid]) / 2;
      stats.min = numericValues[0];
      stats.max = numericValues[numericValues.length - 1];
    }

    // Calculate mode for all types
    const valueCounts: Record<string, number> = {};
    nonNullValues.forEach(v => {
      const key = String(v);
      valueCounts[key] = (valueCounts[key] || 0) + 1;
    });
    let maxCount = 0;
    for (const key in valueCounts) {
      if (valueCounts[key] > maxCount) {
        maxCount = valueCounts[key];
      }
    }
    stats.mode = Object.entries(valueCounts)
      .filter(([_, count]) => count === maxCount)
      .map(([valStr]) => { // Convert back to original type if possible
          if (dataType === 'number') return Number(valStr);
          if (dataType === 'boolean') return valStr.toLowerCase() === 'true';
          return valStr;
      });


    return { columnName: header, statistics: stats as ColumnStatistic };
  });
};


const generateMockPerformanceMetrics = (algorithm: Algorithm): PerformanceMetric[] => {
  const isRegression = algorithm.toLowerCase().includes("regression");
  if (isRegression) {
    return [
      { metric: 'R²', value: Math.random() * 0.3 + 0.6 }, // 0.6 to 0.9
      { metric: 'Mean Squared Error', value: Math.random() * 10 + 5 },
      { metric: 'Mean Absolute Error', value: Math.random() * 5 + 1 },
    ];
  }
  return [
    { metric: 'Accuracy', value: Math.random() * 0.3 + 0.65 }, // 0.65 to 0.95
    { metric: 'Precision', value: Math.random() * 0.3 + 0.6 },
    { metric: 'Recall', value: Math.random() * 0.3 + 0.6 },
    { metric: 'F1-score', value: Math.random() * 0.3 + 0.6 },
  ];
};


export default function DashboardPage() {
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [columnProfiles, setColumnProfiles] = useState<ColumnProfile[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [modelTrained, setModelTrained] = useState(false);
  const [activeSection, setActiveSection] = useState("upload");
  const { toast } = useToast();

  const parseCSV = (file: File, callback: (data: DatasetRow[]) => void) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Automatically convert numbers, booleans
      complete: (results) => {
        // Filter out rows that are entirely null or undefined (often an issue with dynamicTyping and empty last lines)
        const cleanedData = (results.data as DatasetRow[]).filter(row => 
            Object.values(row).some(value => value !== null && value !== undefined)
        );
        callback(cleanedData);
      },
      error: (error: any) => {
        toast({
            title: "CSV Parsing Error",
            description: error.message || "Could not parse the CSV file.",
            variant: "destructive",
        });
        callback([]); // return empty dataset on error
      }
    });
  };


  const handleDatasetSelect = useCallback((file: File) => {
    // Basic file type check (though Input accept should handle this mostly)
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
       parseCSV(file, (parsedData) => {
          setDataset(parsedData);
          const profiles = calculateColumnProfiles(parsedData);
          setColumnProfiles(profiles);
          setModelTrained(false);
          setPerformanceMetrics([]);
          setActiveSection("preview"); // Move to preview after upload
           toast({
            title: "Dataset Loaded",
            description: `${file.name} has been successfully processed.`,
          });
       });
    } else {
        // For simplicity, we'll only fully support CSV for now.
        // Excel parsing would require a library like 'xlsx'.
        toast({
            title: "File Type Not Fully Supported",
            description: "CSV files are recommended. For other types, functionality might be limited (using mock data).",
            variant: "destructive",
        });
        // Fallback to mock data if not CSV for demo purposes
        const mockData = generateMockDataset();
        setDataset(mockData);
        setColumnProfiles(calculateColumnProfiles(mockData));
        setModelTrained(false);
        setPerformanceMetrics([]);
        setActiveSection("preview");
    }
  }, [toast]);


  const handleTrainModel = useCallback((algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    // Simulate model training
    setTimeout(() => {
      setPerformanceMetrics(generateMockPerformanceMetrics(algorithm));
      setModelTrained(true);
      setActiveSection("metrics"); // Move to metrics after training
       toast({
        title: "Model Trained",
        description: `${algorithm} model training complete. Metrics are available.`,
      });
    }, 1500); // Simulate training time
  }, [toast]);

  // Scroll to section logic
  useEffect(() => {
    const sectionElement = document.getElementById(activeSection);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);


  const menuItems = [
    { id: "upload", label: "Upload Data", icon: LayoutDashboard },
    { id: "preview", label: "Preview Data", icon: FileText },
    { id: "statistics", label: "Column Stats", icon: BarChartBig },
    { id: "suggestions", label: "Chart Suggestions", icon: Activity },
    { id: "charts", label: "Interactive Charts", icon: BarChartBig },
    { id: "algorithm", label: "Select Algorithm", icon: BrainCircuit },
    { id: "metrics", label: "Performance", icon: Gauge },
    { id: "download", label: "Download Model", icon: DownloadCloud },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r shadow-md">
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    tooltip={{ children: item.label, className: "font-body" }}
                    className="font-body"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
             <h1 className="font-headline text-xl font-semibold text-foreground sm:text-2xl ml-auto sm:ml-0">DataLens Dashboard</h1>
          </header>
          <ScrollArea className="h-[calc(100vh-3.5rem)] sm:h-auto">
            <main className="flex-1 p-4 sm:p-6 space-y-6">
              <section id="upload">
                <DatasetUpload onDatasetSelect={handleDatasetSelect} />
              </section>
              <section id="preview">
                <DatasetPreview dataset={dataset} />
              </section>
              <section id="statistics">
                <ColumnStatistics statistics={columnProfiles} />
              </section>
              <section id="suggestions">
                <ChartingSuggestions columnProfiles={columnProfiles} />
              </section>
              <section id="charts">
                <InteractiveCharts dataset={dataset} columnProfiles={columnProfiles} />
              </section>
              <section id="algorithm">
                <AlgorithmSelection onTrainModel={handleTrainModel} datasetLoaded={dataset.length > 0}/>
              </section>
              <section id="metrics">
                <PerformanceMetrics metrics={performanceMetrics} />
              </section>
              <section id="download">
                <DownloadModel modelTrained={modelTrained} />
              </section>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
