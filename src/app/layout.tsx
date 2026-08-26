import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ServerStatusProvider } from "@/context/ServerStatusContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServerStatusBanner } from "@/components/ServerStatusBanner";
import { DynamicBackground } from "@/components/DynamicBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Phan Duy Khang — Backend & Full-Stack Engineer",
    template: "%s | Phan Duy Khang"
  },
  description: "Engineering Portfolio of Phan Duy Khang — Full-Stack Developer specializing in Java Spring Boot, PostgreSQL, React, Next.js, and Cloud Architectures.",
  keywords: ["Phan Duy Khang", "Backend Developer", "Full-Stack Developer", "Java Spring Boot", "Next.js", "React", "Software Engineer", "PostgreSQL"],
  authors: [{ name: "Phan Duy Khang", url: "https://github.com/KhangIsTheBest" }],
  creator: "Phan Duy Khang",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" }
    ],
    shortcut: "/logo.png",
    apple: "/logo.png"
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://khang.kamy.space",
    title: "Phan Duy Khang — Backend & Full-Stack Engineer",
    description: "Engineering portfolio featuring Java Spring Boot, PostgreSQL, React, Next.js, and REST APIs.",
    siteName: "Phan Duy Khang Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Phan Duy Khang — Backend & Full-Stack Engineer",
    description: "Engineering Portfolio — Java Spring Boot, React, Next.js & PostgreSQL."
  }
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
      <body className="min-h-full flex flex-col font-mono relative p-4 md:p-8">
        <LanguageProvider>
          <ServerStatusProvider>
            <ThemeProvider>
              {/* Dynamic Particle Canvas Background */}
              <DynamicBackground />

              {/* Server connection status alert banner */}
              <ServerStatusBanner />

              {/* Sticky global navigation bar */}
              <Header />

              {/* Content Viewport */}
              <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto justify-center">
                {children}
              </main>

              {/* Global Footer */}
              <Footer />
            </ThemeProvider>
          </ServerStatusProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
