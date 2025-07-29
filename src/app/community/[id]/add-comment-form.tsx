
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, doc, serverTimestamp, writeBatch, increment } from "firebase/firestore"
import { Loader2 } from "lucide-react"

interface AddCommentFormProps {
    postId: string
}

export default function AddCommentForm({ postId }: AddCommentFormProps) {
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) return

        if (!isAuthenticated || !user) {
            toast({
                title: "Authentication Required",
                description: "You must be logged in to comment.",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)

        try {
            const batch = writeBatch(db)

            // 1. Create a new comment document
            const commentRef = doc(collection(db, "posts", postId, "comments"))
            batch.set(commentRef, {
                text: comment,
                authorId: user.uid,
                authorName: user.displayName || user.email,
                authorPhotoURL: user.photoURL,
                createdAt: serverTimestamp()
            })

            // 2. Atomically increment the comment count on the post
            const postRef = doc(db, "posts", postId)
            batch.update(postRef, { commentCount: increment(1) })

            await batch.commit()

            setComment("")
            toast({
                title: "Comment Added",
                description: "Your comment has been posted.",
            })

        } catch (error) {
            console.error("Error adding comment: ", error)
            toast({
                title: "Error",
                description: "Could not post your comment. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea 
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                disabled={!isAuthenticated}
            />
             <Button type="submit" disabled={isLoading || !comment.trim() || !isAuthenticated} className="self-end">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Comment
            </Button>
        </form>
    )
}
