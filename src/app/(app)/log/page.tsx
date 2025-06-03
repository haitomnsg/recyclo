'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { WasteItem } from '@/lib/types';
import { ListPlus, Trash2, Edit3, Leaf, Archive, CalendarDays, Weight, StickyNote, Save, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const WASTE_LOG_KEY = 'ecoCycleWasteLog';
const PREFILL_KEY = 'prefillWasteLog';

const initialFormState: Omit<WasteItem, 'id' | 'date'> & { date: string } = {
  name: '',
  category: 'Organic',
  date: new Date().toISOString().split('T')[0], // Default to today
  weight: undefined,
  notes: '',
};

export default function LogPage() {
  const [wasteLog, setWasteLog] = useState<WasteItem[]>([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedLog = localStorage.getItem(WASTE_LOG_KEY);
    if (storedLog) {
      setWasteLog(JSON.parse(storedLog));
    }

    const prefillDataString = localStorage.getItem(PREFILL_KEY);
    if (prefillDataString) {
      const prefillData = JSON.parse(prefillDataString);
      setFormData(prev => ({
        ...prev,
        name: prefillData.name || '',
        category: prefillData.category || 'Organic',
      }));
      localStorage.removeItem(PREFILL_KEY); // Clear after use
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'weight' ? (value ? parseFloat(value) : undefined) : value }));
  };

  const handleCategoryChange = (value: 'Organic' | 'Inorganic') => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please enter item name and date." });
        return;
    }

    let updatedLog;
    if (editingId) {
      updatedLog = wasteLog.map(item => item.id === editingId ? { ...formData, id: editingId, date: new Date(formData.date).toISOString() } : item);
      toast({ title: "Item Updated", description: `"${formData.name}" has been updated.` });
    } else {
      const newItem: WasteItem = { ...formData, id: Date.now().toString(), date: new Date(formData.date).toISOString() };
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
    setFormData({
        name: item.name,
        category: item.category,
        date: item.date.split('T')[0], // Format for date input
        weight: item.weight,
        notes: item.notes,
    });
  };

  const handleDelete = (id: string) => {
    const updatedLog = wasteLog.filter(item => item.id !== id);
    setWasteLog(updatedLog);
    localStorage.setItem(WASTE_LOG_KEY, JSON.stringify(updatedLog));
    toast({ title: "Item Deleted", description: "The item has been removed from your log." });
    if (editingId === id) { // If deleting the item being edited
      setFormData(initialFormState);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">
        {editingId ? 'Edit Waste Item' : 'Log Your Waste'}
      </h2>
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
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1"><StickyNote className="w-4 h-4 text-muted-foreground" />Item Name*</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Banana Peels, Plastic Bottle" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-1"><Archive className="w-4 h-4 text-muted-foreground" />Category*</Label>
                <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Organic">
                      <span className="flex items-center"><Leaf className="w-4 h-4 mr-2 text-green-600" />Organic</span>
                    </SelectItem>
                    <SelectItem value="Inorganic">
                      <span className="flex items-center"><Archive className="w-4 h-4 mr-2 text-blue-600" />Inorganic</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-muted-foreground" />Date*</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-1"><Weight className="w-4 h-4 text-muted-foreground" />Weight (kg, optional)</Label>
              <Input id="weight" name="weight" type="number" step="0.01" value={formData.weight || ''} onChange={handleInputChange} placeholder="e.g., 0.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-1"><StickyNote className="w-4 h-4 text-muted-foreground" />Notes (optional)</Label>
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
            {wasteLog.map(item => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                        {item.category === 'Organic' ? <Leaf className="w-5 h-5 text-green-600" /> : <Archive className="w-5 h-5 text-blue-600" />}
                        <p className="font-semibold text-lg">{item.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()} - {item.category}
                      {item.weight && ` - ${item.weight} kg`}
                    </p>
                    {item.notes && <p className="text-xs text-foreground/70 mt-1 italic">Notes: {item.notes}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
