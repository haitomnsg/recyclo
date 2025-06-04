
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import React from 'react';

// Dynamically import MapDisplay since it uses client-side Google Maps API
const MapDisplay = dynamic(() => import('@/components/app/map-display'), {
  ssr: false, // Ensure it's only rendered on the client
  loading: () => (
    <div className="flex flex-col items-center justify-center flex-grow h-full">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Initializing Map...</p>
    </div>
  ),
});

// Define Kathmandu's coordinates as google.maps.LatLngLiteral
const KATHMANDU_CENTER: google.maps.LatLngLiteral = { lat: 27.7172, lng: 85.3240 };
const DEFAULT_ZOOM = 13;

export default function MapPage() {
  // Access the API key from environment variables
  // IMPORTANT: This requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to be set in your .env or .env.local
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Loader2 className="h-12 w-12 text-destructive mb-4 animate-pulse" />
        <h2 className="text-xl font-semibold text-destructive">Google Maps API Key Missing</h2>
        <p className="text-muted-foreground mt-2">
          Please ensure the <code className="bg-muted px-1.5 py-0.5 rounded-sm text-foreground font-mono text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> environment variable is set in your <code className="bg-muted px-1.5 py-0.5 rounded-sm text-foreground font-mono text-sm">.env.local</code> file.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          You might need to restart your development server after setting it.
        </p>
      </div>
    );
  }

  return (
    // Ensure this container allows the map to fill the space
    // The PageContainer for AppLayout already provides padding, so we aim for full height within that.
    // The h-full on this div, combined with h-full on MapDisplay's containerStyle, is key.
    <div className="flex flex-col h-full w-full">
      <MapDisplay apiKey={apiKey} center={KATHMANDU_CENTER} zoom={DEFAULT_ZOOM} />
    </div>
  );
}
