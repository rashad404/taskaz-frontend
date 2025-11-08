import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { CheckCircle, Users, Target, Award } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('about');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    {
      icon: Target,
      title: t('values.trust.title'),
      description: t('values.trust.description'),
    },
    {
      icon: Users,
      title: t('values.community.title'),
      description: t('values.community.description'),
    },
    {
      icon: Award,
      title: t('values.quality.title'),
      description: t('values.quality.description'),
    },
    {
      icon: CheckCircle,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
    },
  ];

  const stats = [
    { number: '10,000+', label: t('stats.users') },
    { number: '5,000+', label: t('stats.completedTasks') },
    { number: '2,000+', label: t('stats.professionals') },
    { number: '50+', label: t('stats.categories') },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[rgb(81,91,195)] to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t('mission.title')}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-8">
              {t('mission.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[rgb(81,91,195)] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            {t('values.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon className="w-12 h-12 text-[rgb(81,91,195)] mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t('story.title')}
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>{t('story.paragraph1')}</p>
              <p>{t('story.paragraph2')}</p>
              <p>{t('story.paragraph3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[rgb(81,91,195)] to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/az/tasks/create"
              className="bg-white text-[rgb(81,91,195)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('cta.postTask')}
            </a>
            <a
              href="/az/professionals"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              {t('cta.browseProfessionals')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
