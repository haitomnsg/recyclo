'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const ONBOARDING_COMPLETE_KEY = 'ecoCycleOnboardingComplete';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem(ONBOARDING_COMPLETE_KEY);
    if (onboardingComplete === 'true') {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
    // Set loading to false after a short delay to ensure redirection logic runs
    // This is mostly for perceived performance, actual redirection happens quickly.
    const timer = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {loading && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-foreground">Loading EcoCycle...</p>
        </>
      )}
    </div>
  );
}
