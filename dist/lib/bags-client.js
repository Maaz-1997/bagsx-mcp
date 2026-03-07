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
     * Generate unsigned buy transaction (user signs in their wallet)
     * Returns base64 transaction to sign - NO PRIVATE KEY NEEDED
     */
    async buy(tokenMint, amountUsd, slippage = config_1.CONFIG.DEFAULT_SLIPPAGE, walletAddress) {
        // Generate unsigned transaction - user will sign it themselves
        return this.request('/trading/prepare-buy', {
            method: 'POST',
            body: JSON.stringify({
                mint: tokenMint,
                amountUsd,
                slippage,
                walletAddress, // Optional: for simulation
            }),
        });
    }
    /**
     * Generate unsigned sell transaction (user signs in their wallet)
     * Returns base64 transaction to sign - NO PRIVATE KEY NEEDED
     */
    async sell(tokenMint, amountTokens, slippage = config_1.CONFIG.DEFAULT_SLIPPAGE, walletAddress) {
        // Generate unsigned transaction - user will sign it themselves
        return this.request('/trading/prepare-sell', {
            method: 'POST',
            body: JSON.stringify({
                mint: tokenMint,
                amountTokens,
                slippage,
                walletAddress, // Optional: for simulation
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
        // Returns unsigned transaction - user signs themselves
        return this.request('/tokens/prepare-launch', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    // ==================== NEW: MARKET INTELLIGENCE ====================
    /**
     * Get historical price data for a token
     */
    async getPriceHistory(token, period = '24h') {
        return this.request(`/tokens/${encodeURIComponent(token)}/price-history?period=${period}`);
    }
    /**
     * Get newly launched tokens
     */
    async getNewLaunches(hours = 24, limit = 20) {
        return this.request(`/tokens/new?hours=${hours}&limit=${limit}`);
    }
    /**
     * Get top gainers and losers
     */
    async getGainersLosers(type = 'both', period = '24h', limit = 10) {
        return this.request(`/tokens/movers?type=${type}&period=${period}&limit=${limit}`);
    }
    /**
     * Analyze holder distribution for a token
     */
    async getHolderAnalysis(token) {
        return this.request(`/tokens/${encodeURIComponent(token)}/holders`);
    }
    // ==================== NEW: TRADING ENHANCEMENTS ====================
    /**
     * Prepare token-to-token swap (unsigned transaction)
     */
    async prepareSwap(fromToken, toToken, amount, slippage = 1, wallet) {
        return this.request('/trading/prepare-swap', {
            method: 'POST',
            body: JSON.stringify({
                fromMint: fromToken,
                toMint: toToken,
                amount,
                slippage,
                walletAddress: wallet,
            }),
        });
    }
    /**
     * Set a limit order
     */
    async setLimitOrder(params) {
        return this.request('/orders/limit', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    /**
     * Estimate gas/fees for a transaction
     */
    async estimateGas(action, token, amount) {
        return this.request('/trading/estimate-gas', {
            method: 'POST',
            body: JSON.stringify({ action, token, amount }),
        });
    }
    /**
     * Calculate slippage for a trade
     */
    async checkSlippage(token, side, amountUsd) {
        return this.request('/trading/slippage-check', {
            method: 'POST',
            body: JSON.stringify({ token, side, amountUsd }),
        });
    }
    // ==================== NEW: PORTFOLIO & ALERTS ====================
    /**
     * Manage watchlist
     */
    async manageWatchlist(action, token, wallet) {
        return this.request('/user/watchlist', {
            method: 'POST',
            body: JSON.stringify({ action, token, wallet }),
        });
    }
    /**
     * Manage price alerts
     */
    async managePriceAlert(params) {
        return this.request('/user/alerts', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    /**
     * Generate P&L report for a wallet
     */
    async getPnlReport(wallet, period = '30d') {
        return this.request(`/portfolio/${wallet}/pnl?period=${period}`);
    }
    /**
     * Compare multiple tokens side-by-side
     */
    async compareTokens(tokens) {
        return this.request('/tokens/compare', {
            method: 'POST',
            body: JSON.stringify({ tokens }),
        });
    }
    // ==================== NEW: CREATOR TOOLS ====================
    /**
     * Get top creators leaderboard
     */
    async getTopCreators(metric = 'earnings', limit = 20) {
        return this.request(`/creators/top?metric=${metric}&limit=${limit}`);
    }
    /**
     * Prepare token launch (full flow)
     */
    async prepareTokenLaunch(params) {
        return this.request('/tokens/prepare-full-launch', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    /**
     * Prepare airdrop transaction
     */
    async prepareAirdrop(token, recipients, senderWallet) {
        return this.request('/tokens/prepare-airdrop', {
            method: 'POST',
            body: JSON.stringify({
                mint: token,
                recipients,
                senderWallet,
            }),
        });
    }
}
exports.bagsClient = new BagsClient();
//# sourceMappingURL=bags-client.js.map