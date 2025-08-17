
"use client";

import type { Sermon } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function SermonPlayerDialog({ sermon, open, onOpenChange }: { sermon: Sermon | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  if (!sermon) return null;

  const getYouTubeVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const videoId = sermon.video_url ? getYouTubeVideoId(sermon.video_url) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] md:w-full">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{sermon.title}</DialogTitle>
          <DialogDescription>By {sermon.speaker}</DialogDescription>
        </DialogHeader>
        {videoId ? (
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>The video for this sermon could not be loaded. It might be an invalid or unsupported link.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { SermonPlayerDialog };

    