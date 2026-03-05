# 🌸 Bloom Discovery

**Understand how you learn, decide, and build — then get the right tools for the AI era.**

[![Version](https://img.shields.io/badge/version-3.1.0-blue)](https://github.com/bloomprotocol/bloom-discovery-skill)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-green)](https://openclaw.ai)
[![ClawHub](https://img.shields.io/badge/ClawHub-Published-purple)](https://clawhub.ai/unicornbloom/bloom-discovery)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

---

## What Is This?

Bloom Discovery analyzes your conversations and USER.md to build a **builder profile** — how you learn, how you make decisions, what your strengths are — then recommends tools matched to your style.

```bash
/bloom
```

That's it. ~3 seconds.

---

## What You Get

### On the Card
- **Personality Type** — Visionary, Explorer, Cultivator, Optimizer, or Innovator
- **Custom Tagline** — One-liner that captures your style
- **3-Sentence Description** — Your personality + learning/decision style + AI-era angle
- **Hidden Pattern Insight** — Something about yourself you might not realize (e.g., "You describe yourself as methodical, but your actions say hands-on learner")
- **Categories & Strengths** — What you care about and what you're good at

### On the Dashboard
- **MentalOS Spectrum** — Learning, Decision, Novelty, Risk (each 0-100)
- **AI-Era Playbook** — Personalized advice:
  - **Leverage** — Your style's advantage in the AI era
  - **Watch out** — Your blind spot
  - **Next move** — Specific action based on your learning x risk combo
- **Tool Recommendations** — From the Bloom skill catalog, scored and matched to your profile
- **Shareable Link** — `bloomprotocol.ai/agents/{id}`

---

## MentalOS Spectrum

| Spectrum | Low (0) | High (100) | Question |
|----------|---------|------------|----------|
| **Learning** | Try First | Study First | Jump in or read the docs? |
| **Decision** | Gut | Analytical | Instinct or methodical? |
| **Novelty** | Early Adopter | Proven First | Bleeding edge or battle-tested? |
| **Risk** | All In | Measured | Go big or hedge? |

## 5 Personality Types

| Type | Style |
|------|-------|
| 💜 **The Visionary** | High conviction + high intuition — backs bold ideas early |
| 💚 **The Explorer** | Low conviction + high intuition — experiments widely |
| 🩵 **The Cultivator** | High contribution — builds communities and shares knowledge |
| 🧡 **The Optimizer** | High conviction + low intuition — doubles down on what works |
| 💙 **The Innovator** | Low conviction + low intuition — spots patterns others miss |

## 6 Hidden Pattern Detectors

Bloom surfaces insights you might not see yourself, in priority order:

1. **Layer Mismatch** — Your words and actions disagree (e.g., you say "research" but you actually ship first)
2. **Spectrum Extreme** — Any spectrum score < 15 or > 85
3. **Episode Dominance** — One behavioral pattern dominates your story (e.g., 8 out of 10 episodes are pivots)
4. **Stealth Contributor** — High community contribution without the Cultivator label
5. **Strength Synergy** — Rare strength combos (Builder + Designer, Analyst + Writer, etc.)
6. **Boundary Dweller** — Sitting right at a personality threshold (±4 points)

---

## How It Works

1. **Collect signals** — USER.md (primary) + conversation history (~120 messages) + optional feedback
2. **Build personality profile** — 4 spectrums + personality type + strengths + categories
3. **Detect hidden pattern** — 6 detectors run in priority order, first match wins
4. **Generate AI playbook** — Leverage / watch-out / next-move based on spectrum combos
5. **Recommend tools** — Match profile against the Bloom skill catalog (scored by category, personality boost, and community backing)
6. **Create dashboard** — Shareable card at `bloomprotocol.ai/agents/{id}`

---

## Quick Start

### OpenClaw Users

```bash
/bloom
```

### Developers

```bash
git clone https://github.com/bloomprotocol/bloom-discovery-skill.git
cd bloom-discovery-skill
npm install
cp .env.example .env

# Run from session file
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  <userId>

# Or pipe conversation text
echo "your conversation" | npx tsx scripts/run-from-context.ts --user-id <userId>
```

### ClawHub

```bash
clawhub install bloom-discovery
```

---

## Configuration

```bash
# Required
JWT_SECRET=your_secret_key_here
DASHBOARD_URL=https://bloomprotocol.ai

# Optional (agent wallet)
CDP_API_KEY_ID=your_coinbase_key
CDP_API_KEY_SECRET=your_coinbase_secret
NETWORK=base-mainnet
```

---

## Privacy

- Conversation analyzed locally — raw text never uploaded
- USER.md read locally — only analysis results sent to API
- No wallet transaction scraping
- No social auth required
- Open source — audit the algorithm yourself

---

## Links

- **Homepage**: [bloomprotocol.ai](https://bloomprotocol.ai)
- **ClawHub**: [clawhub.ai/unicornbloom/bloom-discovery](https://clawhub.ai/unicornbloom/bloom-discovery)
- **Source**: [github.com/bloomprotocol/bloom-discovery-skill](https://github.com/bloomprotocol/bloom-discovery-skill)
- **Dashboard**: [bloomprotocol.ai/agents](https://bloomprotocol.ai/agents)

---

**Built by [Bloom Protocol](https://bloomprotocol.ai) 🌸**

*For indie devs, vibe coders, and AI builders who want to understand themselves and find the right tools.*

*Built with [@openclaw](https://openclaw.ai), [@coinbase](https://www.coinbase.com/cloud), and [@base](https://base.org)*
