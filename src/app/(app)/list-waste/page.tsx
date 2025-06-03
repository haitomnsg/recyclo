
'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { WasteListing } from '@/lib/types';
import { ShoppingBag, Tag, ImagePlus, Weight, Phone, Mail, MapPin, Save, Trash2, Edit3, XCircle, Leaf, Archive, Recycle as RecycleIcon, AlertTriangle as AlertTriangleIcon, Package, StickyNote } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const WASTE_LISTINGS_KEY = 'ecoCycleWasteListings';
const PREFILL_KEY = 'prefillWasteListing';

const initialFormState: Omit<WasteListing, 'id' | 'dateListed'> = {
  category: 'Other',
  description: '',
  photoDataUrl: undefined,
  estimatedWeight: undefined,
  contactMethod: '',
};

export default function ListWastePage() {
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedListings = localStorage.getItem(WASTE_LISTINGS_KEY);
    if (storedListings) {
      setListings(JSON.parse(storedListings));
    }

    const prefillDataString = localStorage.getItem(PREFILL_KEY);
    if (prefillDataString) {
      const prefillData = JSON.parse(prefillDataString);
      setFormData(prev => ({
        ...prev,
        category: prefillData.category || 'Other',
        description: prefillData.description || '',
        photoDataUrl: prefillData.photoDataUrl || undefined,
      }));
      if (prefillData.photoDataUrl) {
        setPreview(prefillData.photoDataUrl);
      }
      localStorage.removeItem(PREFILL_KEY);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'estimatedWeight' ? (value ? parseFloat(value) : undefined) : value }));
  };

  const handleCategoryChange = (value: WasteListing['category']) => {
    setFormData(prev => ({ ...prev, category: value }));
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
    if (!formData.description || !formData.contactMethod) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a description and contact method." });
      return;
    }

    let updatedListings;
    if (editingId) {
      updatedListings = listings.map(item => item.id === editingId ? { ...formData, id: editingId, dateListed: item.dateListed } : item);
      toast({ title: "Listing Updated", description: "Your waste listing has been updated." });
    } else {
      const newListing: WasteListing = { ...formData, id: Date.now().toString(), dateListed: new Date().toISOString() };
      updatedListings = [newListing, ...listings];
      toast({ title: "Listing Created", description: "Your waste item is now listed." });
    }
    setListings(updatedListings);
    localStorage.setItem(WASTE_LISTINGS_KEY, JSON.stringify(updatedListings));
    setFormData(initialFormState);
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    setEditingId(null);
  };

  const handleEdit = (item: WasteListing) => {
    setEditingId(item.id);
    setFormData({
      category: item.category,
      description: item.description,
      photoDataUrl: item.photoDataUrl,
      estimatedWeight: item.estimatedWeight,
      contactMethod: item.contactMethod,
    });
    setPreview(item.photoDataUrl || null);
  };

  const handleDelete = (id: string) => {
    const updatedListings = listings.filter(item => item.id !== id);
    setListings(updatedListings);
    localStorage.setItem(WASTE_LISTINGS_KEY, JSON.stringify(updatedListings));
    toast({ title: "Listing Deleted", description: "The listing has been removed." });
     if (editingId === id) {
      setFormData(initialFormState);
      setPreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    setEditingId(null);
  }
  
  const categoryIcons = {
    Organic: <Leaf className="w-4 h-4 mr-2 text-green-600" />,
    Inorganic: <Archive className="w-4 h-4 mr-2 text-blue-600" />,
    Recyclable: <RecycleIcon className="w-4 h-4 mr-2 text-yellow-600" />,
    Hazardous: <AlertTriangleIcon className="w-4 h-4 mr-2 text-red-600" />,
    Other: <Package className="w-4 h-4 mr-2 text-gray-600" />,
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">
        {editingId ? 'Edit Waste Listing' : 'List Waste for Sale/Donation'}
      </h2>
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              {editingId ? 'Update Listing Details' : 'Create New Listing'}
            </CardTitle>
            <CardDescription>Offer your recyclable or reusable items to others.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-1"><Tag className="w-4 h-4 text-muted-foreground" />Category*</Label>
              <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryIcons).map(([cat, icon]) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center">{icon}{cat}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1"><StickyNote className="w-4 h-4 text-muted-foreground" />Description*</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g., Old newspapers, lightly used plastic containers" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="photo" className="flex items-center gap-1"><ImagePlus className="w-4 h-4 text-muted-foreground" />Photo (optional)</Label>
              <Input id="photo" name="photo" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:rounded-lg file:px-3 file:py-2 file:border-0" />
              {preview && (
                <div className="mt-2 border border-border rounded-md p-2 inline-block">
                  <Image src={preview} alt="Preview" width={100} height={100} className="rounded-md object-contain max-h-24" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedWeight" className="flex items-center gap-1"><Weight className="w-4 h-4 text-muted-foreground" />Estimated Weight (kg, optional)</Label>
              <Input id="estimatedWeight" name="estimatedWeight" type="number" step="0.1" value={formData.estimatedWeight || ''} onChange={handleInputChange} placeholder="e.g., 2.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactMethod" className="flex items-center gap-1"><Phone className="w-4 h-4 text-muted-foreground" />Contact Method* (Location, Phone, or Email)</Label>
              <Input id="contactMethod" name="contactMethod" value={formData.contactMethod} onChange={handleInputChange} placeholder="e.g., Pickup from Baneshwor, or 98********" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
             {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" /> Cancel Edit
                </Button>
            )}
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> {editingId ? 'Save Changes' : 'Create Listing'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <section className="mt-8">
        <h3 className="text-2xl font-semibold font-headline mb-4 text-foreground">Current Listings</h3>
        {listings.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No items currently listed. Create a listing above!</p>
        ) : (
          <div className="space-y-4">
            {listings.map(item => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden">
                {item.photoDataUrl && (
                  <div className="sm:w-1/4 w-full h-40 sm:h-auto relative shrink-0">
                    <Image src={item.photoDataUrl} alt={item.description.substring(0,30)} layout="fill" objectFit="cover" />
                  </div>
                )}
                <CardContent className={`p-4 flex flex-col justify-between flex-grow ${item.photoDataUrl ? 'sm:w-3/4' : 'w-full'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {categoryIcons[item.category]}
                      <p className="font-semibold text-lg">{item.category}</p>
                    </div>
                    <p className="text-sm text-foreground/90 mb-1">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.estimatedWeight && `Approx. ${item.estimatedWeight} kg • `}
                      Listed on {new Date(item.dateListed).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-primary mt-2 flex items-center gap-1">
                        {item.contactMethod.includes('@') ? <Mail className="w-4 h-4" /> : (item.contactMethod.match(/\d/) ? <Phone className="w-4 h-4" /> : <MapPin className="w-4 h-4" />)}
                        {item.contactMethod}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 self-end">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} aria-label={`Edit ${item.description.substring(0,20)}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" aria-label={`Delete listing for ${item.description.substring(0,20)}`}>
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this listing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

    