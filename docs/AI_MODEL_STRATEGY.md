# AI Model Strategy — RedKross OSINT Investigation Platform

**Date:** 25 August 2026
**Status:** Active

---

## 1. Hardware Assessment

### Development Machine (Primary)

| Component | Specification |
|---|---|
| CPU | Intel Core i5-12500H (12 cores / 16 threads) |
| RAM | 16 GB |
| GPU | NVIDIA GeForce RTX 3050 Laptop |
| VRAM | 4 GB (3.4 GB available) |
| Storage (C:) | 85 GB free / 410 GB total |
| Storage (D:) | 76 GB free / 209 GB total |
| OS | Windows 11 Home Single Language |
| Docker | 29.4.2 |
| Node.js | v24.15.0 |
| Python | 3.14.4 |

### Hardware Constraints

- **4 GB VRAM** limits GPU-accelerated models to ~3-4B parameters
- **16 GB RAM** limits total system load; Ollama + OS + browser + IDE consume ~8-10 GB
- **Available VRAM for models: ~3.4 GB** (after OS/GPU overhead)
- CPU inference is viable for smaller models when GPU is full

---

## 2. Installed Ollama Models

| Model | Parameters | Disk Size | VRAM Required | Status |
|---|---|---|---|---|
| qwen3:8b | 8B | 5.2 GB | ~5 GB | Installed — will require CPU offloading on this GPU |
| qwen3:4b | 4B | 2.5 GB | ~2.5 GB | Installed — fits in VRAM |
| moondream:latest | 1.6B | 1.7 GB | ~1.5 GB | Installed — vision model |
| tinyllama | 1.1B | 637 MB | ~0.6 GB | Installed — ultra-light |

### Model Compatibility with This Hardware

| Model | GPU Offload | CPU Only | Quality for Coding |
|---|---|---|---|
| qwen3:8b | Partial (layers split) | Yes, slower | Best |
| qwen3:4b | Full | Yes | Good |
| moondream | Full | Yes | Vision only — not for coding |
| tinyllama | Full | Yes | Basic — limited coding ability |

---

## 3. Recommended Model Configuration

### For Coding Tasks

| Priority | Model | Use Case | Expected Performance |
|---|---|---|---|
| PRIMARY | qwen3:4b | General coding, implementation | Fast, good quality, fits in VRAM |
| SECONDARY | qwen3:8b | Complex reasoning, architecture | Slower (partial GPU), best quality |
| TERTIARY | tinyllama | Simple tasks, formatting | Very fast, limited quality |

### For Reasoning/Architecture Tasks

| Priority | Model | Use Case |
|---|---|---|
| PRIMARY | qwen3:8b | Architecture decisions, complex debugging |
| SECONDARY | qwen3:4b | Moderate reasoning tasks |

### For Documentation/Simple Tasks

| Priority | Model | Use Case |
|---|---|---|
| PRIMARY | qwen3:4b | Documentation, simple generation |
| SECONDARY | tinyllama | Formatting, repetitive tasks |

---

## 4. Model Fallback Order

### General Development

```
1. qwen3:4b (fast, fits VRAM)
   ↓ timeout or error
2. qwen3:8b (better quality, slower)
   ↓ timeout or error
3. tinyllama (ultra-light, limited)
   ↓ unavailable
4. STOP — "NO FREE MODEL AVAILABLE — HUMAN ACTION REQUIRED"
```

### Complex Tasks

```
1. qwen3:8b (best reasoning)
   ↓ timeout or error
2. qwen3:4b (decent reasoning, faster)
   ↓ timeout or error
3. tinyllama (minimal)
   ↓ unavailable
4. STOP
```

---

## 5. Recommended Additional Models

Given 4 GB VRAM and 16 GB RAM, the following models would also be viable:

| Model | Size | VRAM | Why |
|---|---|---|---|
| qwen3:1.7b | ~1 GB | ~1 GB | Ultra-fast, better than tinyllama |
| codellama:7b-q4 | ~3.8 GB | ~3 GB | Code-specialized |
| deepseek-coder:6.7b-q4 | ~3.5 GB | ~3 GB | Code-specialized |
| phi-3:3.8b | ~2.2 GB | ~2 GB | Good small reasoning model |

**NOT Recommended** (too large for this hardware):
- qwen3:14b (~9 GB VRAM)
- llama3:70b (~40 GB VRAM)
- codellama:34b (~20 GB VRAM)

---

## 6. How to Switch Models

### In OpenCode Configuration

Edit `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "model": "qwen3:4b"
    }
  }
}
```

### Via Environment Variable

```bash
set AI_MODEL_PRIMARY=qwen3:4b
```

### Via Ollama CLI

```bash
# Pull a new model
ollama pull codellama:7b-q4

# Remove a model
ollama rm moondream:latest

# Verify a model works
ollama run qwen3:4b "Write a TypeScript function to hash a string with SHA-256"
```

---

## 7. How to Verify a Model

### Quick Test

```bash
ollama run qwen3:4b "What is 2 + 2?"
```

### Coding Test

```bash
ollama run qwen3:4b "Write a TypeScript function: function hashSHA256(input: string): Promise<string>"
```

### Benchmark

```bash
# Time a generation
$ stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
ollama run qwen3:4b "Explain the difference between REST and GraphQL in 3 sentences"
$ stopwatch.Stop()
Write-Host "Elapsed: $($stopwatch.Elapsed.TotalSeconds) seconds"
```

---

## 8. Resource Monitoring

Monitor during development:

```bash
# Check Ollama process memory
Get-Process ollama | Select-Object WorkingSet64

# Check GPU usage
nvidia-smi

# Check available memory
Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory, TotalVisibleMemorySize
```

---

## 9. Privacy Policy for AI Models

| Data Type | Safe for Local Models | Safe for Cloud Free | Never Send |
|---|---|---|---|
| Public open-source code | Yes | Yes | — |
| RedKross source code | Yes | No | — |
| Test data | Yes | Yes (if synthetic) | — |
| Investigation data | Yes | No | — |
| Credentials/secrets | Yes (local only) | No | Cloud: No |
| Architecture docs | Yes | Yes (generic only) | — |

**Rule:** When in doubt, use local models.

---

## 10. Verification of Free-Only Status

To confirm no paid APIs are configured:

```bash
# Check for API keys in environment
Get-ChildItem env: | Where-Object { $_.Name -like "*API*" -or $_.Name -like "*KEY*" -or $_.Name -like "*TOKEN*" }

# Check .env file (should not exist or should have no paid keys)
if (Test-Path .env) { Get-Content .env } else { "No .env file" }

# Check opencode config
Get-Content ~/.config/opencode/opencode.jsonc
```
