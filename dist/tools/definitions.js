"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorEarningsInputSchema = exports.SellInputSchema = exports.BuyInputSchema = exports.QuoteInputSchema = exports.WhalesInputSchema = exports.TradesInputSchema = exports.PortfolioInputSchema = exports.TokenInfoInputSchema = exports.SearchInputSchema = exports.TrendingInputSchema = exports.TOOL_DEFINITIONS = void 0;
const zod_1 = require("zod");
// Tool definitions following MCP spec
exports.TOOL_DEFINITIONS = {
    // ==================== READ TOOLS ====================
    bags_trending: {
        name: 'bags_trending',
        description: 'Get trending tokens on Bags.fm by volume, market cap, gainers, or losers. Use this to discover hot projects.',
        inputSchema: {
            type: 'object',
            properties: {
                metric: {
                    type: 'string',
                    enum: ['volume', 'marketCap', 'gainers', 'losers'],
                    description: 'How to rank trending tokens',
                    default: 'volume',
                },
                limit: {
                    type: 'number',
                    description: 'Number of results (1-50)',
                    default: 10,
                },
            },
            required: [],
        },
    },
    bags_search: {
        name: 'bags_search',
        description: 'Search for tokens on Bags.fm by name or symbol. Use this to find specific projects.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query (token name or symbol)',
                },
                limit: {
                    type: 'number',
                    description: 'Number of results (1-20)',
                    default: 10,
                },
            },
            required: ['query'],
        },
    },
    bags_token_info: {
        name: 'bags_token_info',
        description: 'Get detailed information about a specific token including price, market cap, volume, and holders.',
        inputSchema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'Token symbol (e.g., "NYAN") or mint address',
                },
            },
            required: ['token'],
        },
    },
    bags_portfolio: {
        name: 'bags_portfolio',
        description: 'Get portfolio holdings and performance for a Solana wallet address.',
        inputSchema: {
            type: 'object',
            properties: {
                wallet: {
                    type: 'string',
                    description: 'Solana wallet address (Base58 encoded)',
                },
            },
            required: ['wallet'],
        },
    },
    bags_trades: {
        name: 'bags_trades',
        description: 'Get recent trades for a token. Shows buy/sell activity.',
        inputSchema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'Token symbol or mint address',
                },
                limit: {
                    type: 'number',
                    description: 'Number of trades to fetch (1-100)',
                    default: 20,
                },
            },
            required: ['token'],
        },
    },
    bags_whales: {
        name: 'bags_whales',
        description: 'Track whale activity (large trades) across Bags.fm or for a specific token.',
        inputSchema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'Optional: Token symbol or mint to filter whales',
                },
                minUsd: {
                    type: 'number',
                    description: 'Minimum trade size in USD',
                    default: 10000,
                },
            },
            required: [],
        },
    },
    // ==================== TRADE TOOLS ====================
    bags_quote: {
        name: 'bags_quote',
        description: 'Get a price quote for a trade without executing. Shows expected output and price impact.',
        inputSchema: {
            type: 'object',
            properties: {
                from: {
                    type: 'string',
                    description: 'Input token (SOL or token symbol/mint)',
                },
                to: {
                    type: 'string',
                    description: 'Output token (symbol or mint)',
                },
                amount: {
                    type: 'number',
                    description: 'Amount to swap (in input token units)',
                },
                slippage: {
                    type: 'number',
                    description: 'Max slippage tolerance as percentage',
                    default: 1,
                },
            },
            required: ['from', 'to', 'amount'],
        },
    },
    bags_buy: {
        name: 'bags_buy',
        description: 'Prepare a buy order on Bags.fm. Returns an unsigned transaction for the user to sign in their wallet. NO PRIVATE KEY NEEDED - zero custody risk.',
        inputSchema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'Token symbol or mint address to buy',
                },
                amountUsd: {
                    type: 'number',
                    description: 'Amount in USD to spend',
                },
                slippage: {
                    type: 'number',
                    description: 'Max slippage tolerance as percentage',
                    default: 1,
                },
                wallet: {
                    type: 'string',
                    description: 'Optional: Wallet address for transaction simulation',
                },
            },
            required: ['token', 'amountUsd'],
        },
    },
    bags_sell: {
        name: 'bags_sell',
        description: 'Prepare a sell order on Bags.fm. Returns an unsigned transaction for the user to sign in their wallet. NO PRIVATE KEY NEEDED - zero custody risk.',
        inputSchema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'Token symbol or mint address to sell',
                },
                amount: {
                    type: 'number',
                    description: 'Amount of tokens to sell (or use "all" via percentage)',
                },
                percentage: {
                    type: 'number',
                    description: 'Alternative: percentage of holdings to sell (1-100)',
                },
                slippage: {
                    type: 'number',
                    description: 'Max slippage tolerance as percentage',
                    default: 1,
                },
                wallet: {
                    type: 'string',
                    description: 'Optional: Wallet address for transaction simulation',
                },
            },
            required: ['token'],
        },
    },
    // ==================== ANALYTICS TOOLS ====================
    bags_creator_earnings: {
        name: 'bags_creator_earnings',
        description: 'Get creator earnings and royalty stats for a token.',
        inputSchema: {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    description: 'Token symbol or mint address',
                },
            },
            required: ['token'],
        },
    },
};
// Zod schemas for runtime validation
exports.TrendingInputSchema = zod_1.z.object({
    metric: zod_1.z.enum(['volume', 'marketCap', 'gainers', 'losers']).optional().default('volume'),
    limit: zod_1.z.number().min(1).max(50).optional().default(10),
});
exports.SearchInputSchema = zod_1.z.object({
    query: zod_1.z.string().min(1),
    limit: zod_1.z.number().min(1).max(20).optional().default(10),
});
exports.TokenInfoInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
exports.PortfolioInputSchema = zod_1.z.object({
    wallet: zod_1.z.string().min(32).max(44),
});
exports.TradesInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    limit: zod_1.z.number().min(1).max(100).optional().default(20),
});
exports.WhalesInputSchema = zod_1.z.object({
    token: zod_1.z.string().optional(),
    minUsd: zod_1.z.number().min(0).optional().default(10000),
});
exports.QuoteInputSchema = zod_1.z.object({
    from: zod_1.z.string().min(1),
    to: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    slippage: zod_1.z.number().min(0).max(50).optional().default(1),
});
exports.BuyInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    amountUsd: zod_1.z.number().positive(),
    slippage: zod_1.z.number().min(0).max(50).optional().default(1),
    wallet: zod_1.z.string().min(32).max(44).optional(),
});
exports.SellInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive().optional(),
    percentage: zod_1.z.number().min(1).max(100).optional(),
    slippage: zod_1.z.number().min(0).max(50).optional().default(1),
    wallet: zod_1.z.string().min(32).max(44).optional(),
});
exports.CreatorEarningsInputSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
//# sourceMappingURL=definitions.js.map