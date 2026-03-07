interface BagsResponse<T> {
    success: boolean;
    response?: T;
    error?: string;
}
interface TokenInfo {
    mint: string;
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    marketCap?: number;
    volume24h?: number;
    priceUsd?: number;
    holders?: number;
    createdAt?: string;
}
interface TrendingToken extends TokenInfo {
    change24h?: number;
    rank?: number;
}
interface Portfolio {
    tokens: {
        mint: string;
        symbol: string;
        balance: number;
        valueUsd: number;
        change24h: number;
    }[];
    totalValueUsd: number;
    totalChange24h: number;
}
interface TradeResult {
    success: boolean;
    txHash?: string;
    amountIn?: number;
    amountOut?: number;
    priceImpact?: number;
    error?: string;
}
interface UnsignedTransaction {
    transaction: string;
    amountIn: number;
    amountOut: number;
    priceImpact: number;
    fee: number;
    expiresAt: string;
}
declare class BagsClient {
    private apiKey;
    private baseUrl;
    constructor();
    private request;
    /**
     * Get trending tokens on Bags.fm
     */
    getTrending(metric?: 'volume' | 'marketCap' | 'gainers' | 'losers', limit?: number): Promise<BagsResponse<TrendingToken[]>>;
    /**
     * Search for tokens by name or symbol
     */
    searchTokens(query: string, limit?: number): Promise<BagsResponse<TokenInfo[]>>;
    /**
     * Get detailed info for a specific token
     */
    getTokenInfo(mintOrSymbol: string): Promise<BagsResponse<TokenInfo>>;
    /**
     * Get portfolio for a wallet address
     */
    getPortfolio(walletAddress: string): Promise<BagsResponse<Portfolio>>;
    /**
     * Get recent trades for a token
     */
    getRecentTrades(mint: string, limit?: number): Promise<BagsResponse<any[]>>;
    /**
     * Get whale activity (large trades)
     */
    getWhaleActivity(mint?: string, minUsd?: number): Promise<BagsResponse<any[]>>;
    /**
     * Get creator earnings for a token
     */
    getCreatorEarnings(mint: string): Promise<BagsResponse<{
        totalEarnings: number;
        totalVolume: number;
        tradeCount: number;
    }>>;
    /**
     * Get a quote for a trade (doesn't execute)
     */
    getQuote(inputMint: string, outputMint: string, amount: number, slippage?: number): Promise<BagsResponse<{
        inputAmount: number;
        outputAmount: number;
        priceImpact: number;
        fee: number;
    }>>;
    /**
     * Generate unsigned buy transaction (user signs in their wallet)
     * Returns base64 transaction to sign - NO PRIVATE KEY NEEDED
     */
    buy(tokenMint: string, amountUsd: number, slippage?: number, walletAddress?: string): Promise<BagsResponse<UnsignedTransaction>>;
    /**
     * Generate unsigned sell transaction (user signs in their wallet)
     * Returns base64 transaction to sign - NO PRIVATE KEY NEEDED
     */
    sell(tokenMint: string, amountTokens: number, slippage?: number, walletAddress?: string): Promise<BagsResponse<UnsignedTransaction>>;
    /**
     * Create token metadata (first step of launch)
     */
    createTokenMetadata(params: {
        name: string;
        symbol: string;
        description: string;
        image?: string;
        twitter?: string;
        telegram?: string;
        website?: string;
    }): Promise<BagsResponse<{
        metadataUri: string;
    }>>;
    /**
     * Launch a new token on Bags.fm
     */
    launchToken(params: {
        metadataUri: string;
        initialBuyAmountSol?: number;
        feeSharing?: {
            wallets: string[];
            percentages: number[];
        };
    }): Promise<BagsResponse<{
        transaction: string;
        mint: string;
        bagsUrl: string;
    }>>;
    /**
     * Get historical price data for a token
     */
    getPriceHistory(token: string, period?: '1h' | '24h' | '7d' | '30d'): Promise<BagsResponse<{
        token: string;
        period: string;
        prices: Array<{
            timestamp: number;
            price: number;
            volume: number;
        }>;
        priceChange: number;
        high: number;
        low: number;
    }>>;
    /**
     * Get newly launched tokens
     */
    getNewLaunches(hours?: number, limit?: number): Promise<BagsResponse<Array<{
        mint: string;
        name: string;
        symbol: string;
        creator: string;
        launchedAt: string;
        initialMarketCap: number;
        currentMarketCap: number;
        priceChange: number;
        volume24h: number;
        holders: number;
    }>>>;
    /**
     * Get top gainers and losers
     */
    getGainersLosers(type?: 'gainers' | 'losers' | 'both', period?: '1h' | '24h' | '7d', limit?: number): Promise<BagsResponse<{
        gainers?: Array<{
            mint: string;
            symbol: string;
            name: string;
            priceChange: number;
            volume: number;
        }>;
        losers?: Array<{
            mint: string;
            symbol: string;
            name: string;
            priceChange: number;
            volume: number;
        }>;
    }>>;
    /**
     * Analyze holder distribution for a token
     */
    getHolderAnalysis(token: string): Promise<BagsResponse<{
        totalHolders: number;
        top10Concentration: number;
        top50Concentration: number;
        whaleCount: number;
        retailCount: number;
        distribution: Array<{
            range: string;
            count: number;
            percentage: number;
        }>;
        topHolders: Array<{
            wallet: string;
            balance: number;
            percentage: number;
        }>;
    }>>;
    /**
     * Prepare token-to-token swap (unsigned transaction)
     */
    prepareSwap(fromToken: string, toToken: string, amount: number, slippage?: number, wallet?: string): Promise<BagsResponse<UnsignedTransaction & {
        inputAmount: number;
        outputAmount: number;
        priceImpact: number;
    }>>;
    /**
     * Set a limit order
     */
    setLimitOrder(params: {
        token: string;
        side: 'buy' | 'sell';
        price: number;
        amount: number;
        expiry: string;
        wallet?: string;
    }): Promise<BagsResponse<{
        orderId: string;
        token: string;
        side: string;
        targetPrice: number;
        amount: number;
        expiresAt: string;
        status: 'active' | 'pending';
    }>>;
    /**
     * Estimate gas/fees for a transaction
     */
    estimateGas(action: 'buy' | 'sell' | 'swap' | 'launch', token?: string, amount?: number): Promise<BagsResponse<{
        estimatedFee: number;
        feeInSol: number;
        feeInUsd: number;
        networkCongestion: 'low' | 'medium' | 'high';
        priorityFee: number;
    }>>;
    /**
     * Calculate slippage for a trade
     */
    checkSlippage(token: string, side: 'buy' | 'sell', amountUsd: number): Promise<BagsResponse<{
        expectedSlippage: number;
        priceImpact: number;
        recommendedSlippage: number;
        liquidity: number;
        warning: string | null;
    }>>;
    /**
     * Manage watchlist
     */
    manageWatchlist(action: 'add' | 'remove' | 'list', token?: string, wallet?: string): Promise<BagsResponse<{
        action: string;
        watchlist?: Array<{
            mint: string;
            symbol: string;
            name: string;
            addedAt: string;
            priceAtAdd: number;
            currentPrice: number;
            change: number;
        }>;
        success?: boolean;
    }>>;
    /**
     * Manage price alerts
     */
    managePriceAlert(params: {
        action: 'set' | 'remove' | 'list';
        token?: string;
        targetPrice?: number;
        direction?: 'above' | 'below';
        wallet?: string;
    }): Promise<BagsResponse<{
        action: string;
        alerts?: Array<{
            id: string;
            token: string;
            targetPrice: number;
            direction: string;
            currentPrice: number;
            createdAt: string;
        }>;
        success?: boolean;
    }>>;
    /**
     * Generate P&L report for a wallet
     */
    getPnlReport(wallet: string, period?: '24h' | '7d' | '30d' | 'all'): Promise<BagsResponse<{
        wallet: string;
        period: string;
        summary: {
            totalInvested: number;
            currentValue: number;
            realizedPnl: number;
            unrealizedPnl: number;
            totalPnl: number;
            percentageReturn: number;
        };
        byToken: Array<{
            token: string;
            symbol: string;
            invested: number;
            currentValue: number;
            pnl: number;
            percentageReturn: number;
        }>;
        trades: number;
        winRate: number;
    }>>;
    /**
     * Compare multiple tokens side-by-side
     */
    compareTokens(tokens: string[]): Promise<BagsResponse<Array<{
        mint: string;
        symbol: string;
        name: string;
        price: number;
        marketCap: number;
        volume24h: number;
        priceChange24h: number;
        priceChange7d: number;
        holders: number;
        liquidity: number;
        creatorEarnings: number;
    }>>>;
    /**
     * Get top creators leaderboard
     */
    getTopCreators(metric?: 'earnings' | 'volume' | 'holders', limit?: number): Promise<BagsResponse<Array<{
        wallet: string;
        displayName: string;
        avatar: string;
        tokenCount: number;
        totalEarnings: number;
        totalVolume: number;
        totalHolders: number;
        topToken: {
            symbol: string;
            mint: string;
        };
    }>>>;
    /**
     * Prepare token launch (full flow)
     */
    prepareTokenLaunch(params: {
        name: string;
        symbol: string;
        description: string;
        image?: string;
        twitter?: string;
        telegram?: string;
        website?: string;
        initialBuySol?: number;
        wallet?: string;
    }): Promise<BagsResponse<UnsignedTransaction & {
        metadataUri: string;
        estimatedMint: string;
        launchFee: number;
    }>>;
    /**
     * Prepare airdrop transaction
     */
    prepareAirdrop(token: string, recipients: Array<{
        wallet: string;
        amount: number;
    }>, senderWallet?: string): Promise<BagsResponse<UnsignedTransaction & {
        totalAmount: number;
        recipientCount: number;
        estimatedFee: number;
    }>>;
}
export declare const bagsClient: BagsClient;
export type { TokenInfo, TrendingToken, Portfolio, TradeResult, BagsResponse };
//# sourceMappingURL=bags-client.d.ts.map