import { CONFIG } from '../config';

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
  transaction: string; // Base64 encoded unsigned transaction
  amountIn: number;
  amountOut: number;
  priceImpact: number;
  fee: number;
  expiresAt: string; // ISO timestamp - transaction valid for ~2 minutes
}

class BagsClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = CONFIG.BAGS_API_KEY;
    this.baseUrl = CONFIG.BAGS_API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BagsResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'x-api-key': this.apiKey }),
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json() as { response?: T; error?: string };

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        response: (data.response || data) as T,
      };
    } catch (error) {
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
  async getTrending(
    metric: 'volume' | 'marketCap' | 'gainers' | 'losers' = 'volume',
    limit: number = 10
  ): Promise<BagsResponse<TrendingToken[]>> {
    return this.request<TrendingToken[]>(`/tokens/trending?metric=${metric}&limit=${limit}`);
  }

  /**
   * Search for tokens by name or symbol
   */
  async searchTokens(query: string, limit: number = 10): Promise<BagsResponse<TokenInfo[]>> {
    return this.request<TokenInfo[]>(`/tokens/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Get detailed info for a specific token
   */
  async getTokenInfo(mintOrSymbol: string): Promise<BagsResponse<TokenInfo>> {
    return this.request<TokenInfo>(`/tokens/${encodeURIComponent(mintOrSymbol)}`);
  }

  /**
   * Get portfolio for a wallet address
   */
  async getPortfolio(walletAddress: string): Promise<BagsResponse<Portfolio>> {
    return this.request<Portfolio>(`/wallets/${walletAddress}/portfolio`);
  }

  /**
   * Get recent trades for a token
   */
  async getRecentTrades(
    mint: string,
    limit: number = 20
  ): Promise<BagsResponse<any[]>> {
    return this.request<any[]>(`/tokens/${mint}/trades?limit=${limit}`);
  }

  /**
   * Get whale activity (large trades)
   */
  async getWhaleActivity(
    mint?: string,
    minUsd: number = 10000
  ): Promise<BagsResponse<any[]>> {
    const endpoint = mint
      ? `/tokens/${mint}/whales?minUsd=${minUsd}`
      : `/whales?minUsd=${minUsd}`;
    return this.request<any[]>(endpoint);
  }

  /**
   * Get creator earnings for a token
   */
  async getCreatorEarnings(mint: string): Promise<BagsResponse<{
    totalEarnings: number;
    totalVolume: number;
    tradeCount: number;
  }>> {
    return this.request(`/tokens/${mint}/earnings`);
  }

  // ==================== WRITE OPERATIONS ====================

  /**
   * Get a quote for a trade (doesn't execute)
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number = CONFIG.DEFAULT_SLIPPAGE
  ): Promise<BagsResponse<{
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
    fee: number;
  }>> {
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
  async buy(
    tokenMint: string,
    amountUsd: number,
    slippage: number = CONFIG.DEFAULT_SLIPPAGE,
    walletAddress?: string
  ): Promise<BagsResponse<UnsignedTransaction>> {
    // Generate unsigned transaction - user will sign it themselves
    return this.request<UnsignedTransaction>('/trading/prepare-buy', {
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
  async sell(
    tokenMint: string,
    amountTokens: number,
    slippage: number = CONFIG.DEFAULT_SLIPPAGE,
    walletAddress?: string
  ): Promise<BagsResponse<UnsignedTransaction>> {
    // Generate unsigned transaction - user will sign it themselves
    return this.request<UnsignedTransaction>('/trading/prepare-sell', {
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
  async createTokenMetadata(params: {
    name: string;
    symbol: string;
    description: string;
    image?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  }): Promise<BagsResponse<{ metadataUri: string }>> {
    return this.request('/tokens/metadata', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Launch a new token on Bags.fm
   */
  async launchToken(params: {
    metadataUri: string;
    initialBuyAmountSol?: number;
    feeSharing?: {
      wallets: string[];
      percentages: number[];
    };
  }): Promise<BagsResponse<{
    transaction: string; // Unsigned transaction for token launch
    mint: string;
    bagsUrl: string;
  }>> {
    // Returns unsigned transaction - user signs themselves
    return this.request('/tokens/prepare-launch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export const bagsClient = new BagsClient();
export type { TokenInfo, TrendingToken, Portfolio, TradeResult, BagsResponse };
