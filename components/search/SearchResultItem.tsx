import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Briefcase, User, Folder, MapPin, Wallet, Star } from 'lucide-react';

interface SearchResultItemProps {
  type: 'task' | 'professional' | 'category';
  item: any;
  locale: string;
  onSelect: () => void;
}

export default function SearchResultItem({ type, item, locale, onSelect }: SearchResultItemProps) {
  const t = useTranslations('search');
  const router = useRouter();

  const handleClick = () => {
    onSelect();

    if (type === 'task') {
      router.push(`/${locale}/tasks/${item.slug}`);
    } else if (type === 'professional') {
      router.push(`/${locale}/professionals/${item.slug}`);
    } else if (type === 'category') {
      router.push(`/${locale}/categories/${item.slug}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3 group"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
        type === 'task' ? 'bg-blue-100 dark:bg-blue-900/30' :
        type === 'professional' ? 'bg-green-100 dark:bg-green-900/30' :
        'bg-purple-100 dark:bg-purple-900/30'
      }`}>
        {type === 'task' && <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        {type === 'professional' && <User className="w-5 h-5 text-green-600 dark:text-green-400" />}
        {type === 'category' && <Folder className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {type === 'task' && item.title}
          {type === 'professional' && item.name}
          {type === 'category' && item.name}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
          {type === 'task' && (
            <>
              {item.budget_amount && (
                <span className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  {item.budget_amount} AZN
                </span>
              )}
              {item.is_remote && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {t('remote')}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </span>
              )}
            </>
          )}
          {type === 'professional' && (
            <>
              {item.average_rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {item.average_rating}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  );
}
