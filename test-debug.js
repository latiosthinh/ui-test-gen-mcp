// Simple test to debug CSV parsing and template generation
const csvData = `file_name,test_url,test_description,test_selector,test_hide,test_action,test_env
pdp,https://epi-preprod.northshorecare.com/adult-diapers/adult-diapers-with-tabs/northshore-megamax-tab-style-briefs,Pdp Full Page,body,".modal-backdrop.flyout, #onetrust-banner-sdk",full site scroll to reveal all lazy load components,prep
pdp,https://epi-preprod.northshorecare.com/adult-diapers/adult-diapers-with-tabs/northshore-megamax-tab-style-briefs,Product Top Section - Selected Variant,"div[data-component^=""productContainer""]","#header, .modal-backdrop.flyout, .leaderboardblock, #onetrust-banner-sdk, #contact-us-popup, #recommended-panel","select S, White, Case/40 (4/10s) ",prep`;

// Parse CSV data
const csvLines = csvData.trim().split('\n');
const headers = csvLines[0]?.split(',').map((h) => h.trim()) || [];

console.log('Headers:', headers);
console.log('Has test_env:', headers.includes('test_env'));
console.log('test_env index:', headers.indexOf('test_env'));

// Check if test_env column exists
const hasTestEnv = headers.includes('test_env');
console.log('hasTestEnv:', hasTestEnv);

if (hasTestEnv) {
    console.log('Environment template should be used');
} else {
    console.log('Standard template should be used');
}
