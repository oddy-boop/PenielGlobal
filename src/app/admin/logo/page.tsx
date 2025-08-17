
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

export default function LogoManagementPage() {
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState("");
  const [headerBgUrl, setHeaderBgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const storedBranding = localStorage.getItem("branding_content");
    if (storedBranding) {
      const data: Branding = JSON.parse(storedBranding);
      setLogoUrl(data.logoUrl || "");
      setHeaderBgUrl(data.headerBgUrl || "");
    } else {
      // Set default placeholder if nothing is in localStorage
      setLogoUrl("/placeholder-logo.svg");
      setHeaderBgUrl("https://placehold.co/1200x200.png");
    }
    setIsLoading(false);
  }, []);

  const handleSaveChanges = () => {
    setIsSaving(true);
    try {
      const brandingData: Branding = { logoUrl, headerBgUrl };
      localStorage.setItem("branding_content", JSON.stringify(brandingData));
      
      logActivity("Updated Branding", "Logo and/or Header Background updated.");

      toast({
        title: "Success!",
        description: "Your logo and branding details have been saved locally.",
      });
    } catch (error) {
      console.error("Error saving branding details to localStorage: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please check browser permissions.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Church Logo & Branding Management</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Update Church Logo</CardTitle>
          <CardDescription>
            Enter the URL for your church logo. This will replace the current logo in the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Logo Preview</Label>
            <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-32 relative">
              {isLoading ? <Skeleton className="h-20 w-40"/> : (
                <Image src={logoUrl || "/placeholder-logo.svg"} alt="Current Logo" width={100} height={40} data-ai-hint="church logo" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo Image URL</Label>
            <Input 
              id="logo-url" 
              type="text" 
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
                Paste the URL of your hosted logo image.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header Background</CardTitle>
          <CardDescription>
            Enter the URL for the website header's background image.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Header Background Preview</Label>
            <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48 relative">
              {isLoading ? <Skeleton className="h-32 w-full"/> : (
                <Image src={headerBgUrl || "https://placehold.co/1200x200.png"} alt="Header background" width={300} height={50} style={{objectFit: "cover"}} data-ai-hint="church interior abstract" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="header-bg-url">Header Background URL</Label>
            <Input 
              id="header-bg-url" 
              type="text"
              value={headerBgUrl}
              onChange={(e) => setHeaderBgUrl(e.target.value)}
              placeholder="https://example.com/header.jpg"
              disabled={isSaving}
            />
             <p className="text-sm text-muted-foreground">
                Paste the URL of your hosted header image.
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
