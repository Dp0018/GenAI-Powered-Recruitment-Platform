"use client";

import React, { useState } from "react";
import { useResumeChatMutation } from "../hooks/use-rag";
import { ResumeChatResponse } from "../types/rag";
import {
  MessageSquare,
  Send,
  Loader2,
  Quote,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_QUESTIONS = [
  "What database scale or throughput did they manage?",
  "Did they hold any team leadership or mentoring roles?",
  "What were their core contributions at their most recent company?",
  "What technologies have they used for cloud infrastructure?",
];

interface ChatHistoryItem {
  question: string;
  answer: string;
  confidence: string;
  citations: Array<{ sectionType: string; title: string; snippet: string }>;
}

interface ResumeChatDrawerProps {
  candidateId: string;
  candidateName?: string;
}

export function ResumeChatDrawer({
  candidateId,
  candidateName = "Candidate",
}: ResumeChatDrawerProps) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);

  const chatMutation = useResumeChatMutation(candidateId);

  const handleSend = (q: string) => {
    if (!q.trim() || chatMutation.isPending) return;
    const currentQ = q.trim();
    setQuestion("");

    chatMutation.mutate(
      { question: currentQ },
      {
        onSuccess: (res: ResumeChatResponse) => {
          setHistory((prev) => [
            ...prev,
            {
              question: res.question,
              answer: res.answer,
              confidence: res.confidenceGrade,
              citations: res.citations || [],
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Chat with {candidateName}&apos;s Resume
          </h3>
          <p className="text-xs text-muted-foreground">
            Grounded Q&A strictly backed by citations from the candidate&apos;s verified CV.
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[280px] max-h-[460px]">
        {history.length === 0 && (
          <div className="py-8 text-center space-y-3">
            <Bot className="w-8 h-8 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Ask anything about {candidateName}&apos;s background
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                RAG pulls exact passages from their resume and synthesizes factual, hallucination-free answers.
              </p>
            </div>

            {/* Quick suggested questions */}
            <div className="flex flex-col gap-1.5 max-w-md mx-auto pt-2">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-xs text-left px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/60"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((item, idx) => (
          <div key={idx} className="space-y-2.5">
            {/* User Question */}
            <div className="flex items-start gap-2 justify-end">
              <div className="rounded-lg bg-primary text-primary-foreground px-3.5 py-2 text-xs max-w-[85%]">
                {item.question}
              </div>
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* AI Grounded Answer */}
            <div className="flex items-start gap-2 justify-start">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="space-y-2 max-w-[90%]">
                <div className="rounded-lg border border-border bg-card p-3 text-xs text-foreground space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5">
                    <span className="font-semibold text-[11px] text-muted-foreground">
                      Recruitment Copilot
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        item.confidence === "HIGH_CONFIDENCE"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.confidence === "HIGH_CONFIDENCE"
                        ? "High Confidence"
                        : "Moderate Evidence"}
                    </Badge>
                  </div>

                  <p className="leading-relaxed">{item.answer}</p>

                  {/* Citations */}
                  {item.citations && item.citations.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-border/40 text-[11px]">
                      <span className="font-medium text-muted-foreground flex items-center gap-1">
                        <Quote className="w-3 h-3" />
                        Grounded Citations:
                      </span>
                      {item.citations.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="pl-2 border-l-2 border-border text-muted-foreground font-mono text-[10px]"
                        >
                          <span className="font-semibold text-foreground/80">
                            [{c.sectionType}] {c.title}:
                          </span>{" "}
                          &ldquo;{c.snippet}&rdquo;
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching vector chunks & synthesizing grounded response...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="pt-2 border-t border-border flex items-center gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(question);
            }
          }}
          placeholder="Ask a question about this resume..."
          className="text-xs h-9 bg-background border-border"
          disabled={chatMutation.isPending}
        />
        <Button
          size="sm"
          onClick={() => handleSend(question)}
          disabled={chatMutation.isPending || !question.trim()}
          className="h-9 px-3 gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
