// app/(auth)/login/page.tsx
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Suspense fallback={<div>Загрузка...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}