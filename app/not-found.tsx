import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The page you are looking for does not exist.</p>
        <Link href="/az" className="text-brand-orange hover:underline">
          Go to home page
        </Link>
      </div>
    </div>
  );
}