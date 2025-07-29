import { Sprout } from "lucide-react"
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { Separator } from "./ui/separator"

export default function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">NaijaAgroConnect</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
          <SidebarTrigger />
        </div>
      </header>
      <Sidebar>
        <div className="flex flex-col h-full">
            <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Sprout className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl font-headline group-data-[collapsible=icon]:hidden">
                NaijaAgroConnect
                </span>
            </Link>
            </SidebarHeader>
            <SidebarContent className="flex-grow">
            <MainNav />
            </SidebarContent>
            <SidebarFooter className="p-2 flex-col gap-2">
                <Separator />
                <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                </div>
                <div className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:mx-auto">
                    <UserNav />
                </div>
            </SidebarFooter>
        </div>
      </Sidebar>
    </>
  )
}
