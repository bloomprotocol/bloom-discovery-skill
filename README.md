# 🌸 Bloom Taste Finder (Bloom Identity Skill)

**AI skill that analyzes your conversations to uncover builder taste and recommend the right tools.**

[![Version](https://img.shields.io/badge/version-2.1.0-blue)](https://github.com/unicornbloom/bloom-identity-skill)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-green)](https://openclaw.ai)
[![ClawHub](https://img.shields.io/badge/ClawHub-Published-purple)](https://clawhub.ai/skills/bloom)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

---

## 🎯 What Is This?

**Bloom Taste Finder** reveals your builder taste and recommends tools, projects, and skills based on your unique preferences and personality.

Unlike traditional recommendation systems that rely on popularity, Bloom Taste Finder analyzes nuanced patterns in user behavior to understand their unique "taste" — then finds and matches them with tools they'll genuinely love.

**Key Features:**
- 🎴 **5 Personality Types** – Discover your taste archetype (The Visionary, The Explorer, etc.)
- 📊 **4-Dimension Taste Profile** – See where you land on Learning, Decision, Novelty, and Risk spectrums
- 🎯 **Taste-Based Recommendations** – Get personalized tool suggestions from 3 sources:
  - ClawHub Skills (200+ community-created AI agent skills)
  - Claude Code (Official Anthropic + 6 community repositories)
  - GitHub Repositories (1000+ open source projects)
- 🌱 **Self-Growing Agent** – Recommendations evolve as you interact, with USER.md integration and feedback loops
- 🔗 **Shareable Identity Card** – Showcase your taste profile
- 🤖 **Agent-Ready** – Works with Claude Code, OpenClaw, and other AI agents

---

## ⚡️ Quick Start

### For OpenClaw Users

```bash
/bloom
```

That's it. Get your taste profile in ~3 seconds.

### For Developers

```bash
# Clone and install
git clone https://github.com/unicornbloom/bloom-identity-skill.git
cd bloom-identity-skill
npm install

# Set up environment
cp .env.example .env
# Edit .env with your keys

# Run analysis
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  <userId>
```

---

## 🌟 Why Bloom Taste Finder?

### For AI Agents
Help your users discover tools they'll actually love — not just popular ones, but tools that match their unique taste and personality.

### For Users
- **Save Time** – No need to browse hundreds of tools
- **Truly Personalized** – Goes beyond popularity to match individual taste
- **Multi-Source** – Aggregates from ClawHub, Claude Code, and GitHub (200+ sources total)
- **Nuanced Understanding** – Analyzes personality, not just keywords

### For Developers
- **Easy Integration** – Simple CLI command or API call
- **High Quality** – Curated from trusted sources (Anthropic, ClawHub, GitHub)
- **Open Source** – Audit the taste algorithm yourself
- **Free to Use** – Open for all AI agents

---

## 📊 Taste Profile

Bloom maps you across **4 taste spectrums** — each a slider between two poles:

| Spectrum | Left Pole | Right Pole | What It Measures |
|----------|-----------|------------|------------------|
| **Learning** | Try First | Study First | How you learn new tools — jump in or read the docs? |
| **Decision** | Gut | Analytical | How you pick tools — instinct or methodical research? |
| **Novelty** | Early Adopter | Proven First | When you adopt — bleeding edge or battle-tested? |
| **Risk** | All In | Measured | How you commit — go big or hedge your bets? |

These 4 dimensions combine with your interest categories to determine your personality type and power your recommendations.

---

## 🎴 The 5 Personality Types

Bloom Taste Finder maps users to one of 5 distinct taste archetypes based on their conversation patterns and taste spectrums:

| Type | Tagline | Taste Profile |
|------|---------|---------------|
| 💜 **The Visionary** | First to back what's next | Try-first learner, gut-driven, early adopter, all-in risk taker |
| 🔵 **The Explorer** | Discovers new frontiers | Try-first learner, gut-driven, experiments widely across categories |
| 💚 **The Cultivator** | Builds lasting communities | Study-first, analytical, nurtures ecosystems over time |
| 🟡 **The Optimizer** | Refines what works | Study-first, analytical, proven-first, measured — doubles down on winners |
| 🔴 **The Innovator** | Pushes boundaries | Balanced across all spectrums — combines conviction with experimentation |

---

## 🎁 What You Get

Your personalized **Bloom Taste Profile** includes:

- **🎴 Personality Type** – Your taste archetype (The Visionary, The Explorer, etc.)
- **💬 Custom Tagline** – A one-liner that captures your taste
- **📊 4 Taste Spectrums** – Learning, Decision, Novelty, Risk — each as a visual slider
- **🏷️ Main Categories** – AI Tools, Productivity, Wellness, Education, Crypto, Lifestyle
- **🎯 Personalized Recommendations** – From 3 sources:
  - ClawHub Skills (200+ AI agent skills)
  - Claude Code (Official Anthropic + community skills)
  - GitHub Repositories (1000+ open source projects)
- **🔗 Shareable Dashboard** – Showcase your taste profile

---

## 🚀 How It Works

### 1. Signal Collection
Bloom collects signals from multiple sources to understand you:
- **Conversation history** – What you talk about, how you engage
- **USER.md** – Your declared role, tech stack, and interests (primary signal when present)
- **Feedback** – Interactions with past recommendations (clicks, saves, dismissals)

### 2. Taste Profile Generation
Using 4 taste spectrums (Learning × Decision × Novelty × Risk), we map you to one of 5 personality types and identify your main interest categories:
- **AI Tools** – Agent frameworks, AI development tools
- **Productivity** – Workflow automation, productivity apps
- **Wellness** – Health tech, mindfulness tools
- **Education** – Learning platforms, educational resources
- **Crypto** – DeFi, NFTs, blockchain projects
- **Lifestyle** – Consumer apps, lifestyle tools

### 3. Multi-Source Recommendations
We match your taste profile against tools from 3 trusted sources:
- **ClawHub Skills** – 200+ community-created AI agent skills
- **Claude Code** – Official Anthropic + 6 community repositories
- **GitHub Repositories** – 1000+ open source projects across categories

Ranking by:
- **Keyword matching** – Exact and semantic similarity
- **Personality fit** – Visionaries get cutting-edge tools
- **Category alignment** – Your interests × tool categories
- **Community validation** – What similar users love

### 4. Self-Growing Recommendations

Your agent doesn't stop at the first recommendation — it **learns and improves**:

- **USER.md Integration** — Reads your `~/.config/claude/USER.md` for declared role, tech stack, and interests. This is the primary identity signal — conversation analysis enriches it. Falls back gracefully if not present.
- **Feedback Loop** — Interactions (clicks, saves, dismissals) adjust future recommendations. Engaged categories get boosted; dismissed skills get filtered out.
- **Discovery Sync** — Newly discovered skills sync to a local `bloom-discoveries.md`, building growing context.
- **TTL Refresh** — Recommendations refresh every 7 days via backend worker, pulling in new skills and applying your latest feedback.

**Signal weighting:**
| Source | Weight | Notes |
|--------|--------|-------|
| USER.md | ~30% | Primary identity signal, injected into analysis as first-class text |
| Conversation | ~60% | Topics, engagement patterns, mentioned tools |
| Feedback | up to ~30% | Grows over time as interactions accumulate |

> **Safety-first:** Bloom recommends skills but **never auto-installs** them. You always decide what to install. We believe great recommendations earn trust — auto-installing unvetted code doesn't.

### 5. Identity Card & Dashboard
You get:
- A shareable taste profile dashboard
- Personalized tool recommendations with match reasons
- A JWT-signed token for verification

**Privacy-first. Conversation-based. No wallet signatures required.**
Pure taste intelligence from how you communicate.

---

## 🔧 Installation

### Option 1: ClawHub (Recommended)

```bash
clawhub install bloom-taste-finder
```

### Option 2: Manual Install

```bash
# 1. Clone the repo
cd ~/.openclaw/workspace
git clone https://github.com/unicornbloom/bloom-identity-skill.git
cd bloom-identity-skill

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your JWT_SECRET, DASHBOARD_URL, etc.

# 4. Copy skill wrapper to OpenClaw
cp -r openclaw-wrapper ~/.openclaw/skills/bloom

# 5. Test it
/bloom
```

---

## 📖 Usage

### As an OpenClaw Skill

```bash
/bloom
```

Or use natural language:
```
"discover my taste profile"
"what's my bloom taste"
"find tools based on my taste"
"recommend tools for me"
```

### As a Standalone Tool

#### From session file (full context)
```bash
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  telegram:123456
```

#### From piped conversation
```bash
cat conversation.txt | \
  npx tsx scripts/run-from-context.ts --user-id telegram:123456
```

---

## 🔐 Privacy

- ✅ **Conversation-based analysis** – Analyzes your chat history only
- ✅ **No wallet signatures** – No transaction scraping required
- ✅ **No social auth required** – Twitter/Farcaster optional, not mandatory
- ✅ **Ephemeral processing** – Data not stored long-term
- ✅ **Local-first** – Runs in your OpenClaw environment
- ✅ **Open source** – Audit the taste algorithm yourself

---

## 🛠 Configuration

### Environment Variables

```bash
# Required
JWT_SECRET=your_secret_key_here
DASHBOARD_URL=https://bloomprotocol.ai

# Optional (for agent wallet creation)
CDP_API_KEY_ID=your_coinbase_key
CDP_API_KEY_SECRET=your_coinbase_secret
NETWORK=base-mainnet  # or base-sepolia
```

### Advanced Options

See [SETUP_CDP_CREDENTIALS.md](SETUP_CDP_CREDENTIALS.md) for Coinbase CDP setup.
See [SESSION-READER-GUIDE.md](SESSION-READER-GUIDE.md) for session file analysis.

---

## 🧪 Testing

```bash
# Run full test suite
npm test

# Test with real session data
npx tsx scripts/run-from-session.ts \
  ~/.openclaw/agents/main/sessions/<SessionId>.jsonl \
  test-user-123

# Test end-to-end flow
npx tsx scripts/test-full-flow.ts
```

---

## 📊 Technical Details

| Feature | Details |
|---------|---------|
| **Version** | 2.1.0 |
| **Analysis Engine** | 4-dimension taste spectrums + category mapping |
| **Primary Signal** | USER.md (role, tech stack, interests) |
| **Session Context** | Last ~120 messages (~5KB) |
| **Processing Time** | ~2-5 seconds |
| **Output Format** | Structured text + shareable dashboard URL |
| **Supported Platforms** | OpenClaw, CLI, API |

---

## 🐛 Troubleshooting

**"Insufficient conversation data"**
→ Need at least 3 messages. Keep chatting about what you're interested in!

**"Command not found"**
→ Verify `bloom-identity-skill` is in `~/.openclaw/workspace/` and run `npm install`

**No recommendations**
→ Recommendations depend on data source availability. Your taste profile still works!

**Wallet creation fails**
→ Check your CDP credentials in `.env`. See [SETUP_CDP_CREDENTIALS.md](SETUP_CDP_CREDENTIALS.md).

---

## 📚 Documentation

- [Session Reader Guide](SESSION-READER-GUIDE.md)
- [OpenClaw Integration](openclaw-wrapper/SKILL.md)
- [CDP Wallet Setup](SETUP_CDP_CREDENTIALS.md)

---

## 🤝 Contributing

We welcome contributions! See issues or submit PRs.

Key areas:
- More personality type archetypes
- Better taste matching algorithms
- Additional data sources (Product Hunt, Hacker News, Twitter)
- Multilingual support
- Enhanced privacy features

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🌐 Links

- **Homepage**: [bloomprotocol.ai](https://bloomprotocol.ai)
- **For Agents**: [bloomprotocol.ai/for-agents](https://bloomprotocol.ai/for-agents)
- **ClawHub**: [clawhub.ai/skills/bloom](https://clawhub.ai/skills/bloom)
- **GitHub**: [github.com/unicornbloom/bloom-identity-skill](https://github.com/unicornbloom/bloom-identity-skill)
- **Dashboard**: [bloomprotocol.ai/agents](https://bloomprotocol.ai/agents)

---

**Built by [Bloom Protocol](https://bloomprotocol.ai) 🎨**

Understanding taste, one agent at a time.

*Built with [@openclaw](https://openclaw.ai), [@coinbase](https://www.coinbase.com/cloud), and [@base](https://base.org)*
