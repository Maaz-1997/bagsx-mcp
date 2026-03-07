# BAGSX MCP Server

<div align="center">

![BAGSX Logo](https://img.shields.io/badge/BAGSX-MCP%20Server-00d4ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+)

**Trade crypto with Claude using natural language**

[![npm version](https://img.shields.io/npm/v/@bagsx/mcp-server?style=flat-square)](https://www.npmjs.com/package/@bagsx/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bags Hackathon](https://img.shields.io/badge/Bags-Hackathon%202026-ff6b6b?style=flat-square)](https://bags.fm/hackathon)
[![$BAGSX Token](https://img.shields.io/badge/%24BAGSX-Live%20on%20Bags-00ff88?style=flat-square)](https://bags.fm/BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Tools](#tools) • [$BAGSX Token](#bagsx-token)

</div>

---

## $BAGSX Token

| Property | Value |
|----------|-------|
| **Token** | $BAGSX |
| **Mint Address** | `BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS` |
| **Network** | Solana |
| **Buy on Bags** | [bags.fm/BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS](https://bags.fm/BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS) |

Every trade on $BAGSX generates creator fees that support ongoing development.

---

## What is BAGSX?

BAGSX is a **Model Context Protocol (MCP) server** that connects [Claude](https://claude.ai) to [Bags.fm](https://bags.fm) — the creator token launchpad on Solana.

Talk to Claude in plain English to:
- 📈 **Discover trending tokens** and analyze projects
- 💰 **Execute trades** with natural language commands
- 👀 **Track whales** and large transactions
- 📊 **Manage portfolios** with AI-powered insights
- 🚀 **Launch tokens** with fee sharing built-in

> **First MCP server for Bags.fm** — Built for the $4M Bags Hackathon

---

## Features

| Feature | Description |
|---------|-------------|
| **10 Tools** | Trending, search, portfolio, trades, whales, quotes, buy, sell, analytics |
| **Solana Native** | Direct integration with Bags.fm on Solana |
| **Fee Sharing** | Supports Bags fee sharing for creator revenue |
| **Read + Write** | View market data OR prepare real trades |
| **Zero Custody** | NO private keys needed - you sign in your own wallet |

---

## Security Model

**BAGSX uses unsigned transactions** — your private keys NEVER leave your wallet:

1. You ask Claude to buy/sell
2. BAGSX generates an unsigned transaction
3. You copy the transaction to your wallet (Phantom/Solflare)
4. You sign and submit yourself

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Claude + MCP  │ → │  Unsigned TX    │ → │  Your Wallet    │
│   (analysis)    │    │  (base64 blob)  │    │  (you sign)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Zero custody risk.** We never see your private key.

---

## Installation

### Prerequisites
- Node.js 18+
- [Bags API Key](https://dev.bags.fm) (free)
- [Claude Desktop](https://claude.ai/download) or any MCP client
- A Solana wallet (Phantom, Solflare, Backpack)

### Quick Install

```bash
# Clone the repo
git clone https://github.com/chunk97-bot/bagsx-mcp.git
cd bagsx-mcp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Bags API key

# Build
npm run build
```

### Add to Claude Desktop

Edit your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac or `%APPDATA%/Claude/claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "bagsx": {
      "command": "node",
      "args": ["/path/to/bagsx-mcp/dist/index.js"],
      "env": {
        "BAGS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. You'll see "bagsx" in the MCP servers list.

---

## Usage

Once connected, just talk to Claude:

### Discover Trending Tokens
```
"What's trending on Bags right now?"
"Show me the top gainers today"
"Find tokens with high volume"
```

### Research Projects
```
"Tell me about $NYAN"
"What's the market cap and holder count for $GAS?"
"Show recent trades for $BTH"
```

### Portfolio Management
```
"Check my portfolio" (requires wallet address)
"What's the P&L on my holdings?"
"Which tokens am I holding?"
```

### Trading
```
"Buy $50 of $NYAN"
"Sell half my $GAS position"
"Get a quote for swapping 0.5 SOL to $BTH"
```

### Whale Tracking
```
"Show me whale activity"
"Any large buys on $NYAN in the last hour?"
"Track wallets buying over $10K"
```

---

## Tools

### Read-Only Tools (No API key required for some)

| Tool | Description |
|------|-------------|
| `bags_trending` | Get trending tokens by volume, market cap, gainers, or losers |
| `bags_search` | Search tokens by name or symbol |
| `bags_token_info` | Get detailed token information |
| `bags_portfolio` | View wallet holdings and performance |
| `bags_trades` | Get recent trades for a token |
| `bags_whales` | Track large transactions |
| `bags_creator_earnings` | View creator royalty earnings |

### Trading Tools (Unsigned Transactions - Zero Custody)

| Tool | Description |
|------|-------------|
| `bags_quote` | Get price quotes without executing |
| `bags_buy` | Prepare buy transaction (you sign in wallet) |
| `bags_sell` | Prepare sell transaction (you sign in wallet) |

---

## Examples

### Example 1: Finding Alpha

```
You: "What are the top 5 trending tokens by volume? Give me a quick analysis of each."

Claude: [Uses bags_trending tool]

Here are the top 5 trending tokens on Bags.fm by 24h volume:

1. **$NYAN** - Market Cap: $2.1M, Volume: $892K
   - Creator: @PRguitarman (Nyan Cat creator)
   - Strong holder base, consistent volume

2. **$BTH** - Market Cap: $1.8M, Volume: $654K
   - New project, high momentum
   - Price up 45% in 24h

...
```

### Example 2: Executing a Trade (Secure - You Sign)

```
You: "Buy $100 of $NYAN"

Claude: [Uses bags_buy tool]

🔐 SECURE TRADE - Your keys never leave your wallet

Trade prepared:
- Buying: $NYAN
- Amount: $100 USD
- Expected tokens: ~46.3 NYAN
- Price impact: 0.12%

**Unsigned Transaction:**
AQAAAAAAAAAAAAAAAAAAAAm...

**To complete:**
1. Copy transaction above
2. Go to bags.fm/sign (or Phantom > Developer Settings)
3. Paste and sign
4. Submit to Solana

⏱️ Expires in ~2 minutes
```

### Example 3: Portfolio Analysis

```
You: "Analyze my portfolio performance this week"

Claude: [Uses bags_portfolio]

📊 Portfolio Summary for wallet 7xK2...

Total Value: $4,892.50 (+12.3% this week)

Holdings:
| Token | Value | Change |
|-------|-------|--------|
| $NYAN | $2,156 | +18.2% |
| $GAS | $1,483 | +8.7% |
| $BTH | $892 | +4.1% |
| $RALPH | $361 | -2.3% |

Top performer: $NYAN (+18.2%)
Suggestion: Consider taking partial profits on $NYAN
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BAGS_API_KEY` | Yes | Your Bags API key from dev.bags.fm |
| `SOLANA_RPC_URL` | No | Custom RPC endpoint (default: mainnet) |
| `SOLANA_PRIVATE_KEY` | No | Base58 private key for trading |

### Read-Only Mode

Without `SOLANA_PRIVATE_KEY`, the server runs in read-only mode:
- ✅ View trending, search, portfolio, trades, whales
- ❌ Cannot execute buy/sell orders

This is safer for exploration and analysis.

---

## Categories

This project is submitted to the **Bags Hackathon 2026** under:

- ✅ **Claude Skills** — MCP server for Claude integration
- ✅ **Bags API** — Deep integration with Bags.fm API
- ✅ **AI Agents** — Enables AI-powered trading

---

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
bagsx-mcp/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── config.ts          # Configuration management
│   ├── lib/
│   │   └── bags-client.ts # Bags API client
│   └── tools/
│       ├── definitions.ts # Tool schemas
│       └── handlers.ts    # Tool implementations
├── package.json
├── tsconfig.json
└── README.md
```

---

## Security

- 🔒 **Private keys never leave your machine** — All signing happens locally
- 🔒 **API keys in environment** — Not hardcoded or transmitted
- 🔒 **Trade confirmations** — Claude asks before executing trades
- 🔒 **Open source** — Audit the code yourself

---

## Roadmap

- [x] Core MCP server
- [x] 10 trading/analytics tools
- [x] Read-only mode
- [x] $BAGSX token launch
- [ ] Price alerts
- [ ] Multi-wallet support
- [ ] Autonomous trading mode
- [ ] Telegram/Discord notifications

---

## Links

- **Bags.fm**: https://bags.fm
- **Bags API Docs**: https://docs.bags.fm
- **Bags Hackathon**: https://bags.fm/hackathon
- **MCP Specification**: https://modelcontextprotocol.io

---

## License

MIT License — see [LICENSE](LICENSE)

---

<div align="center">

**Built for the $4M Bags Hackathon 2026**

[Apply Now](https://bags.fm/apply) • [Discord](https://discord.gg/bagsapp) • [Twitter](https://x.com/BagsHackathon)

</div>
