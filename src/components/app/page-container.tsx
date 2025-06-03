import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn("flex-grow container mx-auto px-4 py-8 max-w-3xl", className)}>
      {children}
    </main>
  );
}
