
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
import { MapPin, Camera, ImagePlus, AlertTriangle, Save, FileText, LocateFixed } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const DIRTY_ZONES_KEY = 'ecoCycleDirtyZones';

const initialFormState: Omit<DirtyZoneReport, 'id' | 'reportedDate'> = {
  description: '',
  location: '',
  photoDataUrl: undefined,
};

export default function ReportZonePage() {
  const [formData, setFormData] = useState(initialFormState);
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
    if (!formData.description || !formData.location) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a description and location for the dirty zone." });
      return;
    }

    const newReport: DirtyZoneReport = { 
      ...formData, 
      id: Date.now().toString(), 
      reportedDate: new Date().toISOString() 
    };

    const storedReports = localStorage.getItem(DIRTY_ZONES_KEY);
    const reports: DirtyZoneReport[] = storedReports ? JSON.parse(storedReports) : [];
    reports.unshift(newReport); // Add new report to the beginning
    localStorage.setItem(DIRTY_ZONES_KEY, JSON.stringify(reports));

    toast({ title: "Zone Reported", description: "Thank you for helping keep Kathmandu clean!" });
    setFormData(initialFormState);
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    router.push('/map'); // Redirect to map page after reporting
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
              <Label htmlFor="description" className="flex items-center gap-1"><FileText className="w-4 h-4 text-muted-foreground" />Description*</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="e.g., Large pile of plastic bags and bottles dumped near the river bank." 
                required 
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1"><LocateFixed className="w-4 h-4 text-muted-foreground" />Location Description*</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="e.g., Behind Pashupatinath Temple, west gate, near the large peepal tree." 
                required 
              />
              <p className="text-xs text-muted-foreground">Be as specific as possible to help volunteers find the location.</p>
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
