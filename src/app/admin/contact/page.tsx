
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/activity-logger';
import type { ContactContent } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

const defaultContent: ContactContent = {
  intro: "We would love to hear from you. Whether you have a question, a prayer request, or just want to say hello, feel free to reach out.",
  addressLine1: "123 Faith Avenue",
  addressLine2: "Hope City, HC 12345",
  phone: "(123) 456-7890",
  generalEmail: "contact@penielchurch.org",
  prayerEmail: "prayer@penielchurch.org",
  socials: [
      { platform: "Facebook", url: "https://facebook.com" },
      { platform: "Twitter", url: "https://twitter.com" },
      { platform: "Youtube", url: "https://youtube.com" },
  ]
};

export default function ContactPageManagement() {
  const { toast } = useToast();
  const [content, setContent] = useState<ContactContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', 'contact')
            .single();

        if (data?.content && Object.keys(data.content).length > 0) {
            setContent(data.content as ContactContent);
        } else {
            setContent(defaultContent);
        }
        setIsLoading(false);
    };
    fetchContent();
  }, []);
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ content: content as any })
        .eq('key', 'contact');

      if (error) throw error;
      
      await logActivity("Updated Contact Page", "Contact page details updated.");
      toast({
          title: "Changes Saved!",
          description: "Your contact page details have been updated.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error saving changes",
        description: e.message
      })
    } finally {
      setIsSaving(false);
    }
  }

  const handleAddSocialLink = () => {
    setContent(prev => ({
      ...prev,
      socials: [...prev.socials, { platform: "", url: "" }]
    }));
  };

  const handleRemoveSocialLink = (index: number) => {
    setContent(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...content.socials];
    newLinks[index][field] = value;
    setContent(prev => ({...prev, socials: newLinks}));
  };
  
  const fullAddress = encodeURIComponent(`${content.addressLine1}, ${content.addressLine2}`);
  const mapSrc = `https://maps.google.com/maps?q=${fullAddress}&output=embed&z=15`;


  if (isLoading) {
    return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Contact Page Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update the contact details displayed on the public contact page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address-line1">Address Line 1</Label>
                <Input id="address-line1" value={content.addressLine1} onChange={e => setContent({...content, addressLine1: e.target.value})} placeholder="e.g. 123 Faith Avenue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-line2">Address Line 2</Label>
                <Input id="address-line2" value={content.addressLine2} onChange={e => setContent({...content, addressLine2: e.target.value})} placeholder="e.g. Hope City, HC 12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={content.phone} onChange={e => setContent({...content, phone: e.target.value})} placeholder="e.g. (123) 456-7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-general">General Inquiries Email</Label>
                <Input id="email-general" type="email" value={content.generalEmail} onChange={e => setContent({...content, generalEmail: e.target.value})} placeholder="e.g. contact@penielchurch.org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-prayer">Prayer Requests Email</Label>
                <Input id="email-prayer" type="email" value={content.prayerEmail} onChange={e => setContent({...content, prayerEmail: e.target.value})} placeholder="e.g. prayer@penielchurch.org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-intro">Introductory Text</Label>
                <Textarea id="page-intro" value={content.intro} onChange={e => setContent({...content, intro: e.target.value})} placeholder="e.g. We would love to hear from you..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Update the links to your social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.socials.map((link, index) => (
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
        </div>
        
        <div>
          <Card>
              <CardHeader>
                <CardTitle>Map Preview</CardTitle>
                <CardDescription>This map shows a preview of the address entered on the left. It will update as you type.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="mt-4 h-96 bg-muted rounded-lg overflow-hidden">
                    <iframe
                        key={mapSrc}
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={mapSrc}
                        className="border-0"
                    ></iframe>
                  </div>
              </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
