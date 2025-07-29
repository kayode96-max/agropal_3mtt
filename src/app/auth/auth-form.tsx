"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthForm({ className, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSignUp, setIsSignUp] = React.useState<boolean>(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { toast } = useToast();
  const { loginWithEmail, loginWithGoogle, signUpWithEmail } = useAuth();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
        if (password !== confirmPassword) {
            toast({
                title: "Sign Up Failed",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
        try {
            await signUpWithEmail(email, password, name);
            toast({
                title: "Sign Up Successful",
                description: "Redirecting to your dashboard...",
            });
        } catch (error: any) {
             let description = 'An unexpected error occurred. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                description = 'This email is already in use. Please sign in or use a different email.';
            } else if (error.code === 'auth/weak-password') {
                description = 'The password is too weak. Please use a stronger password.';
            } else if (error.code === 'auth/invalid-email') {
                description = 'Please enter a valid email address.';
            }
             toast({
                title: "Sign Up Failed",
                description,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    } else {
        try {
            await loginWithEmail(email, password);
            toast({
                title: "Login Successful",
                description: "Redirecting to your dashboard...",
            });
        } catch (error: any) {
            let description = 'An unexpected error occurred. Please try again.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = 'Invalid email or password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                description = 'Please enter a valid email address.';
            }
            toast({
                title: "Login Failed",
                description,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
  }

  async function onGoogleSignIn() {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Google Sign-In Successful",
        description: "Redirecting to your dashboard...",
      });
    } catch (error: any) {
        let description = 'Could not sign in with Google. Please try again.';
        if (error.code === 'auth/popup-closed-by-user') {
            description = 'Sign-in process was cancelled.';
        }
        toast({
            title: "Google Sign-In Failed",
            description: description,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
            {isSignUp && (
                 <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="name">
                    Name
                    </Label>
                    <Input
                    id="name"
                    placeholder="Your Name"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
            )}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              disabled={isLoading}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isSignUp && (
            <div className="grid gap-1">
                <Label className="sr-only" htmlFor="confirm-password">
                    Confirm Password
                </Label>
                <Input
                id="confirm-password"
                placeholder="Confirm Password"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
          </div>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSignUp ? "Sign Up with Email" : "Sign In with Email"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={onGoogleSignIn}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" >
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,36.2,44,30.6,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
        )}
        Google
      </Button>
       <p className="px-8 text-center text-sm text-muted-foreground">
          <button
            onClick={toggleFormMode}
            className="underline underline-offset-4 hover:text-primary"
            disabled={isLoading}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
      </p>
    </div>
  );
}
