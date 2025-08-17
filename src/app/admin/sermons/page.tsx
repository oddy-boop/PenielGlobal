
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SermonForm, SermonFormData } from "@/components/admin/sermon-form";
import type { Sermon } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { logActivity } from "@/lib/activity-logger";
import { supabase } from "@/lib/supabaseClient";
import { uploadFileAndGetUrl } from "@/lib/storage";

export default function SermonsManagementPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSermons = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error fetching sermons", description: error.message });
      setSermons([]);
    } else {
      setSermons(data as Sermon[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const handleEditClick = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setIsDialogOpen(true);
  }

  const handleAddClick = () => {
    setEditingSermon(null);
    setIsDialogOpen(true);
  }

  const handleSubmit = async (data: SermonFormData) => {
    setIsSaving(true);
    if (editingSermon) {
      await handleEditSermon(data);
    } else {
      await handleAddSermon(data);
    }
    setIsSaving(false);
  }

  const handleAddSermon = async (data: SermonFormData) => {
    try {
      let thumbnailUrl = '';
      if (data.thumbnail && data.thumbnail[0]) {
        thumbnailUrl = await uploadFileAndGetUrl(data.thumbnail[0], 'sermons');
      } else {
        toast({
            variant: "destructive",
            title: "Thumbnail required",
            description: "Please select a thumbnail image for the sermon.",
        });
        return;
      }
      
      const newSermon = {
        title: data.title,
        speaker: data.speaker,
        topic: data.topic,
        date: data.date.toISOString(),
        video_url: data.videoUrl,
        audio_url: data.audioUrl,
        thumbnail_url: thumbnailUrl,
        description: data.description,
      };
      
      const { error } = await supabase.from('sermons').insert([newSermon]);
      if (error) throw error;
      
      await logActivity("Created Sermon", `Sermon Title: ${data.title}`);
      
      setIsDialogOpen(false);
      toast({
          title: "Sermon Added",
          description: "The new sermon has been successfully created.",
      });
      fetchSermons();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add sermon: " + error.message,
        });
    }
  };

  const handleEditSermon = async (data: SermonFormData) => {
    if (!editingSermon) return;
    try {
      let thumbnailUrl = editingSermon.thumbnail_url;
      // If a new thumbnail is uploaded, replace the old one
      if (data.thumbnail && data.thumbnail[0]) {
        thumbnailUrl = await uploadFileAndGetUrl(data.thumbnail[0], 'sermons');
      }

      const updatedSermon = {
        title: data.title,
        speaker: data.speaker,
        topic: data.topic,
        date: data.date.toISOString(),
        video_url: data.videoUrl,
        audio_url: data.audioUrl,
        thumbnail_url: thumbnailUrl,
        description: data.description,
      };

      const { error } = await supabase.from('sermons').update(updatedSermon).eq('id', editingSermon.id);
      if (error) throw error;

      await logActivity("Updated Sermon", `Sermon Title: ${data.title}`);
      
      setIsDialogOpen(false);
      setEditingSermon(null);
      toast({
          title: "Sermon Updated",
          description: "The sermon has been successfully updated.",
      });
      fetchSermons();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update sermon: " + error.message,
        });
    }
  }

  const handleRemoveSermon = async (sermonToRemove: Sermon) => {
    setIsDeleting(sermonToRemove.id);
    try {
        const { error } = await supabase.from('sermons').delete().eq('id', sermonToRemove.id);
        if (error) throw error;

        await logActivity("Deleted Sermon", `Sermon Title: ${sermonToRemove.title}`);
        toast({
            title: "Sermon Removed",
            description: "The sermon has been deleted.",
        });
        fetchSermons();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to remove sermon. Please try again.",
        });
    } finally {
        setIsDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Sermon Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove sermons.</p>
        </div>
        <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sermon
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                  <DialogTitle>{editingSermon ? "Edit Sermon" : "Add New Sermon"}</DialogTitle>
                  <DialogDescription>
                      {editingSermon ? "Update the details for this sermon." : "Fill in the details below to create a new sermon entry."}
                  </DialogDescription>
              </DialogHeader>
              <SermonForm
                key={editingSermon ? editingSermon.id : 'new'}
                onSubmit={handleSubmit}
                defaultValues={editingSermon || undefined}
                isEditing={!!editingSermon}
                isSaving={isSaving}
              />
          </DialogContent>
      </Dialog>


      <Card>
        <CardHeader>
            <CardTitle>Sermon List</CardTitle>
            <CardDescription>A list of all sermons available on the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Speaker</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
              ) : sermons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No sermons found.
                  </TableCell>
                </TableRow>
              ) : (
                sermons.map((sermon) => (
                  <TableRow key={sermon.id}>
                    <TableCell className="font-medium">{sermon.title}</TableCell>
                    <TableCell>{sermon.speaker}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sermon.topic}</Badge>
                    </TableCell>
                    <TableCell>{new Date(sermon.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isDeleting === sermon.id}>
                              {isDeleting === sermon.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(sermon)}>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this sermon.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveSermon(sermon)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    