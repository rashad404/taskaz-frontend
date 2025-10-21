import { useTranslations } from 'next-intl';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Task.az
          </span>
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400">
          {t('home.welcome')}
        </p>
      </div>
    </div>
  );
}