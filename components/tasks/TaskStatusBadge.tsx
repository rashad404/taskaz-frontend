import type { Task } from '@/lib/types/marketplace';
import { getTaskStatus, getStatusBadgeClasses } from '@/lib/utils/task';

interface TaskStatusBadgeProps {
  task: Task;
  className?: string;
}

export default function TaskStatusBadge({ task, className = '' }: TaskStatusBadgeProps) {
  const status = getTaskStatus(task);
  const badgeClasses = getStatusBadgeClasses(status.key);

  return (
    <span className={`${badgeClasses} ${className}`.trim()}>
      {status.label}
    </span>
  );
}
