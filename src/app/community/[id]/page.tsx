
"use client"

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post, Comment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import AddCommentForm from "./add-comment-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";


function PostPageSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2"/>
                    <Skeleton className="h-5 w-1/2"/>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-5/6"/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Skeleton className="h-6 w-24"/>
                    <Skeleton className="h-6 w-32"/>
                </CardFooter>
            </Card>
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <div className="flex gap-4">
                     <Skeleton className="h-10 w-10 rounded-full"/>
                     <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-full" />
                     </div>
                </div>
                 <div className="flex gap-4">
                     <Skeleton className="h-10 w-10 rounded-full"/>
                     <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-4/5" />
                     </div>
                </div>
            </div>
        </div>
    )
}

export default function PostPage({ params }: { params: { id: string } }) {
    const postId = params.id;
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!postId) return;

        // Listen for post updates
        const postUnsubscribe = onSnapshot(doc(db, "posts", postId), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setPost({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                    likes: data.likes || [],
                } as Post);
            } else {
                // TODO: Handle post not found
            }
            setLoading(false);
        });

        // Listen for comment updates
        const commentsQuery = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
        const commentsUnsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const commentsData: Comment[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                commentsData.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate()
                } as Comment)
            });
            setComments(commentsData);
        });

        return () => {
            postUnsubscribe();
            commentsUnsubscribe();
        };

    }, [postId]);

    const handleLike = async () => {
        if (!isAuthenticated || !user || !post) return;
        
        const postRef = doc(db, "posts", post.id);
        const userHasLiked = post.likes?.includes(user.uid);

        try {
            if (userHasLiked) {
                await updateDoc(postRef, { likes: arrayRemove(user.uid) });
            } else {
                await updateDoc(postRef, { likes: arrayUnion(user.uid) });
            }
        } catch(error) {
            toast({ title: "Error", description: "Could not update like. Please try again.", variant: "destructive" });
            console.error(error);
        }
    }


    if (loading) {
        return <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl"><PostPageSkeleton /></div>;
    }

    if (!post) {
        return <div className="container mx-auto py-10 text-center">Post not found.</div>;
    }
    
    const userHasLiked = user ? post.likes?.includes(user.uid) : false;

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={post.authorPhotoURL} alt={post.authorName}/>
                                <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                            <span>{post.authorName || "Anonymous"}</span>
                        </div>
                        <span>{post.createdAt ? formatDistanceToNow(post.createdAt) + ' ago' : 'Just now'}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                    <span className="font-semibold text-primary">{post.region}</span>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={handleLike} className={cn("flex items-center gap-1", { "text-primary": userHasLiked })}>
                            <ThumbsUp className="h-4 w-4"/> {post.likes?.length || 0} Likes
                        </Button>
                        <div className="flex items-center gap-1 text-muted-foreground"><MessageCircle className="h-4 w-4"/> {comments.length} Comments</div>
                    </div>
                </CardFooter>
            </Card>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6 font-headline">Comments ({comments.length})</h2>
                <div className="space-y-6 mb-8">
                    {comments.length > 0 ? comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-4">
                             <Avatar>
                                <AvatarImage src={comment.authorPhotoURL} alt={comment.authorName}/>
                                <AvatarFallback>{comment.authorName?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <p className="font-semibold">{comment.authorName}</p>
                                    <p className="text-xs text-muted-foreground">{comment.createdAt ? formatDistanceToNow(comment.createdAt) + ' ago' : ''}</p>
                                </div>
                                <p className="text-foreground/90">{comment.text}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-muted-foreground">Be the first to comment on this post.</p>
                    )}
                </div>
                <AddCommentForm postId={postId}/>
            </div>
        </div>
    )
}
