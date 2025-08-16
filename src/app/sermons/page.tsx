import type { Sermon } from "@/lib/types";
import { SermonCard } from "@/components/sermon-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const sermons: Sermon[] = [
  {
    id: "1",
    title: "The Power of Unwavering Faith",
    speaker: "Pastor John Doe",
    date: "2024-07-21",
    topic: "Faith",
    videoUrl: "#",
    audioUrl: "#",
    thumbnailUrl: "https://placehold.co/400x225.png",
    description: "Discover the strength that comes from a faith that never falters, even in the most trying times."
  },
  {
    id: "2",
    title: "Grace in Action",
    speaker: "Pastor Jane Smith",
    date: "2024-07-14",
    topic: "Grace",
    videoUrl: "#",
    thumbnailUrl: "https://placehold.co/400x225.png",
    description: "Learn how to extend grace to others as a reflection of the grace we receive from God."
  },
  {
    id: "3",
    title: "Living a Life of Purpose",
    speaker: "Pastor John Doe",
    date: "2024-07-07",
    topic: "Purpose",
    audioUrl: "#",
    thumbnailUrl: "https://placehold.co/400x225.png",
    description: "Explore what it means to live a life aligned with God's purpose for you."
  },
  {
    id: "4",
    title: "The Heart of a Servant",
    speaker: "Guest Speaker Michael Chen",
    date: "2024-06-30",
    topic: "Service",
    videoUrl: "#",
    audioUrl: "#",
    thumbnailUrl: "https://placehold.co/400x225.png",
    description: "Understand the importance of servanthood and humility in the Christian faith."
  },
  {
    id: "5",
    title: "Navigating Life's Storms",
    speaker: "Pastor Jane Smith",
    date: "2024-06-23",
    topic: "Hope",
    videoUrl: "#",
    thumbnailUrl: "https://placehold.co/400x225.png",
    description: "Find hope and resilience in God's promises during life's most challenging seasons."
  },
    {
    id: "6",
    title: "The Joy of Community",
    speaker: "Pastor John Doe",
    date: "2024-06-16",
    topic: "Community",
    audioUrl: "#",
    thumbnailUrl: "https://placehold.co/400x225.png",
    description: "Celebrate the blessing of fellowship and the strength we find in one another."
  },
];

export default function SermonsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Sermon Archives</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of past sermons. Be inspired and strengthened in your faith.
        </p>
      </div>

      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search sermons..." className="pl-10" />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <Select>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Topic" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="faith">Faith</SelectItem>
                <SelectItem value="grace">Grace</SelectItem>
                <SelectItem value="purpose">Purpose</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="hope">Hope</SelectItem>
                <SelectItem value="community">Community</SelectItem>
            </SelectContent>
            </Select>
            <Select>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Speaker" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="john-doe">Pastor John Doe</SelectItem>
                <SelectItem value="jane-smith">Pastor Jane Smith</SelectItem>
                <SelectItem value="michael-chen">Guest Speaker Michael Chen</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} />
        ))}
      </div>
    </div>
  );
}
