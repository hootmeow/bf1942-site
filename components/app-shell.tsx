"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import {
  ActivitySquare, // Added for System Status
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
import { PlayerSearch } from "@/components/player-search"; // Use the PlayerSearch component
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// --- Import Accordion components ---
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// --- NEW: Import the guides list ---
import { guidesList } from "@/lib/guides-list";
// --- REMOVED Image import ---

// --- MODIFIED: Updated navItems data structure ---
// --- Define NavItem type for safety ---
interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  overviewLabel?: string | null;
  children?: NavItem[];
}

// --- MODIFIED: Updated navItems data structure ---
const navItems: NavItem[] = [
  { label: "Dashboard", icon: Home, href: "/" },
  { label: "News & Updates", icon: Newspaper, href: "/news" },
  { label: "Server Info", icon: Server, href: "/servers" },
  {
    label: "Player Stats",
    icon: BarChart,
    href: "/stats",
    overviewLabel: null,
    children: [
      {
        label: "Ranked Stats",
        href: "/rank-info",
        children: [
          { label: "All Time", href: "/rank-info" },
          { label: "Weekly (Last 7 Days)", href: "/rank-info/weekly" },
          { label: "Monthly (Last 30 Days)", href: "/rank-info/monthly" },
        ]
      },
      { label: "Search", href: "/search" },
      { label: "Rounds", href: "/stats/rounds" },
      { label: "Compare Players", href: "/stats/compare" },
    ],
  },
  { label: "Mods & Expansions", icon: Cog, href: "/mods" },
  {
    label: "Guides", // --- Changed from "Guide" to "Guides" ---
    icon: Download,
    href: "/guide",
    // Dynamically build children from guidesList, limiting to 5
    children: guidesList.slice(0, 5).map(guide => ({
      label: guide.title,
      href: `/guide/${guide.slug}`,
    })),
  },
  {
    label: "Community",
    icon: Users,
    href: "/community",
    children: [
      { label: "Clan Headquarters", href: "/clans" },
    ]
  },
  {
    label: "Tools",
    icon: Wrench,
    href: "/tools", // This is the parent "Overview" page
    children: [
      { label: "Map Alert Bot", href: "/tools/map-alert" },
      { label: "Linux Server", href: "/tools/linux-server" },
    ],
  },
];

import { UserNav } from "@/components/user-nav"; // Import UserNav

interface AppShellProps {
  children: React.ReactNode;
  user?: any; // Add user prop
}

import { ToastProvider } from "@/components/ui/toast-simple";

export function AppShell({ children, user }: AppShellProps) {
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
    <ToastProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <SiteSidebar isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} onCloseMobile={closeMobile} />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader onToggleSidebar={toggleSidebar} user={user} />
          <main className="flex-1 bg-background px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
          <footer className="border-t border-border/60 bg-background/90 px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl text-center text-xs text-muted-foreground">
              <Link href="/about" className="px-2 hover:underline">
                About
              </Link>
              <span className="px-1">•</span>
              <Link href="/tos-privacy" className="px-2 hover:underline">
                TOS & Privacy
              </Link>
              <p className="mt-2">© {new Date().getFullYear()} BF1942.online. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
}

interface AppHeaderProps {
  onToggleSidebar: () => void;
  user?: any; // Add user prop
}

function AppHeader({ onToggleSidebar, user }: AppHeaderProps) {
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
          <div className="flex w-full items-center md:hidden">
            <PlayerSearch />
          </div>
          <div className="hidden w-full items-center md:flex">
            <PlayerSearch />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="h-9 w-9 hidden" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hidden" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Navigation Component */}
            <UserNav user={user} />

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
        {/* --- REVERTED to Avatar and ADDED animate-pulse-glow --- */}
        <Avatar className="h-10 w-10 border border-primary/50 animate-pulse-glow">
          <AvatarFallback className="bg-primary/20 text-primary">BF</AvatarFallback>
        </Avatar>
        {/* --- END MODIFIED SECTION --- */}
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Command Center</p>
            <p className="text-lg font-bold text-foreground">BF1942.online</p>
          </div>
        )}
      </div>

      {/* --- NAVIGATION SECTION (from previous step, handles submenus) --- */}
      <nav className="flex-1 space-y-1 px-3">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const Icon = item.icon || ActivitySquare; // Fallback icon

            // --- 1. Collapsed View (Icons Only) ---
            if (collapsed) {
              const link = (
                <Link
                  key={item.label} // Use label as key
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    // Use startsWith to highlight parent when on a child page
                    pathname.startsWith(item.href) && "bg-primary/20 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            // --- 2. Expanded View (With Submenu Logic) ---

            // If item HAS children, render an Accordion
            if (item.children && item.children.length > 0) { // Check if children exist
              const isChildActive = item.children.some(child => child.href === pathname);
              return (
                <Accordion type="single" collapsible key={item.label} defaultValue={isChildActive || pathname === item.href ? item.label : undefined}>
                  <AccordionItem value={item.label} className="border-b-0">
                    <AccordionTrigger
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground hover:no-underline",
                        // Highlight if parent or a child is active
                        (pathname.startsWith(item.href)) && "text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pl-9 pr-2">
                      {/* Link to the parent "Overview" page - Only if not null */}
                      {/* @ts-ignore */}
                      {item.overviewLabel !== null && (
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground",
                            pathname === item.href && "text-primary" // Active state for parent
                          )}
                        >
                          {/* @ts-ignore */}
                          {item.overviewLabel || "Overview"}
                        </Link>
                      )}
                      {/* Links to all the children */}
                      {item.children.map((child) => {
                        // Check if child has children (Level 3)
                        // @ts-ignore - Dynamic children property
                        if (child.children && child.children.length > 0) {
                          return (
                            <div key={child.href} className="space-y-1">
                              <Link
                                href={child.href}
                                onClick={onCloseMobile}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground",
                                  pathname === child.href && "text-primary"
                                )}
                              >
                                {child.label}
                              </Link>
                              <div className="pl-3 border-l-2 border-border/40 ml-3 space-y-1">
                                {/* @ts-ignore - Dynamic children property */}
                                {child.children.map((subChild) => (
                                  <Link
                                    key={subChild.href}
                                    href={subChild.href}
                                    onClick={onCloseMobile}
                                    className={cn(
                                      "block rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-accent-foreground",
                                      pathname === subChild.href && "text-primary font-semibold"
                                    )}
                                  >
                                    {subChild.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onCloseMobile}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground",
                              pathname === child.href && "text-primary" // Active state for child
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            }

            // If item has NO children, render a normal Link
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary/20 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </TooltipProvider>
      </nav>
      {/* --- END NAVIGATION --- */}

      <div className="px-3 pb-6">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/system-status"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center",
                  pathname === "/system-status" && "text-primary"
                )}
              >
                <ActivitySquare className="h-4 w-4" />
                {!collapsed && <span>System Status</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">System Status</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
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