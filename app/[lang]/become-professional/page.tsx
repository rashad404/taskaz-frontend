import ProfessionalApplicationForm from '@/components/professionals/ProfessionalApplicationForm';
import type { Metadata } from 'next';

interface BecomeProfessionalPageProps {
  params: Promise<{ lang: string }>;
}

export const metadata: Metadata = {
  title: 'Peşəkar Olun | Task.az',
  description: 'Platformamızda peşəkar kimi özünüzü göstərin və işlər qazanmağa başlayın.',
};

export default async function BecomeProfessionalPage({ params }: BecomeProfessionalPageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen px-6 py-16">
      <ProfessionalApplicationForm locale={lang} />
    </div>
  );
}
