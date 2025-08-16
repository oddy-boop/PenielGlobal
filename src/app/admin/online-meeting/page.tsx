
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { OnlineMeetingContent } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { logActivity } from '@/lib/activity-logger';

export default function OnlineMeetingManagementPage() {
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState<Partial<OnlineMeetingContent>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const docRef = doc(db, "siteContent", "onlineMeeting");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data() as OnlineMeetingContent);
      }
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      let imageUrl = content.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `content/meeting-${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updatedContent: OnlineMeetingContent = {
        title: content.title || "",
        intro: content.intro || "",
        meetingTitle: content.meetingTitle || "",
        meetingTime: content.meetingTime || "",
        description: content.description || "",
        meetingLink: content.meetingLink || "#",
        imageUrl: imageUrl || "https://placehold.co/600x450.png",
      };

      await setDoc(doc(db, "siteContent", "onlineMeeting"), updatedContent);
      await logActivity("Updated Online Meeting Page", `New title: ${updatedContent.title}`);

      setContent(updatedContent);
      setImageFile(null);
      setImagePreview(null);
      
      toast({
        title: "Changes Saved!",
        description: "Your online meeting details have been updated.",
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
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Online Meeting Management</h1>
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-32" /></CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Online Meeting Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Update Online Meeting Details</CardTitle>
          <CardDescription>
            Edit the content for the online meeting page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input id="page-title" value={content.title || ''} onChange={(e) => setContent({...content, title: e.target.value})} placeholder="e.g. Join Us Online" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="page-intro">Page Intro</Label>
                <Textarea id="page-intro" value={content.intro || ''} onChange={(e) => setContent({...content, intro: e.target.value})} placeholder="e.g. Connect with our church family from anywhere..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input id="meeting-title" value={content.meetingTitle || ''} onChange={(e) => setContent({...content, meetingTitle: e.target.value})} placeholder="e.g. Midweek Bible Study" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-time">Meeting Time</Label>
                <Input id="meeting-time" value={content.meetingTime || ''} onChange={(e) => setContent({...content, meetingTime: e.target.value})} placeholder="e.g. Every Wednesday at 7:00 PM" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-description">Description</Label>
                <Textarea id="meeting-description" value={content.description || ''} onChange={(e) => setContent({...content, description: e.target.value})} placeholder="e.g. Dive deeper into the scriptures..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting Link</Label>
                <Input id="meeting-link" value={content.meetingLink || ''} onChange={(e) => setContent({...content, meetingLink: e.target.value})} placeholder="https://zoom.us/..." />
            </div>
             <div>
                <Label>Current Image</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48 relative">
                    <Image src={imagePreview || content.imageUrl || "https://placehold.co/600x450.png"} alt="Current Meeting Image" width={200} height={150} data-ai-hint="online meeting" />
                     {imagePreview &&
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setImageFile(null); setImagePreview(null);}}>
                          <X className="h-4 w-4" />
                      </Button>
                    }
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image-upload">Upload New Image</Label>
                <div className="flex items-center gap-4">
                    <Input id="image-upload" type="file" className="hidden" ref={imageInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif"/>
                    <Button onClick={() => imageInputRef.current?.click()} disabled={isSaving}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
             {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    