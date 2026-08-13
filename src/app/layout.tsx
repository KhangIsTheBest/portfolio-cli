import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ServerStatusProvider } from "@/context/ServerStatusContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServerStatusBanner } from "@/components/ServerStatusBanner";

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
    default: "Phan Duy Khang — Backend & Full-Stack Developer",
    template: "%s | Phan Duy Khang"
  },
  description: "Personal Portfolio of Phan Duy Khang — Full-Stack Developer specialized in Java Spring Boot, React, Next.js, PostgreSQL, and Cloud Architectures.",
  keywords: ["Phan Duy Khang", "Backend Developer", "Full-Stack Developer", "Java Spring Boot", "Next.js", "React", "Portfolio", "Software Engineer"],
  authors: [{ name: "Phan Duy Khang", url: "https://github.com/KhangIsTheBest" }],
  creator: "Phan Duy Khang",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://portfolio-cli.vercel.app",
    title: "Phan Duy Khang — Backend & Full-Stack Developer",
    description: "Interactive portfolio featuring Java Spring Boot, React, Next.js, and Cloud services.",
    siteName: "Phan Duy Khang Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Phan Duy Khang — Backend & Full-Stack Developer",
    description: "Personal Portfolio — Java Spring Boot, React, Next.js & PostgreSQL."
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
              {/* Background Decorative Ambient Pulsing Globs */}
              <div className="fixed top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-custom/10 blur-[120px] -z-20 pointer-events-none animate-pulse-slow" />
              <div className="fixed bottom-1/3 right-1/10 w-[450px] h-[450px] rounded-full bg-purple-custom/10 blur-[130px] -z-20 pointer-events-none" />

              {/* Server connection status alert banner */}
              <ServerStatusBanner />

              {/* Sticky global navigation bar */}
              <Header />

              {/* Content Viewport */}
              <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto justify-center">
                {children}
              </div>

              {/* Global Footer */}
              <Footer />
            </ThemeProvider>
          </ServerStatusProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
