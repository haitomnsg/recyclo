
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function WasteShopPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-center text-primary">WasteShop</h2>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Welcome to the WasteShop
          </CardTitle>
          <CardDescription>
            Browse listings or sell your recyclable/reusable items. This feature is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              The WasteShop is under construction.
            </p>
            <p className="text-sm text-muted-foreground">
              Check back later to find or list items!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
