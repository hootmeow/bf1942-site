"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bell,
  Cog,
  Download,
  Home,
  Newspaper,
  PanelLeft,
  Search,
  Server,
  Settings,
  User,
  Users,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "Server Info", icon: Server, href: "/servers" },
  { label: "Player Stats", icon: BarChart, href: "/stats" },
  { label: "Mods & Expansions", icon: Cog, href: "/mods" },
  { label: "Install Guide", icon: Download, href: "/guide" },
  { label: "News & Updates", icon: Newspaper, href: "/news" },
  { label: "Community", icon: Users, href: "/community" },
  { label: "Tools", icon: Wrench, href: "/tools" },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobile = React.useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SiteSidebar isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} onCloseMobile={closeMobile} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-background px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="flex w-full items-center gap-3">
          <div className="relative flex w-full items-center md:hidden">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search players..." className="pl-10" type="search" />
          </div>
          <div className="relative hidden w-full max-w-sm items-center md:flex">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search players..." className="pl-10" type="search" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="User menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup">Sign Up</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

interface SiteSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function SiteSidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SiteSidebarProps) {
  const pathname = usePathname();
  const collapsed = isCollapsed && !isMobileOpen;

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border/60 bg-background/95 backdrop-blur transition-all",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-6">
        <Avatar className="h-10 w-10 border border-primary/50">
          <AvatarFallback className="bg-primary/20 text-primary">BF</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Command Center</p>
            <p className="text-lg font-bold text-foreground">BF1942.online</p>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary/20 text-primary",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </TooltipProvider>
      </nav>
      <div className="px-3 pb-6">
        <Link
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.287-.011-1.244-.017-2.255-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.606-2.665-.304-5.467-1.333-5.467-5.932 0-1.31.469-2.382 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.003 0c2.292-1.552 3.298-1.23 3.298-1.23.655 1.652.243 2.873.119 3.176.77.838 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.901-.015 3.293 0 .323.217.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12Z"
              clipRule="evenodd"
            />
          </svg>
          {!collapsed && <span>Source Code</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn("hidden md:block", isCollapsed ? "w-20" : "w-64")}>{sidebarContent}</aside>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} aria-hidden />
          <div className="relative z-50 w-64">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
