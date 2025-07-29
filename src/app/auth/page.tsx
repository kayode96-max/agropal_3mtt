import { Sprout } from "lucide-react";
import { AuthForm } from "./auth-form";
import Link from "next/link";

export default function AuthenticationPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage:
              "url(/farming-landscape.jpg)",
          }}
          data-ai-hint="farming landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-green-200 transition-colors">
            <Sprout className="h-6 w-6" />
            NaijaAgroConnect
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed">
              &ldquo;This platform has transformed how our community shares knowledge and improves our harvests. It's an indispensable tool for the modern Nigerian farmer.&rdquo;
            </p>
            <footer className="text-sm text-green-200">Bello Aminu, Farmer from Kano</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 bg-gradient-to-br from-background via-card to-muted/20">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Welcome to NaijaAgroConnect
            </h1>
            <p className="text-sm text-muted-foreground">
              Join thousands of Nigerian farmers improving their harvests with AI
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
