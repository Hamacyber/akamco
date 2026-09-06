'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Extension } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
}

/* ── Toolbar button ──────────────────────────────────────────── */
function Btn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-lg text-sm transition-colors ${active
        ? 'bg-[#00C46A]/20 text-[#00C46A]'
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
        } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-700 mx-1 self-center" />;
}

/* ── SVG icons (inline, 16×16) ───────────────────────────────── */
const I = {
  bold: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>,
  italic: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" /></svg>,
  underline: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" /></svg>,
  strike: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" /></svg>,
  code: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>,
  codeblock: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z" /></svg>,
  h1: <span className="font-bold text-xs leading-none">H1</span>,
  h2: <span className="font-bold text-xs leading-none">H2</span>,
  h3: <span className="font-bold text-xs leading-none">H3</span>,
  quote: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>,
  ul: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" /></svg>,
  ol: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" /></svg>,
  hr: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M19 13H5v-2h14v2z" /></svg>,
  alignLeft: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" /></svg>,
  alignCenter: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" /></svg>,
  alignRight: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" /></svg>,
  link: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8v-2z" /></svg>,
  image: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>,
  youtube: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
  highlight: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M15.5 3l-4 4-3.5-3.5L4 7.5 7.5 11 3 15.5 8.5 21l4.5-4.5L16.5 20l4-4-5-5 4-4-4-4zm-4 14L8 13.5l7-7 3.5 3.5-7 7z" /></svg>,
  undo: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" /></svg>,
  redo: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 15.7c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 15.5h9v-9l-3.6 4.1z" /></svg>,
};

/* ── Font Size extension (uses TextStyle mark) ───────────────── */
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

