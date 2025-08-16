"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, AlertTriangle } from "lucide-react";
import { fetchDailyInspiration } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function InspirationClient() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getInspiration = useCallback(async () => {
    setIsLoading(true);
    setPrompt(null);
    const result = await fetchDailyInspiration();
    if ('error' in result) {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
        });
    } else {
        setPrompt(result.prompt);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    getInspiration();
  }, [getInspiration]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="min-h-[200px] shadow-lg flex items-center justify-center p-8 bg-card/80">
        <CardContent className="text-center p-0">
          {isLoading && <Skeleton className="h-20 w-[400px]" />}
          {!isLoading && prompt && (
            <blockquote className="text-xl md:text-2xl font-serif italic text-primary">
              "{prompt}"
            </blockquote>
          )}
          {!isLoading && !prompt && (
            <div className="text-destructive flex flex-col items-center gap-4">
              <AlertTriangle className="h-10 w-10"/>
              <p>Could not load an inspirational prompt. Please try again.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button onClick={getInspiration} size="lg" disabled={isLoading}>
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? "Loading..." : "Get New Inspiration"}
        </Button>
      </div>
    </div>
  );
}
