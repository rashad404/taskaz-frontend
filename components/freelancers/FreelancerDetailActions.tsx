'use client';

import { useState } from 'react';
import MessageModal from '@/components/common/MessageModal';
import HireModal from '@/components/common/HireModal';
import { MessageSquare, Briefcase } from 'lucide-react';

interface FreelancerDetailActionsProps {
  freelancer: any;
  locale?: string;
}

export default function FreelancerDetailActions({ freelancer, locale = 'az' }: FreelancerDetailActionsProps) {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const handleMessageSuccess = () => {
    // You could show a success toast here
  };

  return (
    <>
      <button
        onClick={() => setIsHireModalOpen(true)}
        className="w-full btn-primary py-3 px-6 text-center font-semibold mb-3 flex items-center justify-center gap-2"
      >
        <Briefcase className="w-5 h-5" />
        İşə Götür
      </button>

      <button
        onClick={() => setIsMessageModalOpen(true)}
        className="w-full btn-secondary py-3 px-6 text-center font-semibold flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Mesaj Göndər
      </button>

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        freelancerId={freelancer.id}
        freelancerName={freelancer.name}
        locale={locale}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        receiverId={freelancer.id}
        receiverName={freelancer.name}
        taskId={undefined}
        taskTitle={undefined}
        onSuccess={handleMessageSuccess}
      />
    </>
  );
}
