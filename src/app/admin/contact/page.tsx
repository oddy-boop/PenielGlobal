
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function ContactPageManagement() {
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<{platform: string, url: string}[]>([]);

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const handleSaveChanges = () => {
    // Here you would typically gather all the data from the form fields
    // and save it to your Firestore database.
    toast({
        title: "Changes Saved!",
        description: "Your contact page details have been updated.",
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Contact Page Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update the contact details displayed on the public contact page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address-line1">Address Line 1</Label>
            <Input id="address-line1" placeholder="e.g. 123 Faith Avenue" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address-line2">Address Line 2</Label>
            <Input id="address-line2" placeholder="e.g. Hope City, HC 12345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="e.g. (123) 456-7890" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="email-general">General Inquiries Email</Label>
            <Input id="email-general" type="email" placeholder="e.g. contact@penielchurch.org" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="email-prayer">Prayer Requests Email</Label>
            <Input id="email-prayer" type="email" placeholder="e.g. prayer@penielchurch.org" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="page-intro">Introductory Text</Label>
            <Textarea id="page-intro" placeholder="e.g. We would love to hear from you..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Update the links to your social media profiles. You can add or remove platforms as needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`platform-${index}`}>Platform</Label>
                <Input
                  id={`platform-${index}`}
                  placeholder="e.g. Instagram"
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`url-${index}`}>URL</Label>
                <Input
                  id={`url-${index}`}
                  placeholder="https://instagram.com/your-church"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveSocialLink(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddSocialLink}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Social Media Link
          </Button>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Button onClick={handleSaveChanges}>Save All Changes</Button>
      </div>
    </div>
  );
}
