"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerClaimInputSchema = exports.PartnerInputSchema = exports.PoolsInputSchema = exports.AdminTransferInputSchema = exports.AdminUpdateInputSchema = exports.FeeConfigInputSchema = exports.FeeWalletInputSchema = exports.ClaimFeesInputSchema = exports.WalletInputSchema = exports.ClaimEventsInputSchema = exports.TokenMintInputSchema = exports.LaunchExecuteInputSchema = exports.LaunchPrepareInputSchema = exports.SwapInputSchema = exports.QuoteInputSchema = exports.TOOL_DEFINITIONS = void 0;
const zod_1 = require("zod");
// Tool definitions based on REAL Bags API endpoints
// Verified against docs.bags.fm/api-reference
exports.TOOL_DEFINITIONS = {
    // ==================== TRADING TOOLS ====================
    bags_quote: {
        name: 'bags_quote',
        description: 'Get a price quote for swapping tokens on Bags. Shows expected output, price impact, and slippage.',
        inputSchema: {
            type: 'object',
            properties: {
                inputMint: {
                    type: 'string',
                    description: 'Input token mint address (use So11111111111111111111111111111111111111112 for SOL)',
                },
                outputMint: {
                    type: 'string',
                    description: 'Output token mint address',
                },
                amount: {
                    type: 'number',
                    description: 'Amount in smallest unit (lamports for SOL, base units for tokens)',
                },
                slippageMode: {
                    type: 'string',
                    enum: ['auto', 'manual'],
                    description: 'Slippage mode: auto for automatic calculation, manual for custom',
                    default: 'auto',
                },
                slippageBps: {
                    type: 'number',
                    description: 'Slippage in basis points (0-10000). Required when slippageMode is manual',
                },
            },
            required: ['inputMint', 'outputMint', 'amount'],
        },
    },
    bags_swap: {
        name: 'bags_swap',
        description: 'Create a swap transaction from a trade quote. Returns unsigned transaction for user to sign.',
        inputSchema: {
            type: 'object',
            properties: {
                quoteRequestId: {
                    type: 'string',
                    description: 'Request ID from bags_quote response',
                },
                wallet: {
                    type: 'string',
                    description: 'User wallet public key to sign the transaction',
                },
            },
            required: ['quoteRequestId', 'wallet'],
        },
    },
    // ==================== TOKEN LAUNCH TOOLS ====================
    bags_launch_prepare: {
        name: 'bags_launch_prepare',
        description: 'Prepare token info and metadata for launch. Creates token mint and uploads to IPFS.',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Token name (max 32 characters)',
                },
                symbol: {
                    type: 'string',
                    description: 'Token symbol (max 10 characters, will be uppercased)',
                },
                description: {
                    type: 'string',
                    description: 'Token description (max 1000 characters)',
                },
                imageUrl: {
                    type: 'string',
                    description: 'Public URL to the token image',
                },
                twitter: {
                    type: 'string',
                    description: 'Twitter URL (optional)',
                },
                telegram: {
                    type: 'string',
                    description: 'Telegram URL (optional)',
                },
                website: {
                    type: 'string',
                    description: 'Website URL (optional)',
                },
            },
            required: ['name', 'symbol', 'description'],
        },
    },
    bags_launch_execute: {
        name: 'bags_launch_execute',
        description: 'Create the token launch transaction. Requires output from bags_launch_prepare.',
        inputSchema: {
            type: 'object',
            properties: {
                ipfs: {
                    type: 'string',
                    description: 'IPFS URL from bags_launch_prepare',
                },
                tokenMint: {
                    type: 'string',
                    description: 'Token mint from bags_launch_prepare',
                },
                wallet: {
                    type: 'string',
                    description: 'Creator wallet public key',
                },
                configKey: {
                    type: 'string',
                    description: 'Config key from fee share setup',
                },
                initialBuyLamports: {
                    type: 'number',
                    description: 'Initial buy amount in lamports (optional)',
                    default: 0,
                },
            },
            required: ['ipfs', 'tokenMint', 'wallet', 'configKey'],
        },
    },
    // ==================== ANALYTICS TOOLS ====================
    bags_creators: {
        name: 'bags_creators',
        description: 'Get the creators/deployers of a token. Shows royalty splits and social links.',
        inputSchema: {
            type: 'object',
            properties: {
                tokenMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
            },
            required: ['tokenMint'],
        },
    },
    bags_lifetime_fees: {
        name: 'bags_lifetime_fees',
        description: 'Get total lifetime fees collected for a token (in lamports).',
        inputSchema: {
            type: 'object',
            properties: {
                tokenMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
            },
            required: ['tokenMint'],
        },
    },
    bags_claim_stats: {
        name: 'bags_claim_stats',
        description: 'Get claim statistics for all fee claimers of a token. Shows who claimed how much.',
        inputSchema: {
            type: 'object',
            properties: {
                tokenMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
            },
            required: ['tokenMint'],
        },
    },
    bags_claim_events: {
        name: 'bags_claim_events',
        description: 'Get claim event history for a token. Supports pagination or time-based filtering.',
        inputSchema: {
            type: 'object',
            properties: {
                tokenMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
                mode: {
                    type: 'string',
                    enum: ['offset', 'time'],
                    description: 'Query mode: offset for pagination, time for time range',
                    default: 'offset',
                },
                limit: {
                    type: 'number',
                    description: 'Max events to return (1-100)',
                    default: 100,
                },
                offset: {
                    type: 'number',
                    description: 'Skip this many events (for pagination)',
                    default: 0,
                },
                from: {
                    type: 'number',
                    description: 'Start unix timestamp (for time mode)',
                },
                to: {
                    type: 'number',
                    description: 'End unix timestamp (for time mode)',
                },
            },
            required: ['tokenMint'],
        },
    },
    // ==================== FEE CLAIMING TOOLS ====================
    bags_claimable: {
        name: 'bags_claimable',
        description: 'Get all claimable fee positions for a wallet. Shows pending fees across tokens.',
        inputSchema: {
            type: 'object',
            properties: {
                wallet: {
                    type: 'string',
                    description: 'Wallet public key to check',
                },
            },
            required: ['wallet'],
        },
    },
    bags_claim_fees: {
        name: 'bags_claim_fees',
        description: 'Generate transactions to claim fees for a token. Returns unsigned transactions.',
        inputSchema: {
            type: 'object',
            properties: {
                tokenMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
                wallet: {
                    type: 'string',
                    description: 'Fee claimer wallet public key',
                },
            },
            required: ['tokenMint', 'wallet'],
        },
    },
    // ==================== FEE SHARE CONFIG TOOLS ====================
    bags_fee_wallet: {
        name: 'bags_fee_wallet',
        description: 'Lookup fee share wallet by social provider username (Twitter, GitHub, etc).',
        inputSchema: {
            type: 'object',
            properties: {
                provider: {
                    type: 'string',
                    enum: ['twitter', 'github', 'instagram', 'tiktok', 'kick', 'onlyfans'],
                    description: 'Social provider name',
                },
                username: {
                    type: 'string',
                    description: 'Username/handle on the platform',
                },
            },
            required: ['provider', 'username'],
        },
    },
    bags_fee_config: {
        name: 'bags_fee_config',
        description: 'Create fee sharing config with multiple claimers. Required before token launch.',
        inputSchema: {
            type: 'object',
            properties: {
                payer: {
                    type: 'string',
                    description: 'Payer wallet public key',
                },
                baseMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
                claimers: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of claimer wallet public keys',
                },
                basisPoints: {
                    type: 'array',
                    items: { type: 'number' },
                    description: 'Basis points for each claimer (must total 10000)',
                },
            },
            required: ['payer', 'baseMint', 'claimers', 'basisPoints'],
        },
    },
    bags_admin_list: {
        name: 'bags_admin_list',
        description: 'List all tokens where a wallet is the fee share admin.',
        inputSchema: {
            type: 'object',
            properties: {
                wallet: {
                    type: 'string',
                    description: 'Admin wallet public key',
                },
            },
            required: ['wallet'],
        },
    },
    bags_admin_update: {
        name: 'bags_admin_update',
        description: 'Update fee share config for a token. Only admin can do this.',
        inputSchema: {
            type: 'object',
            properties: {
                baseMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
                payer: {
                    type: 'string',
                    description: 'Payer/admin wallet public key',
                },
                claimers: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'New array of claimer wallets',
                },
                basisPoints: {
                    type: 'array',
                    items: { type: 'number' },
                    description: 'New basis points for each claimer',
                },
            },
            required: ['baseMint', 'payer', 'claimers', 'basisPoints'],
        },
    },
    bags_admin_transfer: {
        name: 'bags_admin_transfer',
        description: 'Transfer fee share admin authority to a new wallet.',
        inputSchema: {
            type: 'object',
            properties: {
                baseMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
                currentAdmin: {
                    type: 'string',
                    description: 'Current admin wallet public key',
                },
                newAdmin: {
                    type: 'string',
                    description: 'New admin wallet public key',
                },
                payer: {
                    type: 'string',
                    description: 'Payer wallet public key',
                },
            },
            required: ['baseMint', 'currentAdmin', 'newAdmin', 'payer'],
        },
    },
    // ==================== STATE/POOL TOOLS ====================
    bags_pools: {
        name: 'bags_pools',
        description: 'Get list of all Bags pools with their Meteora DBC and DAMM v2 keys.',
        inputSchema: {
            type: 'object',
            properties: {
                onlyMigrated: {
                    type: 'boolean',
                    description: 'Only return pools that migrated to DAMM v2',
                    default: false,
                },
            },
            required: [],
        },
    },
    bags_pool_info: {
        name: 'bags_pool_info',
        description: 'Get pool information for a specific token mint.',
        inputSchema: {
            type: 'object',
            properties: {
                tokenMint: {
                    type: 'string',
                    description: 'Token mint public key',
                },
            },
            required: ['tokenMint'],
        },
    },
    // ==================== PARTNER TOOLS ====================
    bags_partner_stats: {
        name: 'bags_partner_stats',
        description: 'Get partner statistics including claimed and unclaimed fees.',
        inputSchema: {
            type: 'object',
            properties: {
                partner: {
                    type: 'string',
                    description: 'Partner wallet public key',
                },
            },
            required: ['partner'],
        },
    },
    bags_partner_claim: {
        name: 'bags_partner_claim',
        description: 'Generate transactions to claim accumulated partner fees.',
        inputSchema: {
            type: 'object',
            properties: {
                partnerWallet: {
                    type: 'string',
                    description: 'Partner wallet public key',
                },
            },
            required: ['partnerWallet'],
        },
    },
};
// ==================== ZOD SCHEMAS ====================
exports.QuoteInputSchema = zod_1.z.object({
    inputMint: zod_1.z.string().min(32).max(44),
    outputMint: zod_1.z.string().min(32).max(44),
    amount: zod_1.z.number().positive(),
    slippageMode: zod_1.z.enum(['auto', 'manual']).optional().default('auto'),
    slippageBps: zod_1.z.number().min(0).max(10000).optional(),
});
exports.SwapInputSchema = zod_1.z.object({
    quoteRequestId: zod_1.z.string().min(1),
    wallet: zod_1.z.string().min(32).max(44),
});
exports.LaunchPrepareInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(32),
    symbol: zod_1.z.string().min(1).max(10),
    description: zod_1.z.string().min(1).max(1000),
    imageUrl: zod_1.z.string().url().optional(),
    twitter: zod_1.z.string().optional(),
    telegram: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
});
exports.LaunchExecuteInputSchema = zod_1.z.object({
    ipfs: zod_1.z.string().min(1),
    tokenMint: zod_1.z.string().min(32).max(44),
    wallet: zod_1.z.string().min(32).max(44),
    configKey: zod_1.z.string().min(32).max(44),
    initialBuyLamports: zod_1.z.number().min(0).optional().default(0),
});
exports.TokenMintInputSchema = zod_1.z.object({
    tokenMint: zod_1.z.string().min(32).max(44),
});
exports.ClaimEventsInputSchema = zod_1.z.object({
    tokenMint: zod_1.z.string().min(32).max(44),
    mode: zod_1.z.enum(['offset', 'time']).optional().default('offset'),
    limit: zod_1.z.number().min(1).max(100).optional().default(100),
    offset: zod_1.z.number().min(0).optional().default(0),
    from: zod_1.z.number().min(0).optional(),
    to: zod_1.z.number().min(0).optional(),
});
exports.WalletInputSchema = zod_1.z.object({
    wallet: zod_1.z.string().min(32).max(44),
});
exports.ClaimFeesInputSchema = zod_1.z.object({
    tokenMint: zod_1.z.string().min(32).max(44),
    wallet: zod_1.z.string().min(32).max(44),
});
exports.FeeWalletInputSchema = zod_1.z.object({
    provider: zod_1.z.enum(['twitter', 'github', 'instagram', 'tiktok', 'kick', 'onlyfans']),
    username: zod_1.z.string().min(1).max(100),
});
exports.FeeConfigInputSchema = zod_1.z.object({
    payer: zod_1.z.string().min(32).max(44),
    baseMint: zod_1.z.string().min(32).max(44),
    claimers: zod_1.z.array(zod_1.z.string().min(32).max(44)).min(1).max(100),
    basisPoints: zod_1.z.array(zod_1.z.number().min(0).max(10000)).min(1).max(100),
});
exports.AdminUpdateInputSchema = zod_1.z.object({
    baseMint: zod_1.z.string().min(32).max(44),
    payer: zod_1.z.string().min(32).max(44),
    claimers: zod_1.z.array(zod_1.z.string().min(32).max(44)).min(1).max(100),
    basisPoints: zod_1.z.array(zod_1.z.number().min(0).max(10000)).min(1).max(100),
});
exports.AdminTransferInputSchema = zod_1.z.object({
    baseMint: zod_1.z.string().min(32).max(44),
    currentAdmin: zod_1.z.string().min(32).max(44),
    newAdmin: zod_1.z.string().min(32).max(44),
    payer: zod_1.z.string().min(32).max(44),
});
exports.PoolsInputSchema = zod_1.z.object({
    onlyMigrated: zod_1.z.boolean().optional().default(false),
});
exports.PartnerInputSchema = zod_1.z.object({
    partner: zod_1.z.string().min(32).max(44),
});
exports.PartnerClaimInputSchema = zod_1.z.object({
    partnerWallet: zod_1.z.string().min(32).max(44),
});
//# sourceMappingURL=definitions-new.js.map