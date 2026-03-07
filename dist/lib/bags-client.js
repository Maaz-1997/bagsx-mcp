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
    // ==================== MULTI-WALLET MANAGEMENT ====================
    // In-memory wallet store (persists during session)
    wallets = new Map();
    defaultWallet = null;
    /**
     * Add a wallet to the session
     */
    async addWallet(wallet, alias) {
        // Validate wallet exists and get balance
        const portfolioResult = await this.getPortfolio(wallet);
        if (!portfolioResult.success) {
            return { success: false, error: 'Invalid wallet address or unable to fetch balance' };
        }
        const key = alias || wallet;
        this.wallets.set(key, { address: wallet, alias });
        // Set as default if first wallet
        if (this.wallets.size === 1) {
            this.defaultWallet = key;
        }
        const portfolio = portfolioResult.response;
        return {
            success: true,
            response: {
                wallet,
                alias: alias || null,
                balance: portfolio.totalValueUsd,
                tokenCount: portfolio.tokens.length,
            },
        };
    }
    /**
     * Remove a wallet from the session
     */
    removeWallet(walletOrAlias) {
        const entry = this.wallets.get(walletOrAlias);
        if (!entry) {
            // Try finding by address
            for (const [key, val] of this.wallets.entries()) {
                if (val.address === walletOrAlias) {
                    this.wallets.delete(key);
                    if (this.defaultWallet === key) {
                        this.defaultWallet = this.wallets.keys().next().value || null;
                    }
                    return { success: true, response: { removed: true, wallet: val.address } };
                }
            }
            return { success: false, error: 'Wallet not found in session' };
        }
        this.wallets.delete(walletOrAlias);
        if (this.defaultWallet === walletOrAlias) {
            this.defaultWallet = this.wallets.keys().next().value || null;
        }
        return { success: true, response: { removed: true, wallet: entry.address } };
    }
    /**
     * List all wallets in session
     */
    async listWallets() {
        const results = [];
        for (const [key, val] of this.wallets.entries()) {
            const portfolio = await this.getPortfolio(val.address);
            const p = portfolio.response;
            results.push({
                wallet: val.address,
                alias: val.alias || null,
                isDefault: this.defaultWallet === key,
                balance: p?.totalValueUsd || 0,
                tokenCount: p?.tokens.length || 0,
            });
        }
        return { success: true, response: results };
    }
    /**
     * Set default wallet for trades
     */
    setDefaultWallet(walletOrAlias) {
        const entry = this.wallets.get(walletOrAlias);
        if (!entry) {
            // Try finding by address
            for (const [key, val] of this.wallets.entries()) {
                if (val.address === walletOrAlias) {
                    this.defaultWallet = key;
                    return { success: true, response: { defaultWallet: val.address } };
                }
            }
            return { success: false, error: 'Wallet not found in session' };
        }
        this.defaultWallet = walletOrAlias;
        return { success: true, response: { defaultWallet: entry.address } };
    }
    /**
     * Get combined portfolio across all wallets
     */
    async getPortfolioAll(groupBy = 'token') {
        if (this.wallets.size === 0) {
            return { success: false, error: 'No wallets in session. Use bags_wallet_add first.' };
        }
        let totalValue = 0;
        const byWallet = [];
        const tokenMap = new Map();
        for (const [key, val] of this.wallets.entries()) {
            const portfolio = await this.getPortfolio(val.address);
            const p = portfolio.response;
            if (p) {
                totalValue += p.totalValueUsd;
                byWallet.push({
                    wallet: val.address,
                    alias: val.alias || null,
                    value: p.totalValueUsd,
                    holdings: p.tokens,
                });
                for (const h of p.tokens) {
                    const existing = tokenMap.get(h.mint);
                    if (existing) {
                        existing.balance += h.balance;
                        existing.value += h.valueUsd;
                        existing.wallets.push(val.alias || val.address.slice(0, 8));
                    }
                    else {
                        tokenMap.set(h.mint, {
                            symbol: h.symbol,
                            balance: h.balance,
                            value: h.valueUsd,
                            wallets: [val.alias || val.address.slice(0, 8)],
                        });
                    }
                }
            }
        }
        const byToken = Array.from(tokenMap.entries()).map(([mint, data]) => ({
            token: mint,
            symbol: data.symbol,
            totalBalance: data.balance,
            totalValue: data.value,
            wallets: data.wallets,
        }));
        return {
            success: true,
            response: {
                totalValue,
                walletCount: this.wallets.size,
                ...(groupBy === 'wallet' ? { byWallet } : { byToken }),
            },
        };
    }
    /**
     * Resolve wallet from alias or address
     */
    resolveWallet(walletOrAlias) {
        if (!walletOrAlias) {
            if (this.defaultWallet) {
                const entry = this.wallets.get(this.defaultWallet);
                return entry?.address || null;
            }
            return null;
        }
        const entry = this.wallets.get(walletOrAlias);
        if (entry)
            return entry.address;
        // Check if it's a direct address
        if (walletOrAlias.length >= 32)
            return walletOrAlias;
        return null;
    }
    // ==================== NOTIFICATION MANAGEMENT ====================
    /**
     * Setup/manage Telegram notifications
     */
    async manageTelegram(action, chatId) {
        return this.request('/notifications/telegram', {
            method: 'POST',
            body: JSON.stringify({ action, chatId }),
        });
    }
    /**
     * Setup/manage Discord notifications
     */
    async manageDiscord(action, webhookUrl) {
        return this.request('/notifications/discord', {
            method: 'POST',
            body: JSON.stringify({ action, webhookUrl }),
        });
    }
    /**
     * Get or update notification settings
     */
    async manageNotificationSettings(params) {
        return this.request('/notifications/settings', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
}
exports.bagsClient = new BagsClient();
//# sourceMappingURL=bags-client.js.map