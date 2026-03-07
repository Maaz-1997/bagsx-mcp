import { z } from 'zod';
export declare const TOOL_DEFINITIONS: {
    bags_quote: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                inputMint: {
                    type: string;
                    description: string;
                };
                outputMint: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
                slippageMode: {
                    type: string;
                    enum: string[];
                    description: string;
                    default: string;
                };
                slippageBps: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_swap: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                quoteRequestId: {
                    type: string;
                    description: string;
                };
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_launch_prepare: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                name: {
                    type: string;
                    description: string;
                };
                symbol: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                imageUrl: {
                    type: string;
                    description: string;
                };
                twitter: {
                    type: string;
                    description: string;
                };
                telegram: {
                    type: string;
                    description: string;
                };
                website: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_launch_execute: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                ipfs: {
                    type: string;
                    description: string;
                };
                tokenMint: {
                    type: string;
                    description: string;
                };
                wallet: {
                    type: string;
                    description: string;
                };
                configKey: {
                    type: string;
                    description: string;
                };
                initialBuyLamports: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: string[];
        };
    };
    bags_creators: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokenMint: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_lifetime_fees: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokenMint: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_claim_stats: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokenMint: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_claim_events: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokenMint: {
                    type: string;
                    description: string;
                };
                mode: {
                    type: string;
                    enum: string[];
                    description: string;
                    default: string;
                };
                limit: {
                    type: string;
                    description: string;
                    default: number;
                };
                offset: {
                    type: string;
                    description: string;
                    default: number;
                };
                from: {
                    type: string;
                    description: string;
                };
                to: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_claimable: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_claim_fees: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokenMint: {
                    type: string;
                    description: string;
                };
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_fee_wallet: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                provider: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                username: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_fee_config: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                payer: {
                    type: string;
                    description: string;
                };
                baseMint: {
                    type: string;
                    description: string;
                };
                claimers: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                basisPoints: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_admin_list: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_admin_update: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                baseMint: {
                    type: string;
                    description: string;
                };
                payer: {
                    type: string;
                    description: string;
                };
                claimers: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                basisPoints: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_admin_transfer: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                baseMint: {
                    type: string;
                    description: string;
                };
                currentAdmin: {
                    type: string;
                    description: string;
                };
                newAdmin: {
                    type: string;
                    description: string;
                };
                payer: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_pools: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                onlyMigrated: {
                    type: string;
                    description: string;
                    default: boolean;
                };
            };
            required: never[];
        };
    };
    bags_pool_info: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokenMint: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_partner_stats: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                partner: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_partner_claim: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                partnerWallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
};
export declare const QuoteInputSchema: z.ZodObject<{
    inputMint: z.ZodString;
    outputMint: z.ZodString;
    amount: z.ZodNumber;
    slippageMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["auto", "manual"]>>>;
    slippageBps: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageMode: "auto" | "manual";
    slippageBps?: number | undefined;
}, {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageMode?: "auto" | "manual" | undefined;
    slippageBps?: number | undefined;
}>;
export declare const SwapInputSchema: z.ZodObject<{
    quoteRequestId: z.ZodString;
    wallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    quoteRequestId: string;
    wallet: string;
}, {
    quoteRequestId: string;
    wallet: string;
}>;
export declare const LaunchPrepareInputSchema: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    description: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    twitter: z.ZodOptional<z.ZodString>;
    telegram: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    description: string;
    twitter?: string | undefined;
    imageUrl?: string | undefined;
    telegram?: string | undefined;
    website?: string | undefined;
}, {
    symbol: string;
    name: string;
    description: string;
    twitter?: string | undefined;
    imageUrl?: string | undefined;
    telegram?: string | undefined;
    website?: string | undefined;
}>;
export declare const LaunchExecuteInputSchema: z.ZodObject<{
    ipfs: z.ZodString;
    tokenMint: z.ZodString;
    wallet: z.ZodString;
    configKey: z.ZodString;
    initialBuyLamports: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    wallet: string;
    ipfs: string;
    tokenMint: string;
    configKey: string;
    initialBuyLamports: number;
}, {
    wallet: string;
    ipfs: string;
    tokenMint: string;
    configKey: string;
    initialBuyLamports?: number | undefined;
}>;
export declare const TokenMintInputSchema: z.ZodObject<{
    tokenMint: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokenMint: string;
}, {
    tokenMint: string;
}>;
export declare const ClaimEventsInputSchema: z.ZodObject<{
    tokenMint: z.ZodString;
    mode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["offset", "time"]>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    from: z.ZodOptional<z.ZodNumber>;
    to: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    tokenMint: string;
    offset: number;
    mode: "offset" | "time";
    limit: number;
    from?: number | undefined;
    to?: number | undefined;
}, {
    tokenMint: string;
    offset?: number | undefined;
    mode?: "offset" | "time" | undefined;
    limit?: number | undefined;
    from?: number | undefined;
    to?: number | undefined;
}>;
export declare const WalletInputSchema: z.ZodObject<{
    wallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet: string;
}, {
    wallet: string;
}>;
export declare const ClaimFeesInputSchema: z.ZodObject<{
    tokenMint: z.ZodString;
    wallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet: string;
    tokenMint: string;
}, {
    wallet: string;
    tokenMint: string;
}>;
export declare const FeeWalletInputSchema: z.ZodObject<{
    provider: z.ZodEnum<["twitter", "github", "instagram", "tiktok", "kick", "onlyfans"]>;
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    provider: "twitter" | "github" | "instagram" | "tiktok" | "kick" | "onlyfans";
    username: string;
}, {
    provider: "twitter" | "github" | "instagram" | "tiktok" | "kick" | "onlyfans";
    username: string;
}>;
export declare const FeeConfigInputSchema: z.ZodObject<{
    payer: z.ZodString;
    baseMint: z.ZodString;
    claimers: z.ZodArray<z.ZodString, "many">;
    basisPoints: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    payer: string;
    baseMint: string;
    claimers: string[];
    basisPoints: number[];
}, {
    payer: string;
    baseMint: string;
    claimers: string[];
    basisPoints: number[];
}>;
export declare const AdminUpdateInputSchema: z.ZodObject<{
    baseMint: z.ZodString;
    payer: z.ZodString;
    claimers: z.ZodArray<z.ZodString, "many">;
    basisPoints: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    payer: string;
    baseMint: string;
    claimers: string[];
    basisPoints: number[];
}, {
    payer: string;
    baseMint: string;
    claimers: string[];
    basisPoints: number[];
}>;
export declare const AdminTransferInputSchema: z.ZodObject<{
    baseMint: z.ZodString;
    currentAdmin: z.ZodString;
    newAdmin: z.ZodString;
    payer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payer: string;
    baseMint: string;
    currentAdmin: string;
    newAdmin: string;
}, {
    payer: string;
    baseMint: string;
    currentAdmin: string;
    newAdmin: string;
}>;
export declare const PoolsInputSchema: z.ZodObject<{
    onlyMigrated: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    onlyMigrated: boolean;
}, {
    onlyMigrated?: boolean | undefined;
}>;
export declare const PartnerInputSchema: z.ZodObject<{
    partner: z.ZodString;
}, "strip", z.ZodTypeAny, {
    partner: string;
}, {
    partner: string;
}>;
export declare const PartnerClaimInputSchema: z.ZodObject<{
    partnerWallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    partnerWallet: string;
}, {
    partnerWallet: string;
}>;
//# sourceMappingURL=definitions-new.d.ts.map