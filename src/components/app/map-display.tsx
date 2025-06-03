
'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

// Fix for default icon path issue with Webpack/Next.js
// This ensures Leaflet's default marker icons load correctly if you add markers later.
// It expects marker-icon.png, marker-icon-2x.png, and marker-shadow.png
// to be available in the /leaflet/ directory of your public folder.
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  });
}

interface MapDisplayProps {
  center: LatLngExpression;
  zoom: number;
  // markers?: { position: LatLngExpression; popupText: string }[]; // For future use when plotting zones
}

const MapDisplay: React.FC<MapDisplayProps> = ({ center, zoom }) => {
  // Ensure component only renders on the client where 'window' is available
  if (typeof window === 'undefined') {
    return null; 
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true} 
      style={{ height: '450px', width: '100%' }} // Explicit height is crucial for Leaflet
      className="rounded-md z-0" // z-0 can help with potential stacking issues with other UI elements
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

export default MapDisplay;
