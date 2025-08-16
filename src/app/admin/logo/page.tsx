
"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LogoManagementPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [headerBgPreview, setHeaderBgPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerBgFile, setHeaderBgFile] = useState<File | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const headerBgInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>, fileSetter: React.Dispatch<React.SetStateAction<File | null>>) => {
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

  const handleSaveChanges = () => {
    // Here you would typically upload the logoFile and headerBgFile to Firebase Storage
    // and save the URLs to your Firestore database.
    toast({
        title: "Changes Saved!",
        description: "Your logo and branding details have been updated.",
    });
  }

  const defaultLogo = "/placeholder-logo.svg";
  const defaultHeaderBg = "https://placehold.co/1200x200.png";

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Church Logo & Branding Management</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Update Church Logo</CardTitle>
          <CardDescription>
            Upload a new logo for the website. This will replace the current logo in the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label>Logo Preview</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-32 relative">
                    {logoPreview || defaultLogo ? (
                        <>
                            <Image src={logoPreview || defaultLogo} alt="Current Logo" width={100} height={40} data-ai-hint="church logo" />
                            {logoFile &&
                              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setLogoFile(null); setLogoPreview(null); if(logoInputRef.current) logoInputRef.current.value = ""}}>
                                  <X className="h-4 w-4" />
                              </Button>
                            }
                        </>
                    ) : null }
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="logo-upload">Upload New Logo</Label>
                <div className="flex items-center gap-4">
                    <Input 
                      id="logo-upload" 
                      type="file" 
                      ref={logoInputRef}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setLogoPreview, setLogoFile)}
                      accept="image/png, image/jpeg, image/svg+xml"
                    />
                    <Button className="flex-1" variant="outline" onClick={() => logoInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        {logoFile ? 'Change Logo' : 'Select Logo'}
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Recommended size: 200x50px. Supports PNG, JPG, SVG.
                </p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header Background</CardTitle>
          <CardDescription>
            Upload a background image for the website header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label>Header Background Preview</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48 relative">
                    {headerBgPreview || defaultHeaderBg ? (
                        <>
                            <Image src={headerBgPreview || defaultHeaderBg} alt="Header background" width={300} height={50} style={{objectFit: "cover"}} data-ai-hint="church interior abstract" />
                             {headerBgFile &&
                              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setHeaderBgFile(null); setHeaderBgPreview(null); if(headerBgInputRef.current) headerBgInputRef.current.value = ""}}>
                                  <X className="h-4 w-4" />
                              </Button>
                            }
                        </>
                    ) : null }
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="header-bg-upload">Upload New Header Background</Label>
                <div className="flex items-center gap-4">
                    <Input 
                      id="header-bg-upload" 
                      type="file"
                      ref={headerBgInputRef}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setHeaderBgPreview, setHeaderBgFile)}
                      accept="image/png, image/jpeg"
                    />
                    <Button className="flex-1" variant="outline" onClick={() => headerBgInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                         {headerBgFile ? 'Change Background' : 'Select Background'}
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Recommended aspect ratio: wide, like 1200x200px.
                </p>
            </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button onClick={handleSaveChanges}>Save All Changes</Button>
      </div>

    </div>
  );
}
