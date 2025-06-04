
import { AppHeader } from '@/components/app/header';
import { PageContainer } from '@/components/app/page-container';
import { BottomNavigation } from '@/components/app/bottom-navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          {/* Adjust paddingBottom on mobile to account for the h-16 (4rem) bottom navigation bar */}
          {/* PageContainer has py-8 (pt-2rem, pb-2rem). Mobile pb should be 2rem + 4rem = 6rem (pb-24) */}
          <PageContainer className="pb-24 md:py-8 flex-grow"> {/* Added flex-grow */}
            {children}
          </PageContainer>
        </SidebarInset>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
}
