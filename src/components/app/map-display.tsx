
'use client';

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

// Fix for default icon path issue with Webpack/Next.js
// This ensures Leaflet's default marker icons load correctly if you add markers later.
if (typeof window !== 'undefined') {
  // Check if already configured to avoid re-applying on HMR or multiple loads
  if (!(L.Icon.Default.prototype as any)._iconUrlOverridden) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png', // Path relative to public directory
      iconUrl: '/leaflet/marker-icon.png',         // Path relative to public directory
      shadowUrl: '/leaflet/marker-shadow.png',     // Path relative to public directory
    });
    // Mark as configured
    (L.Icon.Default.prototype as any)._iconUrlOverridden = true;
  }
}

interface MapDisplayProps {
  center: LatLngExpression;
  zoom: number;
  // markers?: { position: LatLngExpression; popupText: string }[]; // For future use
}

const MapDisplayComponent: React.FC<MapDisplayProps> = ({ center, zoom }) => {
  const mapStyle = React.useMemo(() => ({
    height: '100%', // Fill parent
    width: '100%'   // Fill parent
  }), []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={mapStyle}
      className="rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*
        Future placeholder for markers:
        {markers && markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>{marker.popupText}</Popup>
          </Marker>
        ))}
      */}
    </MapContainer>
  );
};

// Wrap MapDisplayComponent with React.memo
// This prevents re-rendering if props (center, zoom) haven't changed,
// which can help avoid the "Map container is already initialized" error.
const MemoizedMapDisplay = React.memo(MapDisplayComponent);
MemoizedMapDisplay.displayName = 'MapDisplay';

export default MemoizedMapDisplay;
