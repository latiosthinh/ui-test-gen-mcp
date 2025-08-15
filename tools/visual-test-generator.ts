import { z } from "zod";

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

export const visualTestGeneratorTool = {
	name: 'create_playwright_visual_tests',
	description: 'Automatically generate visual testing scripts from CSV data with advanced configuration management. This tool is triggered when users ask to generate UI test scripts, create automated tests, or process CSV test data. It analyzes CSV content containing test information, validates playwright configuration, creates utility files, and generates comprehensive visual testing scripts with proper project code style integration.',
	schema: z.object({
		csvData: z.string().describe("CSV file content or data containing test information (file_name, test_url, test_description, test_selector, test_hide, test_action columns)")
	}),
	handler: async ({ csvData }: { csvData: string }, extra?: any) => {
		return {
			content: [
				{
					type: "text" as const,
					text: `
						I'll analyze the provided CSV data and provide comprehensive guidance for generating visual testing scripts.
						
						CSV Data received:
						${csvData}
						
						## 📋 STEP-BY-STEP INSTRUCTIONS:

						### Phase 1: Configuration Validation
						- Step 1: **CRITICAL** - Look through the project and find playwright.config.ts files
						- Step 2: **CRITICAL** - Check if snapshotDir is set to "./screenshots" in the expect configuration
						- Step 3: If snapshotDir is missing or incorrect, edit the playwright.config.ts to add:
						  \`\`\`typescript
						  expect: {
						    timeout: 30000,
						    toMatchSnapshot: {
						      snapshotDir: "./screenshots"
						    }
						  }
						  \`\`\`
						- Step 4: **ONLY check for snapshotDir, do NOT modify anything else** in the config files
						
						### Phase 2: File Creation
						- Step 5: In the CSV data, find the row that contains file_name to name the generated files
						- Step 6: All the generated test files should be created in ./tests/ui folder 
						- Step 7: Follow other rows in CSV data - and remember to exclude the "test_action" column (if any, for example: test_description, test_selector, test_hide, etc.) to generate the test file
						- Step 8: The test file should be named as the file_name in the CSV data
						- Step 9: After generating the empty test files, fill all the files with default content (use the core-test-script template below as a reference)
						
						### Phase 3: Utils File Creation
						- Step 10: **CRITICAL** - Create ./utils/ui/ folder structure if it doesn't exist
						- Step 11: **CRITICAL** - Utilities and helper functions will be organized into separate grouped files, NOT in one ui-test-utils.ts
						- Step 12: The utils folder structure should contain:
						  - ./utils/ui/selectors.ts - For reusable selectors and constants
						  - ./utils/ui/helpers.ts - For common helper functions (click, fill, wait, etc.)
						  - ./utils/ui/test-actions.ts - For generated test_action functions from CSV data
						  - ./utils/ui/page-objects.ts - For page object model patterns if applicable
						  - ./utils/ui/validation.ts - For validation and error handling utilities
						- Step 13: **IMPORTANT**: Utility generation happens AFTER test script generation, during the refactoring phase
						
						### Phase 3.1: Data & Page Object Organization
						- Step 14: **CRITICAL** - Create ./data/ui/ folder for test data organization
						- Step 15: **CRITICAL** - Create ./pages/ui/ folder for locators and generated classes that serve test functions
						- Step 16: **CRITICAL** - Data files and page object classes should NOT be included in .spec.ts files
						- Step 17: The folder structure should contain:
						  - ./data/ui/ - For test data, constants, and configuration
						  - ./pages/ui/ - For page object classes, locators, and element interactions
						  - ./utils/ui/ - For utility functions and helpers (as defined above)
						
						### Phase 4: Test Action Analysis & Generation
						- Step 18: **CRITICAL** - Check the CSV data for "test_action" column - if it exists, you MUST:
						  - **GENERATE PROPER TEST ACTIONS**: Create test_action functions that follow correct Playwright patterns
						  - Analyze the user's project code to understand the existing coding style and patterns
						  - Generate test functions that match the project's architecture and conventions
						  - Ensure the generated code follows proper Playwright testing best practices
						  - The system will automatically use the appropriate tools to generate correct test action code
						- Step 19: **CRITICAL** - Each component in the CSV has its own test_hide selectors list, so be EXTREMELY careful when refactoring:
						  - Do NOT combine or merge test_hide selectors between different components
						  - Each component should maintain its specific hide selectors
						  - The hide selectors are component-specific and should not be shared
						- Step 20: After finding the code, replace the action in the test file with the found code
						- Step 21: Run the test file to check if the test is working
						** IMPORTANT: Do not overwrite the existing test files **
						
						### Phase 5: File Refactoring (CRITICAL)
						After creating the test files, refactor them for clean, readable code:
						
						#### 5.1 Simple Code Organization
						- Group related tests together in the same describe block
						- Use descriptive test names that clearly indicate what is being tested
						
						#### 5.2 Basic Utility Extraction
						- Extract common selectors into constants at the top of the file
						- Move reusable functions to appropriate files in ./utils/ui/ folder:
						  - Common selectors → ./utils/ui/selectors.ts
						  - Helper functions → ./utils/ui/helpers.ts
						  - Test actions → ./utils/ui/test-actions.ts
						- Use meaningful variable names
						
						#### 5.3 Code Style & Readability
						- Follow the project's existing coding style and conventions
						- Use consistent indentation and formatting
						- Add simple comments for complex logic
						
						#### 5.4 Simple Maintainability
						- Make selectors robust and less likely to break with UI changes
						- Import utilities from appropriate grouped files in test files
						
						## 🎯 CRITICAL REQUIREMENTS:
						- **REQUIREMENT 1**: The core-test-script template below MUST be strictly followed when generating test files. This template is mandatory and non-negotiable.
						- **REQUIREMENT 2**: The test files must be created and must be created in the ./tests/ui folder
						- **REQUIREMENT 3**: The test files must be named as the file_name in the CSV data; those test with the same file_name should be in the same test file
						- **REQUIREMENT 4**: **AFTER generating the test files, you MUST refactor them for clean, readable code (follow the project's coding style)**
						- **REQUIREMENT 5**: **MUST check and edit playwright.config.ts to ensure snapshotDir is "./screenshots"**
						- **REQUIREMENT 6**: **MUST create organized folder structure: ./utils/ui/ (utilities), ./data/ui/ (test data), ./pages/ui/ (page objects & locators)**
						- **REQUIREMENT 7**: **MUST be extremely careful with test_hide selectors - each component has its own list**
						- **REQUIREMENT 8**: **MUST generate proper test_action functions following Playwright best practices and project coding style**
						- **REQUIREMENT 9**: **MUST keep data files and page object classes separate from .spec.ts files**
						
						## 📝 CORE TEST SCRIPT TEMPLATE (MANDATORY):
						\`\`\`typescript
						${CORE_TEST_SCRIPT_TEMPLATE}
						\`\`\`
						
						## 🔄 TEMPLATE VARIABLES TO REPLACE:
						- \`test_description\` → Replace with the actual test description from CSV
						- \`test_url\` → Replace with the actual URL from CSV  
						- \`test_hide_selector\` → Replace with the actual hide selectors from CSV (component-specific)
						- \`test_selector\` → Replace with the actual element selector from CSV
						
						## ✅ RULES TO FOLLOW:
						1. NEVER deviate from the template structure
						2. ALWAYS use the exact import statements
						3. ALWAYS use the exact test.describe and test structure
						4. ALWAYS use the exact page.goto pattern
						5. ALWAYS use the exact hide selector loop pattern
						6. ALWAYS use the exact locator and screenshot pattern
						7. ALWAYS use the exact expect().toMatchSnapshot pattern
						8. **ALWAYS check playwright.config.ts for snapshotDir="./screenshots"**
						9. **ALWAYS create organized folder structure: utils/ui/, data/ui/, pages/ui/**
						10. **ALWAYS preserve component-specific test_hide selectors**
						11. **ALWAYS generate proper test_action functions following Playwright best practices**
						12. **ALWAYS keep data files and page object classes separate from .spec.ts files**
						
						## 🚀 NEXT STEPS:
						1. **Check and edit playwright.config.ts for snapshotDir**
						2. **Create organized folder structure: utils/ui/, data/ui/, pages/ui/**
						3. Create the test files following the template
						4. Replace template variables with CSV data
						5. **REFACTOR the generated files for clean, readable code**
						6. **During refactoring, extract utilities to appropriate grouped files in utils/ui/**
						7. **Generate proper test_action functions following Playwright best practices**
						8. **Create data files in data/ui/ and page object classes in pages/ui/**
						9. Test the files to ensure they work correctly
					`
				}
			]
		};
	}
};
