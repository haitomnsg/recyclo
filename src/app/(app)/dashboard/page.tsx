
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  MapPin,
  ShoppingBag,
  Brush,
  Trophy,
  Sprout,
  Archive,
  AlertTriangle,
  CheckCircle,
  Package,
  Star,
  ShieldCheck,
  Rocket,
  Leaf,
  Recycle as RecycleIcon,
  Diamond,
  ShoppingCart,
  Eye,
  Mail,
  Phone,
  HandCoins,
  LogOut,
} from 'lucide-react';
import type { WasteItem, WasteListing, DirtySpot, WasteCategory, ThriftItem, ThriftItemCategory, WasteListingCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { sampleThriftItems, thriftCategoryIcons, allThriftCategoryValue } from '@/data/thrift-items';


const WASTE_LOG_KEY = 'ecoCycleWasteLog';
const DIRTY_SPOTS_KEY = 'ecoCycleDirtySpots';
const WASTE_LISTINGS_KEY = 'ecoCycleWasteListings';
const ECOCYCLE_LOGGED_IN_KEY = 'ecoCycleLoggedIn';

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

const userListingCategoryIcons: Record<WasteListingCategory, React.ElementType> = {
  Organic: HandCoins,
  Inorganic: Package,
  Recyclable: RecycleIcon,
  Hazardous: AlertTriangle,
  Other: Package,
};


export default function DashboardPage() {
  const [ecoScore, setEcoScore] = useState(0);
  const [currentEcoLevel, setCurrentEcoLevel] = useState<EcoLevel>(ecoLevels[0]);
  const [progressToNextLevel, setProgressToNextLevel] = useState(0);
  const [keyMetrics, setKeyMetrics] = useState<MetricDetail[]>([]);
  const [featuredThriftItems, setFeaturedThriftItems] = useState<ThriftItem[]>([]);
  const [featuredUserListings, setFeaturedUserListings] = useState<WasteListing[]>([]);
  const router = useRouter();


  useEffect(() => {
    const loggedWasteString = localStorage.getItem(WASTE_LOG_KEY);
    const loggedWaste: WasteItem[] = loggedWasteString ? JSON.parse(loggedWasteString) : [];

    const dirtySpotsString = localStorage.getItem(DIRTY_SPOTS_KEY);
    const dirtySpots: DirtySpot[] = dirtySpotsString ? JSON.parse(dirtySpotsString) : [];
    
    const listedWasteString = localStorage.getItem(WASTE_LISTINGS_KEY); // For Eco Score
    const listedWaste: WasteListing[] = listedWasteString ? JSON.parse(listedWasteString) : [];

    const userListingsString = localStorage.getItem(WASTE_LISTINGS_KEY); // For displaying user listings
    const userListings: WasteListing[] = userListingsString ? JSON.parse(userListingsString) : [];
    setFeaturedUserListings(userListings.slice(0, 2)); // Show first 2 user listings

    setFeaturedThriftItems(sampleThriftItems.slice(0, 3));

    const organicWasteCount = loggedWaste.filter(item => item.category === 'Organic').length;
    const inorganicWasteCount = loggedWaste.filter(item => item.category === 'Inorganic').length;

    const reportedCount = dirtySpots.filter(spot => spot.status === 'Dirty' || spot.status === 'Cleaned').length;
    const cleanedCount = dirtySpots.filter(spot => spot.status === 'Cleaned').length;
    const wasteShopItemsCount = listedWaste.length; // Count all user listed items for score

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
    { href: '/waste-to-art', label: 'Waste-to-Art', Icon: Brush, description: 'Get creative reuse ideas' },
    { href: '/waste-shop#listWaste', label: 'List Your Waste', Icon: ShoppingBag, description: 'Offer items for exchange' },
    { href: '/waste-shop#thriftShop', label: 'Thrift Store', Icon: Diamond, description: 'Browse upcycled items' },
    { href: '/map', label: 'View/Report Spots', Icon: MapPin, description: 'See & report dirty areas' },
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

  const handleLogout = () => {
    localStorage.removeItem(ECOCYCLE_LOGGED_IN_KEY);
    router.replace('/login');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold font-headline text-foreground">Key Impact</h2>
      <Card className="shadow-lg">
        <CardContent className="space-y-4 pt-6">
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

      <h2 className="text-2xl font-semibold font-headline text-foreground">Eco Level</h2>
      <Card className="shadow-lg border-2 border-primary/20">
        <CardContent className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <currentEcoLevel.Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${currentEcoLevel.color}`} />
          </div>
          <div className="flex-grow space-y-1">
            <p className={`text-lg font-semibold ${currentEcoLevel.color}`}>{currentEcoLevel.name}</p>
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

      <h2 className="text-2xl font-semibold font-headline text-foreground">Quick Actions</h2>
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

      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold font-headline text-foreground">Featured Thrift Items</h2>
            {featuredThriftItems.length > 0 && (
                <Button variant="link" asChild>
                    <Link href="/waste-shop#thriftShop">View All Thrift Items</Link>
                </Button>
            )}
        </div>
        {featuredThriftItems.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <Diamond className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No thrift items available at the moment.</p>
              <Button asChild>
                <Link href="/waste-shop#thriftShop">Explore Thrift Shop</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuredThriftItems.map(item => {
              const IconComp = thriftCategoryIcons[item.category as ThriftItemCategory] || Package;
              return (
                <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
                  <div className="relative w-full h-40 bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill // Use fill instead of layout="fill" and objectFit="cover" for Next 13+
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="rounded-t-lg"
                      data-ai-hint={item.imageHint}
                    />
                  </div>
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base font-semibold line-clamp-2 leading-tight mt-0.5">
                        {item.name}
                      </CardTitle>
                      <Badge variant="secondary" className="whitespace-nowrap flex items-center gap-1 text-xs">
                        <IconComp className="w-3 h-3" /> {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 flex-grow">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{item.description}</p>
                    <p className="text-lg font-bold text-primary">Rs. {item.price.toLocaleString()}</p>
                  </CardContent>
                  <CardFooter className="p-3 border-t flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" /> View Product
                    </Button>
                      <Button variant="default" size="sm" className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Buy Product
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold font-headline text-foreground">Your Recent WasteShop Items</h2>
          {featuredUserListings.length > 0 && (
            <Button variant="link" asChild>
              <Link href="/waste-shop#listWaste">View All Your Listings</Link>
            </Button>
          )}
        </div>
        {featuredUserListings.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">You haven't listed any items for exchange yet.</p>
              <Button asChild>
                <Link href="/waste-shop#listWaste">List an Item Now</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredUserListings.map(item => {
              const IconComp = userListingCategoryIcons[item.category as WasteListingCategory] || Package;
              return (
                <Card key={item.id} id={`listing-${item.id}`} className="shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
                  {item.photoDataUrl && (
                    <div className="relative w-full h-32 bg-muted">
                      <Image
                        src={item.photoDataUrl}
                        alt={item.description.substring(0,30)}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-sm font-semibold line-clamp-1 leading-tight mt-0.5 flex items-center">
                          <IconComp className="w-4 h-4 mr-2 flex-shrink-0" /> {item.category}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">{new Date(item.dateListed).toLocaleDateString()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 flex-grow">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{item.description}</p>
                      <p className="text-xs font-medium text-primary flex items-center gap-1">
                        {item.contactMethod.includes('@') ? <Mail className="w-3 h-3" /> : (item.contactMethod.match(/\d/) ? <Phone className="w-3 h-3" /> : <MapPin className="w-3 h-3" />)}
                        {item.contactMethod}
                    </p>
                  </CardContent>
                  <CardFooter className="p-3 border-t">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/waste-shop#listing-${item.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Listing
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <div className="text-center mt-8 space-y-2">
        <Button variant="link" asChild>
          <Link href="/onboarding" className="text-primary hover:underline">
            Revisit Onboarding Tips
          </Link>
        </Button>
        <Button variant="link" onClick={handleLogout} className="text-destructive hover:underline">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
