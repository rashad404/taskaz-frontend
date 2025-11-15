'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MessageModal from '@/components/common/MessageModal';
import HireModal from '@/components/common/HireModal';
import { MessageSquare, Briefcase, Edit } from 'lucide-react';
import authService from '@/lib/api/auth';

interface ProfessionalDetailActionsProps {
  professional: any;
  locale?: string;
}

export default function ProfessionalDetailActions({ professional, locale = 'az' }: ProfessionalDetailActionsProps) {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check ownership by calling API with auth token
    const checkOwnership = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        setIsOwner(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/professionals/${professional.slug}`,
          {
            credentials: 'include'
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsOwner(data.data?.is_owner || false);
        }
      } catch (error) {
        console.error('Failed to check ownership:', error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [professional.slug]);

  const handleMessageSuccess = () => {
    // You could show a success toast here
  };

  // If user is the owner, show Edit button only
  if (isOwner) {
    return (
      <Link
        href={`/${locale}/settings/professional`}
        className="w-full btn-primary py-3 px-6 text-center font-semibold flex items-center justify-center gap-2 mb-3"
      >
        <Edit className="w-5 h-5" />
        Profili Redaktə Et
      </Link>
    );
  }

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
        professionalId={professional.id}
        professionalName={professional.name}
        locale={locale}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        receiverId={professional.id}
        receiverName={professional.name}
        taskId={undefined}
        taskTitle={undefined}
        onSuccess={handleMessageSuccess}
      />
    </>
  );
}
