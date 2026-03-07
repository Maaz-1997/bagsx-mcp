# BAGSX MCP Server v2.0

<div align="center">

![BAGSX Logo](https://img.shields.io/badge/BAGSX-MCP%20Server-00d4ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+)

**Trade, launch, and manage creator tokens with Claude**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bags Hackathon](https://img.shields.io/badge/Bags-Hackathon%202026-ff6b6b?style=flat-square)](https://bags.fm/hackathon)
[![$BAGSX Token](https://img.shields.io/badge/%24BAGSX-Live%20on%20Bags-00ff88?style=flat-square)](https://bags.fm/BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS)

[Features](#features) • [Installation](#installation) • [Tools](#tools) • [$BAGSX Token](#bagsx-token)

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

BAGSX is a **Model Context Protocol (MCP) server** that connects [Claude](https://claude.ai) to the [Bags.fm API](https://docs.bags.fm) — enabling AI-powered trading, token launches, and fee management on Solana.

Talk to Claude in plain English to:
- 💰 **Get swap quotes** and execute trades with slippage protection
- 🚀 **Launch tokens** with automatic metadata and bonding curves
- 💸 **Claim creator fees** from your launched tokens
- 📊 **View analytics** on creators, fees, and claim events
- ⚙️ **Configure fee sharing** with multiple wallets

> **Built for the $4M Bags Hackathon** — 18 real API tools

---

## Features

| Feature | Description |
|---------|-------------|
| **18 Real Tools** | Every tool maps to an actual Bags API endpoint |
| **Trading** | Get quotes, execute swaps with auto-slippage |
| **Token Launch** | Prepare metadata + create bonding curve tokens |
| **Fee Management** | Claim fees, configure splits, transfer admin |
| **Zero Custody** | All transactions are UNSIGNED — you sign in your wallet |

---

## Security Model

**BAGSX uses unsigned transactions** — your private keys NEVER leave your wallet:

1. You ask Claude to trade/claim/etc
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

### � Trading (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_quote` | Get swap quotes with price impact & slippage. Supports auto or manual slippage. |
| `bags_swap` | Create unsigned swap transaction from a quote. You sign in your wallet. |

### 🚀 Token Launch (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_launch_prepare` | Create token metadata (name, symbol, image, socials). Returns mint address. |
| `bags_launch_execute` | Create bonding curve launch transaction. You sign to deploy. |

### 📊 Analytics (4 Tools)

| Tool | Description |
|------|-------------|
| `bags_creators` | Get creator info and royalty settings for a token. |
| `bags_lifetime_fees` | Total fees generated by a token since launch. |
| `bags_claim_stats` | Who claimed fees and how much (per wallet breakdown). |
| `bags_claim_events` | Historical claim events with timestamps & signatures. |

### 💸 Fee Claiming (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_claimable` | Check claimable positions for a wallet (all tokens). |
| `bags_claim_fees` | Generate unsigned transactions to claim fees. You sign. |

### ⚙️ Fee Share Config (5 Tools)

| Tool | Description |
|------|-------------|
| `bags_fee_wallet` | Look up fee share wallet for a social username (Twitter, etc). |
| `bags_fee_config` | Create fee share configuration with multiple claimers & splits. |
| `bags_admin_list` | List tokens where a wallet has admin rights. |
| `bags_admin_update` | Update fee share splits (admin only). |
| `bags_admin_transfer` | Transfer admin rights to another wallet. |

### 🏊 State/Pools (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_pools` | List all Bags pools (optionally filter to migrated only). |
| `bags_pool_info` | Get pool details by token mint address. |

### 🤝 Partner (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_partner_stats` | View claimed and unclaimed partner fees. |
| `bags_partner_claim` | Generate unsigned transactions to claim partner fees. |

---

## Usage Examples

### Getting a Swap Quote
```
You: "Get a quote for swapping 0.5 SOL to the BAGSX token"

Claude: [Uses bags_quote tool]

Quote details:
- Input: 0.5 SOL (500000000 lamports)
- Output: ~1,234.56 BAGSX
- Price Impact: 0.12%
- Slippage: 50 bps (auto)
- Request ID: abc123...

Use bags_swap with this request ID to execute the trade.
```

### Executing a Swap
```
You: "Execute that swap with my wallet 7xK2..."

Claude: [Uses bags_swap tool]

Unsigned transaction ready:
- Transaction: AQAAAA...
- Block Height: 234567890
- Priority Fee: 5000 lamports

To complete: Copy to Phantom → Sign → Submit
```

### Launching a Token
```
You: "Launch a token called DEMO with symbol DMO"

Claude: [Uses bags_launch_prepare tool]

Token info created:
- Mint: 9xYz123...
- Metadata URI: ipfs://...
- Status: Ready

Use bags_launch_execute to deploy the bonding curve.
```

### Claiming Creator Fees
```
You: "What fees can I claim for wallet 7xK2...?"

Claude: [Uses bags_claimable tool]

Claimable positions:
| Token | Amount |
|-------|--------|
| BAGSX | 0.42 SOL |
| DEMO  | 0.15 SOL |

Total: 0.57 SOL

Shall I generate claim transactions?
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BAGS_API_KEY` | Yes | Your Bags API key from dev.bags.fm |

### Get Your API Key

1. Go to [dev.bags.fm](https://dev.bags.fm)
2. Sign up / log in
3. Create a new API key
4. Add to your `.env` file

---

## Categories

This project is submitted to the **Bags Hackathon 2026** under:

- ✅ **Claude Skills** — MCP server for Claude integration
- ✅ **Bags API** — Full integration with public Bags.fm API
- ✅ **AI Agents** — Enables AI-powered trading via natural language

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
│   ├── index.ts              # MCP server entry point
│   ├── config.ts             # Configuration management
│   ├── lib/
│   │   └── bags-client-new.ts # Bags API client (18 methods)
│   └── tools/
│       ├── definitions-new.ts # Tool schemas (18 tools)
│       └── handlers-new.ts    # Tool implementations
├── package.json
├── tsconfig.json
└── README.md
```

---

## Security

- 🔒 **Private keys never needed** — All transactions are unsigned
- 🔒 **API key in environment** — Not hardcoded or exposed to Claude
- 🔒 **You sign everything** — Full control over what gets submitted
- 🔒 **Open source** — Audit the code yourself

---

## Roadmap

- [x] Core MCP server with real API integration
- [x] 18 working tools (trading, launch, fees, analytics)
- [x] Zero custody security model
- [x] $BAGSX token launch
- [ ] Additional analytics as Bags API expands
- [ ] Real-time price feeds (when available)

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
