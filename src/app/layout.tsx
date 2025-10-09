'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { ProjectProvider } from '@/context/ProjectContext';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ProjectProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ProjectProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}