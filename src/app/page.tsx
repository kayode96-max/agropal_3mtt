import { Button } from "@/components/ui/button";
import { Sprout, Leaf, MessageCircle, Mic, Wifi, Languages, Users, Bot, Camera, GraduationCap, CloudRain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <header className="w-full px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Sprout className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-lg font-headline">AgroPal</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link href="/auth">
              Log In
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth">
              Sign Up
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="w-full px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    AgroPal - Smart Farming Assistant
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Bridging the gap between traditional farming and modern agriculture through AI-powered solutions, multilingual support, and community-driven knowledge sharing.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/auth">
                      Get Started for Free
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/happy-farmers.jpg"
                width={600}
                height={600}
                alt="Hero"
                data-ai-hint="nigerian farmers smiling"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-destructive">The Challenge</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nigerian farmers face critical barriers that limit their agricultural potential and productivity.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12">
              <Card className="text-center border-destructive/20">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <Wifi className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="mt-4 font-headline text-destructive">Limited Expert Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Rural farmers lack access to agricultural experts and timely advice on crop management, especially in areas with poor internet connectivity.</p>
                </CardContent>
              </Card>
              <Card className="text-center border-destructive/20">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <Languages className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="mt-4 font-headline text-destructive">Language Barriers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Many farmers struggle with literacy and language barriers, preventing them from accessing digital agricultural resources and expert guidance.</p>
                </CardContent>
              </Card>
              <Card className="text-center border-destructive/20">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <Users className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="mt-4 font-headline text-destructive">Isolated Communities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Farmers work in isolation without platforms to share experiences, ask questions, or learn from other farmers' successes and failures.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Our Solution</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AgroPal bridges these gaps with AI-powered technology, multilingual support, and community-driven solutions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 mt-12">
              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-primary">AI-Powered Community Assistant</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">An intelligent AI model reviews community discussions, questions, and suggestions, providing localized insights on the accuracy and effectiveness of proposed solutions.</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time validation of farming advice</li>
                    <li>• Location-specific recommendations</li>
                    <li>• Community knowledge verification</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-primary">Smart Disease Diagnosis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Advanced image, text, and audio-based disease and pest diagnosis with instant control recommendations tailored to local conditions.</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Photo-based crop disease detection</li>
                    <li>• Voice-enabled symptom reporting</li>
                    <li>• Localized treatment solutions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-primary">Personalized Learning</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Customized e-learning modules featuring videos, quizzes, and voice tutorials in local dialects, adapted to individual farming needs.</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Video tutorials in local languages</li>
                    <li>• Interactive farming quizzes</li>
                    <li>• Voice-guided learning modules</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <CloudRain className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-primary">Smart Weather Intelligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Comprehensive weather and climate analysis providing actionable insights for optimal farming decisions and crop planning.</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hyperlocal weather forecasts</li>
                    <li>• Climate-based farming advice</li>
                    <li>• Seasonal planning guidance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Comprehensive Farming Toolkit</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything Nigerian farmers need to increase productivity, reduce losses, and build sustainable agricultural practices.
                </p>
              </div>
            </div>
            <div className="w-full grid items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">AI Crop Diagnosis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Upload photos, describe symptoms, or record voice notes about plant issues. Get instant AI-powered diagnosis and localized treatment recommendations.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">Multilingual Voice Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Speak in Yoruba, Hausa, Igbo, or Pidgin. Our AI assistant understands local dialects and provides farming advice in your preferred language.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">Smart Community Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Connect with farmers nationwide. AI monitors discussions to validate advice and provide location-specific insights on shared solutions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 AgroPal. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
