import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <AuthForm variant="signup" />
    </div>
  );
}
