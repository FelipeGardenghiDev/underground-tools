export type StageItemCategory =
  | 'drums'
  | 'amp_guitar'
  | 'amp_bass'
  | 'mic_vocal'
  | 'mic_instrument'
  | 'monitor_wedge'
  | 'di_box'
  | 'power_strip'
  | 'pedalboard'
  | 'keyboard'
  | 'acoustic';

export interface StageItem {
  id: string;
  type: StageItemCategory;
  name: string;
  shortLabel: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  rotation?: number; // 0 - 360
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
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
  soundCheckDurationMin: number;
  paRequirements: string;
  monitorMixesCount: number;
  monitorRequirements: string;
  lightingNotes: string;
  hospitalityNotes: string;
  additionalNotes: string;
}

export interface GigDate {
  id: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  address: string;
  ticketUrl?: string;
  status: 'confirmed' | 'sold_out' | 'cancelled' | 'tba';
  doorsPrice: string;
  lineup: string[];
}

export interface MerchItem {
  id: string;
  title: string;
  category: 'Camiseta' | 'Fita K7' | 'Vinil / CD' | 'Patch / Bottom' | 'Zine / Print' | 'Adesivos';
  price: number;
  sizes?: string[];
  description: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface BandMember {
  id: string;
  name: string;
  role: string;
  gearSummary: string;
}

export interface BandProfile {
  id: string;
  slug: string;
  name: string;
  genre: string;
  location: string;
  yearFormed: string;
  bioShort: string;
  bioLong: string;
  pressQuotes: { source: string; quote: string }[];
  members: BandMember[];
  links: {
    spotify: string;
    bandcamp: string;
    instagram: string;
    youtube: string;
    whatsappOrder: string;
    pixKey: string;
    pixKeyType: 'email' | 'cpf' | 'chave_aleatoria' | 'telefone';
    pixReceiver: string;
  };
  pressPhotos: { id: string; title: string; resolution: string; downloadUrl: string }[];
}
