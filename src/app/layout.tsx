import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Facebook - Connect and Share',
  description: 'Connect with friends and the world around you on Facebook.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg-main)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
