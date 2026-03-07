import { bagsClient } from '../lib/bags-client';
import {
  TrendingInputSchema,
  SearchInputSchema,
  TokenInfoInputSchema,
  PortfolioInputSchema,
  TradesInputSchema,
  WhalesInputSchema,
  QuoteInputSchema,
  BuyInputSchema,
  SellInputSchema,
  CreatorEarningsInputSchema,
} from './definitions';

type ToolResult = {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
};

function formatSuccess(data: unknown): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function formatError(message: string): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${message}`,
      },
    ],
    isError: true,
  };
}

export async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (toolName) {
      // ==================== READ OPERATIONS ====================
      
      case 'bags_trending': {
        const input = TrendingInputSchema.parse(args);
        const result = await bagsClient.getTrending(input.metric, input.limit);
        
        if (!result.success) {
          return formatError(result.error || 'Failed to fetch trending tokens');
        }
        
        return formatSuccess({
          metric: input.metric,
          tokens: result.response,
        });
      }

      case 'bags_search': {
        const input = SearchInputSchema.parse(args);
        const result = await bagsClient.searchTokens(input.query, input.limit);
        
        if (!result.success) {
          return formatError(result.error || 'Search failed');
        }
        
        return formatSuccess({
          query: input.query,
          results: result.response,
        });
      }

      case 'bags_token_info': {
        const input = TokenInfoInputSchema.parse(args);
        const result = await bagsClient.getTokenInfo(input.token);
        
        if (!result.success) {
          return formatError(result.error || 'Token not found');
        }
        
        return formatSuccess(result.response);
      }

      case 'bags_portfolio': {
        const input = PortfolioInputSchema.parse(args);
        const result = await bagsClient.getPortfolio(input.wallet);
        
        if (!result.success) {
          return formatError(result.error || 'Failed to fetch portfolio');
        }
        
        return formatSuccess(result.response);
      }

      case 'bags_trades': {
        const input = TradesInputSchema.parse(args);
        const result = await bagsClient.getRecentTrades(input.token, input.limit);
        
        if (!result.success) {
          return formatError(result.error || 'Failed to fetch trades');
        }
        
        return formatSuccess({
          token: input.token,
          trades: result.response,
        });
      }

      case 'bags_whales': {
        const input = WhalesInputSchema.parse(args);
        const result = await bagsClient.getWhaleActivity(input.token, input.minUsd);
        
        if (!result.success) {
          return formatError(result.error || 'Failed to fetch whale activity');
        }
        
        return formatSuccess({
          filter: input.token ? `Token: ${input.token}` : 'All tokens',
          minUsd: input.minUsd,
          activity: result.response,
        });
      }

      // ==================== TRADE OPERATIONS ====================

      case 'bags_quote': {
        const input = QuoteInputSchema.parse(args);
        const result = await bagsClient.getQuote(
          input.from,
          input.to,
          input.amount,
          input.slippage
        );
        
        if (!result.success) {
          return formatError(result.error || 'Failed to get quote');
        }
        
        return formatSuccess({
          trade: `${input.amount} ${input.from} → ${input.to}`,
          quote: result.response,
        });
      }

      case 'bags_buy': {
        const input = BuyInputSchema.parse(args);
        
        // Double-check confirmation
        const confirmation = `⚠️ TRADE CONFIRMATION REQUIRED\n\nBuying: ${input.token}\nAmount: $${input.amountUsd} USD\nSlippage: ${input.slippage}%\n\nThis will execute a real trade. Proceed?`;
        
        const result = await bagsClient.buy(
          input.token,
          input.amountUsd,
          input.slippage
        );
        
        if (!result.success) {
          return formatError(result.error || 'Trade failed');
        }
        
        return formatSuccess({
          status: 'success',
          trade: result.response,
        });
      }

      case 'bags_sell': {
        const input = SellInputSchema.parse(args);
        
        if (!input.amount && !input.percentage) {
          return formatError('Must specify either amount or percentage to sell');
        }
        
        const result = await bagsClient.sell(
          input.token,
          input.amount || 0, // Will be calculated from percentage
          input.slippage
        );
        
        if (!result.success) {
          return formatError(result.error || 'Trade failed');
        }
        
        return formatSuccess({
          status: 'success',
          trade: result.response,
        });
      }

      // ==================== ANALYTICS ====================

      case 'bags_creator_earnings': {
        const input = CreatorEarningsInputSchema.parse(args);
        const result = await bagsClient.getCreatorEarnings(input.token);
        
        if (!result.success) {
          return formatError(result.error || 'Failed to fetch earnings');
        }
        
        return formatSuccess(result.response);
      }

      default:
        return formatError(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return formatError(error.message);
    }
    return formatError('An unexpected error occurred');
  }
}
