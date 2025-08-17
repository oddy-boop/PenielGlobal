
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle, Loader2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";
import { logActivity } from "@/lib/activity-logger";
import { type Inspiration } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { uploadFileAndGetUrl } from "@/lib/storage";

export default function DailyInspirationManagement() {
  const { toast } = useToast();
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [newInspirationType, setNewInspirationType] = useState<'text' | 'image'>('text');
  const [newPrompt, setNewPrompt] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const fetchInspirations = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('inspirations').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch inspirations." });
    } else {
      setInspirations(data as Inspiration[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchInspirations();
  }, [fetchInspirations]);

  const handleAddInspiration = async () => {
    setIsSaving(true);
    let inspirationData: Partial<Inspiration> = { type: newInspirationType };

    if (newInspirationType === 'text') {
        if (!newPrompt.trim()) {
            toast({ variant: "destructive", title: "Error", description: "Prompt cannot be empty." });
            setIsSaving(false);
            return;
        }
        inspirationData.prompt = newPrompt;
    } else { // type is 'image'
        if (!newImageFile) {
            toast({ variant: "destructive", title: "Error", description: "Image file is required." });
            setIsSaving(false);
            return;
        }
        try {
            const imageUrl = await uploadFileAndGetUrl(newImageFile, 'inspirations');
            inspirationData.image_url = imageUrl;
        } catch(e: any) {
            toast({ variant: "destructive", title: "Upload Error", description: "Failed to upload image: " + e.message });
            setIsSaving(false);
            return;
        }
    }
    
    try {
        const { error } = await supabase.from('inspirations').insert([inspirationData]);
        if (error) throw error;
        await logActivity("Added Inspiration", `Type: ${newInspirationType}`);
        toast({ title: "Success", description: "New inspiration added." });
        setNewPrompt("");
        setNewImageFile(null);
        setIsDialogOpen(false);
        fetchInspirations();
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: "Failed to add inspiration: " + e.message });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteInspiration = async (id: number) => {
    setIsDeleting(id);
    try {
        const { error } = await supabase.from('inspirations').delete().eq('id', id);
        if (error) throw error;
        await logActivity("Deleted Inspiration", `Inspiration ID: ${id}`);
        toast({ title: "Success", description: "Inspiration deleted." });
        fetchInspirations();
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete inspiration: " + e.message });
    } finally {
        setIsDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Inspiration Management</h1>
            <p className="text-muted-foreground">Add or remove text or image inspirations.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Inspiration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Inspiration</DialogTitle>
              <DialogDescription>
                Choose to add a text prompt or an inspirational image. This will be randomly shown to visitors.
              </DialogDescription>
            </DialogHeader>
            
            <RadioGroup defaultValue="text" value={newInspirationType} onValueChange={(value: 'text' | 'image') => setNewInspirationType(value)} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="text" id="r1" className="peer sr-only" />
                <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Text
                </Label>
              </div>
              <div>
                <RadioGroupItem value="image" id="r2" className="peer sr-only" />
                <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  Image
                </Label>
              </div>
            </RadioGroup>

            {newInspirationType === 'text' ? (
                <Textarea 
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Enter your inspirational message here..."
                    rows={5}
                />
            ) : (
                <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)}
                />
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button onClick={handleAddInspiration} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Inspiration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspiration List</CardTitle>
          <CardDescription>
            This is the list of all available inspirations. One will be chosen at random for visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : inspirations.length > 0 ? (
                 inspirations.map(p => (
                    <div key={p.id} className="p-4 border rounded-lg bg-muted/40 flex justify-between items-center">
                        {p.type === 'text' ? (
                             <p className="italic font-serif text-lg">"{p.prompt}"</p>
                        ): (
                            <div className="relative w-24 h-16 rounded-md overflow-hidden">
                                {p.image_url && <Image src={p.image_url} alt="Inspiration" fill style={{objectFit:"cover"}} />}
                            </div>
                        )}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" disabled={isDeleting === p.id}>
                                    {isDeleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this inspiration.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteInspiration(p.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center">No inspirations added yet. Click "Add Inspiration" to get started.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
