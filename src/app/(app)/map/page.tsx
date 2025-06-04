
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold font-headline text-primary text-center sm:text-left">
          Community Zones
        </h2>
        {/* Link to report zone can be re-added if the feature is re-implemented without the map component */}
        {/* <Button asChild className="w-full sm:w-auto">
          <Link href="/report-zone">
            <PlusCircle className="mr-2 h-5 w-5" /> Report New Zone
          </Link>
        </Button> */}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Zone Information
          </CardTitle>
          <CardDescription>The interactive map feature is currently unavailable. Reported zones would be listed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-md aspect-[16/9] flex flex-col items-center justify-center min-h-[300px]">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Map view temporarily disabled.</p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold font-headline text-foreground">Reported Zones</h3>
        <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Zone reporting feature is currently under review.</p>
            </CardContent>
          </Card>
        {/* Placeholder for listing reported zones if the feature is re-enabled without the interactive map */}
      </section>
    </div>
  );
}
