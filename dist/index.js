#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const config_1 = require("./config");
const definitions_new_1 = require("./tools/definitions-new");
const handlers_new_1 = require("./tools/handlers-new");
// Validate configuration on startup
(0, config_1.validateConfig)();
// Create MCP server
const server = new index_js_1.Server({
    name: 'bagsx-mcp',
    version: '2.0.0',
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
        tools: Object.values(definitions_new_1.TOOL_DEFINITIONS),
    };
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    console.error(`[BAGSX] Tool called: ${name}`);
    console.error(`[BAGSX] Arguments: ${JSON.stringify(args)}`);
    const handler = handlers_new_1.toolHandlers[name];
    if (!handler) {
        return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    try {
        const result = await handler(args || {});
        console.error(`[BAGSX] Result: SUCCESS`);
        return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            isError: false,
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[BAGSX] Result: ERROR - ${message}`);
        return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// ==================== RESOURCE HANDLERS ====================
// List available resources
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: 'bags://platform/info',
                name: 'Platform Info',
                description: 'Bags.fm platform information and features',
                mimeType: 'application/json',
            },
        ],
    };
});
// Read resources
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    switch (uri) {
        case 'bags://platform/info': {
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
                            tools: Object.keys(definitions_new_1.TOOL_DEFINITIONS).length,
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
    console.error('[BAGSX] Starting MCP Server v2.0...');
    console.error(`[BAGSX] API Key: ${config_1.CONFIG.BAGS_API_KEY ? 'Configured ✓' : 'Not configured'}`);
    console.error(`[BAGSX] Tools: ${Object.keys(definitions_new_1.TOOL_DEFINITIONS).length} real API endpoints`);
    console.error('[BAGSX] Security: Unsigned transactions (zero custody)');
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('[BAGSX] Server running. Ready to accept connections.');
}
main().catch((error) => {
    console.error('[BAGSX] Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map