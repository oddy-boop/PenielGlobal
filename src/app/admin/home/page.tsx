
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logActivity } from "@/lib/activity-logger";
import { Skeleton } from '@/components/ui/skeleton';
import type { HomeContent } from '@/lib/types';

export default function HomePageManagement() {
  const { toast } = useToast();
  const [initialContent, setInitialContent] = useState<Partial<HomeContent>>({});
  const [content, setContent] = useState<Partial<HomeContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>(null);

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const docRef = doc(db, "siteContent", "home");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as HomeContent;
        setContent(data);
        setInitialContent(data);
      }
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    fileSetter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      fileSetter(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      let heroImageUrl = content.heroImage;
      let aboutImageUrl = content.aboutImage;
      let activityDetails: string[] = [];

      if (heroImageFile) {
        heroImageUrl = await uploadFile(heroImageFile, `content/hero-${Date.now()}`);
        setHeroImageFile(null);
        setHeroImagePreview(null);
        activityDetails.push("Updated Hero Image");
      }

      if (aboutImageFile) {
        aboutImageUrl = await uploadFile(aboutImageFile, `content/about-${Date.now()}`);
        setAboutImageFile(null);
        setAboutImagePreview(null);
        activityDetails.push("Updated About Image");
      }

      const textContentChanged = 
        content.heroHeadline !== initialContent.heroHeadline ||
        content.heroSubheadline !== initialContent.heroSubheadline ||
        content.aboutTitle !== initialContent.aboutTitle ||
        content.aboutText !== initialContent.aboutText;
      
      if (textContentChanged) {
        activityDetails.push("Updated home page text content.");
      }

      const updatedContent: HomeContent = {
        heroHeadline: content.heroHeadline || "",
        heroSubheadline: content.heroSubheadline || "",
        heroImage: heroImageUrl || "https://placehold.co/1920x1080.png",
        aboutTitle: content.aboutTitle || "",
        aboutText: content.aboutText || "",
        aboutImage: aboutImageUrl || "https://placehold.co/600x400.png",
        latestSermonTitle: content.latestSermonTitle || "",
        latestSermonSpeaker: content.latestSermonSpeaker || "",
        latestSermonImage: content.latestSermonImage || "https://placehold.co/800x450.png",
      };

      await setDoc(doc(db, "siteContent", "home"), updatedContent);
      setContent(updatedContent);
      setInitialContent(updatedContent);
      
      if(activityDetails.length > 0) {
        await logActivity("Updated Home Page", activityDetails.join(" & "));
      }

      toast({
        title: "Changes Saved!",
        description: "Your home page details have been updated.",
      });

    } catch (error) {
      console.error("Error saving content: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Home Page Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Update the main welcome message and background image.</CardDescription>
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
            <Label>Background Image</Label>
            <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 relative min-h-[150px]">
                <Image src={heroImagePreview || content.heroImage || "https://placehold.co/1920x1080.png"} alt="Hero background" width={300} height={150} style={{objectFit:"cover"}} data-ai-hint="church congregation" />
                {heroImagePreview &&
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setHeroImageFile(null); setHeroImagePreview(null);}}>
                      <X className="h-4 w-4" />
                  </Button>
                }
            </div>
            <div className="flex items-center gap-4 mt-4">
                <Input id="hero-image-upload" type="file" className="hidden" ref={heroImageInputRef} onChange={(e) => handleFileChange(e, setHeroImagePreview, setHeroImageFile)} />
                <Button onClick={() => heroImageInputRef.current?.click()} disabled={isSaving}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Image
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Us Snippet</CardTitle>
          <CardDescription>Update the brief "About Us" section on the home page.</CardDescription>
        </CardHeader>
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
                    <Image src={aboutImagePreview || content.aboutImage || "https://placehold.co/600x400.png"} alt="About us" width={200} height={150} style={{objectFit:"cover"}} data-ai-hint="church interior" />
                    {aboutImagePreview &&
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setAboutImageFile(null); setAboutImagePreview(null);}}>
                          <X className="h-4 w-4" />
                      </Button>
                    }
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <Input id="about-image-upload" type="file" className="hidden" ref={aboutImageInputRef} onChange={(e) => handleFileChange(e, setAboutImagePreview, setAboutImageFile)}/>
                    <Button onClick={() => aboutImageInputRef.current?.click()} disabled={isSaving}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Image
                    </Button>
                </div>
            </div>
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

    