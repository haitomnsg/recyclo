'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { onboardingCardsContent } from '@/data/onboarding-data';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { PageContainer } from '@/components/app/page-container';

const ONBOARDING_COMPLETE_KEY = 'ecoCycleOnboardingComplete';

export default function OnboardingPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const router = useRouter();

  const totalCards = onboardingCardsContent.length;
  const card = onboardingCardsContent[currentCardIndex];

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    router.push('/dashboard');
  };

  const progressValue = ((currentCardIndex + 1) / totalCards) * 100;

  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-screen py-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            {card.Icon && <card.Icon className="w-8 h-8 mr-2 text-primary" />}
            <CardTitle className="text-2xl font-headline">{card.title}</CardTitle>
          </div>
          <Progress value={progressValue} className="w-full h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full h-48 rounded-md overflow-hidden">
            <Image
              src={card.imageSrc}
              alt={card.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={card.imageHint}
            />
          </div>
          <CardDescription className="text-center text-foreground/80 text-base leading-relaxed">
            {card.text}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            aria-label="Previous tip"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentCardIndex < totalCards - 1 ? (
            <Button onClick={handleNext} aria-label="Next tip">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Finish onboarding">
              Finish <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
