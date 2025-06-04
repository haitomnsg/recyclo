
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
  BarChart2,
  Package,
} from 'lucide-react';
import type { WasteItem, WasteListing, DirtySpot } from '@/lib/types';

const WASTE_LOG_KEY = 'ecoCycleWasteLog';
const DIRTY_SPOTS_KEY = 'ecoCycleDirtySpots';
const WASTE_LISTINGS_KEY = 'ecoCycleWasteListings';

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export default function DashboardPage() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
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
    const cleanedCount = dirtySpots.filter(spot => spot.status === 'Cleaned').length;

    setImpactStats({
      totalWasteLogged: loggedWaste.length,
      organicLogged: organicCount,
      inorganicLogged: inorganicCount,
      dirtySpotsReported: dirtySpots.length,
      spotsCleaned: cleanedCount,
      itemsInWasteShop: listedWaste.length,
    });

    setChartData([
      { name: 'Organic Logged', value: organicCount, fill: 'hsl(var(--chart-1))' },
      { name: 'Inorganic Logged', value: inorganicCount, fill: 'hsl(var(--chart-2))' },
      { name: 'Spots Reported', value: dirtySpots.length, fill: 'hsl(var(--chart-3))' },
      { name: 'Spots Cleaned', value: cleanedCount, fill: 'hsl(var(--chart-4))' },
    ]);
  }, []);

  const quickActions = [
    { href: '/classify', label: 'Classify Waste', Icon: Camera, description: 'Identify waste type with AI' },
    { href: '/log', label: 'Log Your Waste', Icon: ListPlus, description: 'Record your daily waste' },
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

  const chartConfig = {
    value: { label: 'Count' },
    // Colors are directly in chartData's fill property
  };
  

  return (
    <div className="space-y-8">
      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-foreground flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-primary" />
              Activity Overview
            </CardTitle>
             <CardDescription>A summary of your eco-actions and community impact.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <RechartsBarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  layout="horizontal"
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0,12) + "..." : value }
                    angle={-10}
                    textAnchor="end"
                    height={50} 
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No activity data yet. Start logging!
              </div>
            )}
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
