"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <Button onClick={logout} variant="destructive" className="w-full">
      Logout
    </Button>
  );
}
