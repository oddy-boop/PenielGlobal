
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, ImageIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import type { Event } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().min(1, "Time is required"),
  description: z.string().min(1, "Description is required"),
});

const createEventFormSchema = baseSchema.extend({
  image: z.instanceof(FileList).refine(files => files?.length === 1, "Image is required."),
});

const editEventFormSchema = baseSchema.extend({
    image: z.instanceof(FileList).optional(),
});


export type EventFormData = z.infer<typeof createEventFormSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  defaultValues?: Partial<Event>;
  isSaving: boolean;
  isEditing?: boolean;
}

export function EventForm({ onSubmit, defaultValues, isSaving, isEditing = false }: EventFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(defaultValues?.image_url || null);
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(isEditing ? editEventFormSchema : createEventFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      location: defaultValues?.location || '',
      time: defaultValues?.time || '',
      description: defaultValues?.description || '',
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
    }
  });

  const imageRef = form.register("image");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(defaultValues?.image_url || null);
    }
    imageRef.onChange(event);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Annual Summer Picnic" {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Hope Park, Pavilion 3" {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSaving}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 11:00 AM" {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the event..." {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isEditing && (
          <div className="space-y-2">
            <FormLabel>Current Image</FormLabel>
            <div className="relative aspect-video w-full rounded-md border bg-muted flex items-center justify-center">
              {previewImage ? (
                <Image src={previewImage} alt="Current event image" fill className="object-contain rounded-md" />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8" />
                  <span>No Image</span>
                </div>
              )}
            </div>
          </div>
        )}

        <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" {...imageRef} onChange={handleImageChange} disabled={isSaving} />
                  </FormControl>
                  <FormDescription>
                    {isEditing ? "Upload a new image to replace the existing one. Leave blank to keep the current image." : "Select an image for the event."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
