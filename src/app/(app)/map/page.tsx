
'use client';

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, PlusCircle, MapPin as MapPinIcon, AlertTriangle, CheckCircle, Trash2, Camera, CalendarDays, Users, StickyNote, Save, WandSparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sampleDirtySpots } from '@/data/dirty-spots';
import type { DirtySpot, CleanedDetails } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const MapDisplay = dynamic(() => import('@/components/app/map-display'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Initializing Map...</p>
    </div>
  ),
});

const KATHMANDU_CENTER: google.maps.LatLngLiteral = { lat: 27.7172, lng: 85.3240 };
const DEFAULT_ZOOM = 12;
const DIRTY_SPOTS_STORAGE_KEY = 'ecoCycleDirtySpots';

interface CleanedFormState extends Omit<CleanedDetails, 'photoDataUrl'> {
  photoFile?: File | null;
}

const initialCleanedFormState: CleanedFormState = {
  dateCleaned: new Date().toISOString().split('T')[0],
  volunteersInvolved: 1,
  cleanedBy: '',
  notes: '',
  photoFile: null,
};

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [dirtySpots, setDirtySpots] = useState<DirtySpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<DirtySpot | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isCleanedDialogSpot, setIsCleanedDialogSpot] = useState<DirtySpot | null>(null);
  const [cleanedFormState, setCleanedFormState] = useState<CleanedFormState>(initialCleanedFormState);
  const [cleanedPhotoPreview, setCleanedPhotoPreview] = useState<string | null>(null);
  const cleanedFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedSpotsString = localStorage.getItem(DIRTY_SPOTS_STORAGE_KEY);
    const storedSpots: DirtySpot[] = storedSpotsString ? JSON.parse(storedSpotsString) : [];
    
    // Combine sample spots and stored spots, giving preference to stored if IDs match
    const combinedSpots = [...sampleDirtySpots];
    storedSpots.forEach(stored => {
      const existingIndex = combinedSpots.findIndex(s => s.id === stored.id);
      if (existingIndex > -1) {
        combinedSpots[existingIndex] = stored; // Replace sample with stored if same ID
      } else {
        combinedSpots.push(stored);
      }
    });
    setDirtySpots(combinedSpots.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime() ));
  }, []);

  const handleMarkerClick = (spot: DirtySpot) => {
    setSelectedSpot(spot);
  };

  const handleInfoWindowClose = () => {
    setSelectedSpot(null);
  };

  const handleListItemClick = (spot: DirtySpot) => {
    setSelectedSpot(spot);
  };
  
  const openCleanedDialog = (spot: DirtySpot) => {
    setIsCleanedDialogSpot(spot);
    setCleanedFormState(initialCleanedFormState);
    setCleanedPhotoPreview(null);
  };

  const handleCleanedFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCleanedFormState(prev => ({ ...prev, [name]: name === 'volunteersInvolved' ? parseInt(value) || 1 : value }));
  };

  const handleCleanedPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCleanedFormState(prev => ({ ...prev, photoFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setCleanedPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setCleanedFormState(prev => ({ ...prev, photoFile: null }));
      setCleanedPhotoPreview(null);
    }
  };

  const handleCleanedSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isCleanedDialogSpot || !cleanedFormState.cleanedBy || !cleanedFormState.dateCleaned) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill in 'Cleaned By' and 'Date Cleaned'." });
      return;
    }

    let photoDataUrl: string | undefined = undefined;
    if (cleanedFormState.photoFile) {
      const reader = new FileReader();
      photoDataUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(cleanedFormState.photoFile!);
      });
    }
    
    const updatedDetails: CleanedDetails = {
      photoDataUrl,
      dateCleaned: new Date(cleanedFormState.dateCleaned).toISOString(),
      volunteersInvolved: cleanedFormState.volunteersInvolved,
      cleanedBy: cleanedFormState.cleanedBy,
      notes: cleanedFormState.notes,
    };

    const updatedSpots = dirtySpots.map(spot =>
      spot.id === isCleanedDialogSpot.id
        ? { ...spot, status: 'cleaned' as const, cleanedDetails: updatedDetails }
        : spot
    );
    setDirtySpots(updatedSpots);
    localStorage.setItem(DIRTY_SPOTS_STORAGE_KEY, JSON.stringify(updatedSpots));
    toast({ title: "Spot Cleaned!", description: `${isCleanedDialogSpot.title} has been marked as cleaned.` });
    setIsCleanedDialogSpot(null);
  };

  const getAiHint = (title: string): string => {
    const hintsMap: {[key: string]: string} = {
      'Kantipath Roadside Dump': 'roadside garbage',
      'Bagmati River Bank - Teku Overflow': 'river pollution',
      'Bishnumati Corridor - Dallu Debris': 'urban waste',
      'Swayambhunath Foothill Litter': 'temple litter',
      'Patan Durbar Square Alleyway Mess': 'alleyway trash',
      'Chabahil Chowk Corner Pileup': 'market waste',
      'Kalanki Underpass Area Dumping': 'underpass garbage',
      'Thamel Street Waste Buildup': 'street waste',
      'Boudhanath Kora Path Litter': 'stupa litter',
      'New Road Back Alley Dump': 'alley trash',
    };
    return hintsMap[title] || 'waste dump';
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4 animate-pulse" />
        <h2 className="text-xl font-semibold text-destructive">Google Maps API Key Missing</h2>
        <p className="text-muted-foreground mt-2">
          Please ensure the <code className="bg-muted px-1.5 py-0.5 rounded-sm text-foreground font-mono text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> is set.
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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/leaderboard">
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Link>
          </Button>
          <Button variant="default" className="w-full sm:w-auto" asChild>
            <Link href="/report-zone">
              <PlusCircle className="mr-2 h-5 w-5" />
              Report New Spot
            </Link>
          </Button>
        </div>
      </div>

      <div className="h-[50vh] min-h-[300px] w-full rounded-lg overflow-hidden shadow-lg border border-border">
        <MapDisplay
          apiKey={apiKey}
          center={KATHMANDU_CENTER}
          zoom={DEFAULT_ZOOM}
          dirtySpots={dirtySpots}
          selectedSpot={selectedSpot}
          onMarkerClick={handleMarkerClick}
          onInfoWindowClose={handleInfoWindowClose}
        />
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-1 pb-4">
        <h3 className="text-xl font-semibold font-headline text-foreground sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
          Reported Locations ({dirtySpots.length}):
        </h3>
        {dirtySpots.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No dirty spots reported yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dirtySpots.map((spot) => (
              <Card
                key={spot.id}
                className={cn("hover:shadow-md transition-shadow bg-card flex flex-col", spot.status === 'cleaned' ? 'border-green-500' : 'border-destructive/50')}
              >
                {spot.photoDataUrl && (
                  <div className="relative w-full h-40 cursor-pointer" onClick={() => handleListItemClick(spot)}>
                    <Image 
                      src={spot.photoDataUrl} 
                      alt={spot.title} 
                      layout="fill" 
                      objectFit="cover" 
                      className="rounded-t-lg"
                      data-ai-hint={getAiHint(spot.title)}
                    />
                  </div>
                )}
                <CardHeader className="p-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center text-card-foreground cursor-pointer" onClick={() => handleListItemClick(spot)}>
                      <MapPinIcon className={cn("w-4 h-4 mr-2 flex-shrink-0", spot.status === 'cleaned' ? 'text-green-600' : 'text-destructive')} />
                      {spot.title}
                    </CardTitle>
                    <Badge variant={spot.status === 'cleaned' ? 'default' : 'destructive'} className={cn(spot.status === 'cleaned' ? 'bg-green-600 hover:bg-green-700' : '')}>
                      {spot.status === 'cleaned' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                      {spot.status}
                    </Badge>
                  </div>
                  {spot.address && <CardDescription className="text-xs mt-1">{spot.address}</CardDescription>}
                  {spot.description && <CardDescription className="text-xs mt-1 italic">{spot.description}</CardDescription>}
                   <p className="text-xs text-muted-foreground mt-1">
                    Reported by: {spot.reportedBy || 'Anonymous'} on {new Date(spot.reportedDate).toLocaleDateString()}
                  </p>
                  {spot.status === 'cleaned' && spot.cleanedDetails && (
                    <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200 text-xs">
                      <p className="font-semibold text-green-700">Cleaned by: {spot.cleanedDetails.cleanedBy}</p>
                      <p>Date: {new Date(spot.cleanedDetails.dateCleaned).toLocaleDateString()}</p>
                      <p>Volunteers: {spot.cleanedDetails.volunteersInvolved}</p>
                      {spot.cleanedDetails.photoDataUrl && (
                        <Image src={spot.cleanedDetails.photoDataUrl} alt="Cleaned spot" width={80} height={60} className="rounded mt-1"/>
                      )}
                    </div>
                  )}
                </CardHeader>
                {spot.status === 'dirty' && (
                  <CardFooter className="p-3 border-t">
                    <Button variant="secondary" size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary" onClick={() => openCleanedDialog(spot)}>
                      <WandSparkles className="mr-2 h-4 w-4" /> Report as Cleaned
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {isCleanedDialogSpot && (
        <Dialog open={!!isCleanedDialogSpot} onOpenChange={(open) => { if(!open) setIsCleanedDialogSpot(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Report Cleanup for: {isCleanedDialogSpot.title}</DialogTitle>
              <DialogDescription>
                Thank you for cleaning! Please provide the details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCleanedSubmit} className="space-y-4 py-2">
              <div>
                <Label htmlFor="cleanedBy" className="flex items-center gap-1"><User className="w-4 h-4 text-muted-foreground"/>Cleaned By*</Label>
                <Input id="cleanedBy" name="cleanedBy" value={cleanedFormState.cleanedBy} onChange={handleCleanedFormInputChange} required placeholder="Your Name / Group Name"/>
              </div>
              <div>
                <Label htmlFor="dateCleaned" className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-muted-foreground"/>Date Cleaned*</Label>
                <Input id="dateCleaned" name="dateCleaned" type="date" value={cleanedFormState.dateCleaned} onChange={handleCleanedFormInputChange} required/>
              </div>
              <div>
                <Label htmlFor="volunteersInvolved" className="flex items-center gap-1"><Users className="w-4 h-4 text-muted-foreground"/>Volunteers Involved*</Label>
                <Input id="volunteersInvolved" name="volunteersInvolved" type="number" min="1" value={cleanedFormState.volunteersInvolved} onChange={handleCleanedFormInputChange} required/>
              </div>
              <div>
                <Label htmlFor="cleanedPhoto" className="flex items-center gap-1"><Camera className="w-4 h-4 text-muted-foreground"/>Photo of Cleaned Area (Optional)</Label>
                <Input id="cleanedPhoto" type="file" accept="image/*" onChange={handleCleanedPhotoChange} ref={cleanedFileRef} className="file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:rounded-lg file:px-3 file:py-2 file:border-0"/>
                {cleanedPhotoPreview && <Image src={cleanedPhotoPreview} alt="Cleaned preview" width={100} height={75} className="rounded-md mt-2 object-cover"/>}
              </div>
              <div>
                <Label htmlFor="notes" className="flex items-center gap-1"><StickyNote className="w-4 h-4 text-muted-foreground"/>Notes (Optional)</Label>
                <Textarea id="notes" name="notes" value={cleanedFormState.notes || ''} onChange={handleCleanedFormInputChange} placeholder="Any additional details..."/>
              </div>
              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4"/> Submit Verification
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
