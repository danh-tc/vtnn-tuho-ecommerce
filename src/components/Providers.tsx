"use client";

import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader color="#4CAF50" height={3} showSpinner={false} />
      {children}
    </SessionProvider>
  );
}
