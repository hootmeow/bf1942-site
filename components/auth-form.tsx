"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  variant: "login" | "signup";
}

export function AuthForm({ variant }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: string[] = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.push("Enter a valid email address.");
    }
    if (password.length < 8) {
      nextErrors.push("Password must be at least 8 characters long.");
    }
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  const isLogin = variant === "login";

  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {isLogin ? "Log in to Command Center" : "Create your Command Center account"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {isLogin
            ? "Access dashboards, coordinate squads, and manage your Battlefield operations."
            : "Provision analytics access, synchronize mods, and personalize community alerts."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
          {errors.length > 0 && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <ul className="list-disc space-y-1 pl-4">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {submitted && errors.length === 0 && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {isLogin ? "Credentials validated. Redirecting to your dashboard..." : "Account ready. Proceed to verification."}
            </div>
          )}
          <Button type="submit" className="w-full">
            {isLogin ? "Log In" : "Create Account"}
          </Button>
        </form>
        {isLogin && (
          <Button variant="outline" className="mt-4 w-full">
            Sign in with Google
          </Button>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "Need an account?" : "Already registered?"}{" "}
          <Link className="font-medium text-primary hover:underline" href={isLogin ? "/signup" : "/login"}>
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
