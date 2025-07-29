
"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Diagnosis } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, History, Award } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


function HistorySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-48" />
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-8 w-1/3" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default function DiagnosisHistoryPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "diagnoses"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const history: Diagnosis[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                history.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                } as Diagnosis);
            });
            setDiagnoses(history);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching diagnosis history: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading]);

    if (loading || authLoading) {
        return (
             <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-start mb-10">
                    <h1 className="text-4xl font-bold tracking-tight font-headline flex items-center gap-3"><History />Diagnosis History</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        A record of all your past crop diagnoses.
                    </p>
                </div>
                <HistorySkeleton />
            </div>
        )
    }

    if (!user) {
         return (
             <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Required</AlertTitle>
                    <AlertDescription>You must be logged in to view your diagnosis history.</AlertDescription>
                </Alert>
            </div>
         )
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start mb-10">
                <h1 className="text-4xl font-bold tracking-tight font-headline flex items-center gap-3"><History />Diagnosis History</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    A record of all your past crop diagnoses.
                </p>
            </div>

            {diagnoses.length === 0 ? (
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No History Found</AlertTitle>
                    <AlertDescription>You haven't performed any diagnoses yet. Go to the diagnosis page to get started.</AlertDescription>
                </Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {diagnoses.map(item => (
                        <Dialog key={item.id}>
                            <DialogTrigger asChild>
                                <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="truncate">Diagnosis: {item.diagnosis}</CardTitle>
                                        <CardDescription>{item.createdAt ? formatDistanceToNow(item.createdAt) : ''} ago</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-4">
                                        <div className="relative w-full h-48 rounded-md overflow-hidden border">
                                            <Image src={item.photoDataUri} alt="Diagnosed plant" layout="fill" objectFit="cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Treatment</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.treatmentSolutions}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="w-full">
                                            <Label className="flex items-center gap-1 text-xs"><Award className="h-4 w-4"/>Confidence</Label>
                                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${item.confidenceScore * 100}%` }}></div>
                                            </div>
                                            <p className="text-right text-xs font-bold text-primary">{(item.confidenceScore * 100).toFixed(0)}%</p>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </DialogTrigger>
                             <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{item.diagnosis}</DialogTitle>
                                    <DialogDescription>
                                        Diagnosed {item.createdAt ? formatDistanceToNow(item.createdAt) : ''} ago
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                    <div className="space-y-4">
                                        <div className="relative w-full h-64 rounded-md overflow-hidden border">
                                            <Image src={item.photoDataUri} alt="Diagnosed plant" layout="fill" objectFit="cover" />
                                        </div>
                                        <div>
                                            <Label className="flex items-center gap-1 text-sm"><Award className="h-4 w-4"/>Confidence Score</Label>
                                            <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${item.confidenceScore * 100}%` }}></div>
                                            </div>
                                            <p className="text-right text-sm font-bold text-primary">{(item.confidenceScore * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">Recommended Treatment</h3>
                                            <div className="text-sm">
                                                {item.treatmentSolutions.split('\n').map((line, index) => (
                                                    <p key={index} className="mb-1">{line}</p>
                                                ))}
                                            </div>
                                        </div>
                                        {item.additionalDetails && (
                                            <div>
                                                <h3 className="font-semibold text-lg">Additional Details Provided</h3>
                                                <p className="text-sm text-muted-foreground">{item.additionalDetails}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            )}
        </div>
    )
}
