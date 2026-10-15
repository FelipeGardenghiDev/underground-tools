/**
 * Underground Tools - Shared Domain Types
 * Core types for Band Profile, Stage Plot, Input List, Tech Rider, Shows and Merch.
 */

export type StageItemCategory =
  | 'drums'
  | 'amplifier'
  | 'microphone'
  | 'di_box'
  | 'monitor'
  | 'power'
  | 'instrument'
  | 'accessory';

export interface StageItem {
  id: string;
  type: StageItemCategory;
  name: string;
  shortLabel: string;
  x: number; // percentage from left 0 - 100
  y: number; // percentage from top 0 - 100
  rotation?: number; // degrees 0 - 360
  notes?: string;
  channelNumber?: number;
}

export interface InputListChannel {
  channelNumber: number;
  instrument: string;
  micOrDi: string;
  standType: 'Tall Boom' | 'Short Boom' | 'Straight' | 'Clip' | 'None';
  phantom48v: boolean;
  notes?: string;
}

export interface TechRider {
  bandName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  soundCheckDurationMin: number;
  paRequirements: string;
  monitorMixesCount: number;
  lightingNotes?: string;
  hospitalityNotes?: string; // camarim, água, cerveja, vegano
  additionalNotes?: string;
}

export interface GigDate {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  time?: string;
  venue: string;
  city: string;
  state: string;
  ticketUrl?: string;
  eventUrl?: string;
  flyerUrl?: string;
  status: 'confirmed' | 'sold_out' | 'cancelled' | 'tba';
  doorsPrice?: string;
}

export interface MerchItem {
  id: string;
  title: string;
  type: 'shirt' | 'hoodie' | 'vinyl' | 'cd' | 'cassette' | 'patch' | 'sticker' | 'other';
  price: number;
  currency: string;
  sizes?: string[]; // e.g. ['P', 'M', 'G', 'GG']
  description?: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface BandMember {
  name: string;
  role: string; // ex: 'Voz / Guitarra'
}

export interface BandProfile {
  id: string;
  slug: string;
  name: string;
  genre: string; // ex: 'Hardcore / Screamo / Post-Hardcore'
  city: string;
  state: string;
  bioShort: string; // for flyers and social media
  bioLong: string; // for zines, blogs, festival curatorship
  logoUrl?: string;
  heroImageUrl?: string;
  pressPhotos: string[];
  members: BandMember[];
  links: {
    spotify?: string;
    bandcamp?: string;
    youtube?: string;
    instagram?: string;
    appleMusic?: string;
    whatsappOrder?: string;
    pixKey?: string;
    pixKeyType?: 'email' | 'cpf' | 'cnpj' | 'telefone' | 'aleatoria';
    pixReceiverName?: string;
  };
}
