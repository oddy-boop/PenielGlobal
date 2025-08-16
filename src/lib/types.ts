

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
  date: string; // ISO 8601 date string
  time: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Branding {
  logoUrl?: string;
  headerBgUrl?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string; // ISO 8601 date string
}

export interface HomeContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  latestSermonTitle: string;
  latestSermonSpeaker: string;
  latestSermonImage: string;
}
