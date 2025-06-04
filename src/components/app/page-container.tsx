
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  // Changed from main to div to avoid nested main tags when used with SidebarInset
  return (
    <div className={cn("container mx-auto px-4 py-8 max-w-3xl", className)}>
      {children}
    </div>
  );
}
