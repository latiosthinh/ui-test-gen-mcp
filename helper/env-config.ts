// Environment-specific configuration for UI testing
export interface EnvConfig {
	screenshotDir: string;
	baseUrl: string;
	timeout?: number;
}

// Base configuration that can be extended for any environment
export const BASE_ENV_CONFIG: Partial<EnvConfig> = {
	timeout: 30000
};

// Default environment configurations
export const DEFAULT_ENV_CONFIG: Record<string, EnvConfig> = {
	prep: {
		screenshotDir: "__screenshots__/prep",
		baseUrl: "https://epi-preprod.northshorecare.com",
		timeout: 30000
	},
	int: {
		screenshotDir: "__screenshots__/int",
		baseUrl: "https://epi-int.northshorecare.com",
		timeout: 30000
	}
};

// Dynamic environment configuration generator
export function createEnvConfig(env: string, customConfig?: Partial<EnvConfig>): EnvConfig {
	// If we have a default config for this environment, use it as base
	const baseConfig = DEFAULT_ENV_CONFIG[env] || BASE_ENV_CONFIG;

	// Generate screenshot directory path - at root level
	const screenshotDir = customConfig?.screenshotDir || `__screenshots__/${env}`;

	// Generate base URL if not provided (you can customize this pattern)
	const baseUrl = customConfig?.baseUrl || `https://epi-${env}.northshorecare.com`;

	return {
		...baseConfig,
		...customConfig,
		screenshotDir,
		baseUrl
	};
}

// Function to get or create environment configuration
export function getEnvConfig(env: string, customConfig?: Partial<EnvConfig>): EnvConfig {
	const config = createEnvConfig(env, customConfig);
	return config;
}

// Function to validate environment name
export function validateEnvironment(env: string): boolean {
	// Accept any environment name (alphanumeric and hyphens)
	return /^[a-zA-Z0-9-]+$/.test(env);
}

// Function to get supported environments (including custom ones)
export function getSupportedEnvironments(): string[] {
	return Object.keys(DEFAULT_ENV_CONFIG);
}

// Function to get current environment from process or default
export function getCurrentEnv(): string {
	return process.env.TEST_ENV || process.env.NODE_ENV || 'int';
}

// Function to switch environment dynamically
export function switchEnvironment(env: string): EnvConfig {
	if (!validateEnvironment(env)) {
		throw new Error(`Invalid environment name: ${env}. Environment names must be alphanumeric and can contain hyphens.`);
	}

	return getEnvConfig(env);
}
