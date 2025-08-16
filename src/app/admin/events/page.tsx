
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm, EventFormData } from "@/components/admin/event-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Event } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


// This is placeholder data for events.
const initialEvents: Event[] = [
    { id: "1", title: "Annual Summer Picnic", location: "Hope Park, Pavilion 3", date: "2024-08-10", time: "11:00 AM", description: "A fun day!", imageUrl: "https://placehold.co/600x400.png" },
    { id: "2", title: "Youth Group Movie Night", location: "Church Hall", date: "2024-08-16", time: "7:00 PM", description: "A fun night!", imageUrl: "https://placehold.co/600x400.png" },
    { id: "3", title: "Community Outreach Day", location: "Meet at the Church", date: "2024-08-24", time: "9:00 AM", description: "Let's serve!", imageUrl: "https://placehold.co/600x400.png" },
];

export default function EventsManagementPage() {
  const [events, setEvents] = useState(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddEvent = (data: EventFormData) => {
    const newEvent: Event = {
        id: (events.length + 1).toString(),
        ...data,
        description: data.description || "New Event Description",
        time: data.time || "N/A",
        date: data.date.toString(),
    };
    setEvents(prev => [...prev, newEvent]);
    setIsDialogOpen(false);
    toast({
        title: "Event Added",
        description: "The new event has been successfully created.",
    })
  }
  
  const handleRemoveEvent = (idToRemove: string) => {
    setEvents(prev => prev.filter(event => event.id !== idToRemove));
    toast({
        title: "Event Removed",
        description: "The event has been deleted.",
    });
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
              {events.map((event) => (
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
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
                              <AlertDialogAction onClick={() => handleRemoveEvent(event.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
