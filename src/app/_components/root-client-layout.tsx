"use client";

import { DarkModeProvider } from "./dark-mode-provider";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DarkModeProvider>
      <AppHeader />
      <main className="flex-grow">{children}</main>
      <AppFooter /> 
    </DarkModeProvider>
  );
}