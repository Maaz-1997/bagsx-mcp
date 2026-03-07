"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolHandlers = void 0;
const bags_client_new_1 = require("../lib/bags-client-new");
// ==================== TOOL HANDLERS ====================
exports.toolHandlers = {
    // ==================== TRADING ====================
    bags_quote: async (args) => {
        const { inputMint, outputMint, amount, slippageMode, slippageBps } = args;
        const result = await bags_client_new_1.bagsClient.getQuote({
            inputMint,
            outputMint,
            amount,
            slippageMode,
            slippageBps,
        });
        if (!result.success) {
            throw new Error(result.error || 'Failed to get quote');
        }
        return {
            requestId: result.response.requestId,
            inputMint: result.response.inputMint,
            outputMint: result.response.outputMint,
            inAmount: result.response.inAmount,
            outAmount: result.response.outAmount,
            minOutAmount: result.response.minOutAmount,
            priceImpactPct: result.response.priceImpactPct,
            slippageBps: result.response.slippageBps,
            routes: result.response.routePlan.length,
            message: 'Quote retrieved. Use bags_swap with the requestId to execute.',
        };
    },
    bags_swap: async (args) => {
        const { quoteRequestId, wallet } = args;
        const result = await bags_client_new_1.bagsClient.createSwap({ quoteRequestId, wallet });
        if (!result.success) {
            throw new Error(result.error || 'Failed to create swap transaction');
        }
        return {
            transaction: result.response.swapTransaction,
            computeUnitLimit: result.response.computeUnitLimit,
            lastValidBlockHeight: result.response.lastValidBlockHeight,
            prioritizationFeeLamports: result.response.prioritizationFeeLamports,
            message: 'Sign and submit this transaction to complete the swap.',
        };
    },
    // ==================== TOKEN LAUNCH ====================
    bags_launch_prepare: async (args) => {
        const { name, symbol, description, imageUrl, twitter, telegram, website } = args;
        const result = await bags_client_new_1.bagsClient.createTokenInfo({
            name,
            symbol,
            description,
            imageUrl,
            twitter,
            telegram,
            website,
        });
        if (!result.success) {
            throw new Error(result.error || 'Failed to prepare token launch');
        }
        return {
            tokenMint: result.response.tokenMint,
            metadataUri: result.response.tokenMetadata,
            status: result.response.tokenLaunch.status,
            message: 'Token info created. Use bags_launch_execute to complete the launch.',
        };
    },
    bags_launch_execute: async (args) => {
        const { ipfs, tokenMint, wallet, configKey, initialBuyLamports } = args;
        const result = await bags_client_new_1.bagsClient.createLaunchTransaction({
            ipfs,
            tokenMint,
            wallet,
            configKey,
            initialBuyLamports,
        });
        if (!result.success) {
            throw new Error(result.error || 'Failed to create launch transaction');
        }
        return {
            transaction: result.response,
            message: 'Sign and submit this transaction to launch your token.',
        };
    },
    // ==================== ANALYTICS ====================
    bags_creators: async (args) => {
        const { tokenMint } = args;
        const result = await bags_client_new_1.bagsClient.getCreators(tokenMint);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get creators');
        }
        return {
            creators: result.response,
            count: result.response.length,
        };
    },
    bags_lifetime_fees: async (args) => {
        const { tokenMint } = args;
        const result = await bags_client_new_1.bagsClient.getLifetimeFees(tokenMint);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get lifetime fees');
        }
        return {
            tokenMint,
            lifetimeFees: result.response,
        };
    },
    bags_claim_stats: async (args) => {
        const { tokenMint } = args;
        const result = await bags_client_new_1.bagsClient.getClaimStats(tokenMint);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get claim stats');
        }
        return {
            tokenMint,
            stats: result.response,
            totalClaimers: result.response.length,
        };
    },
    bags_claim_events: async (args) => {
        const { tokenMint, mode, limit, offset, from, to } = args;
        const result = await bags_client_new_1.bagsClient.getClaimEvents({
            tokenMint,
            mode,
            limit,
            offset,
            from,
            to,
        });
        if (!result.success) {
            throw new Error(result.error || 'Failed to get claim events');
        }
        return {
            tokenMint,
            events: result.response.events,
            count: result.response.events.length,
        };
    },
    // ==================== FEE CLAIMING ====================
    bags_claimable: async (args) => {
        const { wallet } = args;
        const result = await bags_client_new_1.bagsClient.getClaimablePositions(wallet);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get claimable positions');
        }
        const totalClaimable = result.response.reduce((sum, pos) => sum + pos.claimableDisplayAmount, 0);
        return {
            wallet,
            positions: result.response,
            count: result.response.length,
            totalClaimableSOL: totalClaimable.toFixed(4),
        };
    },
    bags_claim_fees: async (args) => {
        const { tokenMint, wallet } = args;
        const result = await bags_client_new_1.bagsClient.createClaimTransactions({ tokenMint, wallet });
        if (!result.success) {
            throw new Error(result.error || 'Failed to create claim transactions');
        }
        return {
            transactions: result.response.map((tx) => ({
                blockhash: tx.blockhash.blockhash,
                lastValidBlockHeight: tx.blockhash.lastValidBlockHeight,
                transaction: tx.transaction,
            })),
            count: result.response.length,
            message: 'Sign and submit these transactions to claim your fees.',
        };
    },
    // ==================== FEE SHARE CONFIG ====================
    bags_fee_wallet: async (args) => {
        const { provider, username } = args;
        const result = await bags_client_new_1.bagsClient.getFeeShareWallet({ provider, username });
        if (!result.success) {
            throw new Error(result.error || 'Failed to get fee share wallet');
        }
        return {
            provider: result.response.provider,
            username: result.response.platformData.username,
            displayName: result.response.platformData.display_name,
            wallet: result.response.wallet,
        };
    },
    bags_fee_config: async (args) => {
        const { payer, baseMint, claimers, basisPoints } = args;
        if (claimers.length !== basisPoints.length) {
            throw new Error('claimers and basisPoints arrays must have the same length');
        }
        const totalBps = basisPoints.reduce((sum, bp) => sum + bp, 0);
        if (totalBps !== 10000) {
            throw new Error(`Basis points must sum to 10000 (100%), got ${totalBps}`);
        }
        const result = await bags_client_new_1.bagsClient.createFeeConfig({ payer, baseMint, claimers, basisPoints });
        if (!result.success) {
            throw new Error(result.error || 'Failed to create fee config');
        }
        return {
            needsCreation: result.response.needsCreation,
            feeShareAuthority: result.response.feeShareAuthority,
            transactions: result.response.transactions.length,
            message: result.response.needsCreation
                ? 'Sign and submit the transactions to create fee share config.'
                : 'Fee share config already exists for this token.',
        };
    },
    bags_admin_list: async (args) => {
        const { wallet } = args;
        const result = await bags_client_new_1.bagsClient.getAdminList(wallet);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get admin list');
        }
        return {
            wallet,
            tokenMints: result.response.tokenMints,
            count: result.response.tokenMints.length,
        };
    },
    bags_admin_update: async (args) => {
        const { baseMint, payer, claimers, basisPoints } = args;
        if (claimers.length !== basisPoints.length) {
            throw new Error('claimers and basisPoints arrays must have the same length');
        }
        const totalBps = basisPoints.reduce((sum, bp) => sum + bp, 0);
        if (totalBps !== 10000) {
            throw new Error(`Basis points must sum to 10000 (100%), got ${totalBps}`);
        }
        const result = await bags_client_new_1.bagsClient.updateFeeConfig({ baseMint, payer, claimers, basisPoints });
        if (!result.success) {
            throw new Error(result.error || 'Failed to update fee config');
        }
        return {
            baseMint,
            transactions: result.response.transactions.length,
            message: 'Sign and submit the transactions to update fee share config.',
        };
    },
    bags_admin_transfer: async (args) => {
        const { baseMint, currentAdmin, newAdmin, payer } = args;
        const result = await bags_client_new_1.bagsClient.transferAdmin({ baseMint, currentAdmin, newAdmin, payer });
        if (!result.success) {
            throw new Error(result.error || 'Failed to create admin transfer transaction');
        }
        return {
            blockhash: result.response.blockhash.blockhash,
            lastValidBlockHeight: result.response.blockhash.lastValidBlockHeight,
            transaction: result.response.transaction,
            message: 'Sign and submit this transaction to transfer admin rights.',
        };
    },
    // ==================== STATE/POOLS ====================
    bags_pools: async (args) => {
        const { onlyMigrated } = args;
        const result = await bags_client_new_1.bagsClient.getPools(onlyMigrated);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get pools');
        }
        return {
            pools: result.response,
            count: result.response.length,
            filter: onlyMigrated ? 'migrated only' : 'all',
        };
    },
    bags_pool_info: async (args) => {
        const { tokenMint } = args;
        const result = await bags_client_new_1.bagsClient.getPoolByMint(tokenMint);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get pool info');
        }
        return {
            tokenMint: result.response.tokenMint,
            dbcConfigKey: result.response.dbcConfigKey,
            dbcPoolKey: result.response.dbcPoolKey,
            dammV2PoolKey: result.response.dammV2PoolKey,
        };
    },
    // ==================== PARTNER ====================
    bags_partner_stats: async (args) => {
        const { partner } = args;
        const result = await bags_client_new_1.bagsClient.getPartnerStats(partner);
        if (!result.success) {
            throw new Error(result.error || 'Failed to get partner stats');
        }
        return {
            partner,
            claimedFees: result.response.claimedFees,
            unclaimedFees: result.response.unclaimedFees,
        };
    },
    bags_partner_claim: async (args) => {
        const { partnerWallet } = args;
        const result = await bags_client_new_1.bagsClient.createPartnerClaimTransactions(partnerWallet);
        if (!result.success) {
            throw new Error(result.error || 'Failed to create partner claim transactions');
        }
        return {
            transactions: result.response.transactions.map((tx) => ({
                blockhash: tx.blockhash.blockhash,
                lastValidBlockHeight: tx.blockhash.lastValidBlockHeight,
                transaction: tx.transaction,
            })),
            count: result.response.transactions.length,
            message: 'Sign and submit these transactions to claim partner fees.',
        };
    },
};
//# sourceMappingURL=handlers-new.js.map