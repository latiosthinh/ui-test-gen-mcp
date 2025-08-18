// Test file to demonstrate conditional rendering functionality
const { visualTestGeneratorTool } = require('./tools/visual-test-generator.ts');

// Test CSV data with test_hide values
const csvWithHide = `file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,button.hidden,
test2.spec.ts,https://example.com,Test 2,div,div.ads,`;

// Test CSV data with test_action values
const csvWithAction = `file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,,click_button
test2.spec.ts,https://example.com,Test 2,div,,fill_form`;

// Test CSV data with both test_hide and test_action values
const csvWithBoth = `file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,button.hidden,click_button
test2.spec.ts,https://example.com,Test 2,div,div.ads,fill_form`;

// Test CSV data with neither test_hide nor test_action values
const csvWithNeither = `file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,,
test2.spec.ts,https://example.com,Test 2,div,,`;

console.log('Testing conditional rendering functionality...\n');

// Test 1: CSV with test_hide values
console.log('=== Test 1: CSV with test_hide values ===');
visualTestGeneratorTool.handler({ csvData: csvWithHide })
  .then(result => {
    const template = result.content[0].text;
    const hasHideTemplate = template.includes('for (const selector of [test_hide_selector])');
    const hasActionTemplate = template.includes('// test_action description');
    console.log('✓ HIDE_SELECTOR_TEMPLATE included:', hasHideTemplate);
    console.log('✓ ACTION_TEMPLATE included:', hasActionTemplate);
    console.log('Expected: HIDE_SELECTOR_TEMPLATE=true, ACTION_TEMPLATE=false\n');
  });

// Test 2: CSV with test_action values
console.log('=== Test 2: CSV with test_action values ===');
visualTestGeneratorTool.handler({ csvData: csvWithAction })
  .then(result => {
    const template = result.content[0].text;
    const hasHideTemplate = template.includes('for (const selector of [test_hide_selector])');
    const hasActionTemplate = template.includes('// test_action description');
    console.log('✓ HIDE_SELECTOR_TEMPLATE included:', hasHideTemplate);
    console.log('✓ ACTION_TEMPLATE included:', hasActionTemplate);
    console.log('Expected: HIDE_SELECTOR_TEMPLATE=false, ACTION_TEMPLATE=true\n');
  });

// Test 3: CSV with both values
console.log('=== Test 3: CSV with both test_hide and test_action values ===');
visualTestGeneratorTool.handler({ csvData: csvWithBoth })
  .then(result => {
    const template = result.content[0].text;
    const hasHideTemplate = template.includes('for (const selector of [test_hide_selector])');
    const hasActionTemplate = template.includes('// test_action description');
    console.log('✓ HIDE_SELECTOR_TEMPLATE included:', hasHideTemplate);
    console.log('✓ ACTION_TEMPLATE included:', hasActionTemplate);
    console.log('Expected: HIDE_SELECTOR_TEMPLATE=true, ACTION_TEMPLATE=true\n');
  });

// Test 4: CSV with neither value
console.log('=== Test 4: CSV with neither test_hide nor test_action values ===');
visualTestGeneratorTool.handler({ csvData: csvWithNeither })
  .then(result => {
    const template = result.content[0].text;
    const hasHideTemplate = template.includes('for (const selector of [test_hide_selector])');
    const hasActionTemplate = template.includes('// test_action description');
    console.log('✓ HIDE_SELECTOR_TEMPLATE included:', hasHideTemplate);
    console.log('✓ ACTION_TEMPLATE included:', hasActionTemplate);
    console.log('Expected: HIDE_SELECTOR_TEMPLATE=false, ACTION_TEMPLATE=false\n');
  });
