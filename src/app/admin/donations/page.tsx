
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function DonationsPageManagement() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved!",
        description: "Your donations page details have been updated.",
    });
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
            <Input id="donations-title" placeholder="e.g. Support Our Ministry" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donations-intro">Introductory Paragraph</Label>
            <Textarea id="donations-intro" rows={4} placeholder="e.g. Your generous giving enables us..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donation Tiers</CardTitle>
          <CardDescription>Update the details for the donation options. For the 'Donate Now' buttons, you'll need to provide links to your payment processor (e.g., Stripe, PayPal).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Tier 1 */}
            <div className="p-4 border rounded-lg space-y-4">
                 <h3 className="font-semibold text-lg">Tier 1: General Fund</h3>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="e.g. Support the day-to-day operations..." />
                 </div>
                 <div className="space-y-2">
                    <Label>Suggested Amount</Label>
                    <Input type="number" placeholder="50" />
                 </div>
                 <div className="space-y-2">
                    <Label>Donation Link</Label>
                    <Input placeholder="https://your-payment-link.com/general" />
                 </div>
            </div>
            {/* Tier 2 */}
            <div className="p-4 border rounded-lg space-y-4">
                 <h3 className="font-semibold text-lg">Tier 2: Missions & Outreach</h3>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="e.g. Help us spread the message of hope..." />
                 </div>
                 <div className="space-y-2">
                    <Label>Suggested Amount</Label>
                    <Input type="number" placeholder="100" />
                 </div>
                 <div className="space-y-2">
                    <Label>Donation Link</Label>
                    <Input placeholder="https://your-payment-link.com/missions" />
                 </div>
            </div>
            {/* Tier 3 */}
            <div className="p-4 border rounded-lg space-y-4">
                 <h3 className="font-semibold text-lg">Tier 3: Building Fund</h3>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="Contribute to the maintenance..." />
                 </div>
                 <div className="space-y-2">
                    <Label>Suggested Amount</Label>
                    <Input type="number" placeholder="250" />
                 </div>
                 <div className="space-y-2">
                    <Label>Donation Link</Label>
                    <Input placeholder="https://your-payment-link.com/building" />
                 </div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handleSaveChanges}>Save All Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
