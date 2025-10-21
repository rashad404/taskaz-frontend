'use client';

import { useState } from 'react';
import ApplyModal from './ApplyModal';
import MessageModal from '@/components/common/MessageModal';
import { MessageSquare } from 'lucide-react';

interface TaskDetailActionsProps {
  task: any;
}

export default function TaskDetailActions({ task }: TaskDetailActionsProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplySuccess = () => {
    setApplied(true);
    // You could also show a success toast here
  };

  const handleMessageSuccess = () => {
    // You could show a success toast here
  };

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
