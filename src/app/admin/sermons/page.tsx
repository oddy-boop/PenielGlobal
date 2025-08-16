
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SermonForm, SermonFormData } from "@/components/admin/sermon-form";
import type { Sermon } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { logActivity } from "@/lib/activity-logger";


export default function SermonsManagementPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddSermon = async (data: SermonFormData) => {
    // This is where you would add the sermon to your database.
    // For now, we'll just add it to the local state.
    const newSermon: Sermon = {
      id: (sermons.length + 1).toString(),
      ...data,
      date: data.date.toString(),
    };
    await logActivity("Created Sermon", `Sermon Title: ${data.title}`);
    setSermons(prev => [...prev, newSermon]);
    setIsDialogOpen(false);
    toast({
        title: "Sermon Added",
        description: "The new sermon has been successfully created.",
    })
  };

  const handleRemoveSermon = async (sermonToRemove: Sermon) => {
    // This is where you would delete the sermon from your database.
    // For now, we'll just remove it from the local state.
    await logActivity("Deleted Sermon", `Sermon Title: ${sermonToRemove.title}`);
    setSermons(prev => prev.filter(sermon => sermon.id !== sermonToRemove.id));
    toast({
        title: "Sermon Removed",
        description: "The sermon has been deleted.",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Sermon Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove sermons.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Sermon
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Sermon</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new sermon entry.
                    </DialogDescription>
                </DialogHeader>
                <SermonForm onSubmit={handleAddSermon} />
            </DialogContent>
        </Dialog>
      </div>

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
              {sermons.length === 0 ? (
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
