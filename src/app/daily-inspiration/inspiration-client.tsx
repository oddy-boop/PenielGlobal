
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { fetchDailyInspiration } from "./actions";
import { useToast } from "@/hooks/use-toast";
import type { Inspiration } from "@/lib/types";
import Image from "next/image";

export function InspirationClient() {
  const [inspiration, setInspiration] = useState<Inspiration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getInspiration = useCallback(async () => {
    setIsLoading(true);
    setInspiration(null);
    setError(null);
    const result = await fetchDailyInspiration();
    if ('error' in result) {
        setError(result.error);
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
        });
    } else {
        setInspiration(result.inspiration);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    getInspiration();
  }, [getInspiration]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="min-h-[250px] shadow-lg flex items-center justify-center p-8 bg-card/80">
        <CardContent className="text-center p-0">
          {isLoading && <Skeleton className="h-20 w-[400px]" />}
          {error && (
            <div className="text-destructive flex flex-col items-center gap-4">
              <AlertTriangle className="h-10 w-10"/>
              <p>Could not load an inspirational item. Please try again.</p>
            </div>
          )}
          {inspiration && inspiration.type === 'text' && (
            <blockquote className="text-xl md:text-2xl font-serif italic text-primary">
              "{inspiration.prompt}"
            </blockquote>
          )}
           {inspiration && inspiration.type === 'image' && inspiration.image_url && (
            <div className="relative w-[400px] h-[300px] rounded-lg overflow-hidden">
                 <Image src={inspiration.image_url} alt="Inspirational image" fill style={{objectFit:"contain"}} data-ai-hint="inspiration nature" />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button onClick={getInspiration} size="lg" disabled={isLoading}>
          <RefreshCw className="mr-2 h-5 w-5" />
          {isLoading ? "Loading..." : "Get New Inspiration"}
        </Button>
      </div>
    </div>
  );
}
