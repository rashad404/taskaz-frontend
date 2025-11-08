'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  error
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        // Disable extensions we don't want
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        // Disable hardBreak to prevent unwanted line breaks
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    // Parse options to strip unwanted tags during initial content setting
    parseOptions: {
      preserveWhitespace: false,
    },
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
      // Handle paste events to strip unwanted formatting
      transformPastedHTML(html) {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Function to clean a node and its children
        const cleanNode = (node: Node): Node | null => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.cloneNode(true);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const tagName = element.tagName.toLowerCase();

            // Allowed tags: ONLY p, b, strong, i, em, h2, h3, ul, ol, li, br
            // Explicitly excluding: a, span, div, font, img, video, script, style, etc.
            const allowedTags = ['p', 'b', 'strong', 'i', 'em', 'h2', 'h3', 'ul', 'ol', 'li', 'br'];

            if (allowedTags.includes(tagName)) {
              // Create a clean version of the allowed tag
              const cleanElement = document.createElement(tagName);

              // Recursively clean children
              Array.from(element.childNodes).forEach(child => {
                const cleanedChild = cleanNode(child);
                if (cleanedChild) {
                  cleanElement.appendChild(cleanedChild);
                }
              });

              return cleanElement;
            } else {
              // For disallowed tags, extract their text content
              const fragment = document.createDocumentFragment();
              Array.from(element.childNodes).forEach(child => {
                const cleanedChild = cleanNode(child);
                if (cleanedChild) {
                  fragment.appendChild(cleanedChild);
                }
              });
              return fragment;
            }
          }

          return null;
        };

        // Clean the pasted content
        const cleanedDiv = document.createElement('div');
        Array.from(tempDiv.childNodes).forEach(child => {
          const cleanedChild = cleanNode(child);
          if (cleanedChild) {
            cleanedDiv.appendChild(cleanedChild);
          }
        });

        return cleanedDiv.innerHTML;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // Additional sanitization on output to ensure no unwanted tags slip through
      const sanitizedHtml = sanitizeHTML(html);

      onChange(sanitizedHtml === '<p></p>' ? '' : sanitizedHtml);
    },
  });

  // Function to sanitize HTML output
  const sanitizeHTML = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove all anchor tags and replace with their text content
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      const textNode = document.createTextNode(link.textContent || '');
      link.parentNode?.replaceChild(textNode, link);
    });

    // Remove any other disallowed elements
    const disallowedTags = ['span', 'div', 'font', 'img', 'video', 'audio', 'script', 'style', 'iframe', 'object', 'embed'];
    disallowedTags.forEach(tag => {
      const elements = tempDiv.querySelectorAll(tag);
      elements.forEach(el => {
        const textNode = document.createTextNode(el.textContent || '');
        el.parentNode?.replaceChild(textNode, el);
      });
    });

    return tempDiv.innerHTML;
  };

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${
      error
        ? 'border-red-500 dark:border-red-500'
        : 'border-gray-200 dark:border-gray-700 focus-within:border-indigo-500'
    }`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Heading"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white/50 dark:bg-gray-800/50">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
