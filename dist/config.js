"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
exports.validateConfig = validateConfig;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.CONFIG = {
    // Bags API Configuration
    BAGS_API_KEY: process.env.BAGS_API_KEY || '',
    BAGS_API_BASE_URL: 'https://public-api-v2.bags.fm/api/v1',
    // Solana Configuration
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY || '',
    // Rate limiting
    MAX_REQUESTS_PER_HOUR: 1000,
    // Defaults
    DEFAULT_SLIPPAGE: 1, // 1%
    DEFAULT_LIMIT: 10,
};
function validateConfig() {
    if (!exports.CONFIG.BAGS_API_KEY) {
        console.warn('Warning: BAGS_API_KEY not set. Some features will be limited.');
    }
}
//# sourceMappingURL=config.js.map