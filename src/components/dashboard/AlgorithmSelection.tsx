"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ML_ALGORITHMS } from "@/lib/constants";
import type { Algorithm } from "@/lib/types";
import { BrainCircuit, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export function AlgorithmSelection({ onTrainModel, datasetLoaded }: { onTrainModel: (algorithm: Algorithm) => void, datasetLoaded: boolean }) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const { toast } = useToast();

  const handleTrain = () => {
    if (selectedAlgorithm) {
      onTrainModel(selectedAlgorithm);
      toast({
        title: "Training Started",
        description: `Training model with ${selectedAlgorithm}.`,
      });
    } else {
       toast({
        title: "No Algorithm Selected",
        description: "Please select an algorithm to train.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <BrainCircuit className="mr-2 h-6 w-6 text-primary" />
          Algorithm Selection
        </CardTitle>
        <CardDescription>
          Choose a machine learning algorithm and train your model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="algorithm-select" className="text-sm font-medium">Select Algorithm</Label>
          <Select 
            onValueChange={(value) => setSelectedAlgorithm(value as Algorithm)}
            value={selectedAlgorithm || ""}
            disabled={!datasetLoaded}
          >
            <SelectTrigger id="algorithm-select">
              <SelectValue placeholder="Choose an algorithm" />
            </SelectTrigger>
            <SelectContent>
              {ML_ALGORITHMS.map((alg) => (
                <SelectItem key={alg} value={alg}>{alg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleTrain} disabled={!selectedAlgorithm || !datasetLoaded} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Play className="mr-2 h-4 w-4" />
          Train Model
        </Button>
      </CardContent>
    </Card>
  );
}
