
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as UISidebar,
  SidebarHeader as UISidebarHeader,
  SidebarContent as UISidebarContent,
  SidebarMenu as UISidebarMenu,
  SidebarMenuItem as UISidebarMenuItem,
  SidebarMenuButton as UISidebarMenuButton,
} from '@/components/ui/sidebar';
import { Trash2, LayoutDashboard, ScanLine, MapPin, Brush, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/classify', label: 'Classify', Icon: ScanLine },
  { href: '/map', label: 'Map', Icon: MapPin },
  { href: '/waste-to-art', label: 'Art Ideas', Icon: Brush },
  { href: '/waste-shop', label: 'WasteShop', Icon: ShoppingBag },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <UISidebar
      collapsible="icon"
      className="border-r" // UISidebar handles its own display based on screen size via context
    >
      <UISidebarHeader className="p-2 flex items-center justify-center group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:px-0">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Trash2 className="w-7 h-7" />
          <span className={cn(
            "text-2xl font-bold font-headline",
            "group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden"
          )}>
            Recyclo
          </span>
        </Link>
      </UISidebarHeader>
      <UISidebarContent>
        <UISidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <UISidebarMenuItem key={item.label}>
                <UISidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={{children: item.label, side: 'right', align: 'center', className: "ml-2"}}
                  className="justify-start"
                  variant="default" // Ensure consistent styling
                  size="default" // Ensure consistent sizing
                >
                  <Link href={item.href}>
                    <item.Icon className="h-5 w-5" />
                    <span className={cn(
                        "group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden"
                      )}>
                      {item.label}
                    </span>
                  </Link>
                </UISidebarMenuButton>
              </UISidebarMenuItem>
            );
          })}
        </UISidebarMenu>
      </UISidebarContent>
    </UISidebar>
  );
}
