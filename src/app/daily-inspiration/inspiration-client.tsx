"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Inspiration } from "@/lib/types";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export function InspirationClient() {
  const [allInspirations, setAllInspirations] = useState<Inspiration[]>([]);
  const [currentInspiration, setCurrentInspiration] = useState<Inspiration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getNewInspiration = useCallback(() => {
    if (allInspirations.length > 0) {
      const randomIndex = Math.floor(Math.random() * allInspirations.length);
      setCurrentInspiration(allInspirations[randomIndex]);
    }
  }, [allInspirations]);

  useEffect(() => {
    async function loadInspirations() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: dbError } = await supabase.from('inspirations').select('*');
        if (dbError) throw dbError;

        if (data.length === 0) {
            setCurrentInspiration({ 
              id: 0, 
              type: 'text', 
              prompt: "No inspirational messages have been added yet.",
              image_url: null,
              created_at: new Date().toISOString()
            });
            setAllInspirations([]);
        } else {
            setAllInspirations(data);
            // Select an initial inspiration immediately after fetching
            const randomIndex = Math.floor(Math.random() * data.length);
            setCurrentInspiration(data[randomIndex]);
        }
      } catch (e: any) {
         const errorMessage = 'An unexpected error occurred: ' + e.message;
         setError(errorMessage);
         toast({
              variant: "destructive",
              title: "Error",
              description: errorMessage,
          });
         setAllInspirations([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadInspirations();
  }, [toast]);


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="min-h-[250px] shadow-lg flex items-center justify-center p-8 bg-card/80">
        <CardContent className="text-center p-0">
          {isLoading && <Skeleton className="h-20 w-[400px]" />}
          {error && !isLoading && (
            <div className="text-destructive flex flex-col items-center gap-4">
              <AlertTriangle className="h-10 w-10"/>
              <p>Could not load an inspirational item. Please try again.</p>
            </div>
          )}
          {!isLoading && !error && currentInspiration && currentInspiration.type === 'text' && (
            <blockquote className="text-xl md:text-2xl font-serif italic text-primary">
              "{currentInspiration.prompt}"
            </blockquote>
          )}
           {!isLoading && !error && currentInspiration && currentInspiration.type === 'image' && currentInspiration.image_url && (
            <div className="relative w-full max-w-[400px] h-auto aspect-[4/3] rounded-lg overflow-hidden">
                 <Image src={currentInspiration.image_url} alt="Inspirational image" fill style={{objectFit:"contain"}} data-ai-hint="inspiration nature" />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button onClick={getNewInspiration} size="lg" disabled={isLoading || allInspirations.length === 0}>
          <RefreshCw className="mr-2 h-5 w-5" />
          {isLoading ? "Loading..." : "Get New Inspiration"}
        </Button>
      </div>
    </div>
  );
}
