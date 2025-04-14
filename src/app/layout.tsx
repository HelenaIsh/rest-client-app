import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';
import ClientLogoutButton from '@/components/ClientLogoutButton';
import { VariablesProvider } from './context/VariablesContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rest Client App',
  description: 'REST API client for making and testing HTTP requests',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <ClientLogoutButton />
          </div>
          <div className="min-h-screen">
            <VariablesProvider>{children}</VariablesProvider>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
