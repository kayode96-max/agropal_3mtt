"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Leaf, MessageCircle, Bot, Sun, BookOpen, History, BarChart3 } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/diagnose", label: "Crop Diagnosis", icon: Leaf },
  { href: "/diagnose/history", label: "Diagnosis History", icon: History },
  { href: "/ai-chat", label: "AI Chat", icon: Bot },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/weather", label: "Weather", icon: Sun },
  { href: "/learning", label: "E-Learning", icon: BookOpen },
  { href: "/yield-calculator", label: "Farm Analysis", icon: BarChart3 },
]

export function MainNav() {
  const pathname = usePathname()

  const isLinkActive = (href: string) => {
    if (href === "/diagnose") {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    return pathname === href
  }

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={isLinkActive(link.href)}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
