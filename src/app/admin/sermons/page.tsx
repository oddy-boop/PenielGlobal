
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

// This is a placeholder for sermon data, which would typically come from a database.
const initialSermons: Sermon[] = [
    { id: "1", title: "The Power of Unwavering Faith", speaker: "Pastor John Doe", date: "2024-07-21", topic: "Faith", description: "A sermon on faith.", thumbnailUrl: "https://placehold.co/400x225.png", videoUrl: "#", audioUrl: "#" },
    { id: "2", title: "Grace in Action", speaker: "Pastor Jane Smith", date: "2024-07-14", topic: "Grace", description: "A sermon on grace.", thumbnailUrl: "https://placehold.co/400x225.png", videoUrl: "#" },
    { id: "3", title: "Living a Life of Purpose", speaker: "Pastor John Doe", date: "2024-07-07", topic: "Purpose", description: "A sermon on purpose.", thumbnailUrl: "https://placehold.co/400x225.png", audioUrl: "#" },
];

export default function SermonsManagementPage() {
  const [sermons, setSermons] = useState(initialSermons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSermon = (data: SermonFormData) => {
    const newSermon: Sermon = {
      id: (sermons.length + 1).toString(),
      ...data,
    };
    setSermons(prev => [...prev, newSermon]);
    setIsDialogOpen(false);
  };

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
              {sermons.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium">{sermon.title}</TableCell>
                  <TableCell>{sermon.speaker}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sermon.topic}</Badge>
                  </TableCell>
                  <TableCell>{sermon.date}</TableCell>
                  <TableCell>
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
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
