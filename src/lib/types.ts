
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
  sourceType: 'public' | 'business'; // New field
  businessName?: string; // Optional for business logs
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

// For Recycling Partners Directory
export interface RecyclingPartner {
  id: string;
  name: string;
  contact: string; // Could be phone, email, or address
  description: string;
  materials: RecyclingCategoryType[]; // Which materials they handle
}

export type RecyclingCategoryType = 'Paper' | 'Plastic' | 'Compost' | 'Bottles';

export interface RecyclingCategory {
  type: RecyclingCategoryType;
  label: string;
  Icon: LucideIcon;
}
