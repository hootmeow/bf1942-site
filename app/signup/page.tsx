import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <AuthForm variant="signup" />
    </div>
  );
}
