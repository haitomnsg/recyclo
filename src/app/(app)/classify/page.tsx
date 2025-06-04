
'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { classifyWasteItemAction } from '@/server-actions/waste';
import type { ClassifyWasteOutput } from '@/ai/flows/classify-waste';
import { Loader2, Upload, Camera, Leaf, Archive, AlertTriangle, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

export default function ClassifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassifyWasteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        // Toast is optional here, as an Alert will be shown in UI
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setClassificationResult(null);
      setError(null);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = 640; 
      canvas.height = canvas.width / aspectRatio;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreview(dataUri);
        setFile(null); 
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
        setClassificationResult(null);
        setError(null);
        toast({ title: "Photo Captured", description: "Image ready for classification."});
      }
    }
  };

  const handleSubmit = async () => {
    if (!preview) { 
      setError('Please select or capture an image first.');
      toast({ variant: "destructive", title: "No Image", description: "Please provide an image for classification." });
      return;
    }

    setIsLoading(true);
    setClassificationResult(null);
    setError(null);

    try {
      const result = await classifyWasteItemAction({ photoDataUri: preview });
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Classification Error", description: result.error });
      } else {
        setClassificationResult(result);
        toast({ title: "Classification Successful", description: `Item classified as ${result.wasteType}.` });
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Classification Failed", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogItem = () => {
    if (classificationResult) {
      // Only prefill the category, not the name
      const itemToLog = {
        name: '', // User will fill this in on the log page
        category: classificationResult.wasteType === 'organic' ? 'Organic Fertilizer' : 'Other General Waste',
      };
      localStorage.setItem('prefillWasteLog', JSON.stringify(itemToLog));
      router.push('/log');
    }
  };

  const handleListItem = () => {
     if (classificationResult) {
      const itemToList = {
        category: classificationResult.wasteType === 'organic' ? 'Organic' : 'Inorganic',
        description: `Classified ${classificationResult.wasteType} item. ${classificationResult.explanation}`,
        photoDataUrl: preview || undefined,
      };
      localStorage.setItem('prefillWasteListing', JSON.stringify(itemToList));
      router.push('/waste-shop'); 
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">Classify Your Waste</h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Provide an Image
          </CardTitle>
          <CardDescription>Use your camera or upload an image to identify if an item is organic or inorganic.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {hasCameraPermission === null && <p className="text-muted-foreground text-center">Checking camera permissions...</p>}
          
          {hasCameraPermission === true && (
            <div className="space-y-2 border border-border p-4 rounded-md shadow-sm">
              <Label className="text-md font-semibold text-foreground">Use Camera</Label>
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted border" autoPlay playsInline muted />
              <Button onClick={handleCapturePhoto} className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Capture Photo
              </Button>
            </div>
          )}
          {hasCameraPermission === false && (
             <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Camera permission was denied or is unavailable. Please enable camera access in your browser settings and refresh the page.
              </AlertDescription>
            </Alert>
          )}
          <canvas ref={canvasRef} className="hidden" />

          <div className="space-y-2 border border-border p-4 rounded-md shadow-sm">
            <p className="text-md font-semibold text-foreground">Upload from File</p>
            <Label
              htmlFor="waste-image-upload"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full cursor-pointer flex items-center justify-center"
              )}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span>{file ? "Change File" : "Choose File"}</span>
            </Label>
            <Input
              id="waste-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-1 text-center">
                Selected: {file.name}
              </p>
            )}
          </div>
          
          {preview && (
            <div className="mt-4 border border-border rounded-md p-2">
              <Label className="block text-sm font-medium text-muted-foreground mb-1">Image Preview:</Label>
              <Image src={preview} alt="Preview" width={200} height={200} className="rounded-md object-contain mx-auto max-h-60" />
            </div>
          )}

          <Button onClick={handleSubmit} disabled={isLoading || !preview} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Classify Waste
          </Button>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {classificationResult && (
        <Card className="mt-6 shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {classificationResult.wasteType === 'organic' ? 
                <Leaf className="w-6 h-6 text-green-600" /> : 
                <Archive className="w-6 h-6 text-blue-600" />
              }
              Classification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xl font-semibold">
              This item is: <span className={`font-bold ${classificationResult.wasteType === 'organic' ? 'text-green-700' : 'text-blue-700'}`}>{classificationResult.wasteType.toUpperCase()}</span>
            </p>
            <div>
              <h4 className="font-semibold flex items-center gap-1"><Info className="w-4 h-4 text-muted-foreground" />Explanation:</h4>
              <p className="text-muted-foreground pl-1">{classificationResult.explanation}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleLogItem} variant="outline" className="w-full sm:w-auto">Log this Item</Button>
            <Button onClick={handleListItem} className="w-full sm:w-auto">List in WasteShop</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
