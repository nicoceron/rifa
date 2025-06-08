"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: string; // Route to redirect to if not authenticated
}

export function AuthGuard({ children, fallback = "/signin" }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(fallback);
    }
  }, [user, loading, router, fallback]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-button"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // Show protected content if authenticated
  return <>{children}</>;
}

// Hook for checking authentication in components
export function useRequireAuth(redirectTo: string = "/signin") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
