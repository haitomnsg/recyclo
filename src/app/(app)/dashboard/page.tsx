
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ListPlus,
  Leaf,
  Recycle as RecycleIcon,
} from 'lucide-react';
import type { WasteItem, WasteListing, DirtySpot, WasteCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  colorClass: string; 
  progressMax: number;
}

const categoryIconsSmall: Record<WasteListing['category'], React.ElementType> = {
  Organic: Leaf,
  Inorganic: Archive,
  Recyclable: RecycleIcon,
  Hazardous: AlertTriangle,
  Other: Package,
};

export default function DashboardPage() {
  const [ecoScore, setEcoScore] = useState(0);
  const [currentEcoLevel, setCurrentEcoLevel] = useState<EcoLevel>(ecoLevels[0]);
  const [progressToNextLevel, setProgressToNextLevel] = useState(0);
  const [keyMetrics, setKeyMetrics] = useState<MetricDetail[]>([]);
  const [recentListings, setRecentListings] = useState<WasteListing[]>([]);

  useEffect(() => {
    const loggedWasteString = localStorage.getItem(WASTE_LOG_KEY);
    const loggedWaste: WasteItem[] = loggedWasteString ? JSON.parse(loggedWasteString) : [];

    const dirtySpotsString = localStorage.getItem(DIRTY_SPOTS_KEY);
    const dirtySpots: DirtySpot[] = dirtySpotsString ? JSON.parse(dirtySpotsString) : [];
    
    const listedWasteString = localStorage.getItem(WASTE_LISTINGS_KEY); 
    const listedWaste: WasteListing[] = listedWasteString ? JSON.parse(listedWasteString) : [];
    setRecentListings(listedWaste.slice(0, 3));

    const organicWasteCount = loggedWaste.filter(item => item.category === 'Organic').length;
    const inorganicWasteCount = loggedWaste.filter(item => item.category === 'Inorganic').length;

    const reportedCount = dirtySpots.filter(spot => spot.status === 'Dirty' || spot.status === 'Cleaned').length; 
    const cleanedCount = dirtySpots.filter(spot => spot.status === 'Cleaned').length;
    const wasteShopItemsCount = listedWaste.length;

    setKeyMetrics([
      { label: 'Organic Waste Logged', value: organicWasteCount, Icon: Sprout, colorClass: '[&>div]:bg-green-500', progressMax: 50 },
      { label: 'Inorganic Waste Logged', value: inorganicWasteCount, Icon: Archive, colorClass: '[&>div]:bg-blue-500', progressMax: 50 },
      { label: 'Dirty Spots Reported', value: reportedCount, Icon: AlertTriangle, colorClass: '[&>div]:bg-orange-500', progressMax: 10 },
      { label: 'Dirty Spots Cleaned', value: cleanedCount, Icon: CheckCircle, colorClass: '[&>div]:bg-teal-500', progressMax: 5 },
      { label: 'WasteShop Items Listed', value: wasteShopItemsCount, Icon: ShoppingBag, colorClass: '[&>div]:bg-pink-500', progressMax: 20 },
    ]);
    
    const currentScore = (organicWasteCount * 1) + (inorganicWasteCount * 1) + (reportedCount * 10) + (cleanedCount * 100) + (wasteShopItemsCount * 5);
    setEcoScore(currentScore);
    
    const level = getEcoLevel(currentScore);
    setCurrentEcoLevel(level);

    const nextLevelDetails = ecoLevels.find(l => l.minScore > currentScore);
    let progress = 0;
    if (level.minScore === ecoLevels[ecoLevels.length - 1].minScore) { 
        progress = 100; 
    } else if (nextLevelDetails) {
        const scoreInCurrentLevelSpan = currentScore - level.minScore;
        const scoreNeededForNextLevelSpan = nextLevelDetails.minScore - level.minScore;
        progress = scoreNeededForNextLevelSpan > 0 ? Math.min(100, Math.max(0, (scoreInCurrentLevelSpan / scoreNeededForNextLevelSpan) * 100)) : 100;
    } else { 
        progress = (currentScore / level.targetScore) * 100; 
        if (currentScore >= level.targetScore) progress = 100;
    }
    setProgressToNextLevel(Math.floor(progress));

  }, []);

  const quickActions = [
    { href: '/classify', label: 'Classify Waste', Icon: Camera, description: 'Identify waste type with AI' },
    { href: '/map', label: 'View/Report Spots', Icon: MapPin, description: 'See & report dirty areas' },
    { href: '/waste-shop', label: 'WasteShop', Icon: ShoppingBag, description: 'Sell or donate items' },
    { href: '/waste-to-art', label: 'Waste-to-Art', Icon: Brush, description: 'Get creative reuse ideas' },
    { href: '/leaderboard', label: 'Leaderboard', Icon: Trophy, description: 'Check your eco-rank' },
  ];

  const nextEcoLevel = ecoLevels.find(l => l.minScore > ecoScore);
  const pointsToNextLevelText = () => {
    if (currentEcoLevel.minScore === ecoLevels[ecoLevels.length - 1].minScore) {
      return "You've reached the highest level!";
    }
    if (nextEcoLevel) {
      const pointsNeeded = Math.max(0, nextEcoLevel.minScore - ecoScore);
      return `${pointsNeeded} points to ${nextEcoLevel.name}`;
    }
    return `Progressing in ${currentEcoLevel.name}`;
  };
  
  return (
    <div className="space-y-8">
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
                    value={metric.progressMax > 0 ? (metric.value / metric.progressMax) * 100 : 0} 
                    className={`h-2.5 ${metric.colorClass}`} 
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-lg border-2 border-primary/20">
          <CardContent className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <currentEcoLevel.Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${currentEcoLevel.color}`} />
            </div>
            <div className="flex-grow space-y-1">
              <div>
                <p className="text-xs text-muted-foreground">Eco Level</p>
                <p className={`text-lg font-semibold ${currentEcoLevel.color}`}>{currentEcoLevel.name}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{ecoScore} pts</p>
              <div className="w-full">
                <Progress value={progressToNextLevel} className="h-2 sm:h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-primary" />
                <p className="text-xs text-muted-foreground mt-1">
                  {pointsToNextLevelText()}
                </p>
              </div>
               <Button variant="link" asChild className="p-0 h-auto text-xs text-primary hover:underline mt-1">
                  <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
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
      
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold font-headline text-foreground">Your Latest WasteShop Listings</h2>
            {recentListings.length > 0 && (
                <Button variant="link" asChild>
                    <Link href="/waste-shop">View All</Link>
                </Button>
            )}
        </div>
        {recentListings.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">You haven't listed any items in the WasteShop yet.</p>
              <Button asChild>
                <Link href="/waste-shop#listWaste">List an Item Now</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentListings.map(item => {
              const IconComponent = categoryIconsSmall[item.category] || Package;
              return (
                <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                  {item.photoDataUrl && (
                    <div className="relative w-full h-32">
                      <Image src={item.photoDataUrl} alt={item.description.substring(0,30)} layout="fill" objectFit="cover" className="rounded-t-lg" />
                    </div>
                  )}
                  <CardHeader className="p-3 pb-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconComponent className="w-4 h-4" />
                      <span>{item.category}</span>
                    </div>
                    <CardTitle className="text-base font-semibold line-clamp-2 leading-tight mt-1">
                      {item.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 flex-grow">
                    <p className="text-xs text-muted-foreground">
                      {item.estimatedWeight ? `Approx. ${item.estimatedWeight} kg • ` : ''}
                      Contact: {item.contactMethod.substring(0, 20)}{item.contactMethod.length > 20 ? '...' : ''}
                    </p>
                  </CardContent>
                  <CardFooter className="p-3 border-t">
                     <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/waste-shop#listing-${item.id}`}>View Details</Link> 
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
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
