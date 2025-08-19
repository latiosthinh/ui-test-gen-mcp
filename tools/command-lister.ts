export const commandListerTool = {
	name: 'list_commands',
	description: 'List all available playwright commands which can be used with generated visual tests scripts',
	handler: async (args: any, extra?: any) => {
		return {
			content: [
				{
					type: "text" as const,
					text: `
						## 🛠️ AVAILABLE COMMANDS

						- \`npx playwright test tests/ui/pdp.spec.ts --update-snapshots\` - Update snapshots for visual tests
						- \`npx playwright test tests/ui/pdp.spec.ts --grep "PdpFullPage" --update-snapshots\` - Update snapshots for specific test
						- \`npx playwright test --grep "visual-regression" --update-snapshots\` - Update snapshots for all visual tests

						- \`ENV=int npx playwright test tests/ui/pdp.spec.ts --grep "PdpFullPage" --update-snapshots\` - Update snapshots for specific test in specific environment
						- \`ENV=int npx playwright test tests/ui/pdp.spec.ts --update-snapshots\` - Update snapshots for all tests in specific environment
						- \`ENV=int npx playwright test --grep "visual-regression" --update-snapshots\` - Update snapshots for all visual tests in specific environment
						- \`ENV=int npx playwright test --grep "visual-fullpage" --update-snapshots\` - Update snapshots for all visual fullpage (only) tests in specific environment
					`
				}
			]
		};
	}
};
