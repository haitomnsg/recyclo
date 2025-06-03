
'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateArtIdeaAction } from '@/server-actions/art-ideas';
import type { GenerateArtIdeaOutput } from '@/ai/flows/generate-art-idea-flow';
import { Loader2, Camera, Sparkles, Youtube, AlertTriangle, Search, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WasteToArtPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [artIdeaResult, setArtIdeaResult] = useState<GenerateArtIdeaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = 640; // Or a preferred width
      canvas.height = canvas.width / aspectRatio;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreview(dataUri);
        setArtIdeaResult(null);
        setError(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!preview) {
      setError('Please capture a photo first.');
      toast({ variant: "destructive", title: "No Photo", description: "Capture a photo before getting ideas." });
      return;
    }

    setIsLoading(true);
    setArtIdeaResult(null);
    setError(null);

    try {
      const result = await generateArtIdeaAction({ photoDataUri: preview });
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "AI Error", description: result.error });
      } else {
        setArtIdeaResult(result);
        toast({ title: "Art Idea Generated!", description: "Check out the suggestion below." });
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Request Failed", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">Waste to Art Ideas</h2>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Capture Waste Item
          </CardTitle>
          <CardDescription>Take a photo of a waste item to get creative reuse ideas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasCameraPermission === null && <p className="text-muted-foreground text-center">Checking camera permissions...</p>}
          
          {hasCameraPermission === true && (
            <div className="space-y-4">
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
                Camera permission was denied or is unavailable. Please enable camera access in your browser settings to use this feature. You might need to refresh the page after granting permission.
              </AlertDescription>
            </Alert>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {preview && (
            <div className="mt-4 border border-border rounded-md p-2">
              <Label className="block text-sm font-medium text-muted-foreground mb-1">Captured Photo Preview:</Label>
              <Image src={preview} alt="Preview" width={300} height={200} className="rounded-md object-contain mx-auto max-h-60" />
            </div>
          )}
          
          <Button onClick={handleSubmit} disabled={isLoading || !preview} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Art Idea
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

      {artIdeaResult && (
        <Card className="mt-6 shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              Creative Idea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">{artIdeaResult.artProjectTitle}</h3>
              {artIdeaResult.identifiedItems && artIdeaResult.identifiedItems.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Identified item(s): {artIdeaResult.identifiedItems.join(', ')}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-1 text-foreground/90">Project Idea:</h4>
              <p className="text-muted-foreground pl-1">{artIdeaResult.artProjectDescription}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button 
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(artIdeaResult.youtubeSearchQuery)}`, '_blank')}
              variant="default"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              <Youtube className="mr-2 h-4 w-4" /> Find Tutorial on YouTube
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
