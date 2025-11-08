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
    // Check ownership by calling API with auth token
    const checkOwnership = async () => {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      if (!token) {
        console.log('No token, setting isOwner to false');
        setIsOwner(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.slug}`;
        console.log('Fetching task from:', url);
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Task data:', data);
          console.log('is_owner from API:', data.data?.is_owner);
          setIsOwner(data.data?.is_owner || false);
        } else {
          console.error('Response not OK:', response.status);
          setIsOwner(false);
        }
      } catch (error) {
        console.error('Failed to check ownership:', error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [task.slug]);

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
        href={`/${locale}/tasks/${task.slug}/edit`}
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
