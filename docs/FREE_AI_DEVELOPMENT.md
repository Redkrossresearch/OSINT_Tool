# Free AI Development Guide

## Purpose

Every intern on the RedKross OSINT Investigation Platform must be able to develop using AI assistants **without purchasing any AI subscription**. This document explains how.

---

## Development AI Stack

| Tool | Purpose | Cost |
|---|---|---|
| OpenCode | AI coding assistant (CLI) | Free |
| Ollama | Local model runtime | Free |
| Local models | Code generation, reasoning, analysis | Free |

---

## OpenCode Setup

OpenCode is configured at:
- Global: `~/.config/opencode/opencode.jsonc`
- Project: `.opencode/opencode.json` (in repository root)

OpenCode connects to Ollama by default. No API key is required for local models.

---

## Ollama Usage

### Starting Ollama

```bash
ollama serve
```

Ollama runs as a local service on `http://localhost:11434`. No internet connection required.

### Listing Available Models

```bash
ollama list
```

### Running a Model

```bash
ollama run qwen3:4b
```

### Pulling a New Model

```bash
ollama pull qwen3:8b
```

### Removing a Model

```bash
ollama rm <model-name>
```

---

## Model Fallback Order

The recommended fallback order (configured in `.opencode/opencode.json`):

1. **qwen3:8b** — Best local coding model (5.2 GB, ~3.2 GB VRAM)
2. **qwen3:4b** — Faster, lighter alternative (2.5 GB, ~2 GB VRAM)
3. **tinyllama** — Ultra-light for simple tasks (637 MB)

**NEVER** falls back to a paid cloud provider automatically.

If all local models are unavailable, OpenCode will report an error. A human must explicitly configure a free cloud provider.

---

## API Key Handling

### Rules

1. **NEVER** commit API keys to the repository
2. **NEVER** hardcode API keys in source files
3. **NEVER** share API keys in chat, Slack, or email
4. **ALWAYS** use environment variables for any keys
5. **ALWAYS** add `.env` to `.gitignore`

### If a Free Cloud Provider Is Used

1. Store the API key in `.env` (never committed)
2. Add the provider to `.env.example` with a placeholder
3. Document the provider in `docs/AI_MODEL_STRATEGY.md`
4. Confirm the provider has a genuine free tier
5. Confirm no billing information is required

### Providers Classified as PAID (Disabled by Default)

| Provider | Classification | Action |
|---|---|---|
| OpenAI (GPT-4, etc.) | PAID | DISABLED |
| Anthropic (Claude) | PAID | DISABLED |
| Google Gemini (paid tiers) | PAID | DISABLED |
| Any provider requiring billing | PAID | DISABLED |

---

## Privacy Rules

### Safe for Cloud Free Models
- Public open-source code
- Generic programming questions
- Non-sensitive architectural discussions
- Documentation content
- Test data (non-production)

### NEVER Send to Cloud Models
- Production investigation data
- Real entity information from cases
- Customer credentials or secrets
- Internal API keys
- Database credentials
- Proprietary source code (unless open-source project)
- Evidence from real investigations

### Prefer Local Ollama For
- All proprietary RedKross source code
- Architecture discussions involving internal systems
- Any code that handles investigation data
- Security-sensitive code
- Database schemas with real data references

---

## Context Management

Local models have smaller context windows than cloud models. Work in small tasks:

### Bad (Too Large)
```
"Build the entire connector framework, including all five connectors,
the registry, health monitoring, rate limiting, and tests."
```

### Good (Focused)
```
"Implement the DNS connector that satisfies the ConnectorInterface
defined in packages/schemas/connector.ts. Follow the example in
connectors/web-search.ts. Write tests in connectors/__tests__/dns.test.ts."
```

### Context Window Guidelines

| Model | Context | Recommended Max Input |
|---|---|---|
| qwen3:8b | 128K | ~2000 tokens per request |
| qwen3:4b | 32K | ~1500 tokens per request |
| tinyllama | 2K | ~500 tokens per request |

Always include only:
1. The task description
2. Relevant interfaces/schemas
3. The specific file(s) to modify
4. Related test files

---

## Code Review Requirements

Even with AI assistance:
1. Every AI-generated line must be reviewed by a human before PR
2. AI must not be the sole author — a human must understand and approve
3. Run all tests before submitting
4. Run linter and type checker before submitting
5. If the AI generates something you don't understand, ask before committing

---

## Cost Protection Summary

| Protection | Mechanism |
|---|---|
| Default provider | Ollama (local, free) |
| Paid APIs disabled | Not configured; no keys in repo |
| Fallback chain | Local models only |
| No auto-billing | No provider with billing is configured |
| .env protection | `.gitignore` excludes secrets |
| CI scanning | Secret scanning prevents key commits |
| Documentation | This guide + AI_COST_CONTROL.md |

**If all free/local models are unavailable:**

```
NO FREE MODEL AVAILABLE — HUMAN ACTION REQUIRED
```

The system will NOT silently use a paid provider.
