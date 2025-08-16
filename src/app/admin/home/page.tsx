
"use client";

import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function HomePageManagement() {
  const { toast } = useToast();
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved!",
        description: "Your home page details have been updated.",
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Home Page Management</h1>
      
      {/* Hero Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Update the main welcome message and background image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Headline</Label>
            <Input id="hero-title" placeholder="e.g. Welcome to Peniel Church Global" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Sub-headline</Label>
            <Textarea id="hero-subtitle" placeholder="e.g. A place of faith, hope, and community." />
          </div>
          <div>
            <Label>Background Image</Label>
            <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40">
                <Image src="https://placehold.co/1920x1080.png" alt="Hero background" width={300} height={150} style={{objectFit:"cover"}} data-ai-hint="church congregation" />
            </div>
            <div className="flex items-center gap-4 mt-4">
                <Input id="hero-image-upload" type="file" className="hidden" ref={heroImageInputRef} />
                <Button onClick={() => heroImageInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Image
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Us Snippet Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Us Snippet</CardTitle>
          <CardDescription>Update the brief "About Us" section on the home page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="about-title">Section Title</Label>
                <Input id="about-title" placeholder="e.g. Our Community of Faith" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="about-text">Content</Label>
                <Textarea id="about-text" rows={5} placeholder="e.g. Peniel Church Global is more than just a building..." />
            </div>
             <div>
                <Label>Section Image</Label>
                <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40">
                    <Image src="https://placehold.co/600x400.png" alt="About us" width={200} height={150} style={{objectFit:"cover"}} data-ai-hint="church interior" />
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <Input id="about-image-upload" type="file" className="hidden" ref={aboutImageInputRef} />
                    <Button onClick={() => aboutImageInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Image
                    </Button>
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
