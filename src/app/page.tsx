
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calendar, Church, Clock, Rss, Video, Sparkles, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { HomeContent, Sermon, Service } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import { SermonPlayerDialog } from '@/components/sermon-player-dialog';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { MotionWrapper } from '@/components/motion-wrapper';

const iconMap: { [key: string]: LucideIcon } = {
  Clock,
  Rss,
  Church,
  Video,
  Sparkles,
  Calendar,
};

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [latestSermon, setLatestSermon] = useState<Sermon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      
      const [homeRes, sermonRes, servicesRes] = await Promise.all([
        supabase.from('home_content').select('*').eq('id', 1).single(),
        supabase.from('sermons').select('*').order('date', { ascending: false }).limit(1).single(),
        supabase.from('services').select('*').order('id', { ascending: true })
      ]);

      if (homeRes.data) {
        const homeData = homeRes.data;
        setContent(homeData);
        
        const images: string[] = [];
        for (let i = 1; i <= 10; i++) {
          const key = `hero_image_${i}` as keyof HomeContent;
          if (homeData[key]) {
            images.push(homeData[key] as string);
          }
        }
        setHeroImages(images);
      }

      if (sermonRes.data) {
        setLatestSermon(sermonRes.data as Sermon);
      }

      if(servicesRes.data) {
        setServices(servicesRes.data as Service[]);
      }

      setIsLoading(false);
    };
    fetchContent();
  }, []);

  const handleWatchClick = () => {
    if (latestSermon) {
      setIsPlayerOpen(true);
    }
  }

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
                <div className="md:w-1/2"><Skeleton className="w-full h-64 md:h-80" /></div>
                <div className="md:w-1/2 space-y-4 text-center md:text-left">
                    <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-8 w-40 mx-auto md:mx-0" />
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

  const hasHeroImages = heroImages.length > 0;

  return (
    <>
      <MotionWrapper>
        <div className="flex flex-col">
          {/* Hero Section */}
          <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
            {hasHeroImages ? (
                <Carousel
                  className="absolute inset-0 w-full h-full"
                  plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
                  opts={{ loop: true }}
                >
                  <CarouselContent>
                    {heroImages.map((src, index) => (
                      <CarouselItem key={index} className="relative">
                        <Image
                          src={src}
                          alt={`Hero background ${index + 1}`}
                          fill
                          style={{objectFit:"cover"}}
                          className="z-0 brightness-50"
                          priority={index === 0}
                          data-ai-hint="church congregation"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
            ) : (
                <div className="absolute inset-0 bg-primary/20 z-0"></div>
            )}
            <div className="z-10 p-4 max-w-4xl">
              <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
                {content.hero_headline}
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                {content.hero_subheadline}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                  <Link href="/events">
                    <Calendar className="mr-2 h-5 w-5" />
                    Upcoming Events
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white w-full sm:w-auto">
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
                 {services.length > 0 ? services.map((service) => {
                  const Icon = iconMap[service.icon] || Church;
                  return (
                    <Card key={service.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-3 font-headline text-2xl">
                          <Icon className="h-8 w-8 text-accent" />
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg">{service.schedule}</p>
                        <p className="text-muted-foreground">{service.details}</p>
                      </CardContent>
                    </Card>
                  )
                }) : (
                    <p className="text-muted-foreground col-span-3">Services have not been configured yet.</p>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* About Us Snippet */}
          <section id="about" className="py-16 lg:py-24 bg-card">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2">
                <Image
                  src={content.about_image || "https://placehold.co/600x400.png"}
                  alt="Church interior"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl w-full h-auto"
                  data-ai-hint="church interior"
                />
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
                  {content.about_title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {content.about_text}
                </p>
                <Button asChild className="mt-6" variant="link" size="lg">
                  <Link href="/contact">Learn More About Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Featured Sermons */}
          {latestSermon && (
            <section className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">Latest Message</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Get inspired by our recent sermon on faith and perseverance.
                    </p>
                    <div className="mt-12 max-w-2xl mx-auto">
                        <Card className="shadow-lg overflow-hidden">
                            <div className="relative aspect-video">
                                <Image src={latestSermon.thumbnail_url || "https://placehold.co/800x450.png"} alt={latestSermon.title} fill className="object-cover" data-ai-hint="sermon abstract"/>
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <Button variant="ghost" className="text-white h-20 w-20 hover:bg-white/20" onClick={handleWatchClick}>
                                      <Video className="h-12 w-12"/>
                                      <span className="sr-only">Play Sermon</span>
                                  </Button>
                                </div>
                            </div>
                            <CardContent className="p-6 text-left">
                                <CardTitle className="font-headline text-2xl">{latestSermon.title}</CardTitle>
                                <p className="text-muted-foreground mt-2">Speaker: {latestSermon.speaker}</p>
                                <Button onClick={handleWatchClick} className="mt-4">
                                    Watch Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
          )}
        </div>
      </MotionWrapper>
      <SermonPlayerDialog sermon={latestSermon} open={isPlayerOpen} onOpenChange={setIsPlayerOpen} />
    </>
  );
}
