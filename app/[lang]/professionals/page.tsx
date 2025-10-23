import ProfessionalsListing from '@/components/professionals/ProfessionalsListing';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface ProfessionalsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: ProfessionalsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'metadata.professionals' });

  const title = t('listTitle');
  const description = t('listDescription');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'}/${lang}/professionals`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: lang === 'az' ? 'az_AZ' : lang === 'en' ? 'en_US' : 'ru_RU',
      url,
      siteName: 'Task.az',
      title,
      description,
      images: [
        {
          url: '/images/taskaz-image.jpg',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/taskaz-image.jpg'],
    },
  };
}

export default async function ProfessionalsPage({ params, searchParams }: ProfessionalsPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <ProfessionalsListing locale={lang} initialFilters={filters} />
    </div>
  );
}
