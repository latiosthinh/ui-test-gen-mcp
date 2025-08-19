# Environment-Specific UI Test Organization

## Overview

The ui-test-gen-mcp has been updated to support environment-specific test organization, screenshot management, and test tagging. This allows you to organize tests by environment (e.g., prep, int, qa, prod) and maintain separate screenshot directories for each environment with proper test categorization.

## New Features

### 1. Environment-Specific Screenshot Folders (at Root Level)
- **Before**: All screenshots were saved to `./screenshots/`
- **After**: Screenshots are organized by environment at root level:
  - `./__screenshots__/prep/` - For prep environment tests
  - `./__screenshots__/int/` - For int environment tests
  - `./__screenshots__/qa/` - For qa environment tests
  - `./__screenshots__/prod/` - For prod environment tests
  - **NEW**: Supports ANY environment name dynamically
  - **IMPORTANT**: Screenshots are at root level, NOT nested under ui/

### 2. Single Test File with Environment Switching
- **Before**: Separate test files for each environment
- **After**: **ONE test file per file_name with environment switching capability**
- **NEW**: Users can change `currentEnv` variable to switch environments
- **NEW**: Screenshots automatically save to correct environment folder based on `currentEnv`

### 3. Environment Configuration
The system now automatically detects the `test_env` column in CSV data and:
- Uses single test file template with environment switching
- Creates appropriate folder structures for screenshots at root level
- Configures screenshot paths automatically
- **NEW**: Supports any environment name (not just prep/int)

### 4. Test Tags Implementation with Proper Playwright Syntax
- **NEW**: All visual tests automatically get tags: `['visual', 'screenshot', 'regression']`
- **NEW**: Selector "body" gets additional tag: `'visual-fullpage'`
- **NEW**: Other selectors get additional tag: `'visual-component'`
- **NEW**: Uses proper Playwright test tag syntax: `test('Name', { tag: getTestTags() }, async ({ page }) => {})`

### 5. Fixed Screenshot Paths
- **Before**: `__screenshots__\ui\prep\pdp.spec.ts-snapshots\-screenshots-prep-PdpFullPage-Google-Chrome-win32.png`
- **After**: `__screenshots__\prep\pdp\PdpFullPage-Google-Chrome-win32.png`

## CSV Data Requirements

Your CSV must include a `test_env` column with values like:
- `prep` - For prep environment
- `int` - For int environment
- `qa` - For qa environment
- `prod` - For production environment
- **Any other environment name** - System supports any valid environment name

Example CSV structure:
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action,test_env
pdp,https://epi-preprod.northshorecare.com/...,PDP Full Page,body,".modal-backdrop",,prep
pdp,https://epi-int.northshorecare.com/...,PDP Full Page,body,".modal-backdrop",,int
pdp,https://epi-qa.northshorecare.com/...,PDP Full Page,body,".modal-backdrop",,qa
pdp,https://epi.northshorecare.com/...,PDP Full Page,body,".modal-backdrop",,prod
```

## Generated Folder Structure

```
project/
├── __screenshots__/          # Screenshots at root level
│   ├── prep/
│   │   └── pdp/
│   │       └── PdpFullPage-Google-Chrome-win32.png
│   ├── int/
│   │   └── pdp/
│   │       └── PdpFullPage-Google-Chrome-win32.png
│   ├── qa/
│   │   └── pdp/
│   │       └── PdpFullPage-Google-Chrome-win32.png
│   └── prod/
│       └── pdp/
│           └── PdpFullPage-Google-Chrome-win32.png
├── tests/ui/
│   ├── pdp.spec.ts          # SINGLE test file for all environments
│   └── header.spec.ts       # SINGLE test file for all environments
├── utils/ui/
│   ├── env-config.ts
│   ├── selectors.ts
│   ├── helpers.ts
│   └── test-actions.ts
├── data/ui/
│   └── [test data files]
└── pages/ui/
    └── [page object classes]
```

## Environment Configuration

The system automatically generates environment-specific configuration in each test file:

```typescript
// Environment configuration - users can modify this to switch environments
const ENV_CONFIG = {
	prep: {
		screenshotDir: "__screenshots__/prep",
		baseUrl: "https://epi-preprod.northshorecare.com"
	},
	int: {
		screenshotDir: "__screenshots__/int",
		baseUrl: "https://epi-int.northshorecare.com"
	}
};

// Users can change this value to switch environments
let currentEnv = "test_env"; // Default environment from CSV
const config = ENV_CONFIG[currentEnv];

// Function to switch environment dynamically
function switchEnvironment(env: string) {
	if (ENV_CONFIG[env]) {
		currentEnv = env;
		return ENV_CONFIG[env];
	}
	throw new Error(`Unknown environment: ${env}. Supported: ${Object.keys(ENV_CONFIG).join(', ')}`);
}

// Function to get current environment
function getCurrentEnv(): string {
	return currentEnv;
}
```

## Test Tags Implementation with Proper Playwright Syntax

All visual tests automatically include appropriate tags using proper Playwright syntax:

```typescript
// Import test tags utility
import { getTestTags } from '../utils/ui/test-tags.js';

// Use proper Playwright test tag syntax
test('Visual Test', {
	tag: getTestTags("test_selector")
}, async ({ page }) => {
	// test code here
});
```

**IMPORTANT**: Use the correct Playwright test tag syntax:

```typescript
// CORRECT syntax:
test('Test Name', {
	tag: getTestTags("test_selector")
}, async ({ page }) => {
	// test code here
});

// NOT this syntax:
// test.use({ tag: getTestTags("test_selector") });
// test('Test Name', async ({ page }) => {
//   // test code here
// });
```

## Screenshot Path Structure

The system now generates proper screenshot paths at root level:

```typescript
// Instead of the old complex path:
// __screenshots__\ui\prep\pdp.spec.ts-snapshots\-screenshots-prep-PdpFullPage-Google-Chrome-win32.png

