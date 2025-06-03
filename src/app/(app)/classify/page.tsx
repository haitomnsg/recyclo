'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { classifyWasteItemAction } from '@/server-actions/waste';
import type { ClassifyWasteOutput } from '@/ai/flows/classify-waste';
import { Loader2, Upload, Camera, Leaf, Archive, AlertTriangle, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClassifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassifyWasteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    if (!file || !preview) {
      setError('Please select an image file first.');
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
      const itemToLog = {
        name: `Classified ${classificationResult.wasteType} item`,
        category: classificationResult.wasteType === 'organic' ? 'Organic' : 'Inorganic',
      };
      // Pass data via query params or store in session/localStorage for pre-filling
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
      router.push('/list-waste');
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">Classify Your Waste</h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Upload or Capture an Image
          </CardTitle>
          <CardDescription>Let AI help you identify if an item is organic or inorganic.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="waste-image">Waste Image</Label>
            <Input
              id="waste-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:rounded-lg file:px-3 file:py-2 file:border-0"
            />
          </div>
          {preview && (
            <div className="mt-4 border border-border rounded-md p-2">
              <Image src={preview} alt="Preview" width={200} height={200} className="rounded-md object-contain mx-auto max-h-60" />
            </div>
          )}
          <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
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
            <Button onClick={handleListItem} className="w-full sm:w-auto">List for Sale/Donation</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
