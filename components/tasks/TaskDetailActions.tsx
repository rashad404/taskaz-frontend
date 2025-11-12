'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ApplyModal from './ApplyModal';
import MessageModal from '@/components/common/MessageModal';
import { MessageSquare, Edit } from 'lucide-react';

interface TaskDetailActionsProps {
  task: any;
}

export default function TaskDetailActions({ task }: TaskDetailActionsProps) {
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check ownership by comparing user ID with task client ID
    const checkOwnership = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            credentials: 'include'
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.status === 'success') {
            setIsOwner(data.data.id === task.client?.id);
          } else {
            setIsOwner(false);
          }
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error('Failed to check ownership:', error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [task.client?.id]);

  const handleApplySuccess = () => {
    setApplied(true);
  };

  const handleMessageSuccess = () => {
    // You could show a success toast here
  };

  // If user is the owner (from backend API), show Edit button only
  if (isOwner) {
    return (
      <Link
        href={`/${locale}/dashboard/tasks/${task.id}/edit`}
        className="w-full btn-primary py-3 px-6 text-center font-semibold flex items-center justify-center gap-2"
      >
        <Edit className="w-5 h-5" />
        Tapşırığı Redaktə Et
      </Link>
    );
  }

  // Otherwise, show Apply and Message buttons
  return (
    <>
      <button
        onClick={() => setIsApplyModalOpen(true)}
        disabled={applied || task.status !== 'open'}
        className="w-full btn-primary py-3 px-6 text-center font-semibold mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {applied ? 'Müraciət Göndərilib' : 'Müraciət Et'}
      </button>

      <button
        onClick={() => setIsMessageModalOpen(true)}
        className="w-full btn-secondary py-3 px-6 text-center font-semibold flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Müştəri ilə Əlaqə
      </button>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        taskId={task.id}
        taskTitle={task.title}
        budgetAmount={task.budget_amount}
        budgetType={task.budget_type}
        onSuccess={handleApplySuccess}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        receiverId={task.client?.id || task.user_id}
        receiverName={task.client?.name || 'Müştəri'}
        taskId={task.id}
        taskTitle={task.title}
        onSuccess={handleMessageSuccess}
      />
    </>
  );
}
