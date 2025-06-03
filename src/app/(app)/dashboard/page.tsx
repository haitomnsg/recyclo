
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Camera, ListPlus, ShoppingBag, Trash2, Recycle, Sprout } from 'lucide-react';
import type { WasteItem, WasteListing } from '@/lib/types';

const WASTE_LOG_KEY = 'ecoCycleWasteLog';
const WASTE_LISTINGS_KEY = 'ecoCycleWasteListings';

export default function DashboardPage() {
  const [totalWasteLogged, setTotalWasteLogged] = useState(0);
  const [totalComposted, setTotalComposted] = useState(0);
  const [totalSold, setTotalSold] = useState(0); // Represented by active listings

  useEffect(() => {
    const loggedWasteString = localStorage.getItem(WASTE_LOG_KEY);
    if (loggedWasteString) {
      const loggedWaste: WasteItem[] = JSON.parse(loggedWasteString);
      setTotalWasteLogged(loggedWaste.length);
      setTotalComposted(loggedWaste.filter(item => item.category === 'Organic').length);
    }

    const listedWasteString = localStorage.getItem(WASTE_LISTINGS_KEY);
    if (listedWasteString) {
      const listedWaste: WasteListing[] = JSON.parse(listedWasteString);
      setTotalSold(listedWaste.length);
    }
  }, []);

  const quickActions = [
    { href: '/classify', label: 'Classify Waste', Icon: Camera, description: 'Identify waste type with AI' },
    { href: '/log', label: 'Log Waste', Icon: ListPlus, description: 'Record your daily waste' },
    { href: '/waste-shop', label: 'Sell/Donate Waste', Icon: ShoppingBag, description: 'List items for others' }, // Updated href
  ];

  const stats = [
    { label: 'Total Items Logged', value: totalWasteLogged, Icon: Trash2, color: 'text-primary' },
    { label: 'Organic Items (Compostable)', value: totalComposted, Icon: Sprout, color: 'text-green-600' },
    { label: 'Items Listed in WasteShop', value: totalSold, Icon: Recycle, color: 'text-blue-600' }, // Updated label
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link href={action.href} key={action.label} legacyBehavior>
              <a className="block group">
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium font-headline">{action.label}</CardTitle>
                    <action.Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-4 text-foreground">Your Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium font-headline text-muted-foreground">{stat.label}</CardTitle>
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

    