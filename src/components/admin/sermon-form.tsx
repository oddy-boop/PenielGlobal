
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const sermonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  speaker: z.string().min(1, "Speaker is required"),
  topic: z.string().min(1, "Topic is required"),
  date: z.date({ required_error: "A date is required." }),
  videoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  audioUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  thumbnailUrl: z.any().refine((files) => files?.length >= 1, "Image is required."),
  description: z.string().min(1, "Description is required"),
});

export type SermonFormData = z.infer<typeof sermonFormSchema>;

interface SermonFormProps {
  onSubmit: (data: SermonFormData) => void;
  defaultValues?: Partial<SermonFormData>;
}

export function SermonForm({ onSubmit, defaultValues }: SermonFormProps) {
  const form = useForm<SermonFormData>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      speaker: defaultValues?.speaker || '',
      topic: defaultValues?.topic || '',
      videoUrl: defaultValues?.videoUrl || '',
      audioUrl: defaultValues?.audioUrl || '',
      description: defaultValues?.description || '',
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
    },
  });

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
                <Input placeholder="e.g. The Power of Unwavering Faith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="speaker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speaker</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Pastor John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Faith" {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the sermon..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Input
                            {...fieldProps}
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={(event) => {
                                onChange(event.target.files && event.target.files);
                            }}
                            className="flex-1"
                        />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. https://youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="audioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audio URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. https://spotify.com/episode/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Save Sermon</Button>
      </form>
    </Form>
  );
}

    