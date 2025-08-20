
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

        if (data && data.length > 0) {
            setAllInspirations(data);
            const randomIndex = Math.floor(Math.random() * data.length);
            setCurrentInspiration(data[randomIndex]);
        } else {
            setAllInspirations([]);
            setCurrentInspiration(null); // No default message needed, will show a specific message below
        }
      } catch (e: any) {
         const errorMessage = 'Failed to load inspirations: ' + e.message;
         setError(errorMessage);
         toast({
              variant: "destructive",
              title: "Error",
              description: errorMessage,
          });
         setAllInspirations([]);
         setCurrentInspiration(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadInspirations();
  }, [toast]);


  return (
    <div className="max-w-3xl mx-auto">
      <Card className="min-h-[350px] shadow-lg flex items-center justify-center p-4 bg-card/80 relative overflow-hidden text-white">
        {isLoading && (
            <div className="w-full h-full p-8">
                <Skeleton className="h-full w-full bg-muted-foreground/20" />
            </div>
        )}
        
        {error && !isLoading && (
            <div className="text-destructive flex flex-col items-center gap-4">
                <AlertTriangle className="h-10 w-10"/>
                <p>{error}</p>
            </div>
        )}
        
        {!isLoading && !error && currentInspiration && (
            <>
                {currentInspiration.background_image_url && (
                    <Image 
                        src={currentInspiration.background_image_url} 
                        alt="Inspirational background" 
                        fill 
                        className="object-cover brightness-50 z-0"
                        data-ai-hint="inspirational scenery"
                    />
                )}
                <CardContent className="text-center p-4 sm:p-8 z-10">
                    <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic drop-shadow-md">
                        "{currentInspiration.quote}"
                    </blockquote>
                    <p className="mt-6 text-lg md:text-xl font-semibold tracking-wide drop-shadow-sm">- {currentInspiration.author}</p>
                </CardContent>
            </>
        )}
        
        {!isLoading && !error && !currentInspiration && (
             <div className="text-center text-primary">
                <p className="text-xl">No inspirational messages have been added yet.</p>
                <p className="text-muted-foreground">Please check back later.</p>
             </div>
        )}
      </Card>
      <div className="mt-6 flex justify-center">
        <Button onClick={getNewInspiration} size="lg" disabled={isLoading || allInspirations.length < 2}>
          <RefreshCw className="mr-2 h-5 w-5" />
          {isLoading ? "Loading..." : "Get New Inspiration"}
        </Button>
      </div>
    </div>
  );
}
