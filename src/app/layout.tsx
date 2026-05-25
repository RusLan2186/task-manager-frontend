import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Container } from "@/components/Container";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description:
    "A  task management application built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.015_255)_0%,transparent_42%),radial-gradient(circle_at_88%_12%,oklch(0.9_0.012_260)_0%,transparent_36%),linear-gradient(to_bottom,oklch(0.97_0.006_255),oklch(0.9_0.008_260))] text-foreground flex flex-col">
        <AuthProvider>
          <Header />
          <Container>{children}</Container>
          <Toaster richColors closeButton position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
