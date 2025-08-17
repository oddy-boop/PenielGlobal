
import type { Sermon } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Video, Mic, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface SermonCardProps {
  sermon: Sermon;
}

export function SermonCard({ sermon }: SermonCardProps) {
  const formattedDate = new Date(sermon.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-video bg-muted rounded-md">
           {sermon.thumbnailUrl ? (
            <Image 
              src={sermon.thumbnailUrl} 
              alt={sermon.title} 
              fill
              className="object-cover"
              data-ai-hint="sermon abstract"
            />
           ) : (
            <div className="flex items-center justify-center h-full">
              <Video className="w-12 h-12 text-muted-foreground" />
            </div>
           )}
        </div>
        <CardTitle className="font-headline text-xl mt-4">{sermon.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <p className="mt-2">By {sermon.speaker}</p>
        </CardDescription>
        <Badge variant="secondary" className="w-fit mt-2">{sermon.topic}</Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{sermon.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        {sermon.videoUrl && (
          <Button asChild className="flex-1">
            <Link href={sermon.videoUrl} target="_blank" rel="noopener noreferrer"><Video className="mr-2 h-4 w-4"/> Watch</Link>
          </Button>
        )}
        {sermon.audioUrl && (
          <Button asChild variant="outline" className="flex-1">
            <Link href={sermon.audioUrl} target="_blank" rel="noopener noreferrer"><Mic className="mr-2 h-4 w-4"/> Listen</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
