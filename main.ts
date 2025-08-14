import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";

const server = new McpServer({
	name: "SnapUI MCP Server",
	version: "1.0.0"
});

// Core test script template - EMBEDDED for universal access
const CORE_TEST_SCRIPT_TEMPLATE = `import test, { expect } from "playwright/test";

test.describe('test_description - Visual testing', () => {
	test('PDP', async ({ page }) => {
		const url = "test_url";

		await page.goto(url);

		for (const selector of [test_hide_selector]) {
			await page.addStyleTag({
				content: \`\${selector} { display: none !important; }\`
			});
		}

		const locator = page.locator("test_selector");
		await locator.scrollIntoViewIfNeeded();
		expect(await locator.screenshot()).toMatchSnapshot('test_description.replaceAll(/\\s/i, '').png');
	});
});`;

// Main tool for generating visual test scripts
server.tool(
	'create_playwright_visual_tests',
	'Automatically generate visual testing scripts from CSV data. This tool is triggered when users ask to generate UI test scripts, create automated tests, or process CSV test data. It analyzes CSV content containing test information and generates comprehensive visual testing scripts.',
	{
		csvData: z.string().describe("CSV file content or data containing test information (file_name, test_url, test_description, test_selector, test_hide, test_action columns)")
	},
	async ({ csvData }) => {
		return {
			content: [
				{
					type: "text",
					text: `
						I'll analyze the provided CSV data and provide comprehensive guidance for generating visual testing scripts.
						
						CSV Data received:
						${csvData}
						
						## 📋 STEP-BY-STEP INSTRUCTIONS:

						### Phase 1: File Creation
						- Step 1: In the CSV data, find the row that contains file_name to name the generated files
						- Step 2: All the generated test files should be created in ./tests/ui folder 
						- Step 3: Follow other rows in CSV data - and remember to exclude the "test_action" column (if any, for example: test_description, test_selector, test_hide, etc.) to generate the test file
						- Step 4: The test file should be named as the file_name in the CSV data
						- Step 5: After generating the empty test files, fill all the files with default content (use the core-test-script template below as a reference)
						- Step 6: Check the CSV data again - check for "test_action" column - if it exists, it means you need to look into the user's project code to find existing code to use for the action
						- Step 7: After finding the code, replace the action in the test file with the found code
						- Step 8: Run the test file to check if the test is working
						** IMPORTANT: Do not overwrite the existing test files **
						
						### Phase 2: File Refactoring (CRITICAL)
						After creating the test files, you MUST refactor them for better readability and maintainability:
						
						#### 2.1 Code Organization
						- Group related tests together in the same describe block
						- Use descriptive test names that clearly indicate what is being tested
						- Organize tests by functionality or page section
						
						#### 2.2 Variable Management
						- Extract common selectors into constants at the top of the file
						- Create reusable helper functions for common operations
						- Use meaningful variable names that reflect their purpose
						
						#### 2.3 Error Handling & Validation
						- Add proper error handling for failed page loads
						- Include validation that elements exist before interacting with them
						- Add timeout configurations for slow-loading elements
						
						#### 2.4 Code Style & Readability
						- Follow the project's existing coding style and conventions
						- Use consistent indentation and formatting
						- Add meaningful comments for complex logic
						- Break down long test functions into smaller, focused functions
						
						#### 2.5 Performance Optimization
						- Minimize unnecessary page reloads
						- Use efficient selectors (prefer data-testid over complex CSS selectors)
						- Implement proper waiting strategies instead of hard delays
						
						#### 2.6 Maintainability
						- Make selectors robust and less likely to break with UI changes
						- Use page object model patterns if the project follows them
						- Create reusable test utilities for common operations
						
						## 🎯 CRITICAL REQUIREMENTS:
						- The core-test-script template below MUST be strictly followed when generating test files. This template is mandatory and non-negotiable.
						- The test files must be created and must be created in the ./tests/ui folder
						- The test files must be named as the file_name in the CSV data; those test with the same file_name should be in the same test file
						- **AFTER generating the test files, you MUST refactor them to make them more readable and maintainable (should follow the project's coding style)**
						
						## 📝 CORE TEST SCRIPT TEMPLATE (MANDATORY):
						\`\`\`typescript
						${CORE_TEST_SCRIPT_TEMPLATE}
						\`\`\`
						
						## 🔄 TEMPLATE VARIABLES TO REPLACE:
						- \`test_description\` → Replace with the actual test description from CSV
						- \`test_url\` → Replace with the actual URL from CSV  
						- \`test_hide_selector\` → Replace with the actual hide selectors from CSV
						- \`test_selector\` → Replace with the actual element selector from CSV
						
						## ✅ RULES TO FOLLOW:
						1. NEVER deviate from the template structure
						2. ALWAYS use the exact import statements
						3. ALWAYS use the exact test.describe and test structure
						4. ALWAYS use the exact page.goto pattern
						5. ALWAYS use the exact hide selector loop pattern
						6. ALWAYS use the exact locator and screenshot pattern
						7. ALWAYS use the exact expect().toMatchSnapshot pattern
						
						## 🚀 NEXT STEPS:
						1. Create the test files following the template
						2. Replace template variables with CSV data
						3. **REFACTOR the generated files for better code quality**
						4. Test the files to ensure they work correctly
					`
				}
			]
		};
	}
);

const transport = new StdioServerTransport();
server.connect(transport);