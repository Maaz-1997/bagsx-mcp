interface BagsResponse<T> {
    success: boolean;
    response?: T;
    error?: string;
}
interface QuoteResponse {
    requestId: string;
    contextSlot: number;
    inAmount: string;
    inputMint: string;
    outAmount: string;
    outputMint: string;
    minOutAmount: string;
    otherAmountThreshold: string;
    priceImpactPct: string;
    slippageBps: number;
    routePlan: {
        venue: string;
        inAmount: string;
        outAmount: string;
        inputMint: string;
        outputMint: string;
        inputMintDecimals: number;
        outputMintDecimals: number;
        marketKey: string;
        data: string;
    }[];
    platformFee?: {
        amount: string;
        feeBps: number;
        feeAccount: string;
    };
    simulatedComputeUnits: number;
}
interface SwapResponse {
    swapTransaction: string;
    computeUnitLimit: number;
    lastValidBlockHeight: number;
    prioritizationFeeLamports: number;
}
interface TokenInfoResponse {
    tokenMint: string;
    tokenMetadata: string;
    tokenLaunch: {
        name: string;
        symbol: string;
        description: string;
        image: string;
        tokenMint: string;
        status: string;
        createdAt: string;
        uri: string;
    };
}
interface CreatorInfo {
    username: string;
    pfp: string;
    royaltyBps: number;
    isCreator: boolean;
    wallet: string;
    provider: string;
    providerUsername: string;
    isAdmin: boolean;
}
interface ClaimStat extends CreatorInfo {
    totalClaimed: string;
}
interface ClaimEvent {
    wallet: string;
    isCreator: boolean;
    amount: string;
    signature: string;
    timestamp: string;
}
interface ClaimablePosition {
    baseMint: string;
    isMigrated: boolean;
    totalClaimableLamportsUserShare: number;
    claimableDisplayAmount: number;
    user: string;
    userBps: number;
}
interface PoolInfo {
    tokenMint: string;
    dbcConfigKey: string;
    dbcPoolKey: string;
    dammV2PoolKey: string;
}
interface FeeWalletResponse {
    provider: string;
    platformData: {
        id: string;
        username: string;
        display_name: string;
        avatar_url: string;
    };
    wallet: string;
}
interface FeeConfigResponse {
    needsCreation: boolean;
    feeShareAuthority: string;
    meteoraConfigKey: string;
    transactions: {
        blockhash: {
            blockhash: string;
            lastValidBlockHeight: number;
        };
        transaction: string;
    }[];
}
interface TransactionBundle {
    blockhash: {
        blockhash: string;
        lastValidBlockHeight: number;
    };
    transaction: string;
}
interface PartnerStats {
    claimedFees: string;
    unclaimedFees: string;
}
declare class BagsClient {
    private apiKey;
    private baseUrl;
    private quoteCache;
    constructor();
    private request;
    getQuote(params: {
        inputMint: string;
        outputMint: string;
        amount: number;
        slippageMode?: 'auto' | 'manual';
        slippageBps?: number;
    }): Promise<BagsResponse<QuoteResponse>>;
    createSwap(params: {
        quoteRequestId: string;
        wallet: string;
    }): Promise<BagsResponse<SwapResponse>>;
    createTokenInfo(params: {
        name: string;
        symbol: string;
        description: string;
        imageUrl?: string;
        twitter?: string;
        telegram?: string;
        website?: string;
    }): Promise<BagsResponse<TokenInfoResponse>>;
    createLaunchTransaction(params: {
        ipfs: string;
        tokenMint: string;
        wallet: string;
        configKey: string;
        initialBuyLamports?: number;
    }): Promise<BagsResponse<string>>;
    getCreators(tokenMint: string): Promise<BagsResponse<CreatorInfo[]>>;
    getLifetimeFees(tokenMint: string): Promise<BagsResponse<string>>;
    getClaimStats(tokenMint: string): Promise<BagsResponse<ClaimStat[]>>;
    getClaimEvents(params: {
        tokenMint: string;
        mode?: 'offset' | 'time';
        limit?: number;
        offset?: number;
        from?: number;
        to?: number;
    }): Promise<BagsResponse<{
        events: ClaimEvent[];
    }>>;
    getClaimablePositions(wallet: string): Promise<BagsResponse<ClaimablePosition[]>>;
    createClaimTransactions(params: {
        tokenMint: string;
        wallet: string;
    }): Promise<BagsResponse<TransactionBundle[]>>;
    getFeeShareWallet(params: {
        provider: string;
        username: string;
    }): Promise<BagsResponse<FeeWalletResponse>>;
    createFeeConfig(params: {
        payer: string;
        baseMint: string;
        claimers: string[];
        basisPoints: number[];
    }): Promise<BagsResponse<FeeConfigResponse>>;
    getAdminList(wallet: string): Promise<BagsResponse<{
        tokenMints: string[];
    }>>;
    updateFeeConfig(params: {
        baseMint: string;
        payer: string;
        claimers: string[];
        basisPoints: number[];
    }): Promise<BagsResponse<{
        transactions: TransactionBundle[];
    }>>;
    transferAdmin(params: {
        baseMint: string;
        currentAdmin: string;
        newAdmin: string;
        payer: string;
    }): Promise<BagsResponse<TransactionBundle>>;
    getPools(onlyMigrated?: boolean): Promise<BagsResponse<PoolInfo[]>>;
    getPoolByMint(tokenMint: string): Promise<BagsResponse<PoolInfo>>;
    getPartnerStats(partner: string): Promise<BagsResponse<PartnerStats>>;
    createPartnerClaimTransactions(partnerWallet: string): Promise<BagsResponse<{
        transactions: TransactionBundle[];
    }>>;
}
export declare const bagsClient: BagsClient;
export {};
//# sourceMappingURL=bags-client-new.d.ts.map