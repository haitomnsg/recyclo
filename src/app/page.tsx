
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Leaf } from 'lucide-react';

const ECOCYCLE_LOGGED_IN_KEY = 'ecoCycleLoggedIn';
// ONBOARDING_COMPLETE_KEY is no longer needed here as login page handles onboarding check.

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading EcoCycle...');

  useEffect(() => {
    const loggedIn = localStorage.getItem(ECOCYCLE_LOGGED_IN_KEY);

    if (loggedIn === 'true') {
      setMessage('Redirecting to your dashboard...');
      router.replace('/dashboard');
    } else {
      setMessage('Redirecting to login...');
      router.replace('/login');
    }
    
    // Keep loader for a bit for smoother transition
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {loading && (
        <>
          <Leaf className="h-16 w-16 text-primary mb-4" />
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-foreground">{message}</p>
        </>
      )}
      {/* Fallback content if redirection fails or for non-JS users, though unlikely with Next.js */}
      {!loading && (
         <div className="text-center">
            <Leaf className="h-16 w-16 text-primary mb-4 mx-auto" />
            <p className="text-lg text-foreground">Welcome to EcoCycle.</p>
            <p className="text-muted-foreground">Please enable JavaScript or wait for redirection.</p>
         </div>
      )}
    </div>
  );
}
