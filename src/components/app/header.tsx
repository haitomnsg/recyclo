
import Link from 'next/link';
import { Trash2, ListPlus } from 'lucide-react'; // Changed Leaf to Trash2
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-3xl">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Trash2 className="w-7 h-7" /> {/* Changed Icon */}
          <h1 className="text-2xl font-bold font-headline">Recyclo</h1> {/* Updated App Name */}
        </Link>
        <Button variant="outline" asChild>
          <Link href="/log">
            <ListPlus className="h-5 w-5 mr-2" />
            Log Waste
          </Link>
        </Button>
      </div>
    </header>
  );
}
