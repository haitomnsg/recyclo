
import { AppHeader } from '@/components/app/header';
import { PageContainer } from '@/components/app/page-container';
import { BottomNavigation } from '@/components/app/bottom-navigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      {/* Restore original PageContainer padding behavior before sidebar */}
      <PageContainer className="flex-grow pb-24 md:py-8">
        {children}
      </PageContainer>
      <BottomNavigation />
    </div>
  );
}
