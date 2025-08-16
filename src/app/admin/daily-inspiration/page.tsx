
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


export default function DailyInspirationManagement() {
  const { toast } = useToast();
  const [inspirations, setInspirations] = useState([
    "Reflect on a moment today when you felt grateful.",
    "Ask for guidance in a challenging situation you are facing.",
    "Offer a prayer of gratitude for the blessings in your life.",
    "Pray for peace and healing for those who are suffering.",
    "Seek strength to overcome temptation and make positive choices.",
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");

  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      setInspirations(prev => [...prev, newPrompt.trim()]);
      setNewPrompt("");
      setIsDialogOpen(false);
      toast({
        title: "Prompt Added",
        description: "The new inspirational prompt has been saved.",
      });
    }
  };
  
  const handleRemovePrompt = (indexToRemove: number) => {
    setInspirations(prev => prev.filter((_, index) => index !== indexToRemove));
    toast({
        title: "Prompt Removed",
        description: "The inspirational prompt has been deleted.",
    });
  }

  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved!",
        description: "Your inspiration prompts have been updated.",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Inspiration Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove the inspirational prompts.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Inspirational Prompt</DialogTitle>
                    <DialogDescription>
                        Enter the new prompt below. It will be added to the list of inspirations.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                   <Textarea 
                     placeholder="Type your new prompt here..." 
                     value={newPrompt}
                     onChange={(e) => setNewPrompt(e.target.value)}
                     rows={4}
                   />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddPrompt}>Add Prompt</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspiration Prompts</CardTitle>
          <CardDescription>
            This is the list of prompts that users will see on the Daily Inspiration page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inspirations.map((prompt, index) => (
            <div key={index} className="flex items-center gap-4 p-2 border rounded-lg">
              <Textarea defaultValue={prompt} className="flex-1" rows={2}/>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this prompt.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemovePrompt(index)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
