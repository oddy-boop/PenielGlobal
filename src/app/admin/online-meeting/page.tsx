
"use client";

import { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function OnlineMeetingManagementPage() {
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSaveChanges = () => {
    // Here you would typically gather all the data from the form fields
    // and save it to your Firestore database.
    toast({
        title: "Changes Saved!",
        description: "Your online meeting details have been updated.",
    });
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
                <Label htmlFor="meeting-title">Title</Label>
                <Input id="meeting-title" placeholder="e.g. Midweek Bible Study" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-description">Description</Label>
                <Textarea id="meeting-description" placeholder="e.g. Dive deeper into the scriptures..." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting Link</Label>
                <Input id="meeting-link" placeholder="https://zoom.us/..." />
            </div>
             <div>
                <Label>Current Image</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48">
                    <Image src="https://placehold.co/600x450.png" alt="Current Meeting Image" width={200} height={150} data-ai-hint="online meeting" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image-upload">Upload New Image</Label>
                <div className="flex items-center gap-4">
                    <Input id="image-upload" type="file" className="hidden" ref={imageInputRef}/>
                    <Button onClick={() => imageInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
