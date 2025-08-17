

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string; // ISO 8601 date string
  topic: string;
  video_url?: string;
  audio_url?: string;
  thumbnail_url: string;
  description: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO 8601 date string
  time: string;
  location: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Branding {
  logoUrl?: string;
  headerBgUrl?: string;
}

export interface ActivityLog {
  id?: number;
  action: string;
  details: string;
  timestamp?: string; // ISO 8601 date string
}

export interface HomeContent {
  id: number;
  hero_headline: string;
  hero_subheadline: string;
  about_title: string;
  about_text: string;
  about_image: string;
  hero_image_1: string | null;
  hero_image_2: string | null;
  hero_image_3: string | null;
  hero_image_4: string | null;
  hero_image_5: string | null;
  hero_image_6: string | null;
  hero_image_7: string | null;
  hero_image_8: string | null;
  hero_image_9: string | null;
  hero_image_10: string | null;
}

export interface OnlineMeetingContent {
    title: string;
    intro: string;
    meetingTitle: string;
    meetingTime: string;
    description: string;
    meetingLink: string;
    imageUrl: string;
}

export interface ContactContent {
    intro: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
    generalEmail: string;
    prayerEmail: string;
    socials: { platform: string, url: string }[];
    latitude?: number;
    longitude?: number;
}

export interface DonationsContent {
  headline: string;
  intro: string;
  tiers: {
    id: string;
    title: string;
    description: string;
    suggestedAmount: string;
    link: string;
  }[];
}

export interface Service {
    id: string;
    title: string;
    schedule: string;
    details: string;
    icon: string;
}

export interface Inspiration {
    id: number;
    prompt: string | null;
    type: 'text' | 'image';
    image_url: string | null;
    created_at: string;
}


// Generic type for site content stored in the 'site_content' table
export interface SiteContent<T> {
    key: string;
    content: T;
}
