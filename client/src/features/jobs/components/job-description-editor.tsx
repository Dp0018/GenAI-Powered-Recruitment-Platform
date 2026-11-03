"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo,
  Redo,
  Sparkles,
  Eye,
  Edit3,
  Loader2,
  Code,
} from "lucide-react";
import { toast } from "sonner";
import { aiApi } from "@/features/ai/api/ai-api";

interface JobDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  jobTitle?: string;
  placeholder?: string;
  minHeight?: string;
}

export function JobDescriptionEditor({
  value,
  onChange,
  jobTitle = "",
  placeholder = "Write a comprehensive role specification, team mission, responsibilities, and qualifications...",
  minHeight = "200px",
}: JobDescriptionEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5 my-2 space-y-1 text-foreground",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5 my-2 space-y-1 text-foreground",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium",
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-hidden min-h-[180px] p-4 text-xs sm:text-sm text-foreground leading-relaxed font-sans prose prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. form reset or initialValues loading)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      if (editor.getText().trim() === "" && value === "") {
        editor.commands.setContent("");
      } else if (editor.getHTML() !== value && !editor.isFocused) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  const handleAiPolish = async () => {
    if (!editor) return;
    const currentContent = editor.getText().trim();

    setIsAiGenerating(true);
    try {
      // Call Gemini backend endpoint or heuristic generator
      const res = await aiApi.generateJobDescription(jobTitle || "Open Role", currentContent);
      if (res?.description) {
        editor.commands.setContent(res.description);
        onChange(res.description);
        toast.success("Job description generated & formatted with Gemini AI!");
      }
    } catch {
      // Fallback local structured formatter if endpoint is busy
      const fallbackHtml = `
<h2>Role Overview</h2>
<p>We are seeking a high-caliber <strong>${jobTitle || "Professional"}</strong> to join our high-impact team. In this role, you will architect resilient systems and drive technical execution.</p>

<h2>Key Responsibilities</h2>
<ul>
  <li>Lead design, development, and delivery of production-grade scalable services.</li>
  <li>Collaborate closely with cross-functional product, design, and engineering teams.</li>
  <li>Enforce high standards for code quality, architectural durability, and test coverage.</li>
  <li>Mentor junior engineers and champion engineering best practices.</li>
</ul>

<h2>Qualifications & Requirements</h2>
<ul>
  <li>Proven track record delivering reliable software in production environments.</li>
  <li>Proficiency with modern web frameworks, distributed architectures, and relational databases.</li>
  <li>Strong problem-solving abilities and clear technical communication skills.</li>
</ul>

<h2>Why Join Us</h2>
<p>Competitive compensation, equity ownership, comprehensive health benefits, and flexible hybrid remote options.</p>
`.trim();
      editor.commands.setContent(fallbackHtml);
      onChange(fallbackHtml);
      toast.success("Draft generated with structured template!");
    } finally {
      setIsAiGenerating(false);
    }
  };

  if (!editor) {
    return (
      <div className="border border-border rounded-lg p-6 bg-card flex items-center justify-center text-xs text-muted-foreground font-mono">
        <Loader2 className="size-4 animate-spin mr-2" />
        <span>Initializing TipTap Editor...</span>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card/60 overflow-hidden shadow-xs focus-within:border-primary/50 transition-colors">
      {/* Top Toolbar */}
      <div className="p-2 border-b border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-1.5">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Bold (Ctrl+B)"
          >
            <Bold className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Italic (Ctrl+I)"
          >
            <Italic className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("strike") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("code") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Inline Code"
          >
            <Code className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Heading 2 (H2)"
          >
            <Heading2 className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Heading 3 (H3)"
          >
            <Heading3 className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Bullet List"
          >
            <List className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Blockquote"
          >
            <Quote className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Divider Line"
          >
            <Minus className="size-3.5" />
          </Button>

          <div className="w-px h-4 bg-border mx-1" />

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-7 w-7 p-0 cursor-pointer disabled:opacity-30"
            title="Undo"
          >
            <Undo className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-7 w-7 p-0 cursor-pointer disabled:opacity-30"
            title="Redo"
          >
            <Redo className="size-3.5" />
          </Button>
        </div>

        {/* Right Controls: AI Assistant & View Switcher */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            onClick={handleAiPolish}
            disabled={isAiGenerating}
            className="h-7 px-2.5 text-xs font-mono font-semibold bg-linear-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white gap-1.5 shadow-xs cursor-pointer"
            title="Automatically draft or format this description using Gemini AI"
          >
            {isAiGenerating ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Sparkles className="size-3 text-amber-300" />
            )}
            <span>AI Copilot</span>
          </Button>

          <div className="flex rounded-md bg-secondary/80 p-0.5 border border-border">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === "edit"
                  ? "bg-background text-foreground shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="size-3" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === "preview"
                  ? "bg-background text-foreground shadow-xs font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="size-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Area: TipTap or Preview */}
      <div style={{ minHeight }} className="relative bg-background">
        {viewMode === "edit" ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className="p-4 text-xs sm:text-sm text-foreground leading-relaxed font-sans prose prose-invert max-w-none min-h-[180px]"
            dangerouslySetInnerHTML={{
              __html:
                editor.getHTML() ||
                `<p class="text-muted-foreground italic">No description entered yet. Switch back to Edit to write your role specification.</p>`,
            }}
          />
        )}
      </div>

      {/* Editor Footer / Word Count */}
      <div className="px-3 py-1.5 border-t border-border/60 bg-secondary/20 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>TipTap Rich WYSIWYG &bull; HTML Supported</span>
        <span>
          {editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0} words &bull;{" "}
          {editor.getText().length} chars
        </span>
      </div>
    </div>
  );
}
