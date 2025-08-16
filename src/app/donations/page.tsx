

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Heart, Gift } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const donationTiers = [
  {
    title: "General Fund",
    description: "Support the day-to-day operations and ministries of our church.",
    icon: DollarSign,
    placeholder: "50.00",
  },
  {
    title: "Missions & Outreach",
    description: "Help us spread the message of hope and serve communities locally and globally.",
    icon: Heart,
    placeholder: "100.00",
  },
  {
    title: "Building Fund",
    description: "Contribute to the maintenance and improvement of our church facilities.",
    icon: Gift,
    placeholder: "250.00",
  },
];

export default function DonationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Support Our Ministry</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Your generous giving enables us to continue our mission of spreading faith, hope, and love. Every contribution makes a difference. Thank you for your partnership in the gospel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {donationTiers.map((tier) => (
          <Card key={tier.title} className="flex flex-col shadow-lg">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-accent/20 rounded-full mb-4">
                  <tier.icon className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">{tier.title}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow justify-center items-center flex p-6">
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="number" 
                        placeholder={tier.placeholder}
                        className="pl-10 text-xl font-semibold text-center" 
                    />
                </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                <Link href="#">Donate Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
        <div className="text-center mt-16">
            <h2 className="font-headline text-2xl font-semibold text-primary">Other Ways to Give</h2>
            <p className="mt-2 text-muted-foreground">You can also give during our Sunday services or mail a check to our address.</p>
        </div>
    </div>
  );
}
