
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DirtyZoneReport } from '@/lib/types';
import { MapPin, PlusCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DIRTY_ZONES_KEY = 'ecoCycleDirtyZones';

export default function MapPage() {
  const [reportedZones, setReportedZones] = useState<DirtyZoneReport[]>([]);

  useEffect(() => {
    const storedReports = localStorage.getItem(DIRTY_ZONES_KEY);
    if (storedReports) {
      setReportedZones(JSON.parse(storedReports));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold font-headline text-primary text-center sm:text-left">
          Community Reported Dirty Zones
        </h2>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/report-zone">
            <PlusCircle className="mr-2 h-5 w-5" /> Report New Zone
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Kathmandu Area Map (Conceptual)
          </CardTitle>
          <CardDescription>This is a placeholder for a map. Reported zones are listed below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-md overflow-hidden aspect-[16/9] flex items-center justify-center">
            <Image 
              src="https://placehold.co/800x450.png" 
              alt="Placeholder map of Kathmandu" 
              width={800} 
              height={450} 
              className="object-cover w-full h-full"
              data-ai-hint="map kathmandu city" 
            />
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold font-headline text-foreground">Reported Zones</h3>
        {reportedZones.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No dirty zones reported yet.</p>
              <p className="text-sm text-muted-foreground">Be the first to report one using the button above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reportedZones.map(zone => (
              <Card key={zone.id} className="shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {zone.photoDataUrl && (
                    <div className="sm:w-1/3 w-full h-48 sm:h-auto relative shrink-0">
                       <Image src={zone.photoDataUrl} alt={`Photo of ${zone.location}`} layout="fill" objectFit="cover" />
                    </div>
                  )}
                  <CardContent className={`p-4 flex flex-col justify-between flex-grow ${zone.photoDataUrl ? 'sm:w-2/3' : 'w-full'}`}>
                    <div>
                      <div className="flex items-center text-red-600 mb-1">
                        <MapPin className="w-5 h-5 mr-2 shrink-0" />
                        <h4 className="font-semibold text-lg break-words">{zone.location}</h4>
                      </div>
                      <p className="text-sm text-foreground/90 mb-2">{zone.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Reported {formatDistanceToNow(new Date(zone.reportedDate), { addSuffix: true })}
                      </p>
                    </div>
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 self-start sm:self-end"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zone.location)}`, '_blank')}
                        title="Attempt to view this location on Google Maps"
                      >
                        View on Google Maps <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
