import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-3xl">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Leaf className="w-7 h-7" />
          <h1 className="text-2xl font-bold font-headline">EcoCycle</h1>
        </Link>
      </div>
    </header>
  );
}
