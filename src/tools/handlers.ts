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
  // New Market Intelligence
  PriceHistoryInputSchema,
  NewLaunchesInputSchema,
  GainersLosersInputSchema,
  HolderAnalysisInputSchema,
  // New Trading Enhancements
  SwapInputSchema,
  LimitOrderInputSchema,
  GasEstimateInputSchema,
  SlippageCheckInputSchema,
  // New Portfolio & Alerts
  WatchlistInputSchema,
  PriceAlertInputSchema,
  PnlReportInputSchema,
  CompareInputSchema,
  // New Creator Tools
  TopCreatorsInputSchema,
  LaunchTokenInputSchema,
  AirdropInputSchema,
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

        const result = await bagsClient.buy(
          input.token,
          input.amountUsd,
          input.slippage,
          input.wallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare trade');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          trade: {
            type: 'BUY',
            token: input.token,
            amountUsd: input.amountUsd,
            expectedOutput: tx?.amountOut,
            priceImpact: tx?.priceImpact,
            fee: tx?.fee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🔐 SECURE SIGNING - Your keys never leave your wallet',
            '',
            'To complete this trade:',
            '1. Copy the transaction string below',
            '2. Go to bags.fm/sign or use Phantom/Solflare',
            '3. Paste and sign the transaction',
            '4. Submit to complete the trade',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      case 'bags_sell': {
        const input = SellInputSchema.parse(args);

        if (!input.amount && !input.percentage) {
          return formatError('Must specify either amount or percentage to sell');
        }

        const result = await bagsClient.sell(
          input.token,
          input.amount || 0,
          input.slippage,
          input.wallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare trade');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          trade: {
            type: 'SELL',
            token: input.token,
            amountTokens: input.amount,
            expectedOutput: tx?.amountOut,
            priceImpact: tx?.priceImpact,
            fee: tx?.fee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🔐 SECURE SIGNING - Your keys never leave your wallet',
            '',
            'To complete this trade:',
            '1. Copy the transaction string below',
            '2. Go to bags.fm/sign or use Phantom/Solflare',
            '3. Paste and sign the transaction',
            '4. Submit to complete the trade',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
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

      // ==================== NEW: MARKET INTELLIGENCE ====================

      case 'bags_price_history': {
        const input = PriceHistoryInputSchema.parse(args);
        const result = await bagsClient.getPriceHistory(input.token, input.period);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch price history');
        }

        return formatSuccess({
          token: input.token,
          period: input.period,
          data: result.response,
        });
      }

      case 'bags_new_launches': {
        const input = NewLaunchesInputSchema.parse(args);
        const result = await bagsClient.getNewLaunches(input.hours, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch new launches');
        }

        return formatSuccess({
          timeframe: `Last ${input.hours} hours`,
          tokens: result.response,
        });
      }

      case 'bags_gainers_losers': {
        const input = GainersLosersInputSchema.parse(args);
        const result = await bagsClient.getGainersLosers(input.type, input.period, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch movers');
        }

        return formatSuccess({
          period: input.period,
          type: input.type,
          data: result.response,
        });
      }

      case 'bags_holder_analysis': {
        const input = HolderAnalysisInputSchema.parse(args);
        const result = await bagsClient.getHolderAnalysis(input.token);

        if (!result.success) {
          return formatError(result.error || 'Failed to analyze holders');
        }

        return formatSuccess({
          token: input.token,
          analysis: result.response,
        });
      }

      // ==================== NEW: TRADING ENHANCEMENTS ====================

      case 'bags_swap': {
        const input = SwapInputSchema.parse(args);
        const result = await bagsClient.prepareSwap(
          input.fromToken,
          input.toToken,
          input.amount,
          input.slippage,
          input.wallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare swap');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          swap: {
            from: input.fromToken,
            to: input.toToken,
            inputAmount: tx?.inputAmount,
            outputAmount: tx?.outputAmount,
            priceImpact: tx?.priceImpact,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🔐 SECURE SIGNING - Your keys never leave your wallet',
            '',
            `Swapping ${input.amount} ${input.fromToken} → ${input.toToken}`,
            '1. Copy the transaction string below',
            '2. Sign in Phantom/Solflare/bags.fm',
            '3. Submit to complete the swap',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      case 'bags_limit_order': {
        const input = LimitOrderInputSchema.parse(args);
        const result = await bagsClient.setLimitOrder({
          token: input.token,
          side: input.side,
          price: input.price,
          amount: input.amount,
          expiry: input.expiry,
          wallet: input.wallet,
        });

        if (!result.success) {
          return formatError(result.error || 'Failed to set limit order');
        }

        return formatSuccess({
          status: 'limit_order_set',
          order: result.response,
          message: `${input.side.toUpperCase()} order set for ${input.token} at $${input.price}`,
        });
      }

      case 'bags_gas_estimate': {
        const input = GasEstimateInputSchema.parse(args);
        const result = await bagsClient.estimateGas(input.action, input.token, input.amount);

        if (!result.success) {
          return formatError(result.error || 'Failed to estimate gas');
        }

        return formatSuccess({
          action: input.action,
          estimate: result.response,
        });
      }

      case 'bags_slippage_check': {
        const input = SlippageCheckInputSchema.parse(args);
        const result = await bagsClient.checkSlippage(input.token, input.side, input.amountUsd);

        if (!result.success) {
          return formatError(result.error || 'Failed to check slippage');
        }

        return formatSuccess({
          token: input.token,
          tradeSize: input.amountUsd,
          side: input.side,
          slippageData: result.response,
        });
      }

      // ==================== NEW: PORTFOLIO & ALERTS ====================

      case 'bags_watchlist': {
        const input = WatchlistInputSchema.parse(args);
        const result = await bagsClient.manageWatchlist(input.action, input.token, input.wallet);

        if (!result.success) {
          return formatError(result.error || 'Watchlist operation failed');
        }

        return formatSuccess({
          action: input.action,
          result: result.response,
        });
      }

      case 'bags_price_alert': {
        const input = PriceAlertInputSchema.parse(args);
        const result = await bagsClient.managePriceAlert({
          action: input.action,
          token: input.token,
          targetPrice: input.targetPrice,
          direction: input.direction,
          wallet: input.wallet,
        });

        if (!result.success) {
          return formatError(result.error || 'Alert operation failed');
        }

        return formatSuccess({
          action: input.action,
          result: result.response,
        });
      }

      case 'bags_pnl_report': {
        const input = PnlReportInputSchema.parse(args);
        const result = await bagsClient.getPnlReport(input.wallet, input.period);

        if (!result.success) {
          return formatError(result.error || 'Failed to generate P&L report');
        }

        return formatSuccess({
          wallet: input.wallet,
          period: input.period,
          report: result.response,
        });
      }

      case 'bags_compare': {
        const input = CompareInputSchema.parse(args);
        const result = await bagsClient.compareTokens(input.tokens);

        if (!result.success) {
          return formatError(result.error || 'Failed to compare tokens');
        }

        return formatSuccess({
          comparing: input.tokens,
          comparison: result.response,
        });
      }

      // ==================== NEW: CREATOR TOOLS ====================

      case 'bags_top_creators': {
        const input = TopCreatorsInputSchema.parse(args);
        const result = await bagsClient.getTopCreators(input.metric, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch creators');
        }

        return formatSuccess({
          metric: input.metric,
          leaderboard: result.response,
        });
      }

      case 'bags_launch_token': {
        const input = LaunchTokenInputSchema.parse(args);
        const result = await bagsClient.prepareTokenLaunch({
          name: input.name,
          symbol: input.symbol,
          description: input.description,
          image: input.image,
          twitter: input.twitter,
          telegram: input.telegram,
          website: input.website,
          initialBuySol: input.initialBuySol,
          wallet: input.wallet,
        });

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare token launch');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          token: {
            name: input.name,
            symbol: input.symbol,
            estimatedMint: tx?.estimatedMint,
            metadataUri: tx?.metadataUri,
            launchFee: tx?.launchFee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🚀 TOKEN LAUNCH - Sign to create your token',
            '',
            `Creating: ${input.symbol} (${input.name})`,
            '1. Copy the transaction string below',
            '2. Sign in Phantom/Solflare',
            '3. Submit to launch your token',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      case 'bags_airdrop': {
        const input = AirdropInputSchema.parse(args);
        const result = await bagsClient.prepareAirdrop(
          input.token,
          input.recipients,
          input.senderWallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare airdrop');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          airdrop: {
            token: input.token,
            recipientCount: tx?.recipientCount,
            totalAmount: tx?.totalAmount,
            estimatedFee: tx?.estimatedFee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🎁 AIRDROP - Sign to distribute tokens',
            '',
            `Sending ${input.token} to ${input.recipients.length} recipients`,
            '1. Copy the transaction string below',
            '2. Sign in Phantom/Solflare',
            '3. Submit to execute the airdrop',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
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
