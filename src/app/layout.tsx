import type { Metadata } from 'next';
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration';

import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits and keep your streaks going.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
