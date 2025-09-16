import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './_components/Header'
import Hero from './_components/Hero'
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Form Builder",
  description: "Build, Share, and Manage your own customizable forms created by AI!",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
    <html lang="en">
      <head></head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        <Toaster/>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
