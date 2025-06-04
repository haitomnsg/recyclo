
'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { WasteListing, WasteListingCategory, ThriftItem, ThriftItemCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleThriftItems, thriftCategories, allThriftCategoryValue } from '@/data/thrift-items';
import { Badge } from "@/components/ui/badge"; // Added import
import { 
  ShoppingBag, Tag, ImagePlus, Weight, Phone, Mail, MapPin, Save, Trash2, Edit3, XCircle, Search, FilterX,
  Shirt, Laptop, BookOpen, ToyBrick, Sofa, Package, Diamond, HandCoins, Recycle, AlertTriangle, StickyNote
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

const WASTE_LISTINGS_KEY = 'ecoCycleWasteListings';
const PREFILL_KEY = 'prefillWasteListing';

const initialFormState: Omit<WasteListing, 'id' | 'dateListed'> = {
  category: 'Other',
  description: '',
  photoDataUrl: undefined,
  estimatedWeight: undefined,
  contactMethod: '',
};

const wasteCategoryIcons: Record<WasteListingCategory, React.ElementType> = {
  Organic: HandCoins,
  Inorganic: Package,
  Recyclable: Recycle,
  Hazardous: AlertTriangle,
  Other: Package,
};

const thriftCategoryIcons: Record<ThriftItemCategory, React.ElementType> = {
  Clothes: Shirt,
  Electronics: Laptop,
  Books: BookOpen,
  Toys: ToyBrick,
  Furniture: Sofa,
  Other: Package,
};

export default function WasteShopPage() {
  // State for Waste Listings Tab
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for Thrift Shop Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThriftCategory, setSelectedThriftCategory] = useState<ThriftItemCategory | typeof allThriftCategoryValue>(allThriftCategoryValue);
  const [filteredThriftItems, setFilteredThriftItems] = useState<ThriftItem[]>(sampleThriftItems);

  const { toast } = useToast();

  // Effect for Waste Listings
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

  // Effect for Thrift Shop filtering
  useEffect(() => {
    let items = sampleThriftItems;
    if (selectedThriftCategory !== allThriftCategoryValue) {
      items = items.filter(item => item.category === selectedThriftCategory);
    }
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredThriftItems(items);
  }, [searchTerm, selectedThriftCategory]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'estimatedWeight' ? (value ? parseFloat(value) : undefined) : value }));
  };

  const handleCategoryChange = (value: WasteListingCategory) => {
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
      setFormData(prev => ({...prev, photoDataUrl: undefined}));
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
    if(fileInputRef.current) fileInputRef.current.value = ""; 
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const clearThriftFilters = () => {
    setSearchTerm('');
    setSelectedThriftCategory(allThriftCategoryValue);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="listWaste" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sticky top-[calc(4rem+1px)] md:top-[calc(4rem+1px)] z-30 bg-background/95 backdrop-blur-sm shadow-sm">
          <TabsTrigger value="listWaste" className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" />List Your Waste</TabsTrigger>
          <TabsTrigger value="thriftShop" className="flex items-center gap-2"><Diamond className="w-4 h-4" />Thrift Shop</TabsTrigger>
        </TabsList>

        <TabsContent value="listWaste" className="mt-2">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-headline text-center text-primary pt-4">
              {editingId ? 'Edit Waste Listing' : 'List Item for Exchange'}
            </h2>
            <Card className="shadow-lg">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    {editingId ? 'Update Listing Details' : 'Create New Listing'}
                  </CardTitle>
                  <CardDescription>Offer your recyclable or reusable items to the community.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-1"><Tag className="w-4 h-4 text-muted-foreground" />Category*</Label>
                    <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(wasteCategoryIcons).map(([cat, IconComp]) => (
                          <SelectItem key={cat} value={cat}>
                            <span className="flex items-center"><IconComp className="w-4 h-4 mr-2" />{cat}</span>
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
                    <Label className="flex items-center gap-1"><ImagePlus className="w-4 h-4 text-muted-foreground" />Photo (optional)</Label>
                    <Label
                      htmlFor="photo-upload-listing"
                      className={cn(buttonVariants({ variant: "outline" }), "w-full cursor-pointer flex items-center justify-center")}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" />
                      <span>{preview ? "Change Photo" : "Upload Photo"}</span>
                    </Label>
                    <Input 
                      id="photo-upload-listing" 
                      name="photo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      ref={fileInputRef} 
                      className="hidden" 
                    />
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
              <h3 className="text-2xl font-semibold font-headline mb-4 text-foreground">Your Community Listings</h3>
              {listings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items currently listed. Create a listing above!</p>
              ) : (
                <div className="space-y-4">
                  {listings.map(item => {
                    const IconComponent = wasteCategoryIcons[item.category] || Package;
                    return (
                    <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden">
                      {item.photoDataUrl && (
                        <div className="sm:w-1/4 w-full h-40 sm:h-auto relative shrink-0 bg-muted">
                          <Image src={item.photoDataUrl} alt={item.description.substring(0,30)} layout="fill" objectFit="cover" />
                        </div>
                      )}
                      <CardContent className={`p-4 flex flex-col justify-between flex-grow ${item.photoDataUrl ? 'sm:w-3/4' : 'w-full'}`}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="w-5 h-5 text-muted-foreground" />
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
                  )})}
                </div>
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="thriftShop" className="mt-2">
          <div className="space-y-6 pt-4">
            <h2 className="text-3xl font-bold font-headline text-center text-primary">Thrift & Upcycled Treasures</h2>
            <Card className="shadow-md p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow relative">
                  <Input 
                    type="text"
                    placeholder="Search thrift items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Select value={selectedThriftCategory} onValueChange={(value) => setSelectedThriftCategory(value as ThriftItemCategory | typeof allThriftCategoryValue)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={allThriftCategoryValue}>All Categories</SelectItem>
                    {thriftCategories.map(cat => {
                      const IconComp = thriftCategoryIcons[cat] || Package;
                      return (
                        <SelectItem key={cat} value={cat}>
                          <span className="flex items-center"><IconComp className="w-4 h-4 mr-2" />{cat}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearThriftFilters} className="w-full md:w-auto">
                  <FilterX className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              </div>

              {filteredThriftItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No thrift items match your criteria. Try adjusting your search or filters!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredThriftItems.map(item => {
                    const IconComp = thriftCategoryIcons[item.category] || Package;
                    return (
                    <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
                      <div className="relative w-full h-52 bg-muted">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          layout="fill" 
                          objectFit="cover"
                          data-ai-hint={item.imageHint}
                        />
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-lg font-semibold line-clamp-2">{item.name}</CardTitle>
                          <Badge variant="secondary" className="whitespace-nowrap flex items-center gap-1">
                            <IconComp className="w-3.5 h-3.5" /> {item.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-1 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{item.description}</p>
                        <p className="text-xl font-bold text-primary">Rs. {item.price.toLocaleString()}</p>
                      </CardContent>
                      <CardFooter className="p-4 border-t">
                        <Button variant="default" className="w-full">
                          View Details (Coming Soon)
                        </Button>
                      </CardFooter>
                    </Card>
                  )})}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
