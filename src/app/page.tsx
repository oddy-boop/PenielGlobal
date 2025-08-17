
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Church, Clock, Calendar, ArrowRight, Video, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'home')
        .single();
      
      if (data?.content) {
        setContent(data.content as HomeContent);
      }
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {/* Hero Skeleton */}
        <section className="relative h-[60vh] min-h-[400px] w-full bg-muted flex items-center justify-center text-center">
            <div className="z-10 p-4 max-w-4xl space-y-4">
                <Skeleton className="h-16 w-96 mx-auto" />
                <Skeleton className="h-6 w-80 mx-auto" />
                <div className="flex justify-center gap-4 mt-4">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-12 w-28" />
                </div>
            </div>
        </section>

        {/* Service Times Skeleton */}
         <section id="service-times" className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-10 w-72 mx-auto" />
                <Skeleton className="h-6 w-96 mx-auto mt-4" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </section>
        
        <Separator />
        
        {/* About Us Skeleton */}
        <section id="about" className="py-16 lg:py-24 bg-card">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="md:w-1/2"><Skeleton className="w-full h-64" /></div>
                <div className="md:w-1/2 space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-8 w-40" />
                </div>
            </div>
        </section>

        {/* Featured Sermon Skeleton */}
        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 text-center">
                <Skeleton className="h-10 w-72 mx-auto" />
                <Skeleton className="h-6 w-96 mx-auto mt-4" />
                <div className="mt-12 max-w-2xl mx-auto">
                    <Skeleton className="w-full h-96" />
                </div>
            </div>
        </section>

      </div>
    );
  }
  
  if (!content) {
     return (
        <div className="flex justify-center items-center min-h-[50vh] flex-col gap-4">
            <h2 className="text-2xl font-semibold text-primary">Welcome!</h2>
            <p className="text-muted-foreground">Content is not yet configured. Please visit the admin panel.</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-cover bg-center flex items-center justify-center text-center text-white">
        <Image
          src={content.heroImage || "https://placehold.co/1920x1080.png"}
          alt="Church congregation"
          fill
          objectFit="cover"
          className="z-0 brightness-50"
          data-ai-hint="church congregation"
          priority
        />
        <div className="z-10 p-4 max-w-4xl">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            {content.heroHeadline}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            {content.heroSubheadline}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/events">
                <Calendar className="mr-2 h-5 w-5" />
                Upcoming Events
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white">
              <Link href="/contact">
                Visit Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section id="service-times" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
            Join Our Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We gather every week to celebrate, worship, and learn from the Word.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                  <Clock className="h-8 w-8 text-accent" />
                  Sunday Worship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Every Sunday at 10:00 AM</p>
                <p className="text-muted-foreground">In-person & Online</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                  <Rss className="h-8 w-8 text-accent" />
                  Midweek Bible Study
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Every Wednesday at 7:00 PM</p>
                <p className="text-muted-foreground">Online via Zoom</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                  <Church className="h-8 w-8 text-accent" />
                  Youth Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Every Friday at 6:30 PM</p>
                <p className="text-muted-foreground">At the church hall</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* About Us Snippet */}
      <section id="about" className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2">
            <Image
              src={content.aboutImage || "https://placehold.co/600x400.png"}
              alt="Church interior"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              data-ai-hint="church interior"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
              {content.aboutTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.aboutText}
            </p>
            <Button asChild className="mt-6" variant="link" size="lg">
              <Link href="/contact">Learn More About Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Sermons */}
      <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">Latest Message</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get inspired by our recent sermon on faith and perseverance.
              </p>
              <div className="mt-12 max-w-2xl mx-auto">
                  <Card className="shadow-lg overflow-hidden">
                      <div className="relative">
                          <Image src={content.latestSermonImage || "https://placehold.co/800x450.png"} alt="Sermon thumbnail" width={800} height={450} className="w-full" data-ai-hint="sermon abstract"/>
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Link href="/sermons">
                              <Button variant="ghost" className="text-white h-20 w-20 hover:bg-white/20">
                                <Video className="h-12 w-12"/>
                                <span className="sr-only">Play Sermon</span>
                              </Button>
                            </Link>
                          </div>
                      </div>
                      <CardContent className="p-6 text-left">
                          <CardTitle className="font-headline text-2xl">{content.latestSermonTitle}</CardTitle>
                          <p className="text-muted-foreground mt-2">Speaker: {content.latestSermonSpeaker}</p>
                          <Button asChild className="mt-4">
                              <Link href="/sermons">
                                  Watch Now <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                          </Button>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>
    </div>
  );
}
