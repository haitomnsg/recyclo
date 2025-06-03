import type { LucideIcon } from 'lucide-react';

export interface OnboardingCardContent {
  id: number;
  title: string;
  text: string;
  imageSrc: string;
  imageHint: string;
  Icon?: LucideIcon; // Optional icon for the card title
}

export interface WasteItem {
  id: string;
  name: string;
  category: 'Organic' | 'Inorganic';
  date: string; // ISO string
  weight?: number; // in kg
  notes?: string;
}

export interface WasteListing {
  id:string;
  category: 'Organic' | 'Inorganic' | 'Recyclable' | 'Hazardous' | 'Other';
  description: string;
  photoDataUrl?: string; // Base64 string
  estimatedWeight?: number; // in kg
  contactMethod: string; // e.g., location, phone, email
  dateListed: string; // ISO string
}

export interface DirtyZoneReport {
  id: string;
  description: string;
  location: string; // Textual description of location
  photoDataUrl?: string; // Base64 string for an optional photo
  reportedDate: string; // ISO string for the date reported
  // severity?: 'low' | 'medium' | 'high'; // Potential future field
  // status?: 'reported' | 'in-progress' | 'cleaned'; // Potential future field
}
