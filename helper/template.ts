export const MODULE_IMPORT_TEMPLATE = `import test, { expect } from "playwright/test";`;

// This template is conditionally rendered only when CSV rows have test_action values
export const ACTION_TEMPLATE = `
	// test_action description
	// your code here
`;

// This template is conditionally rendered only when CSV rows have test_hide values
export const HIDE_SELECTOR_TEMPLATE = `
	for (const selector of [test_hide_selector]) {
		await page.addStyleTag({
			content: \`\${selector} { display: none !important; }\`
		});
	}
`;

export const CORE_TEST_TEMPLATE_HEADER = `test.describe('test_description - Visual testing', () => {
	test('PDP', async ({ page }) => {
		const url = "test_url";
`;

export const CORE_TEST_TEMPLATE_FOOTER = `
		const locator = page.locator("test_selector");
		await locator.scrollIntoViewIfNeeded();
		expect(await locator.screenshot()).toMatchSnapshot('test_description.replaceAll(/\\s/i, '').png');
	});
});
`;

// Test tags template - this will be populated from CSV data
export const TEST_TAGS_IMPORT = `
// Test tags for visual testing - populated from CSV data
const baseVisualTags = ['@visual-regression', '@screenshot'];
const fullPageTags = [...baseVisualTags, '@visual-fullpage'];
const sectionTags = [...baseVisualTags, '@visual-section'];
`;

// Environment configuration template for single test file - will be populated from CSV data
export const ENV_CONFIG_TEMPLATE = `
// Environment configuration - populated from CSV data
// This will be populated with actual environments from CSV data

// Function to get current environment - USER SHOULD IMPLEMENT THIS BASED ON THEIR CONFIG
let currentEnv = "test_env";
function getCurrentEnv(): string {
	// TODO: User should implement this function based on their environment configuration
	// This could read from environment variables, config files, or other sources
	return currentEnv;
}
`;

// Single test file template with proper tag syntax
export const SINGLE_TEST_WITH_ENV_TEMPLATE = `
// Single test file
test.describe('test_description - Visual testing', () => {
	test('Visual Test', {
		tag: test_tags
	}, async ({ page }) => {
		const testData = pdpTestData.find(t => t.test_description === 'test_description' && t.test_env === getCurrentEnv());
		if (!testData) throw new Error('Test data not found');

		await page.goto(testData.test_url);
		
		// Hide elements specific to this component
		for (const selector of [test_hide_selector]) {
			await page.addStyleTag({
				content: \`\${selector} { display: none !important; }\`
			});
		}
		
		// Execute test action if specified
		test_action_code
		
		const locator = page.locator("test_selector");
		await locator.scrollIntoViewIfNeeded();
		
		// Use simple screenshot path structure: __screenshots__/currentEnv/screenShotName.png
		const screenShotName = "test_description".replaceAll(/\\s/i, '');
		expect(await locator.screenshot()).toMatchSnapshot(\[\${currentEnv}, \`\${screenShotName}.png\`\]);
	});
});
`;

// Test tags template
export const TEST_TAGS_TEMPLATE = `
// Test tags for visual testing
const VISUAL_TEST_TAGS = ['visual', 'screenshot', 'regression'];
const FULLPAGE_TAG = 'visual-fullpage';
const COMPONENT_TAG = 'visual-component';

// Function to get appropriate tags based on selector
function getTestTags(selector: string): string[] {
	const baseTags = [...VISUAL_TEST_TAGS];
	
	if (selector === 'body') {
		baseTags.push(FULLPAGE_TAG);
	} else {
		baseTags.push(COMPONENT_TAG);
	}
	
	return baseTags;
}
`;

// Environment-specific test organization template with tags
export const ENV_TEST_WITH_TAGS_TEMPLATE = `
// Environment-specific test organization with tags
test.describe(\`\${test_description} - \${currentEnv.toUpperCase()} Environment\`, () => {
	test('Visual Test', {
		tag: test_tags
	}, async ({ page }) => {
		const url = "test_url";
		await page.goto(url);
		
		// Hide elements specific to this environment
		for (const selector of [test_hide_selector]) {
			await page.addStyleTag({
				content: \`\${selector} { display: none !important; }\`
			});
		}
		
		// Execute test action if specified
		test_action_code
		
		const locator = page.locator("test_selector");
		await locator.scrollIntoViewIfNeeded();
		
		// Use simple screenshot path structure: __screenshots__/currentEnv/screenShotName.png
		const screenShotName = "test_description".replaceAll(/\\s/i, '');
		expect(await locator.screenshot()).toMatchSnapshot(\[\${currentEnv}, \`\${screenShotName}.png\`\]);
	});
});
`;