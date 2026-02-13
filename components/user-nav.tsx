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
import { User, Settings, LogOut, Shield } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { getMyLinkedProfile } from "@/app/actions/profile-actions"
import { getIsAdmin } from "@/app/actions/admin-actions"

export function SignIn() {
    return (
        <form action={loginAction}>
            <Button variant="outline" size="sm">Login with Discord</Button>
        </form>
    )
}

export function UserNav({ user }: { user: any }) {
    const [profileSlug, setProfileSlug] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (user?.id) {
            getMyLinkedProfile(user.id).then((slug) => {
                if (slug) setProfileSlug(slug);
            });
            getIsAdmin().then(setIsAdmin);
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

                {isAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer text-primary">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin Panel</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                    onClick={() => startTransition(() => { logoutAction() })}
                    disabled={isPending}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
