// src/app/_components/root-client-layout.tsx
"use client";

import { DarkModeProvider } from "./dark-mode-provider";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";

/**
 * A client component wrapper to ensure DarkModeProvider is the parent of 
 * AppHeader (which uses the context) and the children.
 */
export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DarkModeProvider>
      <AppHeader />
      <main className="flex-grow">{children}</main>
      {/* AppFooter is kept here to maintain the structure */}
      <AppFooter /> 
    </DarkModeProvider>
  );
}