import { z } from 'zod';
export declare const TOOL_DEFINITIONS: {
    bags_trending: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                metric: {
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
            };
            required: never[];
        };
    };
    bags_search: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                query: {
                    type: string;
                    description: string;
                };
                limit: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: string[];
        };
    };
    bags_token_info: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_portfolio: {
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
    bags_trades: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                limit: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: string[];
        };
    };
    bags_whales: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                minUsd: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: never[];
        };
    };
    bags_quote: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                from: {
                    type: string;
                    description: string;
                };
                to: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
                slippage: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: string[];
        };
    };
    bags_buy: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                amountUsd: {
                    type: string;
                    description: string;
                };
                slippage: {
                    type: string;
                    description: string;
                    default: number;
                };
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_sell: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
                percentage: {
                    type: string;
                    description: string;
                };
                slippage: {
                    type: string;
                    description: string;
                    default: number;
                };
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_creator_earnings: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_price_history: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                period: {
                    type: string;
                    enum: string[];
                    description: string;
                    default: string;
                };
            };
            required: string[];
        };
    };
    bags_new_launches: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                hours: {
                    type: string;
                    description: string;
                    default: number;
                };
                limit: {
                    type: string;
                    description: string;
                    default: number;
                };
            };
            required: never[];
        };
    };
    bags_gainers_losers: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                type: {
                    type: string;
                    enum: string[];
                    description: string;
                    default: string;
                };
                period: {
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
            };
            required: never[];
        };
    };
    bags_holder_analysis: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
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
                fromToken: {
                    type: string;
                    description: string;
                };
                toToken: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
                slippage: {
                    type: string;
                    description: string;
                    default: number;
                };
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_limit_order: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                side: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                price: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
                expiry: {
                    type: string;
                    enum: string[];
                    description: string;
                    default: string;
                };
                wallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_gas_estimate: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                action: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                token: {
                    type: string;
                    description: string;
                };
                amount: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_slippage_check: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                side: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                amountUsd: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    bags_watchlist: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                action: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                token: {
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
    bags_price_alert: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                action: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                token: {
                    type: string;
                    description: string;
                };
                targetPrice: {
                    type: string;
                    description: string;
                };
                direction: {
                    type: string;
                    enum: string[];
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
    bags_pnl_report: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                wallet: {
                    type: string;
                    description: string;
                };
                period: {
                    type: string;
                    enum: string[];
                    description: string;
                    default: string;
                };
            };
            required: string[];
        };
    };
    bags_compare: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                tokens: {
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
    bags_top_creators: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                metric: {
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
            };
            required: never[];
        };
    };
    bags_launch_token: {
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
                image: {
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
                initialBuySol: {
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
    bags_airdrop: {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                token: {
                    type: string;
                    description: string;
                };
                recipients: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            wallet: {
                                type: string;
                            };
                            amount: {
                                type: string;
                            };
                        };
                    };
                    description: string;
                };
                senderWallet: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
};
export declare const TrendingInputSchema: z.ZodObject<{
    metric: z.ZodDefault<z.ZodOptional<z.ZodEnum<["volume", "marketCap", "gainers", "losers"]>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    metric: "volume" | "marketCap" | "gainers" | "losers";
    limit: number;
}, {
    metric?: "volume" | "marketCap" | "gainers" | "losers" | undefined;
    limit?: number | undefined;
}>;
export declare const SearchInputSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit: number;
}, {
    query: string;
    limit?: number | undefined;
}>;
export declare const TokenInfoInputSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const PortfolioInputSchema: z.ZodObject<{
    wallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet: string;
}, {
    wallet: string;
}>;
export declare const TradesInputSchema: z.ZodObject<{
    token: z.ZodString;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    token: string;
    limit: number;
}, {
    token: string;
    limit?: number | undefined;
}>;
export declare const WhalesInputSchema: z.ZodObject<{
    token: z.ZodOptional<z.ZodString>;
    minUsd: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    minUsd: number;
    token?: string | undefined;
}, {
    token?: string | undefined;
    minUsd?: number | undefined;
}>;
export declare const QuoteInputSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    amount: z.ZodNumber;
    slippage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    amount: number;
    slippage: number;
}, {
    from: string;
    to: string;
    amount: number;
    slippage?: number | undefined;
}>;
export declare const BuyInputSchema: z.ZodObject<{
    token: z.ZodString;
    amountUsd: z.ZodNumber;
    slippage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    token: string;
    amountUsd: number;
    slippage: number;
    wallet?: string | undefined;
}, {
    token: string;
    amountUsd: number;
    wallet?: string | undefined;
    slippage?: number | undefined;
}>;
export declare const SellInputSchema: z.ZodObject<{
    token: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    percentage: z.ZodOptional<z.ZodNumber>;
    slippage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    token: string;
    slippage: number;
    wallet?: string | undefined;
    amount?: number | undefined;
    percentage?: number | undefined;
}, {
    token: string;
    wallet?: string | undefined;
    amount?: number | undefined;
    slippage?: number | undefined;
    percentage?: number | undefined;
}>;
export declare const CreatorEarningsInputSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const PriceHistoryInputSchema: z.ZodObject<{
    token: z.ZodString;
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["1h", "24h", "7d", "30d"]>>>;
}, "strip", z.ZodTypeAny, {
    token: string;
    period: "1h" | "24h" | "7d" | "30d";
}, {
    token: string;
    period?: "1h" | "24h" | "7d" | "30d" | undefined;
}>;
export declare const NewLaunchesInputSchema: z.ZodObject<{
    hours: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    hours: number;
}, {
    limit?: number | undefined;
    hours?: number | undefined;
}>;
export declare const GainersLosersInputSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["gainers", "losers", "both"]>>>;
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["1h", "24h", "7d"]>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    type: "gainers" | "losers" | "both";
    period: "1h" | "24h" | "7d";
}, {
    limit?: number | undefined;
    type?: "gainers" | "losers" | "both" | undefined;
    period?: "1h" | "24h" | "7d" | undefined;
}>;
export declare const HolderAnalysisInputSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const SwapInputSchema: z.ZodObject<{
    fromToken: z.ZodString;
    toToken: z.ZodString;
    amount: z.ZodNumber;
    slippage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    fromToken: string;
    toToken: string;
    slippage: number;
    wallet?: string | undefined;
}, {
    amount: number;
    fromToken: string;
    toToken: string;
    wallet?: string | undefined;
    slippage?: number | undefined;
}>;
export declare const LimitOrderInputSchema: z.ZodObject<{
    token: z.ZodString;
    side: z.ZodEnum<["buy", "sell"]>;
    price: z.ZodNumber;
    amount: z.ZodNumber;
    expiry: z.ZodDefault<z.ZodOptional<z.ZodEnum<["1h", "24h", "7d", "30d"]>>>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    token: string;
    amount: number;
    side: "buy" | "sell";
    price: number;
    expiry: "1h" | "24h" | "7d" | "30d";
    wallet?: string | undefined;
}, {
    token: string;
    amount: number;
    side: "buy" | "sell";
    price: number;
    wallet?: string | undefined;
    expiry?: "1h" | "24h" | "7d" | "30d" | undefined;
}>;
export declare const GasEstimateInputSchema: z.ZodObject<{
    action: z.ZodEnum<["buy", "sell", "swap", "launch"]>;
    token: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    action: "buy" | "sell" | "swap" | "launch";
    token?: string | undefined;
    amount?: number | undefined;
}, {
    action: "buy" | "sell" | "swap" | "launch";
    token?: string | undefined;
    amount?: number | undefined;
}>;
export declare const SlippageCheckInputSchema: z.ZodObject<{
    token: z.ZodString;
    side: z.ZodEnum<["buy", "sell"]>;
    amountUsd: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    token: string;
    amountUsd: number;
    side: "buy" | "sell";
}, {
    token: string;
    amountUsd: number;
    side: "buy" | "sell";
}>;
export declare const WatchlistInputSchema: z.ZodObject<{
    action: z.ZodEnum<["add", "remove", "list"]>;
    token: z.ZodOptional<z.ZodString>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "add" | "remove" | "list";
    token?: string | undefined;
    wallet?: string | undefined;
}, {
    action: "add" | "remove" | "list";
    token?: string | undefined;
    wallet?: string | undefined;
}>;
export declare const PriceAlertInputSchema: z.ZodObject<{
    action: z.ZodEnum<["set", "remove", "list"]>;
    token: z.ZodOptional<z.ZodString>;
    targetPrice: z.ZodOptional<z.ZodNumber>;
    direction: z.ZodOptional<z.ZodEnum<["above", "below"]>>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "remove" | "list" | "set";
    token?: string | undefined;
    wallet?: string | undefined;
    targetPrice?: number | undefined;
    direction?: "above" | "below" | undefined;
}, {
    action: "remove" | "list" | "set";
    token?: string | undefined;
    wallet?: string | undefined;
    targetPrice?: number | undefined;
    direction?: "above" | "below" | undefined;
}>;
export declare const PnlReportInputSchema: z.ZodObject<{
    wallet: z.ZodString;
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["24h", "7d", "30d", "all"]>>>;
}, "strip", z.ZodTypeAny, {
    wallet: string;
    period: "24h" | "7d" | "30d" | "all";
}, {
    wallet: string;
    period?: "24h" | "7d" | "30d" | "all" | undefined;
}>;
export declare const CompareInputSchema: z.ZodObject<{
    tokens: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    tokens: string[];
}, {
    tokens: string[];
}>;
export declare const TopCreatorsInputSchema: z.ZodObject<{
    metric: z.ZodDefault<z.ZodOptional<z.ZodEnum<["earnings", "volume", "holders"]>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    metric: "volume" | "earnings" | "holders";
    limit: number;
}, {
    metric?: "volume" | "earnings" | "holders" | undefined;
    limit?: number | undefined;
}>;
export declare const LaunchTokenInputSchema: z.ZodObject<{
    name: z.ZodString;
    symbol: z.ZodString;
    description: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    twitter: z.ZodOptional<z.ZodString>;
    telegram: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    initialBuySol: z.ZodOptional<z.ZodNumber>;
    wallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    description: string;
    wallet?: string | undefined;
    image?: string | undefined;
    twitter?: string | undefined;
    telegram?: string | undefined;
    website?: string | undefined;
    initialBuySol?: number | undefined;
}, {
    symbol: string;
    name: string;
    description: string;
    wallet?: string | undefined;
    image?: string | undefined;
    twitter?: string | undefined;
    telegram?: string | undefined;
    website?: string | undefined;
    initialBuySol?: number | undefined;
}>;
export declare const AirdropInputSchema: z.ZodObject<{
    token: z.ZodString;
    recipients: z.ZodArray<z.ZodObject<{
        wallet: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        wallet: string;
        amount: number;
    }, {
        wallet: string;
        amount: number;
    }>, "many">;
    senderWallet: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    token: string;
    recipients: {
        wallet: string;
        amount: number;
    }[];
    senderWallet?: string | undefined;
}, {
    token: string;
    recipients: {
        wallet: string;
        amount: number;
    }[];
    senderWallet?: string | undefined;
}>;
//# sourceMappingURL=definitions.d.ts.map