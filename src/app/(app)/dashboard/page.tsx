
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  MapPin,
  ShoppingBag,
  Brush,
  Trophy,
  Trash2,
  Sprout,
  Archive,
  AlertTriangle,
  CheckCircle,
  Package,
  Star,
  ShieldCheck,
  Rocket,
  BarChart3,
} from 'lucide-react';
import type { WasteItem, WasteListing, DirtySpot } from '@/lib/types';

const WASTE_LOG_KEY = 'ecoCycleWasteLog';
const DIRTY_SPOTS_KEY = 'ecoCycleDirtySpots';
const WASTE_LISTINGS_KEY = 'ecoCycleWasteListings';

interface EcoLevel {
  name: string;
  minScore: number;
  Icon: React.ElementType;
  color: string;
  targetScore: number;
}

const ecoLevels: EcoLevel[] = [
  { name: 'Eco Starter', minScore: 0, Icon: Star, color: 'text-yellow-500', targetScore: 100 },
  { name: 'Eco Contributor', minScore: 100, Icon: Sprout, color: 'text-lime-500', targetScore: 500 },
  { name: 'Eco Guardian', minScore: 500, Icon: ShieldCheck, color: 'text-green-500', targetScore: 1500 },
  { name: 'Eco Hero', minScore: 1500, Icon: Rocket, color: 'text-teal-500', targetScore: 5000 },
];

const getEcoLevel = (score: number): EcoLevel => {
  for (let i = ecoLevels.length - 1; i >= 0; i--) {
    if (score >= ecoLevels[i].minScore) {
      return ecoLevels[i];
    }
  }
  return ecoLevels[0]; 
};

interface MetricDetail {
  label: string;
  value: number;
  Icon: React.ElementType;
  colorClass: string; // Tailwind class for progress bar color
  progressMax: number;
}

