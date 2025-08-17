
import type { Event } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, ImageIcon } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="md:w-1/3 relative min-h-[200px] md:min-h-0 bg-muted">
        {event.imageUrl ? (
            <Image 
              src={event.imageUrl} 
              alt={event.title} 
              fill
              className="object-cover"
              data-ai-hint="church event"
            />
        ) : (
            <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
            </div>
        )}
      </div>
      <div className="md:w-2/3 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{event.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-accent" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-accent" />
              <span>{event.time}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="mr-2 h-4 w-4 text-accent" />
            <span>{event.location}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p>{event.description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Learn More</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
