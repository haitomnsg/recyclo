import { AppHeader } from '@/components/app/header';
import { PageContainer } from '@/components/app/page-container';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <PageContainer>{children}</PageContainer>
    </>
  );
}
