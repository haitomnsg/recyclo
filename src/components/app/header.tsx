
import Link from 'next/link';
import { Trash2, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Trash2 className="w-7 h-7" />
            <h1 className="text-2xl font-bold font-headline block">Recyclo</h1>
          </Link>
        </div>
        <Button variant="outline" asChild>
          <Link href="/log">
            <ListPlus className="h-5 w-5 mr-2" />
            <span className="inline">Log Waste</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
