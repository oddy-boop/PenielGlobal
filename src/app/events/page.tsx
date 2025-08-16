import type { Event } from "@/lib/types";
import { EventCard } from "@/components/event-card";

const events: Event[] = [
  {
    id: "1",
    title: "Annual Summer Picnic",
    date: "2024-08-10",
    time: "11:00 AM - 3:00 PM",
    location: "Hope Park, Pavilion 3",
    description: "Join us for a day of fun, food, and fellowship at our annual church picnic. All are welcome!",
    imageUrl: "https://placehold.co/600x400.png"
  },
  {
    id: "2",
    title: "Youth Group Movie Night",
    date: "2024-08-16",
    time: "7:00 PM",
    location: "Church Hall",
    description: "A fun and relaxing evening for our youth with a movie, popcorn, and games.",
    imageUrl: "https://placehold.co/600x400.png"
  },
  {
    id: "3",
    title: "Community Outreach Day",
    date: "2024-08-24",
    time: "9:00 AM - 1:00 PM",
    location: "Meet at the Church",
    description: "Let's serve our community together. We'll be helping at the local food bank.",
    imageUrl: "https://placehold.co/600x400.png"
  },
  {
    id: "4",
    title: "Women's Ministry Breakfast",
    date: "2024-09-07",
    time: "9:30 AM",
    location: "Fellowship Cafe",
    description: "A time for the women of our church to connect, share, and be encouraged.",
    imageUrl: "https://placehold.co/600x400.png"
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Upcoming Events</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay connected with our church family. Here's what's happening at Peniel Church.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
