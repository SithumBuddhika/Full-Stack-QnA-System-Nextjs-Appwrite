"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/Auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  const verifySession = useAuthStore((s) => s.verifySession);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    // after hydration, verify current session on load
    verifySession();
  }, [verifySession]);

  return <>{children}</>;
}
