"use client";

import React, { useState } from "react";
import { JobQuestionItem, JobQuestionType } from "../types/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, HelpCircle, CheckSquare, AlignLeft, ToggleLeft } from "lucide-react";

interface JobScreeningQuestionsBuilderProps {
  questions: JobQuestionItem[];
  onChange: (questions: JobQuestionItem[]) => void;
}

export function JobScreeningQuestionsBuilder({
  questions,
  onChange,
}: JobScreeningQuestionsBuilderProps) {
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState<JobQuestionType>("TEXT");
  const [newRequired, setNewRequired] = useState(true);
  const [optionsInput, setOptionsInput] = useState("");

  const handleAddQuestion = () => {
    if (!newText.trim()) return;

    let options: string[] = [];
    if (newType === "CHOICE") {
      options = optionsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (options.length < 2) {
        options = ["Option 1", "Option 2"];
      }
    }

    const newQuestion: JobQuestionItem = {
      questionText: newText.trim(),
      questionType: newType,
      required: newRequired,
      options,
      orderIndex: questions.length,
    };

    onChange([...questions, newQuestion]);
    setNewText("");
    setOptionsInput("");
    setNewType("TEXT");
    setNewRequired(true);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    onChange(updated.map((q, i) => ({ ...q, orderIndex: i })));
  };

  return (
    <div className="space-y-3 p-4 rounded-lg border border-border bg-card/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-primary" />
          <h4 className="text-xs font-semibold text-foreground tracking-tight">
            Pre-Screening Candidate Questions
          </h4>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {questions.length} Question{questions.length !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Ask candidates specific qualifying questions (e.g. work authorization, years of experience, or availability) during the application flow.
      </p>

      {/* Existing Questions List */}
      {questions.length > 0 && (
        <div className="space-y-2 pt-1">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-3 rounded-md border border-border bg-secondary/30 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-primary font-bold">#{idx + 1}</span>
                  <span className="font-medium text-foreground">{q.questionText}</span>
                  {q.required ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-destructive/10 text-destructive border border-destructive/20">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                      Optional
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <span className="capitalize">{q.questionType.toLowerCase()}</span>
                  {q.options && q.options.length > 0 && (
                    <span>• Choices: [{q.options.join(", ")}]</span>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveQuestion(idx)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Question Row */}
      <div className="pt-2 border-t border-border space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <div className="sm:col-span-3">
            <Input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. Are you legally authorized to work in the United States?"
              className="h-8 text-xs bg-background"
            />
          </div>
          <div className="sm:col-span-1">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as JobQuestionType)}
              className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground font-mono cursor-pointer"
            >
              <option value="TEXT">Short Text</option>
              <option value="BOOLEAN">Yes / No</option>
              <option value="CHOICE">Multiple Choice</option>
            </select>
          </div>
        </div>

        {newType === "CHOICE" && (
          <div>
            <Input
              value={optionsInput}
              onChange={(e) => setOptionsInput(e.target.value)}
              placeholder="Comma separated choices (e.g. Yes, No, Remote Only)"
              className="h-8 text-xs bg-background font-mono"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newRequired}
              onChange={(e) => setNewRequired(e.target.checked)}
              className="rounded border-border accent-primary size-3.5 cursor-pointer"
            />
            <span>Candidate must answer before submitting</span>
          </label>

          <Button
            type="button"
            size="sm"
            onClick={handleAddQuestion}
            disabled={!newText.trim()}
            className="h-7 text-xs font-mono gap-1"
          >
            <Plus className="size-3" />
            <span>Add Question</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
