import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('terms');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function TermsPage() {
  const t = useTranslations('terms');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[rgb(81,91,195)] to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-white/90">
              {t('hero.lastUpdated')}: {currentDate}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('intro.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('intro.content')}
              </p>
            </div>

            {/* Section 1: Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. {t('section1.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section1.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section1.point1')}</li>
                <li>{t('section1.point2')}</li>
                <li>{t('section1.point3')}</li>
              </ul>
            </div>

            {/* Section 2: User Accounts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. {t('section2.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section2.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section2.point1')}</li>
                <li>{t('section2.point2')}</li>
                <li>{t('section2.point3')}</li>
                <li>{t('section2.point4')}</li>
              </ul>
            </div>

            {/* Section 3: Services */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. {t('section3.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section3.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section3.point1')}</li>
                <li>{t('section3.point2')}</li>
                <li>{t('section3.point3')}</li>
              </ul>
            </div>

            {/* Section 4: Payment and Fees */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. {t('section4.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section4.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section4.point1')}</li>
                <li>{t('section4.point2')}</li>
                <li>{t('section4.point3')}</li>
                <li>{t('section4.point4')}</li>
              </ul>
            </div>

            {/* Section 5: User Conduct */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. {t('section5.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section5.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section5.point1')}</li>
                <li>{t('section5.point2')}</li>
                <li>{t('section5.point3')}</li>
                <li>{t('section5.point4')}</li>
                <li>{t('section5.point5')}</li>
              </ul>
            </div>

            {/* Section 6: Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. {t('section6.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section6.content')}
              </p>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. {t('section7.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section7.content')}
              </p>
            </div>

            {/* Section 8: Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. {t('section8.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section8.content')}
              </p>
            </div>

            {/* Section 9: Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. {t('section9.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section9.content')}
              </p>
            </div>

            {/* Section 10: Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. {t('section10.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section10.content')}
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('contact.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {t('contact.content')}
              </p>
              <a
                href="mailto:legal@task.az"
                className="text-[rgb(81,91,195)] hover:underline"
              >
                legal@task.az
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
