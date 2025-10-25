import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { i18n, type Locale } from "@/i18n-config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StartupBar from "@/components/common/StartupBar";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({
  children,
  params
}: LangLayoutProps) {
  const { lang } = await params;

  // Validate that the incoming `lang` parameter is valid
  if (!i18n.locales.includes(lang as Locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
        <Header />
        <StartupBar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}
