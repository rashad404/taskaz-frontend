import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Task.az - Freelance Marketplace",
  description: "Platform for tasks and talent in Azerbaijan. Post jobs, find professionals, and collaborate.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'manifest', url: '/favicon/site.webmanifest' }
    ]
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'az_AZ',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az',
    siteName: 'Task.az',
    title: 'Task.az - Freelance Marketplace',
    description: 'Platform for tasks and talent in Azerbaijan. Post jobs, find professionals, and collaborate.',
    images: [
      {
        url: '/images/taskaz-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Task.az - Freelance Marketplace',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task.az - Freelance Marketplace',
    description: 'Platform for tasks and talent in Azerbaijan. Post jobs, find professionals, and collaborate.',
    images: ['/images/taskaz-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={dmSans.variable} suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}