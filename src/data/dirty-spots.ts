
import type { DirtySpot } from '@/lib/types';

export const sampleDirtySpots: DirtySpot[] = [
  {
    id: 'spot1',
    title: 'Kantipath Roadside Dump',
    position: { lat: 27.7128, lng: 85.3157 },
    address: 'Near Rani Pokhari, Kantipath',
    photoDataUrl: '/images/kantipathDump.png',
    description: 'Accumulation of plastic bags and food waste.',
    status: 'Dirty',
    reportedBy: 'Green Kathmandu Group',
    reportedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 'spot2',
    title: 'Bagmati River Bank - Teku Overflow',
    position: { lat: 27.6925, lng: 85.3015 },
    address: 'South of Teku Bridge, near the river.',
    photoDataUrl: '/images/bagmati.png',
    description: 'Construction debris and household waste dumped.',
    status: 'Dirty',
    reportedBy: 'Local Resident A',
    reportedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'spot3',
    title: 'Bishnumati Corridor - Dallu Debris',
    position: { lat: 27.7170, lng: 85.3070 },
    address: 'Near Dallu Awas, along the corridor.',
    photoDataUrl: '/images/bishnumati.png',
    description: 'Mixed waste including old clothes and plastics.',
    status: 'Cleaned',
    reportedBy: 'Volunteer Group X',
    reportedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    cleanedDetails: {
      cleanedBy: 'Cleanup Champions',
      dateCleaned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      volunteersInvolved: 15,
      notes: 'Major cleanup drive organized with local community.',
      photoDataUrl: '/images/bishnumatiClean.png',
    }
  },
];
