import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield } from "lucide-react";

// --- FIX: Add 'async' to the function ---
export default async function ProfilePage() {
  
  // --- FIX: Add 'await' to the cookies() call ---
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    redirect("/login");
  }

  const user = {
    displayName: "Commander Jane Doe",
    email: "jane.doe@bf1942.online",
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-500/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/40 ring-2 ring-primary/10 flex-shrink-0">
              <AvatarFallback className="text-2xl font-black text-primary bg-primary/10">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
                <Shield className="h-2.5 w-2.5" />
                Command Center Operator
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {user.displayName}
              </h1>
              <p className="mt-1 font-mono text-xs text-muted-foreground/60">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}