import HeroSection from '@/components/home/HeroSection';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import RecentTasksSection from '@/components/home/RecentTasksSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TopFreelancersSection from '@/components/home/TopFreelancersSection';
import WhyTaskazSection from '@/components/home/WhyTaskazSection';
import StatsSection from '@/components/home/StatsSection';
import FinalCTASection from '@/components/home/FinalCTASection';

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search + Dual CTAs */}
      <HeroSection locale={lang} />

      {/* Categories Grid - Browse by category */}
      <CategoriesGrid locale={lang} />

      {/* Recent Tasks - Show latest opportunities */}
      <RecentTasksSection locale={lang} />

      {/* How It Works - Process explanation */}
      <HowItWorksSection locale={lang} />

      {/* Top Freelancers - Show available talent */}
      <TopFreelancersSection locale={lang} />

      {/* Why Task.az - Key benefits */}
      <WhyTaskazSection locale={lang} />

      {/* Stats Section - Platform metrics */}
      <StatsSection locale={lang} />

      {/* Final CTA - Conversion focused */}
      <FinalCTASection locale={lang} />
    </div>
  );
}
