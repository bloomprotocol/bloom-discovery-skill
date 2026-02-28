---
name: bloom-identity
description: >
  Zero questions asked. Reads your conversation memory in 60 seconds
  and reveals your builder personality, blind spots, and matched tools —
  ready to screenshot and share.
homepage: https://bloomprotocol.ai
metadata:
  {
    "openclaw": {
      "emoji": "🌸",
      "requires": { "bins": ["node", "npx"] }
    }
  }
---

# Bloom Identity Card Generator

Generate personalized Bloom Identity Cards based on **USER.md** (primary identity signal) and **conversation history** (enrichment).

## Trust & Privacy

- **Local analysis** — Your conversation is analyzed entirely on your machine.
  Raw messages never leave your device.
- **Read-only** — Reads session files and USER.md but never writes or modifies them.
- **Minimal transmission** — Only derived results (personality type, categories,
  approximate scores) are sent to Bloom API. Raw conversation text, personal
  identifiable information, and wallet keys are never transmitted.
- **User-initiated** — Only runs when you explicitly invoke the skill.
- **Open source** — Full source code at
  [gitlab.com/bloom-protocol/bloom-discovery-skill](https://gitlab.com/bloom-protocol/bloom-discovery-skill)

## Data Sources

### Primary: USER.md + Conversation History
- **USER.md** — Declared role, tech stack, interests, working style. Injected as first-class text into the personality analyzer. Falls back gracefully if not present.
- **Conversation history** — Always available from OpenClaw sessions. Analyzes topics, interests, engagement patterns.
- **Requires: Minimum 3 messages** in your session. If less than 3 messages, the skill returns a clear error.

## Output

- Personality type (Visionary / Explorer / Cultivator / Optimizer / Innovator)
- Custom tagline and description
- MentalOS spectrum (Learning, Decision, Novelty, Risk — each 0-100)
- Hidden pattern insight + AI-era playbook
- Main categories and subcategories
- Recommended tools from the Bloom skill catalog (with match scores)
- Dashboard link at bloomprotocol.ai

## Triggers

- "generate my bloom identity"
- "create my identity card"
- "analyze me"
- "what's my builder type"
- "discover my personality"
- "create my bloom card"

## Privacy Architecture

- **Local Differential Privacy (ε=1.0)** — MentalOS spectrum scores are noised via Laplace
  mechanism before transmission. Your exact scores stay on your device; the server receives
  only approximate values. (See: `src/utils/privacy.ts`)
- **SHA-256 Conversation Fingerprint** — Your conversation is hashed locally. Only the
  irreversible fingerprint is stored for deduplication — never the content.
- **Minimal Data Design** — Our server sees your personality type and approximate scores,
  never your raw messages or personal descriptions.

## Technical Details

- **Version**: 3.1.0
- **Privacy**: LDP ε=1.0 + SHA-256 fingerprint + E2EE (planned)
- **Analysis Engine**: MentalOS spectrum (4 dimensions) + category mapping
- **Primary Signal**: Conversation memory (~120 messages) + USER.md
- **Processing Time**: ~60 seconds
- **Output**: Personality card + tool recommendations + dashboard URL
- **Network**: Base (mainnet) — configurable via NETWORK env var

## Requirements

- Node.js 18+
- Environment variables:
  - `JWT_SECRET` — JWT signing secret (auto-generated on first run)
  - `DASHBOARD_URL` — Dashboard URL (default: https://bloomprotocol.ai)
  - `BLOOM_API_URL` — API URL (default: https://api.bloomprotocol.ai)
  - `NETWORK` — Network: `base-mainnet` or `base-sepolia` (default: base-mainnet)

## Installation

```bash
git clone https://gitlab.com/bloom-protocol/bloom-discovery-skill.git
cd bloom-identity-skill
npm install
```

---

Built by [Bloom Protocol](https://bloomprotocol.ai)
