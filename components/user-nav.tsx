"use client"

import { loginAction, logoutAction } from "@/app/actions/auth-actions"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { User, Settings, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { getMyLinkedProfile } from "@/app/actions/profile-actions"

export function SignIn() {
    return (
        <form action={loginAction}>
            <Button variant="outline" size="sm">Login with Discord</Button>
        </form>
    )
}

export function UserNav({ user }: { user: any }) {
    const [profileSlug, setProfileSlug] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            getMyLinkedProfile(user.id).then((slug) => {
                if (slug) setProfileSlug(slug);
            });
        }
    }, [user]);

    if (!user) return <SignIn />

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild disabled={!profileSlug}>
                    {profileSlug ? (
                        <Link href={`/player/${profileSlug}`} className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </Link>
                    ) : (
                        <span className="text-muted-foreground cursor-not-allowed flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile (Not Linked)</span>
                        </span>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form action={logoutAction} className="w-full">
                        <button className="w-full text-left flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
