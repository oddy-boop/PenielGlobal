
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SermonForm, SermonFormData } from "@/components/admin/sermon-form";
import type { Sermon } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { logActivity } from "@/lib/activity-logger";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function SermonsManagementPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchSermons = async () => {
    setIsLoading(true);
    const q = query(collection(db, "sermons"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const sermonsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate().toISOString(),
    } as Sermon));
    setSermons(sermonsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const handleAddSermon = async (data: SermonFormData) => {
    try {
      const imageFile = data.thumbnailUrl[0];
      const storageRef = ref(storage, `sermons/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const thumbnailUrl = await getDownloadURL(storageRef);
      
      const newSermonData = {
        ...data,
        thumbnailUrl,
        date: Timestamp.fromDate(data.date),
      };

      const docRef = await addDoc(collection(db, "sermons"), newSermonData);
      
      await logActivity("Created Sermon", `Sermon Title: ${data.title}`);
      
      setSermons(prev => [{ id: docRef.id, ...newSermonData, date: data.date.toISOString() }, ...prev]);
      setIsDialogOpen(false);
      toast({
          title: "Sermon Added",
          description: "The new sermon has been successfully created.",
      })
    } catch (error) {
       console.error("Error adding sermon: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add sermon. Please try again.",
        });
    }
  };

  const handleRemoveSermon = async (sermonToRemove: Sermon) => {
    try {
        await deleteDoc(doc(db, "sermons", sermonToRemove.id));
        await logActivity("Deleted Sermon", `Sermon Title: ${sermonToRemove.title}`);
        setSermons(prev => prev.filter(sermon => sermon.id !== sermonToRemove.id));
        toast({
            title: "Sermon Removed",
            description: "The sermon has been deleted.",
        });
    } catch (error) {
        console.error("Error removing sermon: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to remove sermon. Please try again.",
        });
    }
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

    