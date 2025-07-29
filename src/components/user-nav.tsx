"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useSidebar } from "./ui/sidebar"

export function UserNav() {
  const { logout, user } = useAuth();
  const { state } = useSidebar();
  
  if(state === 'collapsed') {
    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} />
              <AvatarFallback>{user?.email?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
           <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "No email"}
                </p>
              </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center justify-between w-full p-2">
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} />
              <AvatarFallback>{user?.email?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email || "No email"}
                </p>
            </div>
        </div>
         <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
    </div>
  )
}
