"use client";

import { useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';

interface Attachment {
  url?: string;
  path?: string;
  original_name: string;
  type?: string;
  size?: number;
}

interface TaskAttachmentsProps {
  attachments: Attachment[];
}

export default function TaskAttachments({ attachments }: TaskAttachmentsProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isImage = (file: Attachment) => {
    const extension = file.original_name.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    return file.type?.includes('image') || (extension && imageExtensions.includes(extension));
  };

  const isPdf = (file: Attachment) => {
    const extension = file.original_name.split('.').pop()?.toLowerCase();
    return file.type?.includes('pdf') || extension === 'pdf';
  };

  const getFileUrl = (file: Attachment) => {
    return getImageUrl(file.url || `storage/${file.path}`);
  };

  const handleImageClick = (file: Attachment) => {
    if (isImage(file)) {
      setLightboxImage(getFileUrl(file));
    }
  };

  const handleDownload = async (file: Attachment, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const url = getFileUrl(file);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(getFileUrl(file), '_blank');
    }
  };

  return (
    <>
      <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Əlavələr ({attachments.length})
        </h2>

        {/* Image Grid */}
        {attachments.some(isImage) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Şəkillər
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {attachments.filter(isImage).map((file, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(file)}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                >
                  <img
                    src={getFileUrl(file)}
                    alt={file.original_name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* File name tooltip */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{file.original_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document List */}
        {attachments.some(file => !isImage(file)) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Sənədlər
            </h3>
            <div className="space-y-3">
              {attachments.filter(file => !isImage(file)).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                >
                  {/* File Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {isPdf(file) ? (
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <FileText className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.original_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Ölçü məlum deyil'}
                      {isPdf(file) && ' • PDF Sənəd'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* View Button for PDFs */}
                    {isPdf(file) && (
                      <a
                        href={getFileUrl(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                        title="Görüntülə"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    )}

                    {/* Download Button */}
                    <button
                      onClick={(e) => handleDownload(file, e)}
                      className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      title="Yüklə"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 z-[10000] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shadow-lg"
            aria-label="Bağla"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={lightboxImage}
            alt="Böyük görünüş"
            className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Download button in lightbox */}
          <a
            href={lightboxImage}
            download
            className="absolute bottom-4 right-4 p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Yüklə</span>
          </a>
        </div>
      )}
    </>
  );
}
