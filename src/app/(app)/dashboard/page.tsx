
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  ListPlus,
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
  targetScore: number; // Score needed to reach this level or, for the highest, a symbolic max
}

const ecoLevels: EcoLevel[] = [
  { name: 'Eco Starter', minScore: 0, Icon: Star, color: 'text-yellow-500', targetScore: 100 },
  { name: 'Eco Contributor', minScore: 100, Icon: Sprout, color: 'text-lime-500', targetScore: 500 },
  { name: 'Eco Guardian', minScore: 500, Icon: ShieldCheck, color: 'text-green-500', targetScore: 1500 },
  { name: 'Eco Hero', minScore: 1500, Icon: Rocket, color: 'text-teal-500', targetScore: 5000 }, // Target can be conceptual for the highest level
];

const getEcoLevel = (score: number): EcoLevel => {
  for (let i = ecoLevels.length - 1; i >= 0; i--) {
    if (score >= ecoLevels[i].minScore) {
      return ecoLevels[i];
    }
  }
  return ecoLevels[0]; // Default to starter
};

export default function DashboardPage() {
  const [ecoScore, setEcoScore] = useState(0);
  const [currentEcoLevel, setCurrentEcoLevel] = useState<EcoLevel>(ecoLevels[0]);
  const [progressToNextLevel, setProgressToNextLevel] = useState(0);

  const [impactStats, setImpactStats] = useState({
    totalWasteLogged: 0,
    organicLogged: 0,
    inorganicLogged: 0,
    dirtySpotsReported: 0,
    spotsCleaned: 0,
    itemsInWasteShop: 0,
  });

  useEffect(() => {
    const loggedWasteString = localStorage.getItem(WASTE_LOG_KEY);
    const loggedWaste: WasteItem[] = loggedWasteString ? JSON.parse(loggedWasteString) : [];

    const dirtySpotsString = localStorage.getItem(DIRTY_SPOTS_KEY);
    const dirtySpots: DirtySpot[] = dirtySpotsString ? JSON.parse(dirtySpotsString) : [];

    const listedWasteString = localStorage.getItem(WASTE_LISTINGS_KEY);
    const listedWaste: WasteListing[] = listedWasteString ? JSON.parse(listedWasteString) : [];

    const organicCount = loggedWaste.filter(item => item.category === 'Organic').length;
    const inorganicCount = loggedWaste.filter(item => item.category === 'Inorganic').length;
    const reportedCount = dirtySpots.length;
    const cleanedCount = dirtySpots.filter(spot => spot.status === 'Cleaned').length;

    setImpactStats({
      totalWasteLogged: loggedWaste.length,
      organicLogged: organicCount,
      inorganicLogged: inorganicCount,
      dirtySpotsReported: reportedCount,
      spotsCleaned: cleanedCount,
      itemsInWasteShop: listedWaste.length,
    });

    const currentScore = (loggedWaste.length * 1) + (reportedCount * 10) + (cleanedCount * 100);
    setEcoScore(currentScore);
    
    const level = getEcoLevel(currentScore);
    setCurrentEcoLevel(level);

    const nextLevelIndex = ecoLevels.findIndex(l => l.minScore > currentScore);
    let progress = 0;
    if (level.minScore === ecoLevels[ecoLevels.length -1].minScore) { // Highest level
        progress = 100;
    } else if (nextLevelIndex !== -1) {
        const nextLevel = ecoLevels[nextLevelIndex];
        const scoreInCurrentLevel = currentScore - level.minScore;
        const scoreNeededForNextLevel = nextLevel.minScore - level.minScore;
        progress = Math.min(100, Math.max(0, (scoreInCurrentLevel / scoreNeededForNextLevel) * 100));
    } else if (currentScore > 0) { // Should not happen if levels are defined correctly, but as a fallback
        progress = 100;
    }
    setProgressToNextLevel(progress);

  }, []);

  const quickActions = [
    { href: '/classify', label: 'Classify Waste', Icon: Camera, description: 'Identify waste type with AI' },
    // Log Waste is now in header, can be removed or kept for redundancy
    // { href: '/log', label: 'Log Your Waste', Icon: ListPlus, description: 'Record your daily waste' }, 
    { href: '/map', label: 'View/Report Spots', Icon: MapPin, description: 'See & report dirty areas' },
    { href: '/waste-shop', label: 'WasteShop', Icon: ShoppingBag, description: 'Sell or donate items' },
    { href: '/waste-to-art', label: 'Waste-to-Art', Icon: Brush, description: 'Get creative reuse ideas' },
    { href: '/leaderboard', label: 'Leaderboard', Icon: Trophy, description: 'Check your eco-rank' },
  ];

  const statsCards = [
    { label: 'Total Items Logged', value: impactStats.totalWasteLogged, Icon: Trash2, color: 'text-primary' },
    { label: 'Organic Items Logged', value: impactStats.organicLogged, Icon: Sprout, color: 'text-green-600' },
    { label: 'Inorganic Items Logged', value: impactStats.inorganicLogged, Icon: Archive, color: 'text-blue-600' },
    { label: 'Dirty Spots Reported', value: impactStats.dirtySpotsReported, Icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Spots Cleaned by Community', value: impactStats.spotsCleaned, Icon: CheckCircle, color: 'text-teal-500' },
    { label: 'Items in WasteShop', value: impactStats.itemsInWasteShop, Icon: Package, color: 'text-purple-500' },
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

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 text-foreground">Your Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {statsCards.map(stat => (
            <Card key={stat.label} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
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
