import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { commandListerTool, toolListerTool, visualTestGeneratorTool } from './tools/index.js';
import { registerTool } from './helper/index.js';

const server = new McpServer({
	name: "UI Test Gen MCP Server",
	version: "1.0.0"
});

registerTool({
	server,
	tool: visualTestGeneratorTool
});

registerTool({
	server,
	tool: toolListerTool
});

registerTool({
	server,
	tool: commandListerTool
});

const transport = new StdioServerTransport();
server.connect(transport);