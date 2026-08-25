# AI Cost Control

## Policy

The RedKross OSINT Investigation Platform uses **FREE and LOCAL AI only** by default. No automatic paid API usage is permitted.

---

## Configuration

### Environment Variables

```bash
# .env (NEVER commit this file)
AI_PROVIDER=ollama
AI_ALLOW_PAID=false
AI_MODEL_PRIMARY=qwen3:8b
AI_MODEL_SECONDARY=qwen3:4b
AI_MODEL_FALLBACK=tinyllama
OLLAMA_BASE_URL=http://localhost:11434
```

### Defaults

| Setting | Default | Description |
|---|---|---|
| `AI_PROVIDER` | `ollama` | Active AI provider |
| `AI_ALLOW_PAID` | `false` | Paid APIs disabled |
| `AI_MODEL_PRIMARY` | `qwen3:8b` | Primary coding model |
| `AI_MODEL_SECONDARY` | `qwen3:4b` | Secondary/faster model |
| `AI_MODEL_FALLBACK` | `tinyllama` | Ultra-light fallback |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama endpoint |

---

## Fallback Chain

```
PRIMARY: qwen3:8b (local)
    ↓ limit/unavailable
SECONDARY: qwen3:4b (local)
    ↓ limit/unavailable
FALLBACK: tinyllama (local)
    ↓ unavailable
STOP — "NO FREE MODEL AVAILABLE — HUMAN ACTION REQUIRED"
```

**NEVER** automatically switches to a paid provider.

---

## Cost Protection Mechanisms

### 1. Provider Restriction
- Only `ollama` is configured by default
- No API keys for paid services exist in the repository
- `.env.example` does not include paid provider placeholders

### 2. Git Protection
- `.gitignore` excludes `.env`
- CI pipeline includes secret scanning
- CODEOWNERS prevents unauthorized changes to configuration

### 3. Runtime Checks
- AI service module checks `AI_ALLOW_PAID` before calling any provider
- If `AI_ALLOW_PAID=false`, paid providers throw an explicit error
- No silent fallback to paid services

### 4. Monitoring
- All AI calls are logged with provider, model, and token count
- Monthly review of AI usage logs
- Alert if any paid provider is invoked

---

## Model Limits

### Per-Session Token Limits

| Model | Max Input Tokens | Max Output Tokens |
|---|---|---|
| qwen3:8b | 128,000 | 8,192 |
| qwen3:4b | 32,000 | 4,096 |
| tinyllama | 2,048 | 512 |

### Rate Limits

| Constraint | Limit |
|---|---|
| Max concurrent AI requests | 3 |
| Max requests per minute | 30 |
| Max tokens per hour | 500,000 |
| Max model load time | 60 seconds |

---

## Adding a New Free Provider

If a genuinely free provider is discovered:

1. Verify it is truly free (no billing required)
2. Verify data privacy terms are acceptable
3. Add configuration to `.env.example`
4. Update `docs/AI_MODEL_STRATEGY.md`
5. Add provider to fallback chain
6. Update AI service module
7. Get technical architect approval
8. Document in PR

---

## What Must NEVER Happen

1. API key for a paid service committed to repository
2. Automatic fallback to paid provider
3. Billing information stored in code or config
4. Paid API called without explicit user action
5. Cost incurred without user awareness
