
"use client";

import type { Sermon } from "@/lib/types";
import { SermonCard } from "@/components/sermon-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      setIsLoading(true);
      const q = query(collection(db, "sermons"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const sermonsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate().toISOString(),
        } as Sermon;
      });
      setSermons(sermonsData);
      setIsLoading(false);
    };
    fetchSermons();
  }, []);

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
                {/* Topics would be populated from your data */}
            </SelectContent>
            </Select>
            <Select>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Speaker" />
            </SelectTrigger>
            <SelectContent>
                 {/* Speakers would be populated from your data */}
            </SelectContent>
            </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading sermons...</p>
        </div>
      ) : sermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-primary">No Sermons Yet</h2>
          <p className="text-muted-foreground mt-2">Check back later for new messages.</p>
        </div>
      )}
    </div>
  );
}
