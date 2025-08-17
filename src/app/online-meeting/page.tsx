
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { OnlineMeetingContent } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

export default function OnlineMeetingPage() {
  const [content, setContent] = useState<OnlineMeetingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'online_meeting')
        .single();
      
      if (data?.content) {
        setContent(data.content as OnlineMeetingContent);
      }
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-primary">Online Meeting Information Not Available</h2>
        <p className="text-muted-foreground mt-2">Please configure this page in the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{content.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {content.intro}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Video className="w-6 h-6 text-accent"/>
                    {content.meetingTitle}
                </CardTitle>
                <CardDescription>{content.meetingTime}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {content.description}
                </p>
                <Button asChild className="mt-6 w-full">
                    <Link href={content.meetingLink || '#'}>
                        Join via Zoom <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardContent>
        </Card>
        <div className="p-4">
            <Image 
                src={content.imageUrl}
                alt="People in an online meeting"
                width={600}
                height={450}
                className="rounded-lg shadow-xl"
                data-ai-hint="online meeting"
            />
        </div>
      </div>
    </div>
  );
}
