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