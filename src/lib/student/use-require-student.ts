"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export function useRequireStudent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "STUDENT") {
      router.replace("/student/auth/login");
    }
  }, [user, loading, router]);

  return { user, loading, ready: !loading && !!user && user.role === "STUDENT" };
}
