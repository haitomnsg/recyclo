
'use client';

import { useState, type FormEvent, type ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { DirtySpot, DirtyZoneReportFormData } from '@/lib/types';
import { MapPin, Camera, ImagePlus, AlertTriangle, Save, FileText, Heading1, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const DIRTY_SPOTS_STORAGE_KEY = 'ecoCycleDirtySpots';

const initialFormState: DirtyZoneReportFormData = {
  title: '',
  description: '',
  latitude: '',
  longitude: '',
  photoDataUrl: undefined,
  reportedBy: '',
};

export default function ReportZonePage() {
  const [formData, setFormData] = useState<DirtyZoneReportFormData>(initialFormState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({ ...prev, photoDataUrl: result }));
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
      setFormData(prev => ({ ...prev, photoDataUrl: undefined }));
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (!formData.title || !formData.description || isNaN(lat) || isNaN(lng)) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide title, description, and valid coordinates." });
      return;
    }

    const newSpotReport: DirtySpot = { 
      id: Date.now().toString(), 
      title: formData.title,
      description: formData.description,
      position: { lat, lng },
      photoDataUrl: formData.photoDataUrl,
      reportedDate: new Date().toISOString(),
      reportedBy: formData.reportedBy || "Anonymous",
      status: 'Dirty', 
    };

    const storedSpotsString = localStorage.getItem(DIRTY_SPOTS_STORAGE_KEY);
    const spots: DirtySpot[] = storedSpotsString ? JSON.parse(storedSpotsString) : [];
    spots.unshift(newSpotReport); 
    localStorage.setItem(DIRTY_SPOTS_STORAGE_KEY, JSON.stringify(spots));

    toast({ title: "Zone Reported", description: "Thank you for helping keep Kathmandu clean!" });
    setFormData(initialFormState);
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    router.push('/map'); 
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">Report a Dirty Zone</h2>
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-primary" />
              Report Details
            </CardTitle>
            <CardDescription>Help us identify areas that need cleaning. Provide as much detail as possible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-1"><Heading1 className="w-4 h-4 text-muted-foreground" />Title*</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="e.g., Kantipath Roadside Dump" 
                required 
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="reportedBy" className="flex items-center gap-1"><User className="w-4 h-4 text-muted-foreground" />Your Name (Optional)</Label>
              <Input 
                id="reportedBy" 
                name="reportedBy" 
                value={formData.reportedBy} 
                onChange={handleInputChange} 
                placeholder="e.g., John Doe" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1"><FileText className="w-4 h-4 text-muted-foreground" />Description*</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="e.g., Large pile of plastic bags and bottles." 
                required 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="flex items-center gap-1"><MapPin className="w-4 h-4 text-muted-foreground" />Latitude*</Label>
                <Input 
                  id="latitude" 
                  name="latitude" 
                  type="number"
                  step="any"
                  value={formData.latitude} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 27.7172" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="flex items-center gap-1"><MapPin className="w-4 h-4 text-muted-foreground" />Longitude*</Label>
                <Input 
                  id="longitude" 
                  name="longitude" 
                  type="number"
                  step="any"
                  value={formData.longitude} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 85.3240" 
                  required 
                />
              </div>
            </div>
             <div className="space-y-2">
              <Label className="flex items-center gap-1"><ImagePlus className="w-4 h-4 text-muted-foreground" />Photo of Dirty Spot (optional)</Label>
               <Label
                htmlFor="photo-upload"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full cursor-pointer flex items-center justify-center"
                )}
              >
                <Camera className="mr-2 h-4 w-4" />
                <span>{preview ? "Change Photo" : "Upload Photo of Zone"}</span>
              </Label>
              <Input 
                id="photo-upload" 
                name="photo" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                ref={fileInputRef} 
                className="hidden" 
              />
              {preview && (
                <div className="mt-2 border border-border rounded-md p-2 inline-block">
                  <Image src={preview} alt="Zone preview" width={100} height={100} className="rounded-md object-contain max-h-24" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> Report Zone
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
