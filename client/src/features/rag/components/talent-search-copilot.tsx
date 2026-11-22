"use client";

import React, { useState } from "react";
import { useTalentSearchMutation } from "../hooks/use-rag";
import { TalentSearchResult } from "../types/rag";
import {
  Search,
  SlidersHorizontal,
  FileText,
  ExternalLink,
  MapPin,
  Briefcase,
  Quote,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PRESET_QUERIES = [
  "Distributed systems with Kafka & high throughput",
  "Senior React engineer with Design Systems & TypeScript",
  "DevOps / SRE with Kubernetes, Terraform & AWS multi-region",
  "Full-stack engineer with PostgreSQL, Spring Boot & modern web",
];

export function TalentSearchCopilot() {
  const [query, setQuery] = useState("");
  const [minYoe, setMinYoe] = useState<number | undefined>(undefined);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const searchMutation = useTalentSearchMutation();

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    searchMutation.mutate({
      query: searchQuery.trim(),
      minYearsExperience: minYoe,
      requiredSkill: selectedSkill ? selectedSkill.trim() : undefined,
      limit: 10,
    });
  };

  const results = searchMutation.data?.candidates || [];

  return (
    <div className="space-y-6">
      {/* Header and description */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          Semantic Talent Search
        </h2>
        <p className="text-sm text-muted-foreground">
          Find candidates across the talent pool using natural language queries grounded in verified resume vector embeddings.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="e.g. Senior backend engineer with experience scaling Kafka or distributed databases..."
              className="pl-9 pr-4 h-11 bg-background text-sm border-border focus-visible:ring-1"
            />
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-3.5 gap-2 border-border ${
              showFilters ? "bg-muted text-foreground" : "text-muted-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <Button
            onClick={() => handleSearch(query)}
            disabled={searchMutation.isPending || !query.trim()}
            className="h-11 px-5 gap-2"
          >
            {searchMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Search Talent</span>
          </Button>
        </div>

        {/* Filters collapse */}
        {showFilters && (
          <div className="p-3.5 rounded-lg border border-border bg-muted/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Minimum Experience (Years)
              </label>
              <Input
                type="number"
                min={0}
                max={25}
                value={minYoe ?? ""}
                onChange={(e) =>
                  setMinYoe(e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="Any"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Required Keyword / Skill
              </label>
              <Input
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                placeholder="e.g. Kafka, Next.js, Go"
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>
        )}

        {/* Preset query chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground">Suggested queries:</span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSearch(preset)}
              className="text-xs px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/60"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Search results summary */}
      {searchMutation.data && (
        <div className="p-3.5 rounded-lg border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>{searchMutation.data.talentLandscapeSummary}</p>
          <span className="font-medium text-foreground whitespace-nowrap">
            {searchMutation.data.totalCandidatesMatched} candidates matched
          </span>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((candidate: TalentSearchResult) => (
          <div
            key={candidate.candidateId}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {candidate.candidateName}
                  </h3>
                  <Badge variant="outline" className="text-xs font-mono font-normal">
                    {candidate.matchPercentage}% Semantic Match
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidate.headline || "Software Engineering Specialist"}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                  {candidate.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {candidate.location}
                    </span>
                  )}
                  {candidate.yearsOfExperience !== undefined && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {candidate.yearsOfExperience} yrs experience
                    </span>
                  )}
                </div>
              </div>

              {candidate.resumeUrl && (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2.5 py-1 transition-colors self-start"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 7).map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Grounded Citations Box */}
            {candidate.citations && candidate.citations.length > 0 && (
              <div className="rounded-md border border-border/70 bg-muted/20 p-2.5 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Quote className="w-3 h-3" />
                  <span>Grounded Resume Excerpts (Vector Citations)</span>
                </div>
                <div className="space-y-1.5">
                  {candidate.citations.map((cite, i) => (
                    <div
                      key={i}
                      className="pl-2 border-l-2 border-border/80 text-muted-foreground font-mono text-[11px] leading-relaxed"
                    >
                      <span className="font-semibold text-foreground/80">
                        [{cite.sectionType}] {cite.title}:
                      </span>{" "}
                      &ldquo;{cite.snippet}&rdquo;
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {searchMutation.isSuccess && results.length === 0 && (
          <div className="p-8 text-center border border-dashed border-border rounded-lg space-y-2">
            <BookOpen className="w-6 h-6 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-foreground">No candidate matches found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your query terms or lowering the minimum experience requirements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
