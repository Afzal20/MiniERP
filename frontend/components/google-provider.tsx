"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const DEFAULT_GOOGLE_CLIENT_ID =
  "572994709476-63fcnvi3fesnjcnktnqlq81aes2hncjo.apps.googleusercontent.com";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