export default function DashboardPage() {
  const [ecoScore, setEcoScore] = useState(0);
  const [currentEcoLevel, setCurrentEcoLevel] = useState<EcoLevel>(ecoLevels[0]);
  const [progressToNextLevel, setProgressToNextLevel] = useState(0);

  const [keyMetrics, setKeyMetrics] = useState<MetricDetail[]>([]);

  useEffect(() => {
    const loggedWasteString = localStorage.getItem(WASTE_LOG_KEY);
    const loggedWaste: WasteItem[] = loggedWasteString ? JSON.parse(loggedWasteString) : [];

    const dirtySpotsString = localStorage.getItem(DIRTY_SPOTS_KEY);
    const dirtySpots: DirtySpot[] = dirtySpotsString ? JSON.parse(dirtySpotsString) : [];
    
    // Note: WasteListings data is available if needed for other calculations, not directly used in the 4 key metrics
    // const listedWasteString = localStorage.getItem(WASTE_LISTINGS_KEY); 
    // const listedWaste: WasteListing[] = listedWasteString ? JSON.parse(listedWasteString) : [];

    const organicCount = loggedWaste.filter(item => item.category === 'Organic').length;
    const inorganicCount = loggedWaste.filter(item => item.category === 'Inorganic').length;
    const reportedCount = dirtySpots.filter(spot => spot.status === 'Dirty' || spot.status === 'Cleaned').length; // Total reported
    const cleanedCount = dirtySpots.filter(spot => spot.status === 'Cleaned').length;

    setKeyMetrics([
      { label: 'Organic Waste Logged', value: organicCount, Icon: Sprout, colorClass: '[&>div]:bg-green-500', progressMax: 50 },
      { label: 'Inorganic Waste Logged', value: inorganicCount, Icon: Archive, colorClass: '[&>div]:bg-blue-500', progressMax: 50 },
      { label: 'Dirty Spots Reported', value: reportedCount, Icon: AlertTriangle, colorClass: '[&>div]:bg-orange-500', progressMax: 10 },
      { label: 'Spots Cleaned', value: cleanedCount, Icon: CheckCircle, colorClass: '[&>div]:bg-teal-500', progressMax: 5 },
    ]);
    
    const currentScore = (organicCount * 1) + (inorganicCount * 1) + (reportedCount * 10) + (cleanedCount * 100);
    setEcoScore(currentScore);
    
    const level = getEcoLevel(currentScore);
    setCurrentEcoLevel(level);

    const nextLevelIndex = ecoLevels.findIndex(l => l.minScore > currentScore);
    let progress = 0;
    if (level.minScore === ecoLevels[ecoLevels.length -1].minScore) { 
        progress = 100;
    } else if (nextLevelIndex !== -1) {
        const nextLevel = ecoLevels[nextLevelIndex];
        const scoreInCurrentLevel = currentScore - level.minScore;
        const scoreNeededForNextLevel = nextLevel.minScore - level.minScore;
        progress = Math.min(100, Math.max(0, (scoreInCurrentLevel / scoreNeededForNextLevel) * 100));
    } else if (currentScore > 0) { 
        progress = 100;
    }
    setProgressToNextLevel(progress);

  }, []);

  const quickActions = [
    { href: '/classify', label: 'Classify Waste', Icon: Camera, description: 'Identify waste type with AI' },
    { href: '/map', label: 'View/Report Spots', Icon: MapPin, description: 'See & report dirty areas' },
    { href: '/waste-shop', label: 'WasteShop', Icon: ShoppingBag, description: 'Sell or donate items' },
    { href: '/waste-to-art', label: 'Waste-to-Art', Icon: Brush, description: 'Get creative reuse ideas' },
    { href: '/leaderboard', label: 'Leaderboard', Icon: Trophy, description: 'Check your eco-rank' },
  ];
  
  return (
    <div className="space-y-8">
      <section>
        <Card className="shadow-xl border-2 border-primary/30">
          <CardHeader className="items-center text-center pb-3">
            <currentEcoLevel.Icon className={`w-16 h-16 mb-2 ${currentEcoLevel.color}`} />
            <CardTitle className={`text-3xl font-headline ${currentEcoLevel.color}`}>{currentEcoLevel.name}</CardTitle>
            <CardDescription className="text-foreground/80">Your current ecological standing.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <div className="text-5xl font-bold text-foreground">{ecoScore}</div>
            <p className="text-sm text-muted-foreground">Eco Score Points</p>
            <Progress value={progressToNextLevel} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-primary" />
             <p className="text-xs text-muted-foreground">
              {currentEcoLevel.minScore === ecoLevels[ecoLevels.length-1].minScore 
                ? "You've reached the highest level!" 
                : `${ecoLevels[ecoLevels.findIndex(l => l.minScore > ecoScore)]?.minScore - ecoScore || '...'} points to ${ecoLevels[ecoLevels.findIndex(l => l.minScore > ecoScore)]?.name || 'the next level'}`
              }
            </p>
          </CardContent>
          <CardFooter className="pt-3 justify-center">
            <Button variant="link" asChild>
                <Link href="/leaderboard" className="text-sm">View Leaderboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-headline text-primary">
              <BarChart3 className="w-6 h-6" />
              Key Impact Metrics
            </CardTitle>
            <CardDescription>A quick overview of your contributions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyMetrics.map(metric => (
              <div key={metric.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <metric.Icon className={`w-4 h-4 ${metric.colorClass.replace('[&>div]:bg-', 'text-')}`} /> 
                    <span>{metric.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{metric.value}</span>
                </div>
                <Progress 
                    value={(metric.value / metric.progressMax) * 100} 
                    className={`h-2.5 ${metric.colorClass}`} 
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link href={action.href} key={action.label} legacyBehavior>
              <a className="block group">
                <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col ring-1 ring-border hover:ring-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-center mb-3">
                       <div className="p-3 bg-primary/10 rounded-full">
                          <action.Icon className="h-7 w-7 text-primary" />
                       </div>
                    </div>
                    <CardTitle className="text-lg font-semibold font-headline text-center">{action.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <p className="text-sm text-muted-foreground text-center">{action.description}</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </section>
      
      <div className="text-center mt-8">
        <Button variant="link" asChild>
          <Link href="/onboarding" className="text-primary hover:underline">
            Revisit Onboarding Tips
          </Link>
        </Button>
      </div>
    </div>
  );
}
