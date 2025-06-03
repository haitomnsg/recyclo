import type { OnboardingCardContent } from '@/lib/types';
import { Leaf, AlertTriangle, Recycle, Sprout } from 'lucide-react';

export const onboardingCardsContent: OnboardingCardContent[] = [
  {
    id: 1,
    title: 'Organic vs. Inorganic Waste',
    text: "Organic waste comes from plants or animals and can be composted (e.g., fruit peels, vegetable scraps, leftover food). Inorganic waste is man-made and doesn't decompose easily (e.g., plastics, glass, metal). Separate them for a greener Kathmandu!",
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'organic inorganic waste separation',
    Icon: Leaf,
  },
  {
    id: 2,
    title: 'Mastering Compost',
    text: 'Compostable items like fruit/veg scraps, yard trimmings, coffee grounds, and eggshells enrich soil. Avoid meat, dairy, oily foods, and diseased plants in your home compost bin. This helps reduce landfill waste significantly.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'compost bin vegetables',
    Icon: Sprout,
  },
  {
    id: 3,
    title: 'Handle with Care: Hazardous Waste',
    text: 'Items like batteries, old paints, pesticides, CFL bulbs, and broken electronics are hazardous. Never mix them with regular waste. Kathmandu Municipality has designated drop-off points for their safe disposal.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'hazardous waste items',
    Icon: AlertTriangle,
  },
  {
    id: 4,
    title: 'Recycle Right in Kathmandu',
    text: 'Clean and sort your recyclables: paper, plastics (check local guidelines for accepted types), glass bottles/jars, and metal cans. Flatten cardboard boxes. Proper recycling conserves resources and reduces pollution.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'sorted recyclables paper plastic',
    Icon: Recycle,
  },
];
