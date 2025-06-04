
'use client';

import { useState, type FormEvent, type ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { DirtyZoneReport } from '@/lib/types';
import { MapPin, Camera, ImagePlus, AlertTriangle, Save, FileText, LocateFixed, Heading1, Map } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const DIRTY_ZONES_KEY = 'ecoCycleDirtyZones';

interface ReportZoneFormState {
  title: string;
  description: string;
  latitude: string; // Store as string for input, convert to number on submit
  longitude: string; // Store as string for input, convert to number on submit
  photoDataUrl?: string;
}

const initialFormState: ReportZoneFormState = {
  title: '',
  description: '',
  latitude: '',
  longitude: '',
  photoDataUrl: undefined,
};

export default function ReportZonePage() {
  const [formData, setFormData] = useState<ReportZoneFormState>(initialFormState);
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
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a title, description, and valid latitude/longitude." });
      return;
    }

    const newReport: DirtyZoneReport = { 
      id: Date.now().toString(), 
      title: formData.title,
      description: formData.description,
      latitude: lat,
      longitude: lng,
      photoDataUrl: formData.photoDataUrl,
      reportedDate: new Date().toISOString() 
    };

    const storedReports = localStorage.getItem(DIRTY_ZONES_KEY);
    const reports: DirtyZoneReport[] = storedReports ? JSON.parse(storedReports) : [];
    reports.unshift(newReport); 
    localStorage.setItem(DIRTY_ZONES_KEY, JSON.stringify(reports));

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
              <Label className="flex items-center gap-1"><ImagePlus className="w-4 h-4 text-muted-foreground" />Photo (optional)</Label>
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