// Use the new clean path at root level:
const fileName = "test_description".replaceAll(/\s/i, '');
expect(await locator.screenshot()).toMatchSnapshot(
    `${config.screenshotDir}/${fileName}/${fileName}-Google-Chrome-win32.png`
);
```

**Key Points**:
- Screenshots are saved to `./__screenshots__/{env}/` (at root level)
- NOT to `./__screenshots__/ui/{env}/` (nested under ui/)
- Each environment gets its own folder at the root level

## Playwright Configuration Update

**IMPORTANT**: Update your `playwright.config.ts` to use the new screenshot directory:

```typescript
export default defineConfig({
  expect: {
    timeout: 30000,
    toMatchSnapshot: {
      snapshotDir: "./__screenshots__"  // Updated from "./screenshots"
    }
  }
  // ... rest of your config
});
```

## Environment Switching Usage

After generating the test file, users can switch environments by:

```typescript
// Change the currentEnv variable to switch environments
currentEnv = "qa"; // Switch to qa environment

// Or use the switchEnvironment function
const qaConfig = switchEnvironment("qa");

// Get current environment
const env = getCurrentEnv();
```

The test will automatically:
- Use the correct base URL for the selected environment
- Save screenshots to the correct environment folder
- Apply environment-specific configurations

## Environment Management Functions

The system provides several utility functions for environment management:

```typescript
import { getCurrentEnv, switchEnvironment, getEnvConfig } from './utils/ui/env-config.js';

// Get current environment
const currentEnv = getCurrentEnv(); // Returns from process.env.TEST_ENV or defaults to 'int'

// Switch to different environment
const qaConfig = switchEnvironment('qa');

// Get environment configuration
const prodConfig = getEnvConfig('prod');
```

## Usage

1. **Include `test_env` column** in your CSV data
2. **Run the visual test generator** - it will automatically detect environments
3. **Single test files** will be created with environment switching capability
4. **Screenshots will be saved** to environment-specific folders at root level based on `currentEnv`
5. **Test tags will be applied** automatically based on selector type using proper Playwright syntax
6. **Switch environments** by changing `currentEnv` variable in the test file

## Benefits

- **Better Organization**: Tests and screenshots are clearly separated by environment
- **Easier Maintenance**: Environment-specific configurations are centralized
- **Reduced Conflicts**: No more screenshot naming conflicts between environments
- **Clearer Structure**: Easy to identify which tests belong to which environment
- **Scalable**: Easy to add new environments in the future
- **Proper Tagging**: Automatic test categorization for better test management
- **Clean Screenshot Paths**: Simple, organized screenshot file structure at root level
- **Single Test Files**: No need to maintain multiple copies of the same test
- **Environment Switching**: Easy to switch between environments without regenerating tests
- **Correct Playwright Syntax**: Uses proper test tag syntax for better compatibility

## Adding New Environments

To add a new environment, simply include it in your CSV data:

```csv
file_name,test_url,test_description,test_selector,test_hide,test_action,test_env
pdp,https://epi-staging.northshorecare.com/...,PDP Full Page,body,".modal-backdrop",,staging
```

The system will automatically:
- Add the new environment to the `ENV_CONFIG` in the test file
- Create `./__screenshots__/staging/` folder at root level
- Generate appropriate configuration
- Apply test tags automatically using proper Playwright syntax

## Migration from Old Structure

If you have existing tests in the old structure:

1. **Backup** your existing tests and screenshots
2. **Update** your CSV to include `test_env` column
3. **Regenerate** tests using the new system
4. **Move** existing screenshots to appropriate environment folders at root level
5. **Update** any hardcoded paths in existing tests

## Troubleshooting

### Common Issues

1. **"Unknown environment" error**: The system now supports any environment name - ensure your CSV `test_env` values are valid
2. **Screenshots not saving**: Check that `playwright.config.ts` has the correct `snapshotDir`
3. **Folder structure not created**: Ensure the CSV has a `test_env` column with valid values
4. **Test tags not working**: Ensure you're using the correct Playwright syntax: `test('Name', { tag: getTestTags() }, async ({ page }) => {})`
5. **Environment not switching**: Make sure you're changing the `currentEnv` variable in the test file
6. **Screenshots in wrong location**: Ensure screenshots are saved to root level `./__screenshots__/{env}/` not nested under ui/

### Validation

The system automatically validates:
- Environment names in CSV data (supports any valid name)
- Required folder structure creation
- Screenshot directory configuration at root level
- Template variable replacement
- Test tag implementation with proper Playwright syntax
- Screenshot path structure
- Environment switching functions

## Advanced Configuration

For custom environment configurations, you can extend the system:

```typescript
// In your test files, you can customize environment config
const customConfig = {
  screenshotDir: `__screenshots__/custom-${env}`, // At root level
  baseUrl: `https://custom-${env}.example.com`,
  timeout: 45000
};

const config = getEnvConfig('custom-env', customConfig);
```

## Key Differences from Previous Version

- **Single Test Files**: Instead of separate files per environment, now ONE file per file_name
- **Environment Switching**: Users can change `currentEnv` variable to switch environments
- **Automatic Screenshot Organization**: Screenshots automatically save to correct environment folder
- **Built-in Functions**: `switchEnvironment()` and `getCurrentEnv()` functions included in test files
- **Simplified Maintenance**: No need to maintain multiple copies of the same test
- **Root Level Screenshots**: Screenshots saved to `./__screenshots__/{env}/` at root level
- **Proper Playwright Syntax**: Uses correct test tag syntax: `test('Name', { tag: getTestTags() }, async ({ page }) => {})`
