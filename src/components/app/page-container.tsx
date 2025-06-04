
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  // Root element remains div, as it was before the sidebar to avoid nested mains
  // Main functionality is handled by ensuring correct padding for bottom nav
  return (
    <div className={cn("container mx-auto px-4 py-8 max-w-3xl", className)}>
      {children}
    </div>
  );
}
