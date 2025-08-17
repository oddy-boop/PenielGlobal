
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

interface Inspiration {
    id: number;
    prompt: string;
}

export default function DailyInspirationManagement() {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Inspiration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('inspirations').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch prompts." });
    } else {
      setPrompts(data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleAddPrompt = async () => {
    if (!newPrompt.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Prompt cannot be empty." });
      return;
    }
    try {
        const { error } = await supabase.from('inspirations').insert([{ prompt: newPrompt }]);
        if (error) throw error;
        await logActivity("Added Inspiration", `Prompt: ${newPrompt.substring(0, 30)}...`);
        toast({ title: "Success", description: "New prompt added." });
        setNewPrompt("");
        setIsDialogOpen(false);
        fetchPrompts();
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: "Failed to add prompt: " + e.message });
    }
  };

  const handleDeletePrompt = async (id: number) => {
    try {
        const { error } = await supabase.from('inspirations').delete().eq('id', id);
        if (error) throw error;
        await logActivity("Deleted Inspiration", `Prompt ID: ${id}`);
        toast({ title: "Success", description: "Prompt deleted." });
        fetchPrompts();
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete prompt: " + e.message });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Inspiration Management</h1>
            <p className="text-muted-foreground">Add or remove the inspirational prompts displayed on the website.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Inspirational Prompt</DialogTitle>
              <DialogDescription>
                This prompt will be randomly selected to be shown to visitors on the Daily Inspiration page.
              </DialogDescription>
            </DialogHeader>
            <Textarea 
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter your inspirational message here..."
              rows={5}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPrompt}>Add Prompt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspiration List</CardTitle>
          <CardDescription>
            This is the list of all available prompts. One will be chosen at random for visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : prompts.length > 0 ? (
                 prompts.map(p => (
                    <div key={p.id} className="p-4 border rounded-lg bg-muted/40 flex justify-between items-center">
                        <p className="italic font-serif text-lg">"{p.prompt}"</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this inspirational prompt.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeletePrompt(p.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center">No prompts added yet. Click "Add Prompt" to get started.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
