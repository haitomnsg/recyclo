
import type { RecyclingPartner, RecyclingCategory, RecyclingCategoryType } from '@/lib/types';
import { Newspaper, Recycle, Sprout, GlassWater, PackagePlus } from 'lucide-react';

export const recyclingCategories: RecyclingCategory[] = [
  { type: 'Paper', label: 'Paper', Icon: Newspaper },
  { type: 'Plastic', label: 'Plastic', Icon: Recycle },
  { type: 'Compost', label: 'Organic/Compost', Icon: Sprout },
  { type: 'Bottles', label: 'Glass Bottles', Icon: GlassWater },
];

export const recyclingPartners: RecyclingPartner[] = [
  {
    id: 'rp1',
    name: 'GreenCycle Paper Co.',
    contact: 'info@greencyclepaper.com / 01-XXXXXX1',
    description: 'We collect and recycle all types of paper and cardboard. Contact us for bulk pickups.',
    materials: ['Paper'],
  },
  {
    id: 'rp2',
    name: 'Plastic Protectors Ltd.',
    contact: 'pickup@plasticprotectors.org / 98XXXXXXXX',
    description: 'Specializing in PET and HDPE plastic recycling. Check our website for acceptable types.',
    materials: ['Plastic'],
  },
  {
    id: 'rp3',
    name: 'SoilBuilders Composting',
    contact: 'compost@soilbuilders.com.np',
    description: 'Transforming organic waste into nutrient-rich compost for agriculture and gardening.',
    materials: ['Compost'],
  },
  {
    id: 'rp4',
    name: 'Kathmandu Glass Works',
    contact: '01-XXXXXX2 / Balaju Industrial Area',
    description: 'Recycling glass bottles and jars. Drop-off points available.',
    materials: ['Bottles'],
  },
  {
    id: 'rp5',
    name: 'EcoPaper Solutions',
    contact: 'sales@ecopaper.com / 97XXXXXXXX',
    description: 'Provides solutions for businesses to recycle paper waste efficiently.',
    materials: ['Paper'],
  },
  {
    id: 'rp6',
    name: 'Reclaim Plastics Nepal',
    contact: 'contact@reclaimplastics.np',
    description: 'Working with industries to recycle various types of plastic materials.',
    materials: ['Plastic', 'Bottles'],
  },
   {
    id: 'rp7',
    name: 'Urban Garden Composters',
    contact: 'urbangarden@email.com / Baneshwor',
    description: 'Local composting services for households and small businesses.',
    materials: ['Compost'],
  },
];

export const getPartnersByCategory = (categoryType: RecyclingCategoryType): RecyclingPartner[] => {
  return recyclingPartners.filter(partner => partner.materials.includes(categoryType));
};
