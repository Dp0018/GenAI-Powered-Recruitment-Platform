import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "sonner";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobPortal - Multi-Tenant Enterprise Recruitment Platform",
  description:
    "Enterprise recruitment infrastructure connecting verified employers directly with candidates with strict role-based access control.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <QueryProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Toaster richColors position="top-right" theme="dark" />
        </QueryProvider>
      </body>
    </html>
  );
}
