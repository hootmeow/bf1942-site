import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const authToken = cookies().get("auth-token");

  if (!authToken) {
    redirect("/login");
  }

  const user = {
    displayName: "Commander Jane Doe",
    email: "jane.doe@bf1942.online",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your Battlefield identity, communication preferences, and operational alerts.
        </p>
      </div>
      <Card className="max-w-xl border-border/60">
        <CardHeader>
          <CardTitle>{user.displayName}</CardTitle>
          <CardDescription>Authenticated Command Center operator</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-primary/50">
            <AvatarFallback className="text-lg font-semibold text-primary">JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-medium text-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
