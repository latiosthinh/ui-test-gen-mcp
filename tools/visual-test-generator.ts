import { z } from "zod";
import { ACTION_TEMPLATE, CORE_TEST_TEMPLATE_FOOTER, CORE_TEST_TEMPLATE_HEADER, HIDE_SELECTOR_TEMPLATE, MODULE_IMPORT_TEMPLATE, ENV_CONFIG_TEMPLATE, SINGLE_TEST_WITH_ENV_TEMPLATE, TEST_TAGS_IMPORT } from "../helper/template.js";

export const visualTestGeneratorTool = {
	name: 'create_playwright_visual_tests',
	description: 'Automatically generate visual testing scripts from CSV data with advanced configuration management. This tool is triggered when users ask to generate UI test scripts, create automated tests, or process CSV data. It analyzes CSV content containing test information, validates playwright configuration, creates utility files, and generates comprehensive visual testing scripts with proper project code style integration.',
	schema: z.object({
		csvData: z.string().describe("CSV file content or data containing test information (file_name, test_url, test_description, test_selector, test_hide, test_action, test_env columns)")
	}),
	handler: async (args: any, extra?: any) => {
		// Extract csvData from arguments
		const { csvData } = args;

		if (!csvData) {
			throw new Error('csvData parameter is required');
		}

		// Parse CSV data to determine which templates to include
		const csvLines = csvData.trim().split('\n');
		const headers = csvLines[0]?.split(',').map((h: string) => h.trim()) || [];

		// Check if test_hide and test_action columns exist and have values
		const hasHideSelectors = csvLines.slice(1).some((line: string) => {
			const values = line.split(',').map((v: string) => v.trim());
			const hideIndex = headers.indexOf('test_hide');
			return hideIndex >= 0 && values[hideIndex] && values[hideIndex] !== '';
		});

		const hasTestActions = csvLines.slice(1).some((line: string) => {
			const values = line.split(',').map((v: string) => v.trim());
			const actionIndex = headers.indexOf('test_action');
			return actionIndex >= 0 && values[actionIndex] && values[actionIndex] !== '';
		});

		// Check if test_env column exists
		const hasTestEnv = headers.includes('test_env');

		// Build conditional template
		let conditionalTemplate = '';

		if (hasHideSelectors) {
			conditionalTemplate += HIDE_SELECTOR_TEMPLATE;
		}

		if (hasTestActions) {
			conditionalTemplate += ACTION_TEMPLATE;
		}

		// Generate environment config from CSV data
		let envConfigCode = '';
		if (hasTestEnv) {
			const envIndex = headers.indexOf('test_env');
			const urlIndex = headers.indexOf('test_url');

			// Get unique environments and their URLs from CSV
			const envData = new Map();
			csvLines.slice(1).forEach((line: string) => {
				const values = line.split(',').map((v: string) => v.trim());
				const env = values[envIndex];
				const url = values[urlIndex];

				if (env && url && !envData.has(env)) {
					envData.set(env, url);
				}
			});

			// Generate environment config code
			envConfigCode = 'const ENV_CONFIG = {\n';
			envData.forEach((url: string, env: string) => {
				envConfigCode += `\t"${env}": {\n`;
				envConfigCode += `\t\tbaseUrl: "${url}"\n`;
				envConfigCode += `\t},\n`;
			});
			envConfigCode += '};';
		}

		// Build single test file template
		let envTemplate = '';
		if (hasTestEnv) {
			console.log('DEBUG: Generating environment template');
			// Replace the placeholder in ENV_CONFIG_TEMPLATE with actual generated config
			const envConfigWithData = ENV_CONFIG_TEMPLATE.replace('// This will be populated with actual environments from CSV data', envConfigCode);

			// Replace test_tags with the appropriate tag based on selector
			let tagReplacedTemplate = SINGLE_TEST_WITH_ENV_TEMPLATE;

			// Get the first row to determine the default values for template variables
			const firstRow = csvLines.slice(1).find((line: string) => line.trim() !== '');
			if (firstRow) {
				const values = firstRow.split(',').map((v: string) => v.trim());
				const descriptionIndex = headers.indexOf('test_description');
				const selectorIndex = headers.indexOf('test_selector');
				const hideIndex = headers.indexOf('test_hide');
				const actionIndex = headers.indexOf('test_action');

				const description = values[descriptionIndex] || 'test_description';
				const selector = values[selectorIndex] || 'test_selector';
				const hideSelectors = values[hideIndex] || 'test_hide_selector';
				const actionCode = values[actionIndex] || 'test_action_code';

				console.log('DEBUG: Template variables:', { description, selector, hideSelectors, actionCode });

				// Replace template variables with actual values
				tagReplacedTemplate = tagReplacedTemplate
					.replace(/test_description/g, description)
					.replace(/test_selector/g, selector)
					.replace(/test_hide_selector/g, hideSelectors)
					.replace(/test_action_code/g, actionCode);

				// Replace test_tags with appropriate tag based on selector
				if (selector === 'body') {
					tagReplacedTemplate = tagReplacedTemplate.replace('test_tags', 'fullPageTags');
				} else {
					tagReplacedTemplate = tagReplacedTemplate.replace('test_tags', 'sectionTags');
				}
			}

			envTemplate = TEST_TAGS_IMPORT + envConfigWithData + tagReplacedTemplate;
			console.log('DEBUG: envTemplate length:', envTemplate.length);
			console.log('DEBUG: envTemplate preview:', envTemplate.substring(0, 200));
		}

		console.log('DEBUG: hasTestEnv:', hasTestEnv);
		console.log('DEBUG: envTemplate length:', envTemplate.length);

		return {
			content: [
				{
					type: "text" as const,
					text: `
						I'll analyze the provided CSV data and provide comprehensive guidance for generating visual testing scripts in a single test file, using external test data files and proper Playwright test tag syntax.
						
						CSV Data received:
						${csvData}
						
						## 📋 STEP-BY-STEP INSTRUCTIONS:

						### Phase 1: Configuration Validation
						- Step 1: **CRITICAL** - Look through the project and find playwright.config.ts files
						- Step 2: **CRITICAL** - Check if snapshotPathTemplate is set to "'./__screenshots__{/testFileName}{/projectName}{/arg}{ext}" in the configuration (equal level to testDir)
						- Step 3: If snapshotPathTemplate is missing or incorrect, edit the playwright.config.ts to add:
						  \`\`\`typescript
							snapshotPathTemplate: "'./__screenshots__{/testFileName}{/projectName}{/arg}{ext}"
						  \`\`\`
						- Step 4: **ONLY check for snapshotPathTemplate, do NOT modify anything else** in the config files
						
						### Phase 2: Single Test File
						- Step 5: **NEW REQUIREMENT** - Create ONE test file per file_name, NOT separate files per environment
						- Step 6: **NEW REQUIREMENT** - Screenshots will be saved to appropriate environment folders based on currentEnv
						
						### Phase 3: File Creation
						- Step 7: In the CSV data, find the row that contains file_name to name the generated files
						- Step 9: All the generated test files should be created in ./tests/ui folder (NOT in environment subfolders)
						- Step 9: Follow other rows in CSV data to generate the test file
						- Step 10: The test file should be named as the file_name in the CSV data
						- Step 11: After generating the empty test files, fill all the files with content
						
						### Phase 4: Utils File Creation
						- Step 12: **CRITICAL** - Create ./utils/ui/ folder structure if it doesn't exist
						- Step 13: **CRITICAL** - Utilities and helper functions will be organized into separate grouped files, NOT in one ui-test-utils.ts
						- Step 14: The utils folder structure should contain:
						  - ./utils/ui/selectors.ts - For reusable selectors and constants
						  - ./utils/ui/helpers.ts - For common helper functions (click, fill, wait, etc.) and For test tag management
						  - ./utils/ui/test-actions.ts - For generated test_action functions from CSV data
						  - ./utils/ui/page-objects.ts - For page object model patterns if applicable
						  - ./utils/ui/env-config.ts - **NEW** For flexible environment configuration
						- Step 15: **IMPORTANT**: Utility generation happens AFTER test script generation, during the refactoring phase
						
						### Phase 4.1: Data & Page Object Organization
						- Step 16: **CRITICAL** - Create ./data/ui/ folder for test data organization
						- Step 17: **CRITICAL** - Create ./pages/ui/ folder for locators and generated classes that serve test functions
						- Step 18: **CRITICAL** - Data files and page object classes should NOT be included in .spec.ts files
						- Step 19: The folder structure should contain:
						  - ./data/ui/ - For test data, constants, and configuration
						  - ./pages/ui/ - For page object classes, locators, and element interactions
						  - ./utils/ui/ - For utility functions and helpers (as defined above)
						
						### Phase 5: Generation
						- Step 20: **CRITICAL** - Each component in the CSV has its own test_hide selectors list, so be EXTREMELY careful when refactoring:
						  - Do NOT combine or merge test_hide selectors between different components
						  - Each component should maintain its specific hide selectors
						  - The hide selectors are component-specific and should not be shared
						- Step 21: **NEW REQUIREMENT** - Apply test tags using proper Playwright syntax:
						  - All visual tests get tags: ['@visual-regression', '@screenshot']
						  - Selector "body" gets additional tag: '@visual-fullpage'
						  - Other selectors get additional tag: '@visual-section'
						  - Use proper syntax: test('Test Name', { tag: test_tags }, async ({ page }) => {})
						- Step 22: **NEW REQUIREMENT** - Tags are pre-calculated constants, do NOT use any functions to generate tags
						- Step 23: **NEW REQUIREMENT** - Environment config should be dynamically generated from CSV data, NOT hardcoded
						- Step 24: After finding the code, replace the action in the test file with the found code
						- Step 25: Run the test file to check if the test is working
						** IMPORTANT: Do not overwrite the existing test files **
						
						### Phase 6: File Refactoring (CRITICAL)
						After creating the test files, refactor them for clean, readable code:
						
						#### 6.1 Single Test File
						- **NEW REQUIREMENT**: Create ONE test file per file_name, NOT separate files per environment
						- **NEW REQUIREMENT**: Users can change currentEnv variable to switch environments
						- **NEW REQUIREMENT**: Screenshots automatically save to correct environment folder
						- **NEW REQUIREMENT**: All the steps of gettingTestData, gotoDataUrl, hideElements should be contained in test.beforeEach hook
						- **NEW REQUIREMENT**: All the steps of getting locator, scroll to locator, take screenshot should be contained in test.afterEach hook
						- **NEW REQUIREMENT**: Simplify the test block so the test blocks is only different from each other by the test_description, and the test_action_code (because the test_action_code should be manually written/modified by the user)
						- **NEW REQUIREMENT**: Test blocks should be extremely short, containing only the test description and test action code
						
						#### 6.2 Test Tags Implementation with Proper Playwright Syntax
						- **NEW REQUIREMENT**: Tags are pre-calculated constants, do NOT use any functions to generate tags
						- **NEW REQUIREMENT**: Do NOT duplicate tag constants in test files
						- **NEW REQUIREMENT**: Use proper Playwright test tag syntax:
						  \`\`\`typescript
						  test('Test Name', {
						    tag: test_tags
						  }, async ({ page }) => {
						    // test code here
						  });
						  \`\`\`
						- **NEW REQUIREMENT**: Tag selector "body" as "@visual-fullpage"
						- **NEW REQUIREMENT**: Tag other selectors as "@visual-section"
						
						#### 6.3 Environment Configuration from CSV Data
						- **NEW REQUIREMENT**: Environment config should be dynamically generated from CSV data
						- **NEW REQUIREMENT**: Do NOT hardcode environment configurations
						- **NEW REQUIREMENT**: Extract unique environments and URLs from CSV data and generate ENV_CONFIG object dynamically
						
						#### 6.4 Screenshot Path Structure
						- **NEW REQUIREMENT**: Screenshots should be saved as:
						  \`\`\`typescript
						  // Use: __screenshots__/pdp/PdpFullPage.png
							expect(await locator.screenshot()).toMatchSnapshot(\[\${currentEnv}, \`\${screenShotName}.png\`\]);
						  \`\`\`
						- **NEW REQUIREMENT**: Screenshot paths should be: \`\${currentEnv}/\${screenShotName}.png\`
						
						#### 6.5 External Test Data Files
						- **NEW REQUIREMENT**: Create test data files in ./data/ui/ folder
						- **NEW REQUIREMENT**: Do NOT duplicate test data in test files
						- **NEW REQUIREMENT**: Import test data from external files and test files should reference external data, not contain hardcoded values
						
						#### 6.6 Environment Switching in Single File
						- **NEW REQUIREMENT**: Test file should include:
						  \`\`\`typescript
						  // Function to get current environment - USER SHOULD IMPLEMENT THIS
						  let currentEnv = "test_env"; // Default environment from CSV
						  function getCurrentEnv(): string {
						    // TODO: User should implement this function based on their environment configuration
						    // This could read from environment variables, config files, or other sources
						    return currentEnv;
						  }
						  \`\`\`
						
						#### 6.7 Simple Code Organization
						- Group related tests together in the same describe block
						- Use descriptive test names that clearly indicate what is being tested
						
						#### 6.8 Basic Utility Extraction
						- Extract common selectors into constants at the top of the file
						- Move reusable functions to appropriate files in ./utils/ui/ folder:
						  - Common selectors → ./utils/ui/selectors.ts
						  - Helper functions + Test tags → ./utils/ui/helpers.ts
						  - Test actions → ./utils/ui/test-actions.ts
						  - Environment config → ./utils/ui/env-config.ts
						- Use meaningful variable names
						
						#### 6.9 Code Style & Readability
						- Follow the project's existing coding style and conventions
						- Use consistent indentation and formatting
						- Add simple comments for complex logic
						
						#### 6.10 Simple Maintainability
						- Make selectors robust and less likely to break with UI changes
						- Import utilities from appropriate grouped files in test files
						
						## 🎯 CRITICAL REQUIREMENTS:
						- **REQUIREMENT 1**: The core-test-script template below MUST be strictly followed when generating test files. This template is mandatory and non-negotiable.
						- **REQUIREMENT 2**: The test files must be created in ./tests/ui folder (NOT in environment subfolders)
						- **REQUIREMENT 3**: The test files must be named as the file_name in the CSV data; those test with the same file_name should be in the same test file
						- **REQUIREMENT 4**: **AFTER generating the test files, you MUST refactor them for clean, readable code (follow the project's coding style)**
						- **REQUIREMENT 5**: **MUST check and edit playwright.config.ts to ensure snapshotPathTemplate is "'./__screenshots__{/testFileName}{/projectName}{/arg}{ext}"**
						- **REQUIREMENT 6**: **MUST create organized folder structure: ./utils/ui/ (utilities), ./data/ui/ (test data), ./pages/ui/ (page objects & locators)**
						- **REQUIREMENT 7**: **MUST be extremely careful with test_hide selectors - each component has its own list**
						- **REQUIREMENT 8**: **MUST keep data files and page object classes separate from .spec.ts files**
						- **REQUIREMENT 9**: **NEW - MUST create ONE test file per file_name**
						- **REQUIREMENT 10**: **NEW - MUST support ANY environment name (not just prep/int)**
						- **REQUIREMENT 11**: **NEW - MUST implement test tags using proper Playwright syntax: test('Name', { tag: test_tags }, async ({ page }) => {})**
						- **REQUIREMENT 12**: **NEW - MUST fix screenshot paths to use simple structure: /__screenshots__{/testFileName}{/projectName}{/arg}{ext} (at root level)**
						- **REQUIREMENT 13**: **NEW - Tags are pre-calculated constants, do NOT use getTestTags function and do NOT duplicate tag constants in test files**
						- **REQUIREMENT 14**: **NEW - MUST create external test data files, do NOT duplicate data in test files**
						- **REQUIREMENT 15**: **NEW - MUST generate environment config dynamically from CSV data, NOT hardcode it**
						- **REQUIREMENT 16**: **NEW - MUST implement test.beforeEach and test.afterEach hooks to make test blocks extremely short**
						- **REQUIREMENT 17**: **NEW - Test blocks should contain only test description and test action code, all setup/teardown in hooks**
						
						## 📝 CORE TEST SCRIPT TEMPLATE (MANDATORY):
						
						${hasTestEnv ? '**SINGLE TEST FILE (when test_env column is present):**' : '**STANDARD TEMPLATE:**'}
						
						${hasTestEnv ? envTemplate : `
						\`\`\`typescript
						${MODULE_IMPORT_TEMPLATE}
						${CORE_TEST_TEMPLATE_HEADER}
						${conditionalTemplate}
						${CORE_TEST_TEMPLATE_FOOTER}
						\`\`\`
						`}
						
						## 🔄 TEMPLATE VARIABLES TO REPLACE:
						- \`test_description\` → Replace with the actual test description from CSV
						- \`test_url\` → Replace with the actual URL from CSV  
						- \`test_hide_selector\` → Replace with the actual hide selectors from CSV (component-specific)
						- \`test_selector\` → Replace with the actual element selector from CSV
						- \`test_env\` → Replace with the actual environment from CSV (can be any valid name: prep, int, qa, prod, staging, etc.)
						- \`test_action_code\` → Replace with the actual test action code from CSV
						- \`test_tags\` → Replace with the appropriate tag (fullPageTags for "body" selector, sectionTags for others)
						
						## ✅ RULES TO FOLLOW:
						1. NEVER deviate from the template structure
						2. ALWAYS use the exact import statements
						3. ALWAYS use the exact test.describe and test structure
						4. ALWAYS use the exact page.goto pattern
						5. ALWAYS use the exact hide selector loop pattern
						6. ALWAYS use the exact locator and screenshot pattern
						7. ALWAYS use the exact expect().toMatchSnapshot pattern
						8. **ALWAYS check playwright.config.ts for snapshotPathTemplate="'./__screenshots__{/testFileName}{/projectName}{/arg}{ext}"**
						9. **ALWAYS create organized folder structure: utils/ui/, data/ui/, pages/ui/**
						10. **ALWAYS preserve component-specific test_hide selectors**
						11. **ALWAYS keep data files and page object classes separate from .spec.ts files**
						12. **NEW - ALWAYS create ONE test file per file_name**
						13. **NEW - ALWAYS support any environment name (not just prep/int)**
						14. **NEW - ALWAYS implement test tags using proper Playwright syntax: test('Name', { tag: test_tags }, async ({ page }) => {})**
						15. **NEW - ALWAYS use simple screenshot path structure: __screenshots__/{currentEnv}/{screenShotName}.png (at root level)**
						16. **NEW - ALWAYS use pre-calculated tag constants, do NOT duplicate tag constants in test files**
						17. **NEW - ALWAYS create external test data files, do NOT duplicate data in test files**
						18. **NEW - ALWAYS generate environment config dynamically from CSV data, NOT hardcode it**
						19. **NEW - ALWAYS implement test.beforeEach and test.afterEach hooks to make test blocks extremely short**
						20. **NEW - ALWAYS keep test blocks minimal - only description and action code**
						
						## 🚀 NEXT STEPS:
						1. **Check and edit playwright.config.ts for snapshotPathTemplate="'./__screenshots__{/testFileName}{/projectName}{/arg}{ext}"**
						2. **Create organized folder structure: utils/ui/, data/ui/, pages/ui/**
						3. **NEW - Create ONE test file per file_name**
						4. **NEW - Support any environment name dynamically**
						5. Create the test files following the appropriate template (standard or single file)
						6. **NEW - Implement test tags using proper Playwright syntax: test('Name', { tag: test_tags }, async ({ page }) => {})**
						7. **NEW - Fix screenshot paths to use simple structure: __screenshots__/{currentEnv}/{screenShotName}.png (at root level)**
						8. **NEW - Implement test.beforeEach and test.afterEach hooks to make test blocks extremely short**
						9. **NEW - Use pre-calculated tag constants**
						10. **NEW - Create external test data files**
						11. **NEW - Generate environment config dynamically from CSV data**
						12. Replace template variables with CSV data
						13. **REFACTOR the generated files for clean, readable code**
						14. **During refactoring, extract utilities to appropriate grouped files in utils/ui/**
						15. **Create data files in data/ui/ and page object classes in pages/ui/**
						16. Test the files to ensure they work correctly
						
						## 🔧 Environment Switching Usage:
						
						After generating the test file, users can switch environments by changing the currentEnv variable:
						
						\`\`\`typescript
						// Change the currentEnv variable to switch environments
						currentEnv = "qa";
						
						// Get current environment
						const env = getCurrentEnv();
						\`\`\`
						
						The test will automatically:
						- Use the correct base URL for the selected environment
						- Save screenshots to the correct environment folder
						- Apply environment-specific configurations
						
						## 🎯 Test Block Structure with beforeEach/afterEach Hooks:
						
						**CRITICAL**: The test blocks should be extremely short and clean:
						
						\`\`\`typescript
						test.describe('Visual Testing', () => {
							let currentTestData: any;
							let currentLocator: any;
							
							test.beforeEach(async ({ page }) => {
								// Get test data for current test
								currentTestData = getTestData(testDescription, getCurrentEnv());
								if (!currentTestData) throw new Error('Test data not found');
								
								// Navigate to page
								await page.goto(currentTestData.test_url);
								
								// Hide elements
								const hideSelectors = currentTestData.test_hide.split(',').map(s => s.trim()).filter(s => s);
								await hideElements(page, hideSelectors);
								
								// Execute test action
								await executeTestAction(page, currentTestData.test_action);
							});
							
							test.afterEach(async ({ page }) => {
								// Get locator and scroll to element
								currentLocator = page.locator(currentTestData.test_selector);
								await currentLocator.scrollIntoViewIfNeeded();
								
								// Take screenshot
								const screenShotName = generateScreenshotName(currentTestData.test_description);
								expect(await currentLocator.screenshot()).toMatchSnapshot([getCurrentEnv(), \`\${screenShotName}.png\`]);
							});
							
							// EXTREMELY SHORT test blocks - only description and action code
							test('Test Description 1', { tag: test_tags }, async ({ page }) => {
								// Test block should be empty or contain only custom logic
								// All setup and teardown is handled by beforeEach/afterEach
							});
							
							test('Test Description 2', { tag: test_tags }, async ({ page }) => {
								// Only custom test action code here, if any
							});
						});
						\`\`\`
						
						**RESULT**: Test blocks become extremely short and clean, containing only the test description and any custom test action code!
						
						## 📁 External File Structure:
						
						\`\`\`
						./utils/ui/
						├── env-config.ts         # Environment configuration utilities
						├── selectors.ts          # Common selectors
						└── helpers.ts            # Helper functions
						
						./data/ui/
						├── test-data.ts          # Test data structure and functions
						└── [other data files]    # Additional test data
						
						./tests/ui/
						└── [test files].spec.ts  # Test files that import from utils and data
						
						'./__screenshots__{/testFileName}{/projectName}{/arg}{ext}/        # Screenshots at root level
						├── pdp/
						├── header/
						└── [other test files]/
						\`\`\`
						
						## 🏷️ Test Tags Implementation:
						
						**IMPORTANT**: Use proper Playwright test tag syntax:
						
						\`\`\`typescript
						// CORRECT syntax:
						test('Visual Test', {
							tag: test_tags
						}, async ({ page }) => {
							// test code here
						});
						
						// NOT this syntax:
						// test.use({ tag: test_tags });
						// test('Visual Test', async ({ page }) => {
						//   // test code here
						// });
						\`\`\`
						
						## 📸 Screenshot Path Structure:
						
						**IMPORTANT**: Screenshot paths should be simple and clean:
						
						\`\`\`typescript
						// CORRECT screenshot path:
						expect(await locator.screenshot()).toMatchSnapshot(\[\${currentEnv}, \`\${screenShotName}.png\`\]);
						
						// Results in: __screenshots__{/fileName}{projectName}{/currentEnv}{/screenShotName}.png
						
						// NOT these incorrect paths:
						// __screenshots__/ui/pdp.spec.ts-snapshots/-screenshots-prep-pdp-PdpFullPage-Google-Chrome-win32-Google-Chrome-win32.png
						// __screenshots__/pdp/PdpFullPage-Google-Chrome-win32.png
						\`\`\`
						
						## 🔧 Environment Configuration Generation:
						
						**IMPORTANT**: Environment config should be generated dynamically from CSV data:
						
						\`\`\`typescript
						// Generated from CSV data, NOT hardcoded:
						const ENV_CONFIG = {
							"prep": {
								baseUrl: "https://epi-preprod.northshorecare.com/..."
							},
							"int": {
								baseUrl: "https://epi-int.northshorecare.com/..."
							}
							// ... other environments from CSV
						};
						
						// NOT hardcoded like this:
						// const ENV_CONFIG = {
						//   prep: { ... },
						//   int: { ... }
						// };
						\`\`\`
					`
				}
			]
		};
	}
};