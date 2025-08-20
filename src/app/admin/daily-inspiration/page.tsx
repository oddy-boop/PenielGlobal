
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabaseClient";
import { logActivity } from "@/lib/activity-logger";
import { type Inspiration } from "@/lib/types";
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

  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
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
    if (!newQuote.trim()) {
        toast({ variant: "destructive", title: "Error", description: "Quote cannot be empty." });
        return;
    }
    if (!newAuthor.trim()) {
        toast({ variant: "destructive", title: "Error", description: "Author cannot be empty." });
        return;
    }
    if (!newImageFile) {
        toast({ variant: "destructive", title: "Error", description: "Background image is required." });
        return;
    }
    
    setIsSaving(true);
    try {
      const imageUrl = await uploadFileAndGetUrl(newImageFile, 'inspirations');
      const inspirationData = { 
        quote: newQuote,
        author: newAuthor,
        background_image_url: imageUrl
      };
      
      const { error } = await supabase.from('inspirations').insert([inspirationData]);
      if (error) throw error;

      await logActivity("Added Inspiration", `Quote: "${newQuote.substring(0, 20)}..."`);
      toast({ title: "Success", description: "New inspiration added." });
      
      setNewQuote("");
      setNewAuthor("");
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
            <p className="text-muted-foreground">Add or remove inspirational quotes with background images.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Inspiration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a New Inspiration</DialogTitle>
              <DialogDescription>
                Add a quote, its author, and a background image. This will be randomly shown to visitors.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-quote">Quote</Label>
                <Textarea 
                    id="new-quote"
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="Enter the inspirational message here..."
                    rows={4}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="new-author">Author</Label>
                <Input 
                    id="new-author"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. C.S. Lewis"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="new-image">Background Image</Label>
                <Input 
                    id="new-image"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>

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
                    <div key={p.id} className="p-4 border rounded-lg bg-muted/40 flex justify-between items-center gap-4">
                        <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                           <Image src={p.background_image_url} alt="Inspiration background" fill style={{objectFit:"cover"}} />
                        </div>
                        <div className="flex-grow">
                             <p className="italic font-serif text-base">"{p.quote}"</p>
                             <p className="text-sm text-muted-foreground mt-1">- {p.author}</p>
                        </div>
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
