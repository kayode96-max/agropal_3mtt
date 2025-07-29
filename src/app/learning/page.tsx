import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { learningModules } from "@/lib/data";
import { BookOpen, Clock, Film, HelpCircle } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function LearningPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start mb-10">
            <h1 className="text-4xl font-bold tracking-tight font-headline">E-Learning Hub</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Enhance your farming skills with our curated tutorials and quizzes.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {learningModules.map((module) => (
                <Link href="#" key={module.id} className="group">
                    <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                <Image 
                                    src={module.thumbnail} 
                                    alt={module.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={module['data-ai-hint']}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                     <CardTitle className="text-primary-foreground font-headline text-lg">{module.title}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-4">
                            <CardDescription>{module.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="p-4 flex justify-between items-center text-sm text-muted-foreground border-t">
                            <div className="flex items-center gap-1">
                                {module.type === 'video' ? <Film className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                                <span>{module.type === 'video' ? 'Video' : 'Quiz'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{module.duration}</span>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
