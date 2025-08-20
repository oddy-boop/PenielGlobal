
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm, EventFormData } from "@/components/admin/event-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Event } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activity-logger";
import { supabase } from "@/lib/supabaseClient";
import { uploadFileAndGetUrl } from "@/lib/storage";

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        toast({ variant: "destructive", title: "Error fetching events", description: error.message });
        setEvents([]);
    } else {
        setEvents(data as Event[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  const handleAddClick = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  }

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  }

  const handleSubmit = async (data: EventFormData) => {
    setIsSaving(true);
    if (editingEvent) {
      await handleEditEvent(data);
    } else {
      await handleAddEvent(data);
    }
    setIsSaving(false);
  }

  const handleAddEvent = async (data: EventFormData) => {
    try {
      let imageUrl = '';
      if (data.image && data.image[0]) {
        imageUrl = await uploadFileAndGetUrl(data.image[0], 'events');
      } else {
        toast({
            variant: "destructive",
            title: "Image required",
            description: "Please select an image for the event.",
        });
        setIsSaving(false);
        return;
      }

      const newEventData = {
        title: data.title,
        location: data.location,
        date: data.date.toISOString(),
        time: data.time,
        description: data.description,
        image_url: imageUrl,
      };

      const { error } = await supabase.from("events").insert([newEventData]);

      if (error) throw error;
      
      await logActivity("Created Event", `Event Title: ${data.title}`);
      
      setIsDialogOpen(false);
      toast({
          title: "Event Added",
          description: "The new event has been successfully created.",
      });
      fetchEvents(); // Refresh the list
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error adding event",
            description: error.message,
        });
    }
  }

  const handleEditEvent = async (data: EventFormData) => {
    if (!editingEvent) return;
    try {
        let imageUrl = editingEvent.image_url;
        if (data.image && data.image[0]) {
            imageUrl = await uploadFileAndGetUrl(data.image[0], 'events');
        }

        const updatedEventData = {
            title: data.title,
            location: data.location,
            date: data.date.toISOString(),
            time: data.time,
            description: data.description,
            image_url: imageUrl,
        };

        const { error } = await supabase.from("events").update(updatedEventData).eq("id", editingEvent.id);

        if (error) throw error;
        
        await logActivity("Updated Event", `Event Title: ${data.title}`);
        
        setIsDialogOpen(false);
        setEditingEvent(null);
        toast({
            title: "Event Updated",
            description: "The event has been successfully updated.",
        });
        fetchEvents(); // Refresh the list
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error updating event",
            description: error.message,
        });
    }
  };
  
  const handleRemoveEvent = async (eventToDelete: Event) => {
    setIsDeleting(eventToDelete.id);
    try {
        const { error } = await supabase.from("events").delete().eq("id", eventToDelete.id);
        if (error) throw error;

        await logActivity("Deleted Event", `Event Title: ${eventToDelete.title}`);
        toast({
            title: "Event Removed",
            description: "The event has been deleted.",
        });
        fetchEvents(); // Refresh the list
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error removing event",
            description: error.message,
        });
    } finally {
        setIsDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove events.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                    <DialogDescription>
                        {editingEvent ? "Update the details for this event." : "Fill in the details below to create a new event."}
                    </DialogDescription>
                </DialogHeader>
                <EventForm 
                    key={editingEvent ? editingEvent.id : 'new'}
                    onSubmit={handleSubmit} 
                    isSaving={isSaving}
                    defaultValues={editingEvent || undefined}
                    isEditing={!!editingEvent}
                />
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Event List</CardTitle>
            <CardDescription>A list of all upcoming and past events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
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
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No events found.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isDeleting === event.id}>
                               {isDeleting === event.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(event)}>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this event.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveEvent(event)}>Delete</AlertDialogAction>
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
