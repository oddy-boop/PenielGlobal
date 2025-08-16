
"use client";

import type { Event } from "@/lib/types";
import { EventCard } from "@/components/event-card";
import { useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  // In a real app, you'd fetch this data from your database.
  // For now, this is just an empty array.

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Upcoming Events</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay connected with our church family. Here's what's happening at Peniel Church.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-primary">No Upcoming Events</h2>
          <p className="text-muted-foreground mt-2">Please check back soon for our schedule.</p>
        </div>
      )}
    </div>
  );
}
