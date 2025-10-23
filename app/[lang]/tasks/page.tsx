import TasksListing from '@/components/tasks/TasksListing';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface TasksPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: TasksPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'metadata.tasks' });

  const title = t('title');
  const description = t('description');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://task.az'}/${lang}/tasks`;

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

export default async function TasksPage({ params, searchParams }: TasksPageProps) {
  const { lang } = await params;
  const filters = await searchParams;

  return (
    <div className="min-h-screen">
      <TasksListing locale={lang} initialFilters={filters} />
    </div>
  );
}
