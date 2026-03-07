"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bagsClient = void 0;
const config_1 = require("../config");
class BagsClient {
    apiKey;
    baseUrl;
    constructor() {
        this.apiKey = config_1.CONFIG.BAGS_API_KEY;
        this.baseUrl = config_1.CONFIG.BAGS_API_BASE_URL;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'x-api-key': this.apiKey }),
            ...options.headers,
        };
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `HTTP ${response.status}: ${response.statusText}`,
                };
            }
            return {
                success: true,
                response: (data.response || data),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    // ==================== READ OPERATIONS ====================
    /**
     * Get trending tokens on Bags.fm
     */
    async getTrending(metric = 'volume', limit = 10) {
        return this.request(`/tokens/trending?metric=${metric}&limit=${limit}`);
    }
    /**
     * Search for tokens by name or symbol
     */
    async searchTokens(query, limit = 10) {
        return this.request(`/tokens/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    }
    /**
     * Get detailed info for a specific token
     */
    async getTokenInfo(mintOrSymbol) {
        return this.request(`/tokens/${encodeURIComponent(mintOrSymbol)}`);
    }
    /**
     * Get portfolio for a wallet address
     */
    async getPortfolio(walletAddress) {
        return this.request(`/wallets/${walletAddress}/portfolio`);
    }
    /**
     * Get recent trades for a token
     */
    async getRecentTrades(mint, limit = 20) {
        return this.request(`/tokens/${mint}/trades?limit=${limit}`);
    }
    /**
     * Get whale activity (large trades)
     */
    async getWhaleActivity(mint, minUsd = 10000) {
        const endpoint = mint
            ? `/tokens/${mint}/whales?minUsd=${minUsd}`
            : `/whales?minUsd=${minUsd}`;
        return this.request(endpoint);
    }
    /**
     * Get creator earnings for a token
     */
    async getCreatorEarnings(mint) {
        return this.request(`/tokens/${mint}/earnings`);
    }
    // ==================== WRITE OPERATIONS ====================
    /**
     * Get a quote for a trade (doesn't execute)
     */
    async getQuote(inputMint, outputMint, amount, slippage = config_1.CONFIG.DEFAULT_SLIPPAGE) {
        return this.request('/trading/quote', {
            method: 'POST',
            body: JSON.stringify({
                inputMint,
                outputMint,
                amount,
                slippage,
            }),
        });
    }
    /**
     * Execute a buy order (requires private key)
     */
    async buy(tokenMint, amountUsd, slippage = config_1.CONFIG.DEFAULT_SLIPPAGE) {
        if (!config_1.CONFIG.SOLANA_PRIVATE_KEY) {
            return {
                success: false,
                error: 'SOLANA_PRIVATE_KEY not configured. Cannot execute trades.',
            };
        }
        return this.request('/trading/buy', {
            method: 'POST',
            body: JSON.stringify({
                mint: tokenMint,
                amountUsd,
                slippage,
                // Note: In production, transaction signing happens client-side
                // This is a simplified version
            }),
        });
    }
    /**
     * Execute a sell order (requires private key)
     */
    async sell(tokenMint, amountTokens, slippage = config_1.CONFIG.DEFAULT_SLIPPAGE) {
        if (!config_1.CONFIG.SOLANA_PRIVATE_KEY) {
            return {
                success: false,
                error: 'SOLANA_PRIVATE_KEY not configured. Cannot execute trades.',
            };
        }
        return this.request('/trading/sell', {
            method: 'POST',
            body: JSON.stringify({
                mint: tokenMint,
                amountTokens,
                slippage,
            }),
        });
    }
    // ==================== LAUNCH OPERATIONS ====================
    /**
     * Create token metadata (first step of launch)
     */
    async createTokenMetadata(params) {
        return this.request('/tokens/metadata', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    /**
     * Launch a new token on Bags.fm
     */
    async launchToken(params) {
        if (!config_1.CONFIG.SOLANA_PRIVATE_KEY) {
            return {
                success: false,
                error: 'SOLANA_PRIVATE_KEY not configured. Cannot launch tokens.',
            };
        }
        return this.request('/tokens/launch', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
}
exports.bagsClient = new BagsClient();
//# sourceMappingURL=bags-client.js.map