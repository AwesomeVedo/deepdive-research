// src/components/RichTextEditor.tsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  value: string; // HTML string
  onChange: (nextHtml: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit], // bold/italic/lists/undo/redo/etc
    content: value || "",
    editorProps: {
      attributes: {
        class: "rte__content",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Keep editor synced when switching notes (value changes)
  React.useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    const next = value || "";

    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);


  if (!editor) return null;

  const canIndent = editor.can().sinkListItem("listItem");
  const canOutdent = editor.can().liftListItem("listItem");

  return (
    <div className="rte">
      <div className="rte__toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-pressed={editor.isActive("bold")}
          title="Bold"
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-pressed={editor.isActive("italic")}
          title="Italic"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-pressed={editor.isActive("bulletList")}
          title="Bulleted list"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          disabled={!canIndent}
          title="Indent (nested list item)"
        >
          ➡︎
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          disabled={!canOutdent}
          title="Outdent"
        >
          ⬅︎
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
