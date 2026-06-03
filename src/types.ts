export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  rotation?: number; // degree for scrapbook visual alignment
  colorIndex?: number; // color tint for variation
  ownerId?: string; // optional owner identifier to allow delete only by author
}

export interface RSVP {
  name: string;
  attending: boolean;
  message?: string;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption?: string;
  author?: string;
  isCustom?: boolean;
}
