"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { moderateCommunityContent } from "@/ai/flows/moderate-community-content"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function CreatePostForm() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [region, setRegion] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content || !region) {
            setError("Please fill in all fields.")
            return
        }

        if (!user) {
            setError("You must be logged in to create a post.")
            toast({
                title: "Authentication Error",
                description: "Please log in to create a post.",
                variant: "destructive"
            })
            return
        }
        
        setIsLoading(true)
        setError(null)
        
        try {
            const moderationResult = await moderateCommunityContent({ content: `${title} ${content}`})
            if (!moderationResult.isAppropriate) {
                setError(`Your post was flagged as inappropriate: ${moderationResult.reason}. Please revise it.`)
                setIsLoading(false)
                return
            }

            await addDoc(collection(db, "posts"), {
                title,
                content,
                region,
                authorId: user.uid,
                authorName: user.displayName || user.email,
                authorPhotoURL: user.photoURL,
                createdAt: serverTimestamp(),
            })

            toast({
                title: "Post Submitted!",
                description: "Your post is now live on the community board.",
                variant: "default",
            })
            
            setTitle("")
            setContent("")
            setRegion("")

        } catch (err) {
            setError("An error occurred while submitting your post. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Create a New Post</CardTitle>
                <CardDescription>Share your thoughts with the community.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="post-title">Title</Label>
                        <Input id="post-title" placeholder="e.g., Question about fertilizers" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="post-content">Content</Label>
                        <Textarea id="post-content" placeholder="Share more details here..." rows={6} value={content} onChange={(e) => setContent(e.target.value)}/>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="post-region">Region</Label>
                        <Select onValueChange={setRegion} value={region}>
                            <SelectTrigger id="post-region">
                                <SelectValue placeholder="Select your region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="North">North</SelectItem>
                                <SelectItem value="Southwest">Southwest</SelectItem>
                                <SelectItem value="Southeast">Southeast</SelectItem>
                                <SelectItem value="South-South">South-South</SelectItem>
                                <SelectItem value="North-Central">North-Central</SelectItem>
                                <SelectItem value="North-East">North-East</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Post
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
