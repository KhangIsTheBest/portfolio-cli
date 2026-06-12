import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "portfolio-cli | Developer Portfolio",
  description: "An interactive developer portfolio featuring a retro terminal CLI and a modern glassmorphic GUI dashboard, built with Next.js & Spring Boot.",
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
          <ThemeProvider>
            {/* Background Decorative Ambient Pulsing Globs */}
            <div className="fixed top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-custom/10 blur-[120px] -z-20 pointer-events-none animate-pulse-slow" />
            <div className="fixed bottom-1/3 right-1/10 w-[450px] h-[450px] rounded-full bg-purple-custom/10 blur-[130px] -z-20 pointer-events-none" />

            {/* Sticky global navigation bar */}
            <Header />

            {/* Content Viewport */}
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto justify-center">
              {children}
            </div>

            {/* Global Footer */}
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
