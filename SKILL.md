---
name: bloom-identity
description: Generate Bloom Identity Card from conversation history and USER.md. Maps builder personality across 4 MentalOS dimensions (Learning, Decision, Novelty, Risk), identifies personality type (Visionary/Explorer/Cultivator/Optimizer/Innovator), recommends matching tools from the Bloom skill catalog, and generates shareable dashboard. Use when user asks to "generate my bloom identity", "create identity card", "analyze my profile", or "discover my personality".
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

## Data Sources

### Primary: USER.md + Conversation History
- **USER.md** — Declared role, tech stack, interests, working style. Injected as first-class text into the personality analyzer. Falls back gracefully if not present.
- **Conversation history** — Always available from OpenClaw sessions. Analyzes topics, interests, engagement patterns.
- **⭐ REQUIRES: Minimum 3 messages** in your OpenClaw session
  - If less than 3 messages: Skill will fail with clear error message
  - Solution: Continue chatting with OpenClaw to build conversation history

### Secondary: Twitter/X Data (15% weight)
- **Optional** - requires user authorization
- Fetches real data via bird CLI (cookie auth)
- Includes: bio, recent tweets, following list, interactions
- **If not authorized**: Analysis proceeds with conversation only

### Wallet (Optional)
- **Creation only** - NOT analyzed for personality
- Generates local wallet for tipping/payments (Coinbase CDP on Base)
- Does NOT analyze transaction history (privacy-preserving)

**Key Rules**:
1. **USER.md First**: Primary identity signal when present
2. **Conversation Required**: Minimum 3 messages (no silent fallback)
3. **Twitter Optional**: Only fetch if user authorized X account access
4. **Explicit Errors**: If insufficient data → clear error (no degradation to empty results)

## Usage

Run the generator script:

```bash
bash scripts/generate.sh --user-id $USER_ID
```

Or call directly from OpenClaw:

```bash
bash scripts/generate.sh --user-id $OPENCLAW_USER_ID
```

## Output

Returns:

- Personality type (Visionary/Explorer/Cultivator/Optimizer/Innovator)
- Confidence score
- Custom tagline and description
- MentalOS spectrum (Learning, Decision, Novelty, Risk)
- Main categories and subcategories
- Recommended tools from the Bloom skill catalog (with match scores)
- Dashboard link with auth token
- Agent wallet address (optional, on Base network)

## Example

**User**: "Generate my bloom identity"

**Agent runs**:
```bash
bash scripts/generate.sh --user-id user123
```

**Returns**:
```
🎉 **Your Bloom Identity Card is Ready!** 🤖

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💜 **The Visionary** (85% confidence)

*"See beyond the hype"*

You are a forward-thinking builder who sees beyond
the hype and focuses on real-world impact.

🏷️  Categories: Crypto · DeFi · Web3
   Interests: Smart Contracts · Layer 2 · Cross-chain

🧠 MentalOS:
   Learning:  Try First ■■■■■■■■░░ Study First
   Decision:  Gut ■■■░░░░░░░ Analytical
   Novelty:   Early Adopter ■■■■■■■░░░ Proven First
   Risk:      All In ■■■■■■░░░░ Measured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **Top Recommended Tools**

1. **DeFi Protocol Analyzer** (95% match) · by Alice
   Analyze DeFi protocols for risk and opportunity

2. **Smart Contract Auditor** (90% match)
   Audit smart contracts for security vulnerabilities

3. **Gas Optimizer** (88% match)
   Optimize gas costs for Ethereum transactions

🌐 **View Full Dashboard**
   https://bloomprotocol.ai/dashboard?token=xxx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌸 Bloom Identity · Built for indie builders
```

## Triggers

- "generate my bloom identity"
- "create my identity card"
- "analyze my supporter profile"
- "mint my bloom card"
- "discover my personality"

## Technical Details

- **Version**: 2.1.0
- **Network**: Base (mainnet) or Base Sepolia (testnet) - configurable via NETWORK env var
- **Authentication**: EIP-191 signed tokens with 7-layer security
- **Data Sources**:
  - USER.md (~/.config/claude/USER.md) - primary identity signal
  - Conversation history (OpenClaw sessions JSONL) - enrichment
  - Twitter/X (bird CLI) - 15% weight, optional
  - Wallet creation only (viem + AES-256-GCM encryption) - NOT analyzed
- **Integration**: Coinbase AgentKit (optional) + Bloom catalog API + bird CLI
- **Privacy**: No wallet transaction analysis, conversation-first approach

## Requirements

- Node.js 18+
- Environment variables:
  - `JWT_SECRET` - JWT signing secret
  - `DASHBOARD_URL` - Dashboard URL (default: https://bloomprotocol.ai)
  - `NETWORK` - Network to use: `base-mainnet` or `base-sepolia` (default: base-mainnet)
  - `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET` - Coinbase CDP credentials (optional)

## Installation

```bash
# Clone or download the skill
git clone https://gitlab.com/bloom-protocol/bloom-discovery-skill.git

# Install dependencies
cd bloom-identity-skill
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your credentials
```

---

Built by [Bloom Protocol](https://bloomprotocol.ai)
