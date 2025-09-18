export type FlightStatus = 
  | 'requested'
  | 'queued'
  | 'planning'
  | 'underway'
  | 'edited'
  | 'published'
  | 'archived'
  | 'declined';

export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'other';

export interface FlightRequest {
  id: string;
  submittedAt: string;
  status: FlightStatus;
  requesterHandle: string;
  platform?: Platform;
  originIcao: string;
  originCity: string;
  destinationIcao: string;
  destinationCity: string;
  airline?: string;
  aircraft?: string;
  sim: string;
  notesPublic?: string;
  notesPrivate?: string;
  eta?: string;
  priority: number;
  visibility: 'public' | 'unlisted' | 'private';
  publishedAt?: string;
}

export interface MediaLink {
  id: string;
  flightRequestId: string;
  platform: Platform;
  url: string;
  title?: string;
  thumbnailUrl?: string;
  publishedAt: string;
}

export interface StatusEvent {
  id: string;
  flightRequestId: string;
  fromStatus?: FlightStatus;
  toStatus: FlightStatus;
  changedAt: string;
  comment?: string;
  changedBy: string;
}

export interface FilterOptions {
  status?: FlightStatus[];
  airline?: string[];
  aircraft?: string[];
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'priority' | 'eta';
}