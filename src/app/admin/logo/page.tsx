
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Branding } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { logActivity } from "@/lib/activity-logger";
import { supabase } from "@/lib/supabaseClient";
import { uploadFileAndGetUrl } from "@/lib/storage";

export default function LogoManagementPage() {
  const { toast } = useToast();
  const [branding, setBranding] = useState<Branding>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerBgFile, setHeaderBgFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('key', 'branding')
          .single();

      if (data?.content) {
        setBranding(data.content as Branding);
      } else {
        setBranding({ logoUrl: "/placeholder-logo.svg", headerBgUrl: "https://placehold.co/1200x200.png" });
      }
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      let finalBranding = { ...branding };

      if (logoFile) {
        const logoUrl = await uploadFileAndGetUrl(logoFile, 'branding');
        finalBranding.logoUrl = logoUrl;
      }
      if (headerBgFile) {
        const headerBgUrl = await uploadFileAndGetUrl(headerBgFile, 'branding');
        finalBranding.headerBgUrl = headerBgUrl;
      }
      
      const { error } = await supabase
        .from('site_content')
        .update({ content: finalBranding })
        .eq('key', 'branding');
      
      if (error) throw error;
      
      await logActivity("Updated Branding", "Logo and/or Header Background updated.");

      toast({
        title: "Success!",
        description: "Your logo and branding details have been saved.",
      });
      
      setBranding(finalBranding);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes: " + error.message,
      });
    } finally {
      setIsSaving(false);
      setLogoFile(null);
      setHeaderBgFile(null);
    }
  }

  const logoPreview = logoFile ? URL.createObjectURL(logoFile) : branding.logoUrl;
  const headerBgPreview = headerBgFile ? URL.createObjectURL(headerBgFile) : branding.headerBgUrl;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Church Logo & Branding Management</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Update Church Logo</CardTitle>
          <CardDescription>
            Upload a new church logo. This will replace the current logo in the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Logo Preview</Label>
            <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-32 relative">
              {isLoading ? <Skeleton className="h-20 w-40"/> : (
                <Image src={logoPreview || "/placeholder-logo.svg"} alt="Current Logo" width={100} height={40} data-ai-hint="church logo" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-file">Upload New Logo</Label>
            <Input 
              id="logo-file" 
              type="file" 
              onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
              accept="image/*"
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
                Select an image file from your computer.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header Background</CardTitle>
          <CardDescription>
            Upload a new background image for the website header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Header Background Preview</Label>
            <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48 relative">
              {isLoading ? <Skeleton className="h-32 w-full"/> : (
                <Image src={headerBgPreview || "https://placehold.co/1200x200.png"} alt="Header background" width={300} height={50} style={{objectFit: "cover"}} data-ai-hint="church interior abstract" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="header-bg-file">Upload New Header Background</Label>
            <Input 
              id="header-bg-file" 
              type="file"
              onChange={(e) => setHeaderBgFile(e.target.files ? e.target.files[0] : null)}
              accept="image/*"
              disabled={isSaving}
            />
             <p className="text-sm text-muted-foreground">
                Select an image file from your computer.
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
