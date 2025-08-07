"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { reportErrorBoundary } from "@/utils/errorReporting";
import ResourceHints from "@/components/ResourceHints";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: metadata export removed because this is now a Client Component due to ErrorBoundary

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>ElderCare AI Companion</title>
        <meta name="description" content="AI-powered companion for elderly care with validation therapy" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ResourceHints />
        <ErrorBoundary
          onError={(error, errorInfo) => {
            reportErrorBoundary(error, { 
              componentStack: errorInfo?.componentStack || undefined 
            }, {
              location: 'root-layout'
            });
          }}
        >
          <ServiceWorkerRegistration />
          <InstallPrompt />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
