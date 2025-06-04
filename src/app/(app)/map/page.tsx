
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Loader2, PlusCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { sampleDirtySpots } from '@/data/dirty-spots';
import type { DirtySpot } from '@/lib/types'; // Ensure correct import

// Dynamically import MapDisplay as it uses client-side Google Maps API
const MapDisplay = dynamic(() => import('@/components/app/map-display'), {
  ssr: false, // Ensure it's only rendered on the client
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Initializing Map...</p>
    </div>
  ),
});

const KATHMANDU_CENTER: google.maps.LatLngLiteral = { lat: 27.7172, lng: 85.3240 };
const DEFAULT_ZOOM = 12; // Zoom level for Kathmandu Valley

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedSpot, setSelectedSpot] = useState<DirtySpot | null>(null);

  const handleMarkerClick = (spot: DirtySpot) => {
    setSelectedSpot(spot);
  };

  const handleInfoWindowClose = () => {
    setSelectedSpot(null);
  };

  const handleListItemClick = (spot: DirtySpot) => {
    setSelectedSpot(spot);
    // In a more advanced setup, you might want to pan the map to the spot here
    // For Google Maps, opening an InfoWindow usually pans if marker is off-screen.
  };

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
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary">
          Community Reported Dirty Spots
        </h2>
        <Button variant="default" className="w-full sm:w-auto" asChild>
          <Link href="/report-zone">
            <PlusCircle className="mr-2 h-5 w-5" />
            Report New Dirty Spot
          </Link>
        </Button>
      </div>

      {/* Map Container - Increased Height */}
      <div className="h-[50vh] min-h-[300px] w-full rounded-lg overflow-hidden shadow-lg border border-border">
        <MapDisplay
          apiKey={apiKey}
          center={KATHMANDU_CENTER}
          zoom={DEFAULT_ZOOM}
          dirtySpots={sampleDirtySpots}
          selectedSpot={selectedSpot}
          onMarkerClick={handleMarkerClick}
          onInfoWindowClose={handleInfoWindowClose}
        />
      </div>

      {/* List of Dirty Spots - Scrollable */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-1 pb-4">
        <h3 className="text-xl font-semibold font-headline text-foreground sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
          Reported Locations:
        </h3>
        {sampleDirtySpots.length === 0 ? (
          <p className="text-muted-foreground">No dirty spots reported yet.</p>
        ) : (
          <div className="space-y-3">
            {sampleDirtySpots.map((spot) => (
              <Card
                key={spot.id}
                className="hover:shadow-md transition-shadow cursor-pointer bg-card"
                onClick={() => handleListItemClick(spot)}
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-base flex items-center text-card-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-destructive flex-shrink-0" />
                    {spot.name}
                  </CardTitle>
                  {spot.address && <CardDescription className="text-xs mt-1">{spot.address}</CardDescription>}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
