
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScanLine, ShoppingBag, Brush, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/classify', label: 'Classify', Icon: ScanLine },
  { href: '/map', label: 'Map', Icon: MapPin },
  { href: '/waste-to-art', label: 'Art Ideas', Icon: Brush },
  { href: '/waste-shop', label: 'WasteShop', Icon: ShoppingBag },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-full max-w-3xl mx-auto px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link href={item.href} key={item.label} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center text-center p-1 rounded-md transition-colors w-1/5 h-full', // Adjusted for 5 items
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.Icon className={cn('w-5 h-5 mb-0.5')} />
                <span className={cn('text-xs', isActive ? 'font-semibold' : 'font-normal')}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
