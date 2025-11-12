'use client';

import { useState, useEffect } from 'react';
import TaskApplications from './TaskApplications';

interface Application {
  id: number;
  message: string;
  proposed_amount: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  professional: {
    id: number;
    name: string;
    slug: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    rating: number | null;
    completed_tasks_count: number;
  };
}

interface TaskClient {
  id: number;
  name: string;
  slug: string;
  avatar: string | null;
  location: string | null;
  created_at: string;
}

interface TaskApplicationsWrapperProps {
  applications: Application[];
  taskId: number;
  taskClient: TaskClient | null;
  locale: string;
}

export default function TaskApplicationsWrapper({ applications, taskId, taskClient, locale }: TaskApplicationsWrapperProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is the task owner
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data && data.status === 'success') {
          setCurrentUser(data.data);
          setIsOwner(data.data.id === taskClient?.id);
        }
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [taskClient?.id]);

  // Don't show anything while checking ownership
  if (loading) {
    return null;
  }

  // Only show applications if user is the task owner
  if (!isOwner || !applications || applications.length === 0) {
    return null;
  }

  return (
    <TaskApplications
      applications={applications}
      taskId={taskId}
      locale={locale}
    />
  );
}
