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
     * Execute a buy order (requires private key)
     */
    buy(tokenMint: string, amountUsd: number, slippage?: number): Promise<BagsResponse<TradeResult>>;
    /**
     * Execute a sell order (requires private key)
     */
    sell(tokenMint: string, amountTokens: number, slippage?: number): Promise<BagsResponse<TradeResult>>;
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
        mint: string;
        txHash: string;
        bagsUrl: string;
    }>>;
}
export declare const bagsClient: BagsClient;
export type { TokenInfo, TrendingToken, Portfolio, TradeResult, BagsResponse };
//# sourceMappingURL=bags-client.d.ts.map