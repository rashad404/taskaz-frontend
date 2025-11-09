import type { Task } from '@/lib/types/marketplace';

/**
 * Calculate days left until task deadline
 * @param deadline - The deadline date string
 * @returns Number of days left, null if no deadline
 */
export function getDaysLeft(deadline: string | null | undefined): number | null {
  if (!deadline) return null;

  try {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return null;
  }
}

/**
 * Check if a task's deadline has expired
 * @param task - The task object
 * @returns True if task is open and deadline has passed
 */
export function isTaskExpired(task: Task): boolean {
  if (task.status !== 'open') return false;

  const daysLeft = getDaysLeft(task.deadline);
  return daysLeft !== null && daysLeft < 0;
}

/**
 * Get the display status for a task (considering expiration)
 * @param task - The task object
 * @returns Object with status key and label
 */
export function getTaskStatus(task: Task): {
  key: 'expired' | 'open' | 'assigned' | 'completed' | 'cancelled';
  label: string;
} {
  if (isTaskExpired(task)) {
    return { key: 'expired', label: 'Müddəti bitib' };
  }

  switch (task.status) {
    case 'open':
      return { key: 'open', label: 'Açıq' };
    case 'assigned':
      return { key: 'assigned', label: 'Təyin Edilib' };
    case 'completed':
      return { key: 'completed', label: 'Tamamlandı' };
    case 'cancelled':
      return { key: 'cancelled', label: 'Ləğv edildi' };
    default:
      return { key: 'completed', label: 'Bağlı' };
  }
}

/**
 * Get status badge styling classes
 * @param statusKey - The status key
 * @returns Tailwind CSS classes for the badge
 */
export function getStatusBadgeClasses(
  statusKey: 'expired' | 'open' | 'assigned' | 'completed' | 'cancelled'
): string {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';

  switch (statusKey) {
    case 'expired':
      return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
    case 'open':
      return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`;
    case 'assigned':
      return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
    case 'completed':
      return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`;
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`;
  }
}
