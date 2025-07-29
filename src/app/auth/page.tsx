import { Sprout } from "lucide-react";
import { AuthForm } from "./auth-form";
import Link from "next/link";

export default function AuthenticationPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              "url(https://placehold.co/1200x800.png)",
          }}
          data-ai-hint="farming landscape"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6" />
            NaijaAgroConnect
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has transformed how our community shares knowledge and improves our harvests. It's an indispensable tool for the modern Nigerian farmer.&rdquo;
            </p>
            <footer className="text-sm">Bello Aminu</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account or sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
