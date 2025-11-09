'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  lang: string;
}

export default function DashboardLayoutWrapper({ children, lang }: DashboardLayoutWrapperProps) {
  const pathname = usePathname();

  // Check if we're on a dashboard page
  const isDashboardPage = pathname?.includes('/dashboard');

  // Dashboard pages: render children directly (no header/footer)
  // Public pages: render with header and footer
  if (isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
