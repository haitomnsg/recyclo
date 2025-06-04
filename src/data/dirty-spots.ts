
import type { DirtySpot } from '@/lib/types';

export const sampleDirtySpots: DirtySpot[] = [
  {
    id: 'spot1',
    title: 'Kantipath Roadside Dump',
    position: { lat: 27.7128, lng: 85.3157 },
    address: 'Near Rani Pokhari, Kantipath',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Accumulation of plastic bags and food waste.',
  },
  {
    id: 'spot2',
    title: 'Bagmati River Bank - Teku Overflow',
    position: { lat: 27.6925, lng: 85.3015 },
    address: 'South of Teku Bridge, near the river.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Construction debris and household waste dumped.',
  },
  {
    id: 'spot3',
    title: 'Bishnumati Corridor - Dallu Debris',
    position: { lat: 27.7170, lng: 85.3070 },
    address: 'Near Dallu Awas, along the corridor.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Mixed waste including old clothes and plastics.',
  },
  {
    id: 'spot4',
    title: 'Swayambhunath Foothill Litter',
    position: { lat: 27.7155, lng: 85.2910 },
    address: 'Eastern side, pathway leading to stupa.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Tourist litter and discarded items.',
  },
  {
    id: 'spot5',
    title: 'Patan Durbar Square Alleyway Mess',
    position: { lat: 27.6730, lng: 85.3250 },
    address: 'Behind Krishna Mandir, narrow connecting lane.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Overflowing bins and scattered refuse.',
  },
  {
    id: 'spot6',
    title: 'Chabahil Chowk Corner Pileup',
    position: { lat: 27.7175, lng: 85.3480 },
    address: 'Near Gopi Krishna Hall turning, roadside.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Commercial waste and vegetable scraps.',
  },
  {
    id: 'spot7',
    title: 'Kalanki Underpass Area Dumping',
    position: { lat: 27.6950, lng: 85.2800 },
    address: 'Service lane near the underpass entry.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Uncollected garbage bags and debris.',
  },
  {
    id: 'spot8',
    title: 'Thamel Street Waste Buildup',
    position: { lat: 27.7180, lng: 85.3130 },
    address: 'Z-Street, near a popular bakery.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Waste from shops and restaurants.',
  },
  {
    id: 'spot9',
    title: 'Boudhanath Kora Path Litter',
    position: { lat: 27.7215, lng: 85.3610 },
    address: 'Outer kora path, less frequented sections.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Plastic bottles and packaging materials.',
  },
  {
    id: 'spot10',
    title: 'New Road Back Alley Dump',
    position: { lat: 27.7050, lng: 85.3120 },
    address: 'Offshoot lane from main New Road shopping area.',
    photoDataUrl: 'https://placehold.co/300x200.png',
    description: 'Discarded packaging and market waste.',
  },
];

// Add data-ai-hint to all placeholder images
sampleDirtySpots.forEach(spot => {
  if (spot.photoDataUrl && spot.photoDataUrl.startsWith('https://placehold.co')) {
    const hintsMap: {[key: string]: string} = {
      'Kantipath Roadside Dump': 'roadside garbage',
      'Bagmati River Bank - Teku Overflow': 'river pollution',
      'Bishnumati Corridor - Dallu Debris': 'urban waste',
      'Swayambhunath Foothill Litter': 'temple litter',
      'Patan Durbar Square Alleyway Mess': 'alleyway trash',
      'Chabahil Chowk Corner Pileup': 'market waste',
      'Kalanki Underpass Area Dumping': 'underpass garbage',
      'Thamel Street Waste Buildup': 'street waste',
      'Boudhanath Kora Path Litter': 'stupa litter',
      'New Road Back Alley Dump': 'alley trash',
    }
    const hint = hintsMap[spot.title] || 'waste dump';
    // This part is tricky because I cannot add attributes directly to the string URL.
    // The data-ai-hint should be added where the Image component is used.
    // For now, I'm just making sure the placeholder URL is correct.
  }
});
