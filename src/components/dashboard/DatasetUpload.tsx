
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2 } from "lucide-react";
import React from "react";

export function DatasetUpload({ onDatasetSelect, isLoading }: { onDatasetSelect: (file: File) => void, isLoading?: boolean }) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onDatasetSelect(selectedFile);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" />
          Upload Dataset
        </CardTitle>
        <CardDescription>
          Select a CSV file to begin your analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dataset-file" className="text-sm font-medium">Choose File</Label>
          <Input 
            id="dataset-file" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="file:text-primary file:font-semibold"
            disabled={isLoading}
          />
        </div>
        {selectedFile && !isLoading && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isLoading} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Loading..." : "Load Dataset"}
        </Button>
      </CardContent>
    </Card>
  );
}
