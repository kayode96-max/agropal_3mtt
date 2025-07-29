"use client"

import { usePathname, useRouter } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import SiteHeader from '@/components/site-header'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { Toaster } from './ui/toaster'
import { cn } from '@/lib/utils'

function AppContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuth()

    useEffect(() => {
        if (isLoading) return;

        const isAuthPage = pathname === '/auth';
        const isLandingPage = pathname === '/';

        if (!isAuthenticated && !isAuthPage && !isLandingPage) {
            router.push('/auth');
        } else if (isAuthenticated && (isAuthPage || isLandingPage)) {
            router.push('/dashboard');
        }
    }, [pathname, isAuthenticated, isLoading, router]);

    const isAppPage = !isLoading && isAuthenticated && pathname !== '/auth' && pathname !== '/';

    return (
        <SidebarProvider>
            {isAppPage && <SiteHeader />}
            <div className={cn("flex w-full", { "h-screen": !isAppPage })}>
                {children}
            </div>
            <Toaster />
        </SidebarProvider>
    )
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AppContent>{children}</AppContent>
        </AuthProvider>
    )
}
