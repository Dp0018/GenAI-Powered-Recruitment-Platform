# Agent Guidelines for Job Portal

All AI agents working on this codebase must follow the design and engineering standards outlined below.

## Mandatory Design Skill: `unslop`

This workspace includes the **`unslop`** design skill located at [`.agents/skills/unslop/SKILL.md`](.agents/skills/unslop/SKILL.md) and rules at [`.agents/rules/unslop.md`](.agents/rules/unslop.md).

### When modifying or creating UI components:
1. **Always activate and follow the `unslop` skill** before generating frontend code.
2. **Quiet chrome, rich content**:
   - Keep navigation bars, card borders, and backgrounds neutral and calm.
   - Avoid spreading glowing borders, rainbow gradients, or glowing neon boxes across surfaces.
3. **Ban AI UI tells**:
   - **No emoji labels in buttons/nav** (e.g. no `🚀 Launch`, `✨ Upgrade`, `🔥 Hot Jobs`). Use crisp Lucide icons.
   - **No fake badges** with sparkles (`✨`, `🪄`).
   - **No neon gradient soup** (e.g. purple/indigo neon blobs).
   - **No robotic, throat-clearing copy** (e.g. "In today's fast-paced digital world...").
   - **No uppercase tracked shouting labels** (`tracking-[0.3em] uppercase`).
4. **Authentic character**:
   - Designed for high-performing software engineering teams and candidates. Fast, dense, keyboard-friendly, and quiet like Linear or GitHub.
