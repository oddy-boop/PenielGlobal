
"use client";

import { useState, useEffect } from "react";
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

export default function EventsManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchEvents = () => {
    setIsLoading(true);
    const storedEvents = localStorage.getItem("events_data");
    const eventsData = storedEvents ? JSON.parse(storedEvents) : [];
    eventsData.sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEvents(eventsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = (data: EventFormData) => {
    try {
      const newEvent: Event = {
        ...data,
        id: `event-${Date.now()}`,
        date: data.date.toISOString(),
      };

      const updatedEvents = [newEvent, ...events];
      localStorage.setItem("events_data", JSON.stringify(updatedEvents));
      logActivity("Created Event", `Event Title: ${data.title}`);
      
      setEvents(updatedEvents);
      setIsDialogOpen(false);
      toast({
          title: "Event Added",
          description: "The new event has been successfully created locally.",
      })
    } catch (error) {
       console.error("Error adding event to localStorage: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add event. Please try again.",
        });
    }
  }
  
  const handleRemoveEvent = (eventToDelete: Event) => {
    try {
        const updatedEvents = events.filter(event => event.id !== eventToDelete.id);
        localStorage.setItem("events_data", JSON.stringify(updatedEvents));
        logActivity("Deleted Event", `Event Title: ${eventToDelete.title}`);
        setEvents(updatedEvents);
        toast({
            title: "Event Removed",
            description: "The event has been deleted locally.",
        });
    } catch (error) {
        console.error("Error removing event from localStorage: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to remove event. Please try again.",
        });
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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new event.
                    </DialogDescription>
                </DialogHeader>
                <EventForm onSubmit={handleAddEvent} />
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
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem disabled>Edit</DropdownMenuItem>
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
