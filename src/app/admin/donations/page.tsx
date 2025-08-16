
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

interface DonationTier {
  id: string;
  title: string;
  description: string;
  suggestedAmount: string;
  link: string;
}

export default function DonationsPageManagement() {
  const { toast } = useToast();
  const [headline, setHeadline] = useState("");
  const [intro, setIntro] = useState("");
  const [tiers, setTiers] = useState<DonationTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDonationsContent = async () => {
      setIsLoading(true);
      const docRef = doc(db, "siteContent", "donations");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeadline(data.headline || "");
        setIntro(data.intro || "");
        setTiers(data.tiers || []);
      }
      setIsLoading(false);
    };
    fetchDonationsContent();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const donationsData = { headline, intro, tiers };
      await setDoc(doc(db, "siteContent", "donations"), donationsData);
      toast({
        title: "Changes Saved!",
        description: "Your donations page details have been updated.",
      });
    } catch (error) {
      console.error("Error saving donations content: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTier = () => {
    setTiers([
      ...tiers,
      { id: `tier-${Date.now()}`, title: "", description: "", suggestedAmount: "", link: "" },
    ]);
  };

  const handleRemoveTier = (id: string) => {
    setTiers(tiers.filter(tier => tier.id !== id));
  };

  const handleTierChange = (id: string, field: keyof Omit<DonationTier, 'id'>, value: string) => {
    setTiers(
      tiers.map(tier => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
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
            <Input id="donations-title" placeholder="e.g. Support Our Ministry" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donations-intro">Introductory Paragraph</Label>
            <Textarea id="donations-intro" rows={4} placeholder="e.g. Your generous giving enables us..." value={intro} onChange={(e) => setIntro(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donation Tiers</CardTitle>
          <CardDescription>Update the details for the donation options. For the 'Donate Now' buttons, you'll need to provide links to your payment processor (e.g., Stripe, PayPal).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {tiers.map((tier) => (
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
