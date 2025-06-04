
import Link from 'next/link';
import { Trash2, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      {/* Ensure container takes full width when sidebar is inset */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger /> {/* Will be hidden on desktop if sidebar is always open and not collapsible via trigger */}
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Trash2 className="w-7 h-7" />
            {/* Hide text title on very small screens if sidebar trigger and logo make it too crowded */}
            <h1 className="text-2xl font-bold font-headline hidden xs:block sm:block">Recyclo</h1>
          </Link>
        </div>
        <Button variant="outline" asChild>
          <Link href="/log">
            <ListPlus className="h-5 w-5 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Log Waste</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
