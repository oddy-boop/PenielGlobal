
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


export default function DailyInspirationManagement() {
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
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Inspiration Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove the inspirational prompts.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Prompt
            </Button>
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
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
