
'use client';

import React from 'react'; // Import React for React.memo and useMemo
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import type { DirtySpot } from '@/data/dirty-spots'; // Ensure this type is correctly defined and imported

interface MapDisplayProps {
  apiKey: string; // Kept for consistency, though useJsApiLoader uses it directly
  center: google.maps.LatLngLiteral;
  zoom: number;
  dirtySpots?: DirtySpot[];
  selectedSpot?: DirtySpot | null;
  onMarkerClick?: (spot: DirtySpot) => void;
  onInfoWindowClose?: () => void;
}

const containerStyleDefault: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '300px', // Ensure map is visible even if parent height is small
};

const MapDisplayComponent: React.FC<MapDisplayProps> = ({
  apiKey,
  center,
  zoom,
  dirtySpots = [],
  selectedSpot,
  onMarkerClick,
  onInfoWindowClose,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // Unique ID for the script tag
    googleMapsApiKey: apiKey,
    // libraries: ['places'], // Uncomment if you need Places API features
  });

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(() => {
    mapRef.current = null;
  }, []);

  // Memoize containerStyle to prevent unnecessary re-renders of GoogleMap due to style prop changing identity
  const containerStyle = React.useMemo(() => containerStyleDefault, []);

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
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
      }}
    >
      {dirtySpots.map((spot) => (
        <React.Fragment key={spot.id}>
          <MarkerF
            position={spot.position}
            onClick={() => onMarkerClick?.(spot)}
            // Example of how you might use a custom icon (ensure the path is correct in /public)
            // icon={{
            //   url: `/icons/custom-map-pin.svg`, 
            //   scaledSize: new window.google.maps.Size(30, 30),
            // }}
          />
          {selectedSpot && selectedSpot.id === spot.id && onInfoWindowClose && (
            <InfoWindowF
              position={spot.position}
              onCloseClick={onInfoWindowClose}
              options={{ pixelOffset: new window.google.maps.Size(0, -30) }} // Adjusts InfoWindow position relative to marker
            >
              <div className="p-1">
                <h4 className="font-semibold text-sm text-gray-800">{spot.name}</h4>
                {spot.address && <p className="text-xs text-gray-600">{spot.address}</p>}
              </div>
            </InfoWindowF>
          )}
        </React.Fragment>
      ))}
    </GoogleMap>
  ) : (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders if props haven't changed
const MemoizedMapDisplay = React.memo(MapDisplayComponent);
MemoizedMapDisplay.displayName = 'MapDisplay'; // For better debugging

export default MemoizedMapDisplay;
