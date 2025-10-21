'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Loader2,
  Clock,
  Briefcase,
  User,
  ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';

export default function ConversationsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || 'az';

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    // Fetch current user
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setCurrentUser(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch user:', err));

    // Fetch conversations
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setConversations(data.data || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch conversations:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, locale]);

  const loadMessages = async (task: any) => {
    setSelectedTask(task);
    setLoadingMessages(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}/messages`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedTask || !currentUser) return;

    setSending(true);

    const token = localStorage.getItem('token');

    // Find the other user in the conversation
    const lastMessage = messages[messages.length - 1];
    const receiverId = lastMessage?.sender_id === currentUser.id
      ? lastMessage?.receiver_id
      : lastMessage?.sender_id;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          task_id: selectedTask.id,
          receiver_id: receiverId || selectedTask.user_id,
          message: newMessage
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new message to the list
        setMessages([...messages, data.data]);
        setNewMessage('');
      } else {
        alert(data.message || 'Mesaj göndərilərkən xəta baş verdi');
      }
    } catch (err) {
      alert('Serverlə əlaqə xətası');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mesajlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Müştərilər və freelancerlərlə danışıqlarınız
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 blur-xl" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px]">
                <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Hələ mesaj yoxdur
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tapşırıqlarınız üzrə danışıqlara başlayın
            </p>
            <Link
              href={`/${locale}/tasks`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Briefcase className="w-5 h-5" />
              Tapşırıqlara bax
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 space-y-3 h-[calc(100vh-250px)] overflow-y-auto">
              {conversations.map((conversation) => {
                const task = conversation.task;
                const lastMessage = conversation.last_message;
                const unreadCount = conversation.unread_count || 0;
                const isSelected = selectedTask?.id === task.id;

                return (
                  <button
                    key={task.id}
                    onClick={() => loadMessages(task)}
                    className={`w-full text-left rounded-2xl p-4 transition-all ${
                      isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500'
                        : 'bg-white/80 dark:bg-gray-900/80 border border-white/30 dark:border-gray-700/30 hover:border-indigo-200 dark:hover:border-indigo-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px] flex-shrink-0">
                        <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-gray-900 dark:text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {task.title}
                          </h3>
                          {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                              {unreadCount}
                            </span>
                          )}
                        </div>

                        {lastMessage && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {lastMessage.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Messages Panel */}
            <div className="lg:col-span-2 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
              {selectedTask ? (
                <div className="flex flex-col h-[calc(100vh-250px)]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {selectedTask.title}
                        </h3>
                        {selectedTask.category && (
                          <span className="inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium mt-1">
                            {selectedTask.category.name}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/${locale}/tasks/${selectedTask.slug}`}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Tapşırığa keç
                      </Link>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Hələ mesaj yoxdur
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isMyMessage = currentUser && message.sender_id === currentUser.id;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {message.sender?.name || 'Bilinməyən'}
                                </span>
                              </div>
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isMyMessage
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(message.created_at), {
                                  addSuffix: true,
                                  locale: az
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-250px)] text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Danışığa başlamaq üçün sol tərəfdən tapşırıq seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
