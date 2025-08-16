
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { Branding } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";


export default function LogoManagementPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [headerBgPreview, setHeaderBgPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [headerBgFile, setHeaderBgFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("/placeholder-logo.svg");
  const [currentHeaderBgUrl, setCurrentHeaderBgUrl] = useState<string>("https://placehold.co/1200x200.png");

  useEffect(() => {
    const fetchBranding = async () => {
      setIsLoading(true);
      const docRef = doc(db, "siteContent", "branding");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Branding;
        if(data.logoUrl) setCurrentLogoUrl(data.logoUrl);
        if(data.headerBgUrl) setCurrentHeaderBgUrl(data.headerBgUrl);
      }
      setIsLoading(false);
    };
    fetchBranding();
  }, []);


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

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      let logoUrl = currentLogoUrl;
      let headerBgUrl = currentHeaderBgUrl;

      if (logoFile) {
        logoUrl = await uploadFile(logoFile, `branding/logo-${Date.now()}`);
        setCurrentLogoUrl(logoUrl);
        setLogoFile(null);
        setLogoPreview(null);
      }

      if (headerBgFile) {
        headerBgUrl = await uploadFile(headerBgFile, `branding/header-bg-${Date.now()}`);
        setCurrentHeaderBgUrl(headerBgUrl);
        setHeaderBgFile(null);
        setHeaderBgPreview(null);
      }

      const brandingData: Branding = { logoUrl, headerBgUrl };
      await setDoc(doc(db, "siteContent", "branding"), brandingData, { merge: true });

      toast({
        title: "Success!",
        description: "Your logo and branding details have been saved.",
      });

    } catch (error) {
      console.error("Error saving branding details: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
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
            Upload a new logo for the website. This will replace the current logo in the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label>Logo Preview</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-32 relative">
                    {isLoading ? <Skeleton className="h-20 w-40"/> : (
                        <>
                            <Image src={logoPreview || currentLogoUrl} alt="Current Logo" width={100} height={40} data-ai-hint="church logo" />
                            {(logoFile || logoPreview) &&
                              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setLogoFile(null); setLogoPreview(null);}}>
                                  <X className="h-4 w-4" />
                              </Button>
                            }
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="logo-upload">Upload New Logo</Label>
                 <Input 
                  id="logo-upload" 
                  type="file" 
                  onChange={(e) => handleFileChange(e, setLogoPreview, setLogoFile)}
                  accept="image/png, image/jpeg, image/svg+xml"
                  disabled={isSaving}
                />
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
                    {isLoading ? <Skeleton className="h-32 w-full"/> : (
                        <>
                            <Image src={headerBgPreview || currentHeaderBgUrl} alt="Header background" width={300} height={50} style={{objectFit: "cover"}} data-ai-hint="church interior abstract" />
                             {(headerBgFile || headerBgPreview) &&
                              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {setHeaderBgFile(null); setHeaderBgPreview(null);}}>
                                  <X className="h-4 w-4" />
                              </Button>
                            }
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="header-bg-upload">Upload New Header Background</Label>
                <Input 
                  id="header-bg-upload" 
                  type="file"
                  onChange={(e) => handleFileChange(e, setHeaderBgPreview, setHeaderBgFile)}
                  accept="image/png, image/jpeg"
                  disabled={isSaving}
                />
                <p className="text-sm text-muted-foreground">
                    Recommended aspect ratio: wide, like 1200x200px.
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
