
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { logActivity } from "@/lib/activity-logger";
import type { DonationsContent } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

interface DonationTier {
  id: string;
  title: string;
  description: string;
  suggestedAmount: string;
  link: string;
}

const defaultContent: DonationsContent = {
  headline: "Support Our Ministry",
  intro: "Your generous giving enables us to spread the message of hope and continue our work in the community. Thank you for your support.",
  tiers: [
    { id: 'tier-1', title: 'General Fund', description: 'Support the day-to-day operations and ministries of the church.', suggestedAmount: '50', link: '#' },
    { id: 'tier-2', title: 'Missions', description: 'Help us support missionaries and outreach programs around the world.', suggestedAmount: '100', link: '#' },
    { id: 'tier-3', title: 'Building Fund', description: 'Contribute to the maintenance and improvement of our church facilities.', suggestedAmount: '250', link: '#' },
  ],
};


export default function DonationsPageManagement() {
  const { toast } = useToast();
  const [content, setContent] = useState<DonationsContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'donations')
            .single();

        if (data?.content && Object.keys(data.content).length > 0) {
            setContent(data.content as DonationsContent);
        } else {
            setContent(defaultContent);
        }
        setIsLoading(false);
    };
    fetchContent();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ content: content as any })
        .eq('key', 'donations');
      
      if (error) throw error;
      
      await logActivity("Updated Donations Page", `New headline: ${content.headline}`);
      toast({
        title: "Changes Saved!",
        description: "Your donations page details have been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. " + error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTier = () => {
    setContent(prev => ({
        ...prev,
        tiers: [
          ...prev.tiers,
          { id: `tier-${Date.now()}`, title: "", description: "", suggestedAmount: "", link: "" },
        ]
    }));
  };

  const handleRemoveTier = (id: string) => {
    setContent(prev => ({ ...prev, tiers: prev.tiers.filter(tier => tier.id !== id)}));
  };

  const handleTierChange = (id: string, field: keyof Omit<DonationTier, 'id'>, value: string) => {
    setContent(prev => ({
        ...prev,
        tiers: prev.tiers.map(tier => (tier.id === id ? { ...tier, [field]: value } : tier))
    }));
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Donations Page Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
          <CardDescription>Update the main text on the donations page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="donations-title">Headline</Label>
            <Input id="donations-title" placeholder="e.g. Support Our Ministry" value={content.headline} onChange={(e) => setContent({...content, headline: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donations-intro">Introductory Paragraph</Label>
            <Textarea id="donations-intro" rows={4} placeholder="e.g. Your generous giving enables us..." value={content.intro} onChange={(e) => setContent({...content, intro: e.target.value})} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donation Tiers</CardTitle>
          <CardDescription>Update the details for the donation options. For the 'Donate Now' buttons, you'll need to provide links to your payment processor (e.g., Stripe, PayPal).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {content.tiers.map((tier) => (
              <div key={tier.id} className="p-4 border rounded-lg space-y-4 relative">
                  <div className="flex justify-between items-center">
                    <Input placeholder="Tier Title" className="font-semibold text-lg border-none shadow-none p-0 focus-visible:ring-0" value={tier.title} onChange={(e) => handleTierChange(tier.id, 'title', e.target.value)} />
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemoveTier(tier.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="e.g. Support the day-to-day operations..." value={tier.description} onChange={(e) => handleTierChange(tier.id, 'description', e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <Label>Suggested Amount</Label>
                    <Input type="number" placeholder="50" value={tier.suggestedAmount} onChange={(e) => handleTierChange(tier.id, 'suggestedAmount', e.target.value)}/>
                 </div>
                 <div className="space-y-2">
                    <Label>Donation Link</Label>
                    <Input placeholder="https://your-payment-link.com/general" value={tier.link} onChange={(e) => handleTierChange(tier.id, 'link', e.target.value)}/>
                 </div>
              </div>
            ))}
             <Button variant="outline" onClick={handleAddTier}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tier
            </Button>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Changes
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
