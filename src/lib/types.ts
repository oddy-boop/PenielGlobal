
export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  topic: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl: string;
  description: string;
}

export interface Event {
  id:string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Branding {
  logoUrl?: string;
  headerBgUrl?: string;
}
