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
	server.tool(
		tool.name,
		tool.description,
		tool.schema?.shape ?? {},
		async (args, extra) => tool.handler(args, extra)
	);
};

export default registerTool;