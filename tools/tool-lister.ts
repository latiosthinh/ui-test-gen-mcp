export const toolListerTool = {
	name: 'list_tools',
	description: 'List all available tools only in this MCP server with simple labels for easy selection',
	handler: async (args: any, extra?: any) => {
		return {
			content: [
				{
					type: "text" as const,
					text: `
						## 🛠️ AVAILABLE TOOLS

						- To generate Playwright UI tests: Use \`Tool 1\` or call \`create_playwright_visual_tests\`
						- To see available tools: Use \`Tool 2\` or call \`list_tools\`
					`
				}
			]
		};
	}
};
