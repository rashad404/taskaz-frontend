import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('privacy');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function PrivacyPage() {
  const t = useTranslations('privacy');
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

            {/* Section 1: Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. {t('section1.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section1.content')}
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('section1.subtitle1')}
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>{t('section1.personal1')}</li>
                <li>{t('section1.personal2')}</li>
                <li>{t('section1.personal3')}</li>
                <li>{t('section1.personal4')}</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('section1.subtitle2')}
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section1.auto1')}</li>
                <li>{t('section1.auto2')}</li>
                <li>{t('section1.auto3')}</li>
              </ul>
            </div>

            {/* Section 2: How We Use Your Information */}
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
                <li>{t('section2.point5')}</li>
                <li>{t('section2.point6')}</li>
              </ul>
            </div>

            {/* Section 3: Information Sharing */}
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
                <li>{t('section3.point4')}</li>
              </ul>
            </div>

            {/* Section 4: Data Security */}
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
              </ul>
            </div>

            {/* Section 5: Your Rights */}
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

            {/* Section 6: Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. {t('section6.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section6.content')}
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>{t('section6.point1')}</li>
                <li>{t('section6.point2')}</li>
                <li>{t('section6.point3')}</li>
              </ul>
            </div>

            {/* Section 7: Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. {t('section7.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section7.content')}
              </p>
            </div>

            {/* Section 8: Third-Party Links */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. {t('section8.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section8.content')}
              </p>
            </div>

            {/* Section 9: Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. {t('section9.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('section9.content')}
              </p>
            </div>

            {/* Section 10: Changes to Privacy Policy */}
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
                href="mailto:privacy@task.az"
                className="text-[rgb(81,91,195)] hover:underline"
              >
                privacy@task.az
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
