import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import RootClientLayout from "./_components/root-client-layout"; 

export const metadata: Metadata = {
	title: "BlogSpace Platform",
	description: "A full-stack blog built with the T3 Stack (Next.js, tRPC, Drizzle).",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen">
				<TRPCReactProvider>
					<RootClientLayout>{children}</RootClientLayout>
				</TRPCReactProvider>
			</body>
		</html>
	);
}