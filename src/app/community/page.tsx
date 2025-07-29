
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import CreatePostForm from "./create-post-form";
import { useEffect, useState } from "react";
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function PostSkeleton() {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardFooter>
        </Card>
    )
}

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData: Post[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                postsData.push({ 
                    id: doc.id, 
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                    likes: data.likes || [],
                    commentCount: data.commentCount || 0,
                } as Post);
            });
            setPosts(postsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const handleLike = async (postId: string) => {
        if (!isAuthenticated || !user) {
            toast({
                title: "Authentication Required",
                description: "You must be logged in to like a post.",
                variant: "destructive"
            });
            return;
        }

        const postRef = doc(db, "posts", postId);
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            // Optimistic update
            const oldLikes = post.likes || [];
            const userHasLiked = oldLikes.includes(user.uid);
            const newLikes = userHasLiked 
                ? oldLikes.filter(uid => uid !== user.uid)
                : [...oldLikes, user.uid];

            setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
            
            try {
                if (userHasLiked) {
                    await updateDoc(postRef, { likes: arrayRemove(user.uid) });
                } else {
                    await updateDoc(postRef, { likes: arrayUnion(user.uid) });
                }
            } catch (error) {
                // Revert optimistic update on error
                setPosts(prevPosts => prevPosts.map(p => p.id === postId ? { ...p, likes: oldLikes } : p));
                toast({ title: "Error", description: "Could not update like. Please try again.", variant: "destructive" });
            }
        }
    }


  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start mb-10">
            <h1 className="text-4xl font-bold tracking-tight font-headline">Community Board</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Connect with fellow farmers. Ask questions, share knowledge, and grow together.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                {loading && (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                )}
                {!loading && posts.map((post) => {
                    const userHasLiked = user ? post.likes?.includes(user.uid) : false;
                    return (
                        <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <CardHeader>
                                <Link href={`/community/${post.id}`} className="hover:underline">
                                    <CardTitle>{post.title}</CardTitle>
                                </Link>
                                <CardDescription className="flex items-center gap-4 pt-1">
                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.authorName || 'Anonymous'}</span>
                                    <span>{post.createdAt ? formatDistanceToNow(post.createdAt) + ' ago' : 'Just now'}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-foreground/90 line-clamp-3">{post.content}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                                <span className="font-semibold text-primary">{post.region}</span>
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm" onClick={(e) => {e.stopPropagation(); handleLike(post.id)}} className={cn("flex items-center gap-1 hover:text-primary", { "text-primary": userHasLiked })}>
                                        <ThumbsUp className="h-4 w-4"/> {post.likes?.length || 0} Likes
                                    </Button>
                                    <Link href={`/community/${post.id}`} className="flex items-center gap-1 hover:text-primary"><MessageCircle className="h-4 w-4"/> {post.commentCount || 0} Comments</Link>
                                </div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
            <div className="lg:col-span-1 sticky top-20">
                <CreatePostForm />
            </div>
        </div>
    </div>
  );
}
