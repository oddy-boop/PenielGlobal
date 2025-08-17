
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Loader2, type LucideIcon, Church, Clock, Rss } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceForm, ServiceFormData } from "@/components/admin/service-form";
import type { Service } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { logActivity } from "@/lib/activity-logger";
import { supabase } from "@/lib/supabaseClient";

const iconMap: { [key: string]: LucideIcon } = {
  Clock,
  Rss,
  Church,
};


export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      toast({ variant: "destructive", title: "Error fetching services", description: error.message });
      setServices([]);
    } else {
       setServices(data as Service[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setIsDialogOpen(true);
  }

  const handleAddClick = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  }

  const handleSubmit = async (data: ServiceFormData) => {
    if (editingService) {
      await handleEditService(data);
    } else {
      await handleAddService(data);
    }
  }

  const handleAddService = async (data: ServiceFormData) => {
    try {
      const { error } = await supabase.from('services').insert([data]);
      if (error) throw error;
      
      await logActivity("Created Service", `Service Title: ${data.title}`);
      
      setIsDialogOpen(false);
      toast({
          title: "Service Added",
          description: "The new service has been successfully created.",
      });
      fetchServices();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add service: " + error.message,
        });
    }
  };

  const handleEditService = async (data: ServiceFormData) => {
    if (!editingService) return;
    try {
      const { error } = await supabase.from('services').update(data).eq('id', editingService.id);
      if (error) throw error;

      await logActivity("Updated Service", `Service Title: ${data.title}`);
      
      setIsDialogOpen(false);
      setEditingService(null);
      toast({
          title: "Service Updated",
          description: "The service has been successfully updated.",
      });
      fetchServices();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update service: " + error.message,
        });
    }
  }

  const handleRemoveService = async (serviceToRemove: Service) => {
    try {
        const { error } = await supabase.from('services').delete().eq('id', serviceToRemove.id);
        if (error) throw error;

        await logActivity("Deleted Service", `Service Title: ${serviceToRemove.title}`);
        toast({
            title: "Service Removed",
            description: "The service has been deleted.",
        });
        fetchServices();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to remove service. Please try again.",
        });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground">Manage the services displayed on the home page.</p>
        </div>
        <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                  <DialogDescription>
                      {editingService ? "Update the details for this service." : "Fill in the details below to create a new service."}
                  </DialogDescription>
              </DialogHeader>
              <ServiceForm
                key={editingService ? editingService.id : 'new'}
                onSubmit={handleSubmit}
                defaultValues={editingService || undefined}
              />
          </DialogContent>
      </Dialog>


      <Card>
        <CardHeader>
            <CardTitle>Service List</CardTitle>
            <CardDescription>A list of all services displayed on the home page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Details</TableHead>
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
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No services found.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => {
                  const Icon = iconMap[service.icon] || Church;
                  return (
                  <TableRow key={service.id}>
                     <TableCell><Icon className="h-5 w-5 text-accent" /></TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>{service.schedule}</TableCell>
                    <TableCell>{service.details}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(service)}>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this service.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveService(service)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
