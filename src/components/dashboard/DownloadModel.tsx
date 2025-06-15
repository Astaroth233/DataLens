"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DownloadModel({ modelTrained }: { modelTrained: boolean }) {
  const { toast } = useToast();

  const handleDownload = () => {
    // This is a mock download. In a real app, you'd fetch the model file.
    toast({
      title: "Download Initiated",
      description: "Your model download will begin shortly (mock).",
    });
    console.log("Mock model download started.");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <DownloadCloud className="mr-2 h-6 w-6 text-primary" />
          Download Model
        </CardTitle>
        <CardDescription>
          Download your trained model for local use or deployment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleDownload} disabled={!modelTrained} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <DownloadCloud className="mr-2 h-4 w-4" />
          Download Trained Model
        </Button>
      </CardContent>
    </Card>
  );
}
