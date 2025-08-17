
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { Skeleton } from '@/components/ui/skeleton';
import type { HomeContent } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { uploadFileAndGetUrl } from '@/lib/storage';

const defaultHomeContent: HomeContent = {
  heroHeadline: "Welcome to Peniel Global Ministry",
  heroSubheadline: "A place of faith, hope, and community.",
  heroImages: ["https://placehold.co/1920x1080.png"],
  aboutTitle: "Our Community of Faith",
  aboutText: "Peniel Global Ministry is more than just a building...",
  aboutImage: "https://placehold.co/600x400.png",
};

export default function HomePageManagement() {
  const { toast } = useToast();
  const [content, setContent] = useState<Partial<HomeContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newHeroImageFiles, setNewHeroImageFiles] = useState<File[]>([]);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'home')
            .single();

        if (error || !data?.content || Object.keys(data.content).length === 0) {
            setContent(defaultHomeContent);
        } else {
            setContent(data.content as HomeContent);
        }
        setIsLoading(false);
    };
    fetchContent();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    let updatedContent = { ...content };
    
    try {
      if (newHeroImageFiles.length > 0) {
        const uploadPromises = newHeroImageFiles.map(file => uploadFileAndGetUrl(file, 'content'));
        const newImageUrls = await Promise.all(uploadPromises);
        updatedContent.heroImages = [...(updatedContent.heroImages || []), ...newImageUrls];
      }

      if (aboutImageFile) {
        const aboutImageUrl = await uploadFileAndGetUrl(aboutImageFile, 'content');
        updatedContent.aboutImage = aboutImageUrl;
      }
      
      const { error } = await supabase
        .from('site_content')
        .update({ content: updatedContent as any })
        .eq('key', 'home');

      if (error) throw error;
      
      await logActivity("Updated Home Page", "Home page text and images updated.");

      toast({
        title: "Changes Saved!",
        description: "Your home page details have been updated.",
      });

      // Correctly update the state with the new content
      setContent(updatedContent);
      setNewHeroImageFiles([]);
      setAboutImageFile(null);
      
      const heroInput = document.getElementById('hero-image-file') as HTMLInputElement;
      if (heroInput) heroInput.value = '';
      const aboutInput = document.getElementById('about-image-file') as HTMLInputElement;
      if(aboutInput) aboutInput.value = '';

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save changes: ${error.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveHeroImage = (indexToRemove: number) => {
    setContent(prev => ({
        ...prev,
        heroImages: prev.heroImages?.filter((_, index) => index !== indexToRemove)
    }));
  }

  if (isLoading) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight mb-6">Home Page Management</h1>
            <Card className="mb-8">
                <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  const aboutPreview = aboutImageFile ? URL.createObjectURL(aboutImageFile) : content.aboutImage;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Home Page Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Update the main welcome message and background image slideshow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Headline</Label>
            <Input id="hero-title" value={content.heroHeadline || ""} onChange={(e) => setContent({...content, heroHeadline: e.target.value})} placeholder="e.g. Welcome to Peniel Global Ministry" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Sub-headline</Label>
            <Textarea id="hero-subtitle" value={content.heroSubheadline || ""} onChange={(e) => setContent({...content, heroSubheadline: e.target.value})} placeholder="e.g. A place of faith, hope, and community." />
          </div>
          <div>
            <Label>Slideshow Images</Label>
            <div className="mt-2 p-4 border rounded-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-muted/40 min-h-[150px]">
                {content.heroImages?.map((imageUrl, index) => (
                    <div key={imageUrl} className="relative aspect-video group">
                        <Image src={imageUrl} alt={`Hero background ${index + 1}`} fill style={{objectFit:"cover"}} className="rounded-md" data-ai-hint="church congregation" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveHeroImage(index)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove image</span>
                        </Button>
                    </div>
                ))}
            </div>
            <Input id="hero-image-file" type="file" className="mt-4" onChange={(e) => setNewHeroImageFiles(Array.from(e.target.files || []))} multiple accept="image/*" />
            <p className="text-sm text-muted-foreground mt-2">
              Select one or more images to add to the hero slideshow.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community of Faith Section</CardTitle>
          <CardDescription>Update the brief "About Us" section (titled "Our Community of Faith") on the home page.</CardDescription>
        </Header>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="about-title">Section Title</Label>
                <Input id="about-title" value={content.aboutTitle || ""} onChange={(e) => setContent({...content, aboutTitle: e.target.value})} placeholder="e.g. Our Community of Faith" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="about-text">Content</Label>
                <Textarea id="about-text" rows={5} value={content.aboutText || ""} onChange={(e) => setContent({...content, aboutText: e.target.value})} placeholder="e.g. Peniel Global Ministry is more than just a building..." />
            </div>
             <div>
                <Label>Section Image</Label>
                <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 relative min-h-[150px]">
                    {aboutPreview && <Image src={aboutPreview} alt="About us" width={200} height={150} style={{objectFit:"cover"}} data-ai-hint="church interior" />}
                </div>
                <Input id="about-image-file" type="file" className="mt-4" onChange={(e) => setAboutImageFile(e.target.files ? e.target.files[0] : null)} accept="image/*" />
                <p className="text-sm text-muted-foreground mt-2">
                  Select a new image to replace the current one.
                </p>
            </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
          <Button onClick={handleSaveChanges} disabled={isSaving || isLoading}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
      </div>
    </div>
  );
}

    