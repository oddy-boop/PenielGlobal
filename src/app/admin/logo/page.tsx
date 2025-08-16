
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function LogoManagementPage() {
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
                <Label>Current Logo</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-32">
                    <Image src="/placeholder-logo.svg" alt="Current Logo" width={100} height={40} data-ai-hint="church logo" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="logo-upload">Upload New Logo</Label>
                <div className="flex items-center gap-4">
                    <Input id="logo-upload" type="file" className="flex-1"/>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
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
                <Label>Current Header Background</Label>
                 <div className="mt-2 p-4 border rounded-lg flex items-center justify-center bg-muted/40 h-48">
                    <Image src="https://placehold.co/1200x200.png" alt="Header background" width={300} height={50} objectFit="cover" data-ai-hint="church interior abstract" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="header-bg-upload">Upload New Header Background</Label>
                <div className="flex items-center gap-4">
                    <Input id="header-bg-upload" type="file" className="flex-1"/>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Recommended aspect ratio: wide, like 1200x200px.
                </p>
            </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button>Save All Changes</Button>
      </div>

    </div>
  );
}
