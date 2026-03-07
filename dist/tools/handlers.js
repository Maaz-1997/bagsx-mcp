"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToolCall = handleToolCall;
const bags_client_1 = require("../lib/bags-client");
const definitions_1 = require("./definitions");
function formatSuccess(data) {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}
function formatError(message) {
    return {
        content: [
            {
                type: 'text',
                text: `Error: ${message}`,
            },
        ],
        isError: true,
    };
}
async function handleToolCall(toolName, args) {
    try {
        switch (toolName) {
            // ==================== READ OPERATIONS ====================
            case 'bags_trending': {
                const input = definitions_1.TrendingInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getTrending(input.metric, input.limit);
                if (!result.success) {
                    return formatError(result.error || 'Failed to fetch trending tokens');
                }
                return formatSuccess({
                    metric: input.metric,
                    tokens: result.response,
                });
            }
            case 'bags_search': {
                const input = definitions_1.SearchInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.searchTokens(input.query, input.limit);
                if (!result.success) {
                    return formatError(result.error || 'Search failed');
                }
                return formatSuccess({
                    query: input.query,
                    results: result.response,
                });
            }
            case 'bags_token_info': {
                const input = definitions_1.TokenInfoInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getTokenInfo(input.token);
                if (!result.success) {
                    return formatError(result.error || 'Token not found');
                }
                return formatSuccess(result.response);
            }
            case 'bags_portfolio': {
                const input = definitions_1.PortfolioInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getPortfolio(input.wallet);
                if (!result.success) {
                    return formatError(result.error || 'Failed to fetch portfolio');
                }
                return formatSuccess(result.response);
            }
            case 'bags_trades': {
                const input = definitions_1.TradesInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getRecentTrades(input.token, input.limit);
                if (!result.success) {
                    return formatError(result.error || 'Failed to fetch trades');
                }
                return formatSuccess({
                    token: input.token,
                    trades: result.response,
                });
            }
            case 'bags_whales': {
                const input = definitions_1.WhalesInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getWhaleActivity(input.token, input.minUsd);
                if (!result.success) {
                    return formatError(result.error || 'Failed to fetch whale activity');
                }
                return formatSuccess({
                    filter: input.token ? `Token: ${input.token}` : 'All tokens',
                    minUsd: input.minUsd,
                    activity: result.response,
                });
            }
            // ==================== TRADE OPERATIONS ====================
            case 'bags_quote': {
                const input = definitions_1.QuoteInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getQuote(input.from, input.to, input.amount, input.slippage);
                if (!result.success) {
                    return formatError(result.error || 'Failed to get quote');
                }
                return formatSuccess({
                    trade: `${input.amount} ${input.from} → ${input.to}`,
                    quote: result.response,
                });
            }
            case 'bags_buy': {
                const input = definitions_1.BuyInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.buy(input.token, input.amountUsd, input.slippage, input.wallet);
                if (!result.success) {
                    return formatError(result.error || 'Failed to prepare trade');
                }
                const tx = result.response;
                return formatSuccess({
                    status: 'unsigned_transaction_ready',
                    trade: {
                        type: 'BUY',
                        token: input.token,
                        amountUsd: input.amountUsd,
                        expectedOutput: tx?.amountOut,
                        priceImpact: tx?.priceImpact,
                        fee: tx?.fee,
                    },
                    transaction: tx?.transaction,
                    expiresAt: tx?.expiresAt,
                    instructions: [
                        '🔐 SECURE SIGNING - Your keys never leave your wallet',
                        '',
                        'To complete this trade:',
                        '1. Copy the transaction string below',
                        '2. Go to bags.fm/sign or use Phantom/Solflare',
                        '3. Paste and sign the transaction',
                        '4. Submit to complete the trade',
                        '',
                        '⏱️ Transaction expires in ~2 minutes',
                    ].join('\\n'),
                });
            }
            case 'bags_sell': {
                const input = definitions_1.SellInputSchema.parse(args);
                if (!input.amount && !input.percentage) {
                    return formatError('Must specify either amount or percentage to sell');
                }
                const result = await bags_client_1.bagsClient.sell(input.token, input.amount || 0, input.slippage, input.wallet);
                if (!result.success) {
                    return formatError(result.error || 'Failed to prepare trade');
                }
                const tx = result.response;
                return formatSuccess({
                    status: 'unsigned_transaction_ready',
                    trade: {
                        type: 'SELL',
                        token: input.token,
                        amountTokens: input.amount,
                        expectedOutput: tx?.amountOut,
                        priceImpact: tx?.priceImpact,
                        fee: tx?.fee,
                    },
                    transaction: tx?.transaction,
                    expiresAt: tx?.expiresAt,
                    instructions: [
                        '🔐 SECURE SIGNING - Your keys never leave your wallet',
                        '',
                        'To complete this trade:',
                        '1. Copy the transaction string below',
                        '2. Go to bags.fm/sign or use Phantom/Solflare',
                        '3. Paste and sign the transaction',
                        '4. Submit to complete the trade',
                        '',
                        '⏱️ Transaction expires in ~2 minutes',
                    ].join('\\n'),
                });
            }
            // ==================== ANALYTICS ====================
            case 'bags_creator_earnings': {
                const input = definitions_1.CreatorEarningsInputSchema.parse(args);
                const result = await bags_client_1.bagsClient.getCreatorEarnings(input.token);
                if (!result.success) {
                    return formatError(result.error || 'Failed to fetch earnings');
                }
                return formatSuccess(result.response);
            }
            default:
                return formatError(`Unknown tool: ${toolName}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return formatError(error.message);
        }
        return formatError('An unexpected error occurred');
    }
}
//# sourceMappingURL=handlers.js.map