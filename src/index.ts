#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { validateConfig, CONFIG } from './config';
import { TOOL_DEFINITIONS } from './tools/definitions';
import { handleToolCall } from './tools/handlers';
import { bagsClient } from './lib/bags-client';

// Validate configuration on startup
validateConfig();

// Create MCP server
const server = new Server(
  {
    name: 'bagsx-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ==================== TOOL HANDLERS ====================

// List all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.values(TOOL_DEFINITIONS),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.error(`[BAGSX] Tool called: ${name}`);
  console.error(`[BAGSX] Arguments: ${JSON.stringify(args)}`);
  
  const result = await handleToolCall(name, args || {});
  
  console.error(`[BAGSX] Result: ${result.isError ? 'ERROR' : 'SUCCESS'}`);
  
  return result;
});

// ==================== RESOURCE HANDLERS ====================

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
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
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'bags://market/trending': {
      const result = await bagsClient.getTrending('volume', 20);
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
  console.error(`[BAGSX] API Key: ${CONFIG.BAGS_API_KEY ? 'Configured ✓' : 'Not configured'}`);
  console.error('[BAGSX] Security: Unsigned transactions (zero custody)');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('[BAGSX] Server running. Ready to accept connections.');
}

main().catch((error) => {
  console.error('[BAGSX] Fatal error:', error);
  process.exit(1);
});
