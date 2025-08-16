
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function LogoManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Church Logo Management</h1>
      <Card>
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
        <CardFooter className="border-t pt-6">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