const PRESET_COLORS = [
  '#ffffff', '#d1d5db', '#6b7280', '#111827',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#00C46A', '#14b8a6', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f43f5e',
];

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el: HTMLElement) => el.style.fontSize?.replace('px', '') || null,
          renderHTML: (attrs: Record<string, string | null>) => {
            if (!attrs.fontSize) return {};
            return { style: `font-size: ${attrs.fontSize}px` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      // eslint-disable-next-line
      setFontSize: (size: string) => ({ chain }: { chain: () => any }) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      // eslint-disable-next-line
      unsetFontSize: () => ({ chain }: { chain: () => any }) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

/* ── Helper: upload image via /api/upload ─────────────────────── */
async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Upload failed');
  return data.url as string;
}

/* ── Main component ──────────────────────────────────────────── */
export default function RichEditor({ value, onChange }: RichEditorProps) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);
  const lastEmittedRef = useRef<string>(value || '');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
      }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      Youtube.configure({
        width: 720,
        height: 405,
        controls: true,
        nocookie: true,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Placeholder.configure({ placeholder: 'Write your article here… Use the toolbar to add headings, images, YouTube videos, links and more.' }),
      Highlight.configure({ multicolor: false }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px] px-4 py-3 text-gray-200 leading-relaxed',
      },
    },
    onUpdate({ editor }) {
      if (!isUpdatingRef.current) {
        const html = editor.getHTML();
        lastEmittedRef.current = html;
        onChange(html);
      }
    },
  });

  // Sync external value changes only when they originate outside the editor
  // (e.g. loading an existing post). Skips re-sync when value came from our own onChange.
  useEffect(() => {
    if (!editor) return;
    if (value !== lastEmittedRef.current && value !== '') {
      isUpdatingRef.current = true;
      editor.commands.setContent(value, { emitUpdate: false });
      lastEmittedRef.current = value;
      isUpdatingRef.current = false;
    }
  }, [value, editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch {
      alert('Image upload failed. Please try again.');
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('YouTube URL (e.g. https://youtube.com/watch?v=...)');
    if (url) {
      editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previous = editor?.getAttributes('link').href ?? '';
    const url = window.prompt('Link URL', previous);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImageUpload(f);
          e.target.value = '';
        }}
      />

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-0.5 items-center px-3 py-2 border-b border-gray-700 bg-gray-800/80">

        {/* Undo / Redo */}
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>{I.undo}</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>{I.redo}</Btn>

        <Divider />

        {/* Font size */}
        <select
          title="Font size"
          value={editor.getAttributes('textStyle').fontSize ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v) {
              (editor.chain().focus() as any).setFontSize(v).run();
            } else {
              (editor.chain().focus() as any).unsetFontSize().run();
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="h-7 rounded-lg text-xs bg-gray-700 border border-gray-600 text-gray-200 px-1.5 cursor-pointer hover:border-gray-500 focus:outline-none focus:border-[#00C46A] transition-colors"
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <Divider />

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">{I.h1}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">{I.h2}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">{I.h3}</Btn>

        <Divider />

        {/* Inline formatting */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">{I.bold}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">{I.italic}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">{I.underline}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">{I.strike}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">{I.highlight}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">{I.code}</Btn>

        {/* Font Color */}
        <div className="relative flex items-center gap-0.5" title="Font Color">
          {/* Native color wheel */}
          <label
            title="Pick any color"
            className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <span className="relative">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
              </svg>
              {/* color swatch under icon */}
              <span
                className="absolute -bottom-0.5 left-0.5 right-0.5 h-[3px] rounded-full"
                style={{ background: editor.getAttributes('textStyle').color ?? '#ffffff' }}
              />
            </span>
            <input
              type="color"
              className="sr-only"
              value={editor.getAttributes('textStyle').color ?? '#ffffff'}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                editor.chain().focus().setColor(e.target.value).run();
              }}
            />
          </label>
          {/* Preset swatches */}
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(c).run(); }}
              className="w-4 h-4 rounded-sm border border-gray-600 hover:scale-110 transition-transform flex-shrink-0"
              style={{ background: c }}
            />
          ))}
          {/* Remove color */}
          <button
            type="button"
            title="Remove color"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
            className="ml-0.5 text-[10px] text-gray-400 hover:text-white px-1.5 py-1 rounded hover:bg-gray-700 transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        <Divider />

        {/* Lists + Quote */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">{I.ul}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">{I.ol}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">{I.quote}</Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">{I.codeblock}</Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">{I.hr}</Btn>

        <Divider />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">{I.alignLeft}</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">{I.alignCenter}</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">{I.alignRight}</Btn>

        <Divider />

        {/* Link */}
        <Btn onClick={setLink} active={editor.isActive('link')} title="Insert / Edit Link">{I.link}</Btn>

        {/* Image upload */}
        <Btn onClick={() => imgInputRef.current?.click()} title="Upload Image">{I.image}</Btn>

        {/* YouTube */}
        <Btn onClick={addYoutube} title="Embed YouTube Video">{I.youtube}</Btn>

      </div>

      {/* ── Editor area ──────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className="
          [&_.tiptap]:min-h-[420px]
          [&_.tiptap]:text-gray-200
          [&_.tiptap]:leading-relaxed
          [&_.tiptap_.is-editor-empty:before]:content-[attr(data-placeholder)] [&_.tiptap_.is-editor-empty:before]:float-left [&_.tiptap_.is-editor-empty:before]:text-gray-600 [&_.tiptap_.is-editor-empty:before]:pointer-events-none [&_.tiptap_.is-editor-empty:before]:h-0
        "
      />

      {/* ── Footer hint ──────────────────────────────────── */}
      <div className="px-4 py-2 border-t border-gray-700/60 bg-gray-800/40 flex items-center justify-between">
        <p className="text-[10px] text-gray-600">
          Tip: paste a YouTube link anywhere in text to auto-embed · use toolbar image button to upload · Ctrl+Z to undo
        </p>
        <p className="text-[10px] text-gray-600 tabular-nums">
          {editor.storage.characterCount?.characters?.() ?? 0} chars
        </p>
      </div>
    </div>
  );
}
