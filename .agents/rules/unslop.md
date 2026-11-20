---
name: unslop-design-rules
description: Strict guidelines to eliminate AI UI slop and enforce human design craft across all frontend components.
---

# Design & Anti-AI Slop Rules

All AI agents working on this codebase must adhere to the `unslop` skill instructions located at `.agents/skills/unslop/SKILL.md`.

## Core Directives

1. **Quiet Chrome, Rich Content**:
   - Keep navigation bars, backgrounds, borders, and buttons quiet and neutral.
   - Do NOT spread glowing effects, rainbow gradients, or glowing neon borders over every container.
   - Put richness into deliberate content moments (clean typography, crisp charts, authentic company logos, realistic candidate avatars).

2. **Ban Predictable AI Tells**:
   - **No emoji labels in buttons or navigation**: (e.g., avoid `🚀 Launch`, `✨ Upgrade`, `🔥 Hot Jobs`). Use clean, crisp semantic Lucide icons instead.
   - **No fake "New ✨" or "AI-Powered 🪄" badges**: Avoid spamming sparkle emojis.
   - **No generic purple-indigo neon gradient soup**: Use tailored, subdued palettes (slate/zinc neutrals with a deliberate primary accent like clean sky/amber/emerald).
   - **No uppercase tracked shouting labels**: Keep typography natural and legible (`font-medium text-xs text-muted-foreground` instead of `UPPERCASE TRACKING-[0.3em]`).
   - **No excessive pulsing / infinite bouncing animations**: Micro-animations should be subtle and functional, not distracting.

3. **Authentic Product Character**:
   - Design for the product's actual world: This is an enterprise-grade technical recruitment platform for top-tier software engineers and scale-up tech firms (Stripe, Linear, Vercel, Datadog).
   - Maintain the sub-50ms snappy, local-first feel of Linear and GitHub.

4. **Copywriting Standards**:
   - Clear, concise, active voice.
   - Remove robotic throat-clearing ("In today's fast-paced digital world...", "Not only X, but also Y").
   - State exactly what the feature does in one plain, concrete sentence.
