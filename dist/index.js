#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const config_1 = require("./config");
const definitions_1 = require("./tools/definitions");
const handlers_1 = require("./tools/handlers");
const bags_client_1 = require("./lib/bags-client");
// Validate configuration on startup
(0, config_1.validateConfig)();
// Create MCP server
const server = new index_js_1.Server({
    name: 'bagsx-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// ==================== TOOL HANDLERS ====================
// List all available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: Object.values(definitions_1.TOOL_DEFINITIONS),
    };
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    console.error(`[BAGSX] Tool called: ${name}`);
    console.error(`[BAGSX] Arguments: ${JSON.stringify(args)}`);
    const result = await (0, handlers_1.handleToolCall)(name, args || {});
    console.error(`[BAGSX] Result: ${result.isError ? 'ERROR' : 'SUCCESS'}`);
    return result;
});
// ==================== RESOURCE HANDLERS ====================
// List available resources
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'bags://market/trending',
                name: 'Trending Tokens',
                description: 'Live trending tokens on Bags.fm',
                mimeType: 'application/json',
            },
            {
                uri: 'bags://market/stats',
                name: 'Market Statistics',
                description: 'Overall Bags.fm market statistics',
                mimeType: 'application/json',
            },
        ],
    };
});
// Read resources
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    switch (uri) {
        case 'bags://market/trending': {
            const result = await bags_client_1.bagsClient.getTrending('volume', 20);
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify(result.response || [], null, 2),
                    },
                ],
            };
        }
        case 'bags://market/stats': {
            // Return platform stats
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify({
                            platform: 'Bags.fm',
                            description: 'Creator token launchpad on Solana',
                            features: ['Token Launch', 'Trading', 'Fee Sharing', 'Creator Royalties'],
                            apiDocs: 'https://docs.bags.fm',
                        }, null, 2),
                    },
                ],
            };
        }
        default:
            throw new Error(`Unknown resource: ${uri}`);
    }
});
// ==================== SERVER STARTUP ====================
async function main() {
    console.error('[BAGSX] Starting MCP Server...');
    console.error(`[BAGSX] API Key: ${config_1.CONFIG.BAGS_API_KEY ? 'Configured ✓' : 'Not configured'}`);
    console.error(`[BAGSX] Wallet: ${config_1.CONFIG.SOLANA_PRIVATE_KEY ? 'Configured ✓' : 'Read-only mode'}`);
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('[BAGSX] Server running. Ready to accept connections.');
}
main().catch((error) => {
    console.error('[BAGSX] Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map