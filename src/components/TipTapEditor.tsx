'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Undo, 
  Redo, 
  Maximize2, 
  Minimize2, 
  Palette, 
  Plus, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

const PRESET_COLORS = [
  '#f8fafc', // Slate 50
  '#34d399', // Emerald 400
  '#38bdf8', // Sky 400
  '#a855f7', // Purple 500
  '#f43f5e', // Rose 500
  '#fbbf24', // Amber 400
  '#94a3b8', // Slate 400
];

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here (Rich Text WYSIWYG)...',
  minHeight = 'min-h-[250px]',
  label
}) => {
  const { locale } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4]
        }
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-cyan-custom underline hover:opacity-80 transition cursor-pointer'
        }
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-3 border border-border-custom shadow-md'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-border-custom my-4 font-mono text-xs'
        }
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-border-custom/60'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border-custom bg-slate-900/60 p-2 font-bold text-left text-cyan-custom'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border-custom/50 p-2'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none p-4 text-text font-sans text-xs focus:outline-none focus:ring-0 select-text leading-relaxed ${minHeight}`
      }
    }
  });

  // Keep editor content synchronized with external prop if changed programmatically
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (editor.getText().trim() === '' && value.trim() !== '') {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  // Lock body scroll in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt(locale === 'vi' ? 'Nhập URL liên kết:' : 'Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt(locale === 'vi' ? 'Nhập URL hình ảnh:' : 'Enter Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="space-y-1.5 font-mono">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-secondary uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-custom" />
            <span>{label}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-[10px] text-cyan-custom hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{locale === 'vi' ? 'Mẹo TipTap WYSIWYG' : 'TipTap Hints'}</span>
          </button>
        </div>
      )}

      {/* Guide Box */}
      {showGuide && (
        <div className="p-3.5 rounded-xl border border-cyan-custom/30 bg-cyan-custom/5 text-xs text-text space-y-2 animate-fade-in font-sans">
          <p className="font-bold text-cyan-custom font-mono text-[11px] uppercase">
            🚀 TipTap Rich-Text Editor Pro
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-secondary">
            <div><span className="text-text font-bold">★ Bôi đen văn bản</span> ➔ Menu thao tác nhanh</div>
            <div><span className="text-text font-bold">★ Nút Phóng to</span> ➔ Mở rộng toàn màn hình</div>
            <div><span className="text-text font-bold">★ Nút Palette</span> ➔ Chọn màu chữ tùy thích</div>
            <div><span className="text-text font-bold">★ Nút Bảng Table</span> ➔ Chèn và quản lý dòng/cột</div>
          </div>
        </div>
      )}

      {/* Fullscreen Backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {/* Main Container */}
      <div className={`
        border border-border-custom bg-slate-950/70 rounded-xl overflow-hidden shadow-inner focus-within:border-cyan-custom/60 focus-within:ring-1 focus-within:ring-cyan-custom/30 transition-all duration-300
        ${isFullscreen ? 'fixed inset-3 md:inset-6 z-50 bg-slate-950 border-cyan-custom/60 shadow-2xl rounded-2xl flex flex-col' : 'relative'}
      `}>
        {/* Main Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-2 border-b border-border-custom/60 bg-slate-900/90 select-none shrink-0">
          
          {/* Group 1: Text Styles */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('bold') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('italic') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('strike') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('code') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            {/* Color Palette Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer flex items-center gap-1"
                title={locale === 'vi' ? 'Đổi màu chữ' : 'Text Color'}
              >
                <Palette className="w-3.5 h-3.5" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-slate-900 border border-border-custom rounded-xl shadow-2xl z-50 flex items-center gap-1.5 animate-fade-in">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-5 h-5 rounded-full border border-white/20 hover:scale-125 transition cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="text-[9px] font-mono text-rose-400 hover:underline ml-1"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            {/* Group 2: Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('heading', { level: 1 }) ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('heading', { level: 2 }) ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('heading', { level: 3 }) ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            {/* Group 3: Lists & Blocks */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('bulletList') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('orderedList') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('blockquote') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            {/* Group 4: Alignment */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            {/* Group 5: Media & Link */}
            <button
              type="button"
              onClick={setLink}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                editor.isActive('link') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40 font-bold' : 'text-secondary hover:text-text hover:bg-slate-800'
              }`}
              title="Insert Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={addImage}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-cyan-custom transition cursor-pointer"
              title="Insert Image URL"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Table Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTableMenu(!showTableMenu)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  editor.isActive('table') ? 'bg-cyan-custom/20 text-cyan-custom border border-cyan-custom/40' : 'text-secondary hover:text-text hover:bg-slate-800'
                }`}
                title="Table Tools"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>

              {showTableMenu && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-slate-900 border border-border-custom rounded-xl shadow-2xl z-50 space-y-1 font-mono text-[10px] min-w-[170px] animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-text flex items-center justify-between"
                  >
                    <span>{locale === 'vi' ? 'Chèn bảng (3x3)' : 'Insert Table (3x3)'}</span>
                    <Plus className="w-3 h-3 text-cyan-custom" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-text"
                  >
                    {locale === 'vi' ? '+ Thêm dòng' : '+ Add Row'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-text"
                  >
                    {locale === 'vi' ? '+ Thêm cột' : '+ Add Column'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-rose-400"
                  >
                    {locale === 'vi' ? '- Xóa dòng' : '- Delete Row'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-rose-400"
                  >
                    {locale === 'vi' ? '- Xóa cột' : '- Delete Column'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-rose-500/20 text-rose-400 font-bold border-t border-border-custom/50 pt-1"
                  >
                    {locale === 'vi' ? '🗑️ Xóa toàn bộ bảng' : '🗑️ Delete Table'}
                  </button>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-border-custom/60 mx-1" />

            {/* Group 6: History */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-text disabled:opacity-30 transition cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-secondary hover:text-text disabled:opacity-30 transition cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-border-custom bg-slate-950 text-secondary hover:text-cyan-custom hover:border-cyan-custom/40 transition cursor-pointer"
              title={isFullscreen ? (locale === 'vi' ? 'Thu nhỏ (Esc)' : 'Exit Fullscreen') : (locale === 'vi' ? 'Phóng to toàn màn hình' : 'Expand Fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-custom" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Editor Viewport Content */}
        <div className={`overflow-y-auto ${isFullscreen ? 'flex-1 p-4' : ''}`}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};
