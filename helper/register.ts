import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";

export interface ITool {
	name: string;
	description: string;
	schema?: z.ZodObject<any>;
	handler: (args: any, extra?: any) => Promise<any>;
}

export const registerTool = ({
	server,
	tool
}: {
	server: McpServer;
	tool: ITool;
}) => {
	// Convert Zod schema to JSON schema for MCP
	const jsonSchema = tool.schema ? tool.schema.shape : {};

	// Use the correct MCP tool registration format
	server.tool(
		tool.name,
		tool.description,
		jsonSchema,
		async (args, extra) => tool.handler(args, extra)
	);
};

export default registerTool;