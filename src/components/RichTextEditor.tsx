'use client';

import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Table as TableIcon, 
  Eye, 
  Edit3,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '@/context/LanguageContext';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here (Markdown supported)...',
  minHeight = 'min-h-[220px]',
  label
}) => {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [showGuide, setShowGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;

    const before = value.substring(0, start);
    const after = value.substring(end);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  const insertLinePrefix = (prefix: string, defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const selectedText = value.substring(start, end) || defaultText;

    const newText = `${before}\n${prefix}${selectedText}${after}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length + 1, start + prefix.length + 1 + selectedText.length);
    }, 50);
  };

  return (
    <div className="space-y-1.5 font-mono">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-secondary uppercase font-bold tracking-wider">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-[10px] text-cyan-custom hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{locale === 'vi' ? 'Hướng dẫn định dạng' : 'Formatting Help'}</span>
          </button>
        </div>
      )}

      {/* Formatting Guide Modal */}
      {showGuide && (
        <div className="p-3.5 rounded-xl border border-cyan-custom/30 bg-cyan-custom/5 text-xs text-text space-y-2 animate-fade-in font-sans">
          <p className="font-bold text-cyan-custom font-mono text-[11px] uppercase">
            {locale === 'vi' ? '💡 Cú pháp Markdown hỗ trợ' : '💡 Supported Markdown Syntax'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-secondary">
            <div><span className="text-text font-bold">**Chữ in đậm**</span> ➔ **In đậm**</div>
            <div><span className="text-text font-bold">*Chữ in nghiêng*</span> ➔ *In nghiêng*</div>
            <div><span className="text-text font-bold"># Tiêu đề 1</span> ➔ H1 Heading</div>
            <div><span className="text-text font-bold">## Tiêu đề 2</span> ➔ H2 Heading</div>
            <div><span className="text-text font-bold">- Danh sách</span> ➔ Bullet list</div>
            <div><span className="text-text font-bold">1. Danh sách số</span> ➔ Numbered list</div>
            <div><span className="text-text font-bold">[Tên link](https://...)</span> ➔ Hyperlink</div>
            <div><span className="text-text font-bold">`code`</span> ➔ Inline code</div>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="border border-border-custom bg-slate-950/60 rounded-xl overflow-hidden shadow-inner focus-within:border-cyan-custom/50 focus-within:ring-1 focus-within:ring-cyan-custom/25 transition">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border-custom/60 bg-slate-900/60 select-none">
          {/* Format Action Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', locale === 'vi' ? 'In đậm' : 'Bold')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'In đậm' : 'Bold'}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', locale === 'vi' ? 'In nghiêng' : 'Italic')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'In nghiêng' : 'Italic'}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            <button
              type="button"
              onClick={() => insertLinePrefix('# ', locale === 'vi' ? 'Tiêu đề 1' : 'Heading 1')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix('## ', locale === 'vi' ? 'Tiêu đề 2' : 'Heading 2')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix('### ', locale === 'vi' ? 'Tiêu đề 3' : 'Heading 3')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            <button
              type="button"
              onClick={() => insertLinePrefix('- ', locale === 'vi' ? 'Mục danh sách' : 'List item')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'Danh sách gạch đầu dòng' : 'Bullet List'}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix('1. ', locale === 'vi' ? 'Mục số 1' : 'Numbered item')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'Danh sách số' : 'Numbered List'}
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            <button
              type="button"
              onClick={() => insertLinePrefix('> ', locale === 'vi' ? 'Trích dẫn' : 'Quote')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'Trích dẫn' : 'Blockquote'}
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n```\n', '\n```\n', 'const code = "example";')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'Khối mã nguồn Code' : 'Code Block'}
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://example.com)', locale === 'vi' ? 'Tên liên kết' : 'Link Title')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'Chèn liên kết URL' : 'Hyperlink'}
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n| Cột 1 | Cột 2 |\n| --- | --- |\n| Nội dung 1 | Nội dung 2 |\n', '', '')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title={locale === 'vi' ? 'Tạo bảng Data Table' : 'Table'}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-border-custom/50">
            <button
              type="button"
              onClick={() => setActiveTab('EDIT')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'EDIT'
                  ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/30'
                  : 'text-secondary hover:text-text'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>{locale === 'vi' ? 'Soạn thảo' : 'Edit'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PREVIEW')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                activeTab === 'PREVIEW'
                  ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/30'
                  : 'text-secondary hover:text-text'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{locale === 'vi' ? 'Xem trước' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        {activeTab === 'EDIT' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-4 bg-transparent text-text font-mono text-xs focus:outline-none resize-y ${minHeight}`}
          />
        ) : (
          <div className={`p-4 font-sans text-xs text-text select-text overflow-y-auto space-y-3 leading-relaxed ${minHeight}`}>
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-secondary italic text-center py-8">
                {locale === 'vi' ? 'Chưa có nội dung xem trước...' : 'No content to preview yet...'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
