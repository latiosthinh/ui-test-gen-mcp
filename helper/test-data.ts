// Test data template for visual testing
export interface TestData {
	file_name: string;
	test_url: string;
	test_description: string;
	test_selector: string;
	test_hide: string;
	test_action: string;
	test_env: string;
}

// Sample test data structure
export const SAMPLE_TEST_DATA: TestData[] = [
	{
		file_name: "pdp",
		test_url: "https://epi-preprod.northshorecare.com/adult-diapers/adult-diapers-with-tabs/northshore-megamax-tab-style-briefs",
		test_description: "Pdp Full Page",
		test_selector: "body",
		test_hide: ".modal-backdrop.flyout, #onetrust-banner-sdk",
		test_action: "full site scroll to reveal all lazy load components",
		test_env: "prep"
	},
	{
		file_name: "pdp",
		test_url: "https://epi-int.northshorecare.com/adult-diapers/adult-pull-ups/northshore-gosupreme-pull-on-underwear",
		test_description: "Pdp Full Page",
		test_selector: "body",
		test_hide: ".modal-backdrop.flyout, #onetrust-banner-sdk",
		test_action: "full site scroll to reveal all lazy load components",
		test_env: "int"
	}
];

// Function to get test data by file name
export function getTestDataByFileName(fileName: string): TestData[] {
	return SAMPLE_TEST_DATA.filter(data => data.file_name === fileName);
}

// Function to get test data by environment
export function getTestDataByEnvironment(env: string): TestData[] {
	return SAMPLE_TEST_DATA.filter(data => data.test_env === env);
}

// Function to get unique file names
export function getUniqueFileNames(): string[] {
	return [...new Set(SAMPLE_TEST_DATA.map(data => data.file_name))];
}

// Function to get unique environments
export function getUniqueEnvironments(): string[] {
	return [...new Set(SAMPLE_TEST_DATA.map(data => data.test_env))];
}
