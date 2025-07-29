"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart as BarChartIcon, Bot, CloudSun, Leaf, Lightbulb, MessageCircle, Mic, Users } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { weatherData } from "@/lib/data"
import { Post } from "@/lib/types"
import { useEffect, useState } from "react"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

const chartData = [
  { month: "January", yield: 186 },
  { month: "February", yield: 305 },
  { month: "March", yield: 237 },
  { month: "April", yield: 273 },
  { month: "May", yield: 209 },
  { month: "June", yield: 214 },
]

const chartConfig = {
  yield: {
    label: "Yield (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function CommunitySpotlightSkeleton() {
    return (
        <Card className="col-span-4 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><MessageCircle className="h-6 w-6" /> Community Spotlight</CardTitle>
            <CardDescription>Latest discussions from the community board.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
              </div>
               <div className="border-t border-border pt-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
              </div>
          </CardContent>
        </Card>
    )
}


export default function DashboardPage() {
    const [latestPosts, setLatestPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(2));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData: Post[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                postsData.push({ 
                    id: doc.id, 
                    ...data,
                    createdAt: data.createdAt?.toDate() 
                } as Post);
            });
            setLatestPosts(postsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Community Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary text-primary-foreground col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot/> Talk to Your Farming Assistant</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-4">Ask questions in Yoruba, Hausa, Igbo, or Pidgin and get instant answers. Use text or voice!</p>
                <Button asChild variant="secondary" className="w-full">
                <Link href="/ai-chat">Start AI Chat</Link>
                </Button>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Leaf/> AI Crop Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-4">Got a sick plant? Let our AI help you diagnose the issue from a photo.</p>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/diagnose">Diagnose a Crop</Link>
                </Button>
            </CardContent>
          </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {loading ? <CommunitySpotlightSkeleton /> : (
            <Card className="col-span-4 lg:col-span-4">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><MessageCircle className="h-6 w-6" /> Community Spotlight</CardTitle>
                    <CardDescription>Latest discussions from the community board.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {latestPosts.length > 0 ? (
                        latestPosts.map((post, index) => (
                           <div key={post.id} className={index > 0 ? "border-t border-border pt-4 space-y-2" : "space-y-2"}>
                                <h3 className="font-semibold">{post.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                                    <span>By {post.authorName} in <span className="font-semibold text-primary">{post.region}</span></span>
                                    <span>{post.createdAt ? formatDistanceToNow(post.createdAt) + ' ago' : 'Just now'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No community posts yet. Be the first to start a discussion!</p>
                    )}
                </CardContent>
            </Card>
        )}
        <Card className="col-span-4 lg:col-span-3">
           <CardHeader>
            <CardTitle className="font-headline">Yield & Weather</CardTitle>
            <CardDescription>An overview of your farm's performance and local weather.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{top: 5, right: 20, left: -10, bottom: 5}}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickMargin={10} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="yield" fill="var(--color-yield)" radius={8} />
              </BarChart>
            </ChartContainer>
            <div className="flex justify-around items-center pt-4 mt-4 border-t">
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="text-lg font-bold">{weatherData.temperature}</p>
                </div>
                 <div className="text-center">
                    <p className="text-xs text-muted-foreground">Condition</p>
                    <p className="text-lg font-bold flex items-center gap-1"><CloudSun className="h-5 w-5 text-accent"/>{weatherData.condition}</p>
                </div>
                 <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total Yield</p>
                    <p className="text-lg font-bold">1,424 kg</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
