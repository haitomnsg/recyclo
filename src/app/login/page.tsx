
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock, LogInIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ECOCYCLE_LOGGED_IN_KEY = 'ecoCycleLoggedIn';
const ONBOARDING_COMPLETE_KEY = 'ecoCycleOnboardingComplete';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem(ECOCYCLE_LOGGED_IN_KEY) === 'true') {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      setIsLoading(false);
      return;
    }

    // Simulate login
    localStorage.setItem(ECOCYCLE_LOGGED_IN_KEY, 'true');
    toast({
      title: "Login Successful",
      description: "Welcome to EcoCycle!",
    });

    const onboardingComplete = localStorage.getItem(ONBOARDING_COMPLETE_KEY);
    if (onboardingComplete === 'true') {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center justify-center mb-2">
            <Leaf className="w-16 h-16 text-primary mb-3" />
            <CardTitle className="text-3xl font-headline text-primary">Welcome to EcoCycle</CardTitle>
          </div>
          <CardDescription className="text-foreground/80">
            Log in to manage your waste and contribute to a greener Nepal.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-foreground/90">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter any email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input/50 focus:bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center text-foreground/90">
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input/50 focus:bg-input"
              />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LogInIcon className="mr-2 h-5 w-5 animate-pulse" /> Logging in...
                </>
              ) : (
                <>
                  <LogInIcon className="mr-2 h-5 w-5" /> Log In
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Making waste management simple and effective.
      </p>
    </div>
  );
}
