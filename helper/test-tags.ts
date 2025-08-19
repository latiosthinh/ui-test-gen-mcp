// Test tags utility for visual testing
export const VISUAL_TEST_TAGS = ['@visual', '@screenshot'];
export const FULLPAGE_TAG = '@visual-fullpage';
export const COMPONENT_TAG = '@visual-component';

// Function to get appropriate tags based on selector
export function getTestTags(selector: string): string[] {
	const baseTags = [...VISUAL_TEST_TAGS];

	if (selector === 'body') {
		baseTags.push(FULLPAGE_TAG);
	} else {
		baseTags.push(COMPONENT_TAG);
	}

	return baseTags;
}

// Function to get base visual test tags
export function getBaseVisualTags(): string[] {
	return [...VISUAL_TEST_TAGS];
}

// Function to check if selector is full page
export function isFullPageSelector(selector: string): boolean {
	return selector === 'body';
}

// Function to get selector-specific tag
export function getSelectorTag(selector: string): string {
	return isFullPageSelector(selector) ? FULLPAGE_TAG : COMPONENT_TAG;
}
