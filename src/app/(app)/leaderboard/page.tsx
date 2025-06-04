
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Trash2, Award, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DirtySpot } from '@/lib/types';

const DIRTY_SPOTS_STORAGE_KEY = 'ecoCycleDirtySpots';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}

const getTrophyIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-500" />;
  if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
  return <Star className="w-4 h-4 text-muted-foreground" />; // For ranks outside top 3
};

const getRankCellStyle = (rank: number) => {
  if (rank === 1) return "bg-yellow-400/20 border-yellow-500/50 font-bold text-yellow-700";
  if (rank === 2) return "bg-slate-400/20 border-slate-500/50 font-semibold text-slate-700";
  if (rank === 3) return "bg-orange-400/20 border-orange-500/50 font-medium text-orange-700";
  return "";
};


export default function LeaderboardPage() {
  const [findersLeaderboard, setFindersLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [cleanersLeaderboard, setCleanersLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const storedSpotsString = localStorage.getItem(DIRTY_SPOTS_STORAGE_KEY);
    const spots: DirtySpot[] = storedSpotsString ? JSON.parse(storedSpotsString) : [];

    // Calculate Waste Finders scores
    const finderScores: Record<string, number> = {};
    spots.forEach(spot => {
      const reporter = spot.reportedBy || 'Anonymous';
      finderScores[reporter] = (finderScores[reporter] || 0) + 10; // 10 points per spot reported
    });
    const findersData = Object.entries(finderScores)
      .map(([name, score], index) => ({ id: `f-${index}`, name, score }))
      .sort((a, b) => b.score - a.score);
    setFindersLeaderboard(findersData);

    // Calculate Waste Cleaners scores
    const cleanerScores: Record<string, number> = {};
    spots.forEach(spot => {
      if (spot.status === 'cleaned' && spot.cleanedDetails) {
        const cleaner = spot.cleanedDetails.cleanedBy || 'Anonymous Volunteer';
        cleanerScores[cleaner] = (cleanerScores[cleaner] || 0) + 100; // 100 points per spot cleaned
      }
    });
    const cleanersData = Object.entries(cleanerScores)
      .map(([name, score], index) => ({ id: `c-${index}`, name, score }))
      .sort((a, b) => b.score - a.score);
    setCleanersLeaderboard(cleanersData);

  }, []);


  const LeaderboardList = ({ users, title }: { users: LeaderboardEntry[]; title: string }) => {
    if (users.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No data yet for {title.toLowerCase()}. Be the first!</p>;
    }
    return (
      <div className="space-y-3">
        {users.map((user, index) => {
          const rank = index + 1;
          return (
            <Card key={user.id} className={cn("shadow-sm hover:shadow-md transition-shadow", getRankCellStyle(rank))}>
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("text-lg font-semibold w-8 text-center", rank > 3 ? "text-muted-foreground" : "")}>
                    {rank}.
                  </span>
                  <div className={cn("flex items-center gap-2", rank <=3 ? 'font-semibold': '')}>
                    {getTrophyIcon(rank)}
                    <span className="text-md">{user.name}</span>
                  </div>
                </div>
                <span className={cn("text-lg font-bold", rank <=3 ? '': 'text-primary')}>
                  {user.score} pts
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
        <h2 className="text-3xl font-bold font-headline text-primary">EcoWarrior Leaderboard</h2>
        <p className="text-muted-foreground">See who's making the biggest impact!</p>
      </div>

      <Tabs defaultValue="finders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="finders" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Waste Finders
          </TabsTrigger>
          <TabsTrigger value="cleaners" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Waste Cleaners
          </TabsTrigger>
        </TabsList>
        <TabsContent value="finders" className="mt-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">Top Waste Spotters</CardTitle>
              <CardDescription className="text-center">Points awarded for reporting dirty spots (10 pts/spot).</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardList users={findersLeaderboard} title="Waste Finders" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cleaners" className="mt-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">Top Cleanup Champions</CardTitle>
              <CardDescription className="text-center">Points awarded for verifying cleaned spots (100 pts/spot).</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardList users={cleanersLeaderboard} title="Waste Cleaners" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
