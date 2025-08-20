

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Heart, Gift, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { DonationsContent } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { MotionWrapper } from "@/components/motion-wrapper";

interface DonationTier {
  id: string;
  title: string;
  description: string;
  suggestedAmount: string;
  link: string;
  icon?: React.ElementType;
}

export default function DonationsPage() {
  const [content, setContent] = useState<DonationsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('key', 'donations')
        .single();
      
      if (data?.content) {
        const pageData = data.content as DonationsContent;
        // Assign icons based on tier index for variety
        const tiers = pageData.tiers || [];
        const tiersWithIcons = tiers.map((tier, index) => {
            const icons = [DollarSign, Heart, Gift];
            return {...tier, icon: icons[index % icons.length]};
        });
        setContent({...pageData, tiers: tiersWithIcons});
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
          <h2 className="text-2xl font-semibold text-primary">Donation Information Not Available</h2>
          <p className="text-muted-foreground mt-2">Please configure this page in the admin panel.</p>
        </div>
      )
  }

  return (
    <MotionWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{content.headline}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {content.intro}
          </p>
        </div>

        {content.tiers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.tiers.map((tier) => (
              <Card key={tier.id} className="flex flex-col shadow-lg">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-accent/20 rounded-full mb-4">
                      {tier.icon && <tier.icon className="h-10 w-10 text-accent" />}
                  </div>
                  <CardTitle className="font-headline text-2xl">{tier.title}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow justify-center items-center flex p-6">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">GHS</span>
                        <Input 
                            type="number" 
                            placeholder={Number(tier.suggestedAmount).toFixed(2)}
                            className="pl-14 text-xl font-semibold text-center" 
                        />
                    </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" size="lg">
                    <Link href={tier.link || '#'} target="_blank" rel="noopener noreferrer">Donate Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-primary">Donation Information Not Available</h2>
            <p className="text-muted-foreground mt-2">Please check back soon.</p>
          </div>
        )}

        <div className="text-center mt-16">
            <h2 className="font-headline text-2xl font-semibold text-primary">Other Ways to Give</h2>
            <p className="mt-2 text-muted-foreground">You can also give during our Sunday services or mail a check to our address.</p>
        </div>
      </div>
    </MotionWrapper>
  );
}
