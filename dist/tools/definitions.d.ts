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
}, "strip", z.ZodTypeAny, {
    token: string;
    amountUsd: number;
    slippage: number;
}, {
    token: string;
    amountUsd: number;
    slippage?: number | undefined;
}>;
export declare const SellInputSchema: z.ZodObject<{
    token: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    percentage: z.ZodOptional<z.ZodNumber>;
    slippage: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    token: string;
    slippage: number;
    amount?: number | undefined;
    percentage?: number | undefined;
}, {
    token: string;
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
//# sourceMappingURL=definitions.d.ts.map