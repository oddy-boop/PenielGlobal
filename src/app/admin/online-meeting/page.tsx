
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { OnlineMeetingContent } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { logActivity } from '@/lib/activity-logger';

const defaultContent: OnlineMeetingContent = {
  title: "Join Us Online",
  intro: "Connect with our church family from anywhere in the world. Our online services and meetings are a great way to stay engaged.",
  meetingTitle: "Midweek Bible Study",
  meetingTime: "Every Wednesday at 7:00 PM",
  description: "Dive deeper into the scriptures with us in our interactive online Bible study. It's a time of learning, discussion, and fellowship.",
  meetingLink: "#",
  imageUrl: "https://placehold.co/600x450.png"
};

export default function OnlineMeetingManagementPage() {
  const { toast } = useToast();
  
  const [content, setContent] = useState<Partial<OnlineMeetingContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const storedContent = localStorage.getItem("online_meeting_content");
    if (storedContent) {
      setContent(JSON.parse(storedContent));
    } else {
      setContent(defaultContent);
    }
    setIsLoading(false);
  }, []);

  const handleSaveChanges = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("online_meeting_content", JSON.stringify(content));
      logActivity("Updated Online Meeting Page", `New title: ${content.title}`);
      
      toast({
        title: "Changes Saved!",
        description: "Your online meeting details have been updated locally.",
      });
    } catch (error) {
       console.error("Error saving content to localStorage: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes locally.",
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
                <Label>Image URL</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48 relative">
                    <Image src={content.imageUrl || "https://placehold.co/600x450.png"} alt="Current Meeting Image" width={200} height={150} data-ai-hint="online meeting" />
                </div>
                 <Input id="image-url" type="text" className="mt-4" value={content.imageUrl || ""} onChange={(e) => setContent({...content, imageUrl: e.target.value})} placeholder="https://example.com/meeting-image.jpg" />
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
