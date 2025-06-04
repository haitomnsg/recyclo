
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { WasteItem, WasteCategory } from '@/lib/types'; // Updated WasteCategory import
import { 
  ListPlus, Trash2, Edit3, CalendarDays, Weight, StickyNote, Save, XCircle, Briefcase, Users, Info, Phone,
  Sprout, Package as PackageIcon // Icons for simplified categories
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { recyclingCategories, getPartnersByCategory, type RecyclingPartner, type RecyclingCategoryType } from '@/data/recycling-partners';
import { cn } from '@/lib/utils';

const WASTE_LOG_KEY = 'ecoCycleWasteLog';
const PREFILL_KEY = 'prefillWasteLog';

type LogMode = 'public' | 'business';

const simplifiedWasteCategories: { name: WasteCategory; Icon: React.ElementType }[] = [
  { name: 'Organic Fertilizer', Icon: Sprout },
  { name: 'Other General Waste', Icon: PackageIcon },
];

const initialFormState: Omit<WasteItem, 'id' | 'sourceType'> & { date: string } = {
  name: '',
  category: 'Other General Waste', 
  date: new Date().toISOString().split('T')[0], 
  weight: undefined, // Weight in grams
  notes: '',
  businessName: '',
};

export default function LogPage() {
  const [wasteLog, setWasteLog] = useState<WasteItem[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logMode, setLogMode] = useState<LogMode>('public');
  const [selectedRecyclingCategory, setSelectedRecyclingCategory] = useState<RecyclingCategoryType | null>(null);
  const [currentPartners, setCurrentPartners] = useState<RecyclingPartner[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const storedLog = localStorage.getItem(WASTE_LOG_KEY);
    if (storedLog) {
      setWasteLog(JSON.parse(storedLog));
    }

    const prefillDataString = localStorage.getItem(PREFILL_KEY);
    if (prefillDataString) {
      const prefillData = JSON.parse(prefillDataString) as Partial<Pick<WasteItem, 'category'>>; // Only prefill category
      setFormData(prev => ({
        ...prev,
        name: '', // Clear name, user will input
        category: prefillData.category || 'Other General Waste',
      }));
      localStorage.removeItem(PREFILL_KEY); 
    }
  }, []);

  useEffect(() => {
    if (selectedRecyclingCategory) {
      setCurrentPartners(getPartnersByCategory(selectedRecyclingCategory));
    } else {
      setCurrentPartners([]);
    }
  }, [selectedRecyclingCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'weight' ? (value ? parseFloat(value) : undefined) : value }));
  };

  const handleCategoryButtonClick = (category: WasteCategory) => {
    setFormData(prev => ({ ...prev, category: category }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please enter item name and date." });
        return;
    }
    if (logMode === 'business' && !formData.businessName) {
        toast({ variant: "destructive", title: "Missing Business Name", description: "Please enter the business name." });
        return;
    }

    let updatedLog;
    const itemData = { 
      ...formData, 
      sourceType: logMode,
      businessName: logMode === 'business' ? formData.businessName : undefined,
    };

    if (editingId) {
      updatedLog = wasteLog.map(item => item.id === editingId ? { ...itemData, id: editingId, date: new Date(formData.date).toISOString() } : item);
      toast({ title: "Item Updated", description: `"${formData.name}" has been updated.` });
    } else {
      const newItem: WasteItem = { ...itemData, id: Date.now().toString(), date: new Date(formData.date).toISOString() };
      updatedLog = [newItem, ...wasteLog];
      toast({ title: "Item Logged", description: `"${formData.name}" has been added to your log.` });
    }
    setWasteLog(updatedLog);
    localStorage.setItem(WASTE_LOG_KEY, JSON.stringify(updatedLog));
    setFormData(initialFormState); 
    setEditingId(null);
  };

  const handleEdit = (item: WasteItem) => {
    setEditingId(item.id);
    setLogMode(item.sourceType);
    setFormData({
        name: item.name,
        category: item.category,
        date: item.date.split('T')[0], 
        weight: item.weight,
        notes: item.notes || '',
        businessName: item.businessName || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    const updatedLog = wasteLog.filter(item => item.id !== id);
    setWasteLog(updatedLog);
    localStorage.setItem(WASTE_LOG_KEY, JSON.stringify(updatedLog));
    toast({ title: "Item Deleted", description: "The item has been removed from your log." });
    if (editingId === id) { 
      setFormData(initialFormState);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
  }

  const handleModeChange = (newMode: LogMode) => {
    setLogMode(newMode);
    setFormData(initialFormState); 
    setEditingId(null);
    setSelectedRecyclingCategory(null); 
  };
  
  const handleRecyclingCategoryClick = (categoryType: RecyclingCategoryType) => {
    setSelectedRecyclingCategory(prev => prev === categoryType ? null : categoryType);
  };

  const getCategoryIcon = (categoryName: WasteCategory): React.ElementType => {
    const found = simplifiedWasteCategories.find(cat => cat.name === categoryName);
    return found ? found.Icon : PackageIcon;
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-2 mb-6">
        <Button
          variant={logMode === 'public' ? 'default' : 'outline'}
          onClick={() => handleModeChange('public')}
          className="flex-1 sm:flex-initial"
        >
          <Users className="mr-2 h-4 w-4" /> For Public
        </Button>
        <Button
          variant={logMode === 'business' ? 'default' : 'outline'}
          onClick={() => handleModeChange('business')}
          className="flex-1 sm:flex-initial"
        >
          <Briefcase className="mr-2 h-4 w-4" /> For Business
        </Button>
      </div>

      <h2 className="text-3xl font-bold font-headline text-center text-primary">
        {editingId ? 'Edit Waste Item' : `Log Your Waste (${logMode === 'public' ? 'Public' : 'Business'})`}
      </h2>

      {logMode === 'business' && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="w-5 h-5 text-primary" />
              Connect with Recycling Partners
            </CardTitle>
            <CardDescription>Find organizations that can help recycle specific waste materials (for businesses).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {recyclingCategories.map(category => (
                <Button
                  key={category.type}
                  variant={selectedRecyclingCategory === category.type ? "default" : "outline"}
                  onClick={() => handleRecyclingCategoryClick(category.type)}
                  className="flex flex-col h-auto items-center justify-center p-3 space-y-1 text-center"
                >
                  <category.Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs sm:text-sm">{category.label}</span>
                </Button>
              ))}
            </div>
            {selectedRecyclingCategory && currentPartners.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="font-semibold text-lg text-foreground">
                  Partners for {selectedRecyclingCategory}:
                </h4>
                {currentPartners.map(partner => (
                  <Card key={partner.id} className="p-3 shadow-sm">
                    <p className="font-semibold text-md text-primary">{partner.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3"/> {partner.contact}
                    </p>
                    <p className="text-xs text-foreground/80 mt-1">{partner.description}</p>
                  </Card>
                ))}
              </div>
            )}
             {selectedRecyclingCategory && currentPartners.length === 0 && (
                <p className="text-muted-foreground text-center mt-4">No partners listed for {selectedRecyclingCategory} yet.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListPlus className="w-6 h-6 text-primary" />
              {editingId ? 'Update Item Details' : 'Add New Waste Item'}
            </CardTitle>
            <CardDescription>Keep track of your daily waste production.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {logMode === 'business' && (
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-muted-foreground" />Business Name*</Label>
                <Input id="businessName" name="businessName" value={formData.businessName || ''} onChange={handleInputChange} placeholder="e.g., My Awesome Cafe" required={logMode === 'business'} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1"><StickyNote className="w-4 h-4 text-muted-foreground" />Item Name*</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Banana Peels, Plastic Bottle" required />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><PackageIcon className="w-4 h-4 text-muted-foreground" />Category*</Label>
              <div className="grid grid-cols-2 gap-2">
                {simplifiedWasteCategories.map(cat => (
                  <Button
                    key={cat.name}
                    type="button"
                    variant={formData.category === cat.name ? 'default' : 'outline'}
                    onClick={() => handleCategoryButtonClick(cat.name)}
                    className="flex items-center justify-center space-x-2 py-3"
                    size="lg"
                  >
                    <cat.Icon className="w-5 h-5" />
                    <span className="text-sm leading-tight">{cat.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-muted-foreground" />Date*</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-1"><Weight className="w-4 h-4 text-muted-foreground" />Weight (grams)</Label>
                <Input id="weight" name="weight" type="number" step="any" min="0" value={formData.weight === undefined ? '' : formData.weight} onChange={handleInputChange} placeholder="e.g., 500" />
              </div>
            </div>
           
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-1"><StickyNote className="w-4 h-4 text-muted-foreground" />Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} placeholder="e.g., From lunch, collected from park" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" /> Cancel Edit
                </Button>
            )}
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> {editingId ? 'Save Changes' : 'Log Item'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <section className="mt-8">
        <h3 className="text-2xl font-semibold font-headline mb-4 text-foreground">Waste Log History</h3>
        {wasteLog.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Your waste log is empty. Start logging items above!</p>
        ) : (
          <div className="space-y-3">
            {wasteLog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => {
              const ItemIcon = getCategoryIcon(item.category);
              return (
              <Card key={item.id} className={cn("shadow-sm hover:shadow-md transition-shadow", item.sourceType === 'business' ? 'border-primary/50' : '')}>
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                        <ItemIcon className="w-5 h-5 text-muted-foreground" />
                        <p className="font-semibold text-lg">{item.name}</p>
                    </div>
                     {item.sourceType === 'business' && item.businessName && (
                      <p className="text-xs text-primary font-medium flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {item.businessName}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()} - {item.category}
                      {item.weight !== undefined && ` - ${item.weight} grams`}
                    </p>
                    {item.notes && <p className="text-xs text-foreground/70 mt-1 italic">Notes: {item.notes}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0 self-start sm:self-center">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)} aria-label={`Edit ${item.name}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" aria-label={`Delete ${item.name}`}>
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the item "{item.name}" from your log.
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
  );
}

