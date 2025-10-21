'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/types/marketplace';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  gradient: string;
  locale: string;
}

export default function CategoryCard({ category, gradient, locale }: CategoryCardProps) {
  // Get icon component from lucide-react
  const IconComponent = category.icon ? (Icons as any)[category.icon] : Icons.Folder;

  return (
    <Link href={`/${locale}/categories/${category.slug}`}>
      <div className="relative group cursor-pointer h-full">
        {/* Card Background Gradient */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-all duration-500 pointer-events-none`}
        />

        {/* Glass Card */}
        <div className="relative h-full rounded-3xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 transition-all duration-500 group-hover:scale-[1.02]">
          {/* Hover Gradient Effect */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-50 bg-gradient-to-br ${gradient} blur-3xl transition-opacity duration-500 pointer-events-none`}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Icon and Title */}
            <div>
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
              >
                {IconComponent && (
                  <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>

              {/* Subcategories count */}
              {category.children && category.children.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.children.length} subcategories
                </p>
              )}
            </div>

            {/* Arrow Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
          </div>
        </div>
      </div>
    </Link>
  );
}
