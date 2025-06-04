
'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';

interface MapDisplayProps {
  apiKey: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  // markers?: { position: google.maps.LatLngLiteral; popupText?: string }[]; // For future use
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%', // Ensure this fills the parent container
  minHeight: '300px', // Minimum height to ensure map is visible
};

const MapDisplayComponent: React.FC<MapDisplayProps> = ({ apiKey, center, zoom }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // Unique ID for the script tag
    googleMapsApiKey: apiKey,
    // libraries: ['places'], // Uncomment if you need Places API features
  });

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    // You can optionally do something when the map loads, like setting bounds
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds); // Example: fit map to bounds
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(() => {
    mapRef.current = null;
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <Loader2 className="h-8 w-8 text-destructive mb-2" />
        <p className="font-semibold">Error loading map</p>
        <p className="text-xs mt-1">{loadError.message}</p>
        <p className="text-xs mt-2">Please ensure your API key is correct, billing is enabled for your Google Cloud project, and the Maps JavaScript API is enabled.</p>
      </div>
    );
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        streetViewControl: false, // Disable street view
        mapTypeControl: false,    // Disable map type (Satellite/Terrain) control
        fullscreenControl: false, // Disable fullscreen button
        zoomControl: true,        // Keep zoom control
        // You can add more options here as needed
      }}
    >
      {/* Markers can be added here in the future */}
      {/* Example: <MarkerF position={center} /> */}
    </GoogleMap>
  ) : (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedMapDisplay = React.memo(MapDisplayComponent);
MemoizedMapDisplay.displayName = 'MapDisplay';

export default MemoizedMapDisplay;
