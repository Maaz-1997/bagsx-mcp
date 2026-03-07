"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bagsClient = void 0;
const config_1 = require("../config");
// ==================== CLIENT CLASS ====================
class BagsClient {
    apiKey;
    baseUrl;
    // Quote cache for swap execution
    quoteCache = new Map();
    constructor() {
        this.apiKey = config_1.CONFIG.BAGS_API_KEY;
        this.baseUrl = config_1.CONFIG.BAGS_API_BASE_URL;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
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
            return data;
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    // ==================== TRADING ====================
    async getQuote(params) {
        const queryParams = new URLSearchParams({
            inputMint: params.inputMint,
            outputMint: params.outputMint,
            amount: params.amount.toString(),
            slippageMode: params.slippageMode || 'auto',
        });
        if (params.slippageMode === 'manual' && params.slippageBps !== undefined) {
            queryParams.set('slippageBps', params.slippageBps.toString());
        }
        const result = await this.request(`/trade/quote?${queryParams.toString()}`, { method: 'GET' });
        // Cache quote for swap execution
        if (result.success && result.response) {
            this.quoteCache.set(result.response.requestId, result.response);
        }
        return result;
    }
    async createSwap(params) {
        const quote = this.quoteCache.get(params.quoteRequestId);
        if (!quote) {
            return {
                success: false,
                error: 'Quote not found. Please get a new quote first using bags_quote.',
            };
        }
        return this.request('/trade/swap', {
            method: 'POST',
            body: JSON.stringify({
                quoteResponse: quote,
                userPublicKey: params.wallet,
            }),
        });
    }
    // ==================== TOKEN LAUNCH ====================
    async createTokenInfo(params) {
        const formData = new FormData();
        formData.append('name', params.name);
        formData.append('symbol', params.symbol);
        formData.append('description', params.description);
        if (params.imageUrl)
            formData.append('imageUrl', params.imageUrl);
        if (params.twitter)
            formData.append('twitter', params.twitter);
        if (params.telegram)
            formData.append('telegram', params.telegram);
        if (params.website)
            formData.append('website', params.website);
        const url = `${this.baseUrl}/token-launch/create-token-info`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
            },
            body: formData,
        });
        return response.json();
    }
    async createLaunchTransaction(params) {
        return this.request('/token-launch/create-launch-transaction', {
            method: 'POST',
            body: JSON.stringify({
                ipfs: params.ipfs,
                tokenMint: params.tokenMint,
                wallet: params.wallet,
                configKey: params.configKey,
                initialBuyLamports: params.initialBuyLamports || 0,
            }),
        });
    }
    // ==================== ANALYTICS ====================
    async getCreators(tokenMint) {
        return this.request(`/token-launch/creator/v3?tokenMint=${tokenMint}`, { method: 'GET' });
    }
    async getLifetimeFees(tokenMint) {
        return this.request(`/token-launch/lifetime-fees?tokenMint=${tokenMint}`, { method: 'GET' });
    }
    async getClaimStats(tokenMint) {
        return this.request(`/token-launch/claim-stats?tokenMint=${tokenMint}`, { method: 'GET' });
    }
    async getClaimEvents(params) {
        const queryParams = new URLSearchParams({
            tokenMint: params.tokenMint,
            mode: params.mode || 'offset',
        });
        if (params.mode === 'offset' || !params.mode) {
            queryParams.set('limit', (params.limit || 100).toString());
            queryParams.set('offset', (params.offset || 0).toString());
        }
        else {
            if (params.from !== undefined)
                queryParams.set('from', params.from.toString());
            if (params.to !== undefined)
                queryParams.set('to', params.to.toString());
        }
        return this.request(`/fee-share/token/claim-events?${queryParams.toString()}`, { method: 'GET' });
    }
    // ==================== FEE CLAIMING ====================
    async getClaimablePositions(wallet) {
        return this.request(`/token-launch/claimable-positions?wallet=${wallet}`, { method: 'GET' });
    }
    async createClaimTransactions(params) {
        return this.request('/token-launch/claim-txs/v3', {
            method: 'POST',
            body: JSON.stringify({
                tokenMint: params.tokenMint,
                feeClaimer: params.wallet,
            }),
        });
    }
    // ==================== FEE SHARE CONFIG ====================
    async getFeeShareWallet(params) {
        const queryParams = new URLSearchParams({
            provider: params.provider,
            username: params.username,
        });
        return this.request(`/token-launch/fee-share/wallet/v2?${queryParams.toString()}`, { method: 'GET' });
    }
    async createFeeConfig(params) {
        return this.request('/fee-share/config', {
            method: 'POST',
            body: JSON.stringify({
                payer: params.payer,
                baseMint: params.baseMint,
                claimersArray: params.claimers,
                basisPointsArray: params.basisPoints,
            }),
        });
    }
    async getAdminList(wallet) {
        return this.request(`/fee-share/admin/list?wallet=${wallet}`, { method: 'GET' });
    }
    async updateFeeConfig(params) {
        return this.request('/fee-share/admin/update-config', {
            method: 'POST',
            body: JSON.stringify({
                baseMint: params.baseMint,
                payer: params.payer,
                claimersArray: params.claimers,
                basisPointsArray: params.basisPoints,
            }),
        });
    }
    async transferAdmin(params) {
        return this.request('/fee-share/admin/transfer-tx', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }
    // ==================== STATE/POOLS ====================
    async getPools(onlyMigrated) {
        const query = onlyMigrated ? '?onlyMigrated=true' : '';
        return this.request(`/solana/bags/pools${query}`, { method: 'GET' });
    }
    async getPoolByMint(tokenMint) {
        return this.request(`/solana/bags/pools/token-mint?tokenMint=${tokenMint}`, { method: 'GET' });
    }
    // ==================== PARTNER ====================
    async getPartnerStats(partner) {
        return this.request(`/fee-share/partner-config/stats?partner=${partner}`, { method: 'GET' });
    }
    async createPartnerClaimTransactions(partnerWallet) {
        return this.request('/fee-share/partner-config/claim-tx', {
            method: 'POST',
            body: JSON.stringify({ partnerWallet }),
        });
    }
}
// Export singleton instance
exports.bagsClient = new BagsClient();
//# sourceMappingURL=bags-client-new.js.map