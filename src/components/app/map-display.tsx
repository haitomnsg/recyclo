
'use client';

import React from 'react'; 
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import type { DirtySpot } from '@/lib/types';

interface MapDisplayProps {
  apiKey: string; 
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
  minHeight: '300px', 
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
    id: 'google-map-script', 
    googleMapsApiKey: apiKey,
  });

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(() => {
    mapRef.current = null;
  }, []);

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
          />
          {selectedSpot && selectedSpot.id === spot.id && onInfoWindowClose && (
            <InfoWindowF
              position={spot.position}
              onCloseClick={onInfoWindowClose}
              options={{ pixelOffset: new window.google.maps.Size(0, -30) }} 
            >
              <div className="p-1">
                <h4 className="font-semibold text-sm text-gray-800">{spot.title}</h4>
                {spot.address && <p className="text-xs text-gray-600">{spot.address}</p>}
                {spot.description && <p className="text-xs text-gray-600 mt-0.5">{spot.description}</p>}
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

const MemoizedMapDisplay = React.memo(MapDisplayComponent);
MemoizedMapDisplay.displayName = 'MapDisplay'; 

export default MemoizedMapDisplay;
