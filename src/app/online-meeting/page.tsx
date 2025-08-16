import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OnlineMeetingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Join Us Online</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with our church family from anywhere in the world. Our online services and meetings are a great way to stay engaged.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Video className="w-6 h-6 text-accent"/>
                    Midweek Bible Study
                </CardTitle>
                <CardDescription>Every Wednesday at 7:00 PM</CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    Dive deeper into the scriptures with us in our interactive online Bible study.
                    It's a time of learning, discussion, and fellowship.
                </p>
                <Button asChild className="mt-6 w-full">
                    <Link href="#">
                        Join via Zoom <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardContent>
        </Card>
        <div className="p-4">
            <Image 
                src="https://placehold.co/600x450.png"
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
