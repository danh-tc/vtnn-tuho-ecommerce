"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon,
  Highlighter, Undo, Redo, Minus, Code2,
} from "lucide-react";
import { TextSelection } from "@tiptap/pm/state";
import { useCallback, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", class: "rte-link" } }),
      Image.configure({ HTMLAttributes: { class: "rte-image" } }),
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung mô tả..." }),
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlSource(html);
      onChange(html);
    },
    editorProps: {
      attributes: { class: "rte-editor-content" },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Nhập URL ảnh:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const openColorPicker = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    savedSelection.current = { from, to };
    colorInputRef.current?.click();
  }, [editor]);

  const applyColor = useCallback((color: string) => {
    if (!editor) return;
    const sel = savedSelection.current;
    // Step 1: restore focus + selection via ProseMirror transaction
    editor.view.focus();
    if (sel && sel.from !== sel.to) {
      const { state } = editor;
      editor.view.dispatch(
        state.tr.setSelection(TextSelection.create(state.doc, sel.from, sel.to))
      );
    }
    // Step 2: apply color in a separate command (own transaction)
    editor.commands.setColor(color);
  }, [editor]);

  function toggleHtmlMode() {
    if (!editor) return;
    if (!htmlMode) {
      // switching TO html mode — capture current content
      setHtmlSource(editor.getHTML());
    } else {
      // switching BACK to visual — push html into editor
      editor.commands.setContent(htmlSource, false);
      onChange(htmlSource);
    }
    setHtmlMode((v) => !v);
  }

  function handleHtmlSourceChange(raw: string) {
    setHtmlSource(raw);
    onChange(raw);
  }

  if (!editor) return null;

  const btn = (active: boolean, disabled = false) =>
    `rte-btn${active ? " rte-btn--active" : ""}${disabled ? " rte-btn--disabled" : ""}`;

  const currentColor = (editor.getAttributes("textStyle").color as string | undefined) ?? "#212121";

  return (
    <div className="rte-wrap">
      {/* Toolbar */}
      <div className="rte-toolbar">
        {/* History */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(false, !editor.can().undo())} onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={15} /></button>
          <button type="button" className={btn(false, !editor.can().redo())} onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={15} /></button>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Headings */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1"><Heading1 size={15} /></button>
          <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2"><Heading2 size={15} /></button>
          <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3"><Heading3 size={15} /></button>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Inline marks */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={15} /></button>
          <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={15} /></button>
          <button type="button" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><UnderlineIcon size={15} /></button>
          <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough size={15} /></button>
          <button type="button" className={btn(editor.isActive("highlight"))} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><Highlighter size={15} /></button>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Color — separate button + hidden native picker */}
        <div className="rte-toolbar__group">
          <div className="rte-color-btn" title="Text color" onClick={openColorPicker}>
            <span className="rte-color-btn__letter" style={{ color: currentColor }}>A</span>
            <span className="rte-color-btn__bar" style={{ background: currentColor }} />
            <input
              ref={colorInputRef}
              type="color"
              value={currentColor === "#212121" ? "#e63946" : currentColor}
              onChange={(e) => applyColor(e.target.value)}
              className="rte-color-btn__input"
            />
          </div>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Lists */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List size={15} /></button>
          <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list"><ListOrdered size={15} /></button>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Alignment */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left"><AlignLeft size={15} /></button>
          <button type="button" className={btn(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center"><AlignCenter size={15} /></button>
          <button type="button" className={btn(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right"><AlignRight size={15} /></button>
          <button type="button" className={btn(editor.isActive({ textAlign: "justify" }))} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify"><AlignJustify size={15} /></button>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Insert */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} title="Insert link"><LinkIcon size={15} /></button>
          <button type="button" className={btn(false)} onClick={addImage} title="Insert image"><ImageIcon size={15} /></button>
          <button type="button" className={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={15} /></button>
        </div>

        <div className="rte-toolbar__sep" />

        {/* Code & Quote */}
        <div className="rte-toolbar__group">
          <button type="button" className={btn(editor.isActive("code"))} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
            <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>`</span>
          </button>
          <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
            <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>&ldquo;</span>
          </button>
        </div>

        {/* Spacer + HTML toggle */}
        <div style={{ flex: 1 }} />
        <button
          type="button"
          className={btn(htmlMode)}
          onClick={toggleHtmlMode}
          title="View / edit HTML source"
          style={{ gap: 4, padding: "0 8px", width: "auto", fontSize: 11, fontWeight: 700 }}
        >
          <Code2 size={13} />
          HTML
        </button>
      </div>

      {/* Editor or HTML source */}
      {htmlMode ? (
        <textarea
          className="rte-html-source"
          value={htmlSource}
          onChange={(e) => handleHtmlSourceChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} className="rte-editor" />
      )}
    </div>
  );
}
