# Core Test Script Template - Usage Guide

## ⚠️ CRITICAL REQUIREMENT

**The `core-test-script.content.txt` template MUST be strictly followed when generating test files. This template is mandatory and non-negotiable.**

## Template Structure

The core test script template follows this exact structure:

```typescript
import test, { expect } from "playwright/test";

test.describe('test_description - Visual testing', () => {
	test('PDP', async ({ page }) => {
		const url = "test_url";

		await page.goto(url);

		for (const selector of [test_hide_selector]) {
			await page.addStyleTag({
				content: `${selector} { display: none !important; }`
			});
		}

		const locator = page.locator("test_selector");
		await locator.scrollIntoViewIfNeeded();
		expect(await locator.screenshot()).toMatchSnapshot('test_description.replaceAll(/\s/i, '').png');
	});
});
```

## Template Variables to Replace

When using this template, you MUST replace these placeholders with actual values from your CSV data:

- `test_description` → Replace with the actual test description from CSV
- `test_url` → Replace with the actual URL from CSV  
- `test_hide_selector` → Replace with the actual hide selectors from CSV
- `test_selector` → Replace with the actual element selector from CSV

## Example CSV Row
```
file_name,test_url,test_description,test_selector,test_hide,test_action
pdp,https://example.com/product,Product Top Section,"div[data-component^='productContainer']","#header, .modal-backdrop.flyout, .leaderboardblock, #onetrust-banner-sdk",
```

## Generated Test File Example

For the above CSV row, the generated test file should look like:

```typescript
import test, { expect } from "playwright/test";

test.describe('Product Top Section - Visual testing', () => {
	test('PDP', async ({ page }) => {
		const url = "https://example.com/product";

		await page.goto(url);

		for (const selector of ["#header", ".modal-backdrop.flyout", ".leaderboardblock", "#onetrust-banner-sdk"]) {
			await page.addStyleTag({
				content: `${selector} { display: none !important; }`
			});
		}

		const locator = page.locator("div[data-component^='productContainer']");
		await locator.scrollIntoViewIfNeeded();
		expect(await locator.screenshot()).toMatchSnapshot('ProductTopSection.png');
	});
});
```

## Rules to Follow

1. **NEVER deviate from the template structure**
2. **ALWAYS use the exact import statements**
3. **ALWAYS use the exact test.describe and test structure**
4. **ALWAYS use the exact page.goto pattern**
5. **ALWAYS use the exact hide selector loop pattern**
6. **ALWAYS use the exact locator and screenshot pattern**
7. **ALWAYS use the exact expect().toMatchSnapshot pattern**

## What NOT to Do

❌ Don't change the import statements  
❌ Don't modify the test structure  
❌ Don't change the page.goto pattern  
❌ Don't modify the hide selector implementation  
❌ Don't change the screenshot and snapshot pattern  
❌ Don't add additional test logic outside the template  

## What TO Do

✅ Replace template variables with CSV data  
✅ Keep the exact template structure  
✅ Follow the exact implementation patterns  
✅ Use the exact file naming convention  
✅ Place files in the correct directory structure  

## File Naming Convention

Test files should be named exactly as specified in the `file_name` column of your CSV, with `.spec.ts` extension.

Example: If `file_name` is `pdp`, the file should be named `pdp.spec.ts`

## Directory Structure

All generated test files must be placed in the `./tests/ui/` folder relative to your project root.
