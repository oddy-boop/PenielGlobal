
"use client";

import type { Event } from "@/lib/types";
import { EventCard } from "@/components/event-card";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const q = query(collection(db, "events"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string for client-side date formatting
          date: (data.date as Timestamp).toDate().toISOString(),
        } as Event;
      });
      setEvents(eventsData);
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Upcoming Events</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay connected with our church family. Here's what's happening at Peniel Church.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
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
