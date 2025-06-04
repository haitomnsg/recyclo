
import type { LucideIcon } from 'lucide-react';

export interface OnboardingCardContent {
  id: number;
  title: string;
  text: string;
  imageSrc: string;
  imageHint: string;
  Icon?: LucideIcon; // Optional icon for the card title
}

// Simplified WasteCategory for the Log page
export type WasteCategory = 'Organic' | 'Inorganic';

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory; 
  date: string; // ISO string
  weight?: number; // in grams
  notes?: string;
  sourceType: 'public' | 'business';
  businessName?: string;
}

// This category type is for the Waste Listings (user-submitted items for exchange/donation)
export type WasteListingCategory = 'Organic' | 'Inorganic' | 'Recyclable' | 'Hazardous' | 'Other';

export interface WasteListing {
  id:string;
  category: WasteListingCategory;
  description: string;
  photoDataUrl?: string; // Base64 string
  estimatedWeight?: number; // in kg
  contactMethod: string; // e.g., location, phone, email
  dateListed: string; // ISO string
}

export interface RecyclingPartner {
  id: string;
  name: string;
  contact: string;
  description: string;
  materials: RecyclingCategoryType[];
}

export type RecyclingCategoryType = 'Paper' | 'Plastic' | 'Compost' | 'Bottles';

export interface RecyclingCategory {
  type: RecyclingCategoryType;
  label: string;
  Icon: LucideIcon;
}

export interface CleanedDetails {
  photoDataUrl?: string;
  dateCleaned: string; // ISO string
  volunteersInvolved: number;
  cleanedBy: string; // Name of person/group who cleaned
  notes?: string;
}

export interface DirtySpot {
  id: string;
  title: string;
  position: google.maps.LatLngLiteral;
  address?: string;
  photoDataUrl?: string; // Photo of the dirty spot
  description?: string;
  status: 'Dirty' | 'Cleaned'; 
  reportedBy?: string;
  reportedDate: string; // ISO string
  cleanedDetails?: CleanedDetails;
}

// This type is for the form data on the report-zone page
export interface DirtyZoneReportFormData {
  title: string;
  description: string;
  latitude: string; // Keep as string for form input, parse to number on save
  longitude: string; // Keep as string for form input, parse to number on save
  photoDataUrl?: string;
  reportedBy: string;
}

export type ThriftItemCategory = 'Clothes' | 'Electronics' | 'Books' | 'Toys' | 'Furniture' | 'Other';

export interface ThriftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ThriftItemCategory;
  imageUrl: string;
  imageHint: string; // For data-ai-hint
}
