
'use client';

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, PlusCircle, MapPin as MapPinIcon, AlertTriangle, CheckCircle, User, WandSparkles, Save, Camera, CalendarDays, Users, StickyNote, Trophy } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
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

interface CleanedFormState extends Omit<CleanedDetails, 'photoDataUrl' | 'dateCleaned'> {
  dateCleaned: string; // Keep as string for input type="date"
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
    
    const combinedSpotsMap = new Map<string, DirtySpot>();
    sampleDirtySpots.forEach(spot => combinedSpotsMap.set(spot.id, spot));
    storedSpots.forEach(spot => combinedSpotsMap.set(spot.id, spot)); 
    
    setDirtySpots(Array.from(combinedSpotsMap.values()).sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime() ));
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
    setCleanedFormState({
      ...initialCleanedFormState,
      dateCleaned: new Date().toISOString().split('T')[0] 
    });
    setCleanedPhotoPreview(null);
    if (cleanedFileRef.current) cleanedFileRef.current.value = "";
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
        ? { ...spot, status: 'Cleaned', cleanedDetails: updatedDetails }
        : spot
    );
    setDirtySpots(updatedSpots);
    localStorage.setItem(DIRTY_SPOTS_STORAGE_KEY, JSON.stringify(updatedSpots));
    toast({ title: "Spot Cleaned!", description: `${isCleanedDialogSpot.title} has been marked as Cleaned.` });
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
                className={cn("hover:shadow-md transition-shadow bg-card flex flex-col", spot.status === 'Cleaned' ? 'border-green-500' : 'border-destructive/50')}
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
                      <MapPinIcon className={cn("w-4 h-4 mr-2 flex-shrink-0", spot.status === 'Cleaned' ? 'text-green-600' : 'text-destructive')} />
                      {spot.title}
                    </CardTitle>
                    <Badge variant={spot.status === 'Cleaned' ? 'default' : 'destructive'} className={cn(spot.status === 'Cleaned' ? 'bg-green-600 hover:bg-green-700' : '')}>
                      {spot.status === 'Cleaned' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                      {spot.status}
                    </Badge>
                  </div>
                  {spot.address && <CardDescription className="text-xs mt-1">{spot.address}</CardDescription>}
                  {spot.description && <CardDescription className="text-xs mt-1 italic">{spot.description}</CardDescription>}
                   <p className="text-xs text-muted-foreground mt-1">
                    Reported by: {spot.reportedBy || 'Anonymous'} on {new Date(spot.reportedDate).toLocaleDateString()}
                  </p>
                  {spot.status === 'Cleaned' && spot.cleanedDetails && (
                    <div className="mt-2 p-2 bg-green-500/10 rounded-md border border-green-500/30 text-xs text-green-700">
                      <p className="font-semibold">Cleaned by: {spot.cleanedDetails.cleanedBy}</p>
                      <p>Date: {new Date(spot.cleanedDetails.dateCleaned).toLocaleDateString()}</p>
                      <p>Volunteers: {spot.cleanedDetails.volunteersInvolved}</p>
                      {spot.cleanedDetails.notes && <p className="italic mt-1">Notes: {spot.cleanedDetails.notes}</p>}
                      {spot.cleanedDetails.photoDataUrl && (
                        <div className="mt-1 relative w-20 h-16">
                           <Image src={spot.cleanedDetails.photoDataUrl} alt="Cleaned spot" layout="fill" objectFit="cover" className="rounded"/>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
                {spot.status === 'Dirty' && (
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
              <DialogTitle className="flex items-center gap-2"><WandSparkles className="text-primary"/>Report Cleanup for: {isCleanedDialogSpot.title}</DialogTitle>
              <DialogDescription>
                Thank you for helping keep Kathmandu clean! Please provide the details of the cleanup.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCleanedSubmit} className="space-y-4 py-2">
              <div>
                <Label htmlFor="cleanedBy" className="flex items-center gap-1 text-sm mb-1.5"><User className="w-4 h-4 text-muted-foreground"/>Cleaned By*</Label>
                <Input id="cleanedBy" name="cleanedBy" value={cleanedFormState.cleanedBy} onChange={handleCleanedFormInputChange} required placeholder="Your Name / Group Name"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateCleaned" className="flex items-center gap-1 text-sm mb-1.5"><CalendarDays className="w-4 h-4 text-muted-foreground"/>Date Cleaned*</Label>
                  <Input id="dateCleaned" name="dateCleaned" type="date" value={cleanedFormState.dateCleaned} onChange={handleCleanedFormInputChange} required/>
                </div>
                <div>
                  <Label htmlFor="volunteersInvolved" className="flex items-center gap-1 text-sm mb-1.5"><Users className="w-4 h-4 text-muted-foreground"/>Volunteers Involved*</Label>
                  <Input id="volunteersInvolved" name="volunteersInvolved" type="number" min="1" value={cleanedFormState.volunteersInvolved} onChange={handleCleanedFormInputChange} required/>
                </div>
              </div>
              <div>
                <Label htmlFor="cleanedPhoto" className="flex items-center gap-1 text-sm mb-1.5"><Camera className="w-4 h-4 text-muted-foreground"/>Photo of Cleaned Area</Label>
                <Label
                    htmlFor="cleanedPhoto-upload"
                    className={cn(buttonVariants({ variant: "outline" }), "w-full cursor-pointer flex items-center justify-center")}
                >
                    <Camera className="mr-2 h-4 w-4" />
                    <span>{cleanedPhotoPreview ? "Change Photo" : "Upload Photo"}</span>
                </Label>
                <Input 
                    id="cleanedPhoto-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCleanedPhotoChange} 
                    ref={cleanedFileRef} 
                    className="hidden"
                />
                {cleanedPhotoPreview && 
                  <div className="mt-2 border rounded-md p-1 inline-block">
                    <Image src={cleanedPhotoPreview} alt="Cleaned preview" width={100} height={75} className="rounded-md object-cover"/>
                  </div>
                }
              </div>
              <div>
                <Label htmlFor="notes" className="flex items-center gap-1 text-sm mb-1.5"><StickyNote className="w-4 h-4 text-muted-foreground"/>Notes</Label>
                <Textarea id="notes" name="notes" value={cleanedFormState.notes || ''} onChange={handleCleanedFormInputChange} placeholder="Any additional details about the cleanup..."/>
              </div>
              <DialogFooter className="pt-2 sm:justify-end sm:space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="w-full sm:w-auto mt-2 sm:mt-0">
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
