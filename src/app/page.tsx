
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react'; // Changed Leaf to Trash2

const ECOCYCLE_LOGGED_IN_KEY = 'ecoCycleLoggedIn';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading Recyclo...'); // Updated app name

  useEffect(() => {
    const loggedIn = localStorage.getItem(ECOCYCLE_LOGGED_IN_KEY);

    if (loggedIn === 'true') {
      setMessage('Redirecting to your dashboard...');
      router.replace('/dashboard');
    } else {
      setMessage('Redirecting to login...');
      router.replace('/login');
    }
    
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {loading && (
        <>
          <Trash2 className="h-16 w-16 text-primary mb-4" /> {/* Changed Icon */}
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-foreground">{message}</p>
        </>
      )}
      {!loading && (
         <div className="text-center">
            <Trash2 className="h-16 w-16 text-primary mb-4 mx-auto" /> {/* Changed Icon */}
            <p className="text-lg text-foreground">Welcome to Recyclo.</p> {/* Updated app name */}
            <p className="text-muted-foreground">Please enable JavaScript or wait for redirection.</p>
         </div>
      )}
    </div>
  );
}
