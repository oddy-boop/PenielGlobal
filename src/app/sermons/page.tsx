

"use client";

import type { Sermon } from "@/lib/types";
import { SermonCard } from "@/components/sermon-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SermonPlayerDialog } from "@/components/sermon-player-dialog";

export default function SermonsPage() {
  const [allSermons, setAllSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedSpeaker, setSelectedSpeaker] = useState("all");
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  useEffect(() => {
    const fetchSermons = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });

      if (data) {
        setAllSermons(data as Sermon[]);
      }
      setIsLoading(false);
    };
    fetchSermons();
  }, []);

  const handleWatchClick = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsPlayerOpen(true);
  }

  const { uniqueTopics, uniqueSpeakers, filteredSermons } = useMemo(() => {
    const topics = new Set<string>();
    const speakers = new Set<string>();
    allSermons.forEach(sermon => {
      topics.add(sermon.topic);
      speakers.add(sermon.speaker);
    });

    const filtered = allSermons.filter(sermon => {
      const searchTermMatch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              sermon.description.toLowerCase().includes(searchTerm.toLowerCase());
      const topicMatch = selectedTopic === 'all' || sermon.topic === selectedTopic;
      const speakerMatch = selectedSpeaker === 'all' || sermon.speaker === selectedSpeaker;
      return searchTermMatch && topicMatch && speakerMatch;
    });

    return {
      uniqueTopics: Array.from(topics),
      uniqueSpeakers: Array.from(speakers),
      filteredSermons: filtered,
    };
  }, [allSermons, searchTerm, selectedTopic, selectedSpeaker]);


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
            <Input placeholder="Search sermons..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-4 w-full flex-col sm:flex-row md:w-auto">
            <Select onValueChange={setSelectedTopic} value={selectedTopic}>
              <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Topic" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {uniqueTopics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setSelectedSpeaker} value={selectedSpeaker}>
              <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Speaker" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Speakers</SelectItem>
                  {uniqueSpeakers.map(speaker => <SelectItem key={speaker} value={speaker}>{speaker}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading sermons...</p>
        </div>
      ) : filteredSermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} onWatchClick={handleWatchClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-primary">No Sermons Found</h2>
          <p className="text-muted-foreground mt-2">No sermons match your current filters. Try adjusting your search.</p>
        </div>
      )}
      <SermonPlayerDialog sermon={selectedSermon} open={isPlayerOpen} onOpenChange={setIsPlayerOpen} />
    </div>
  );
}

    