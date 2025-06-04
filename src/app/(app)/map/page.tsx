
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { LatLngExpression } from 'leaflet';

const MapDisplay = dynamic(() => import('@/components/app/map-display'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center flex-grow">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

const KATHMANDU_CENTER: LatLngExpression = [27.7172, 85.3240];
const DEFAULT_ZOOM = 13;

export default function MapPage() {
  return (
    <div className="flex flex-col h-full">
      {/* The MapDisplay component will take up the available space within this div */}
      <MapDisplay center={KATHMANDU_CENTER} zoom={DEFAULT_ZOOM} />
    </div>
  );
}
