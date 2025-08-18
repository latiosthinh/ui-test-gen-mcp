# Conditional Template Rendering

This document explains how the conditional rendering system works in the visual test generator.

## Overview

The visual test generator now intelligently renders templates based on the content of CSV data. Instead of always including all templates, it conditionally includes only the templates that are relevant based on the CSV row values.

## How It Works

### 1. CSV Analysis
The system parses the CSV data and analyzes each row to determine:
- Whether any rows have `test_hide` values
- Whether any rows have `test_action` values

### 2. Conditional Template Selection
Based on the analysis, the system builds a conditional template:

```typescript
// Build conditional template
let conditionalTemplate = '';

if (hasHideSelectors) {
    conditionalTemplate += HIDE_SELECTOR_TEMPLATE;
}

if (hasTestActions) {
    conditionalTemplate += ACTION_TEMPLATE;
}
```

### 3. Template Rendering
The final template is rendered using the conditional template:

```typescript
${MODULE_IMPORT_TEMPLATE}
${CORE_TEST_TEMPLATE_HEADER}
${conditionalTemplate}  // Only includes relevant templates
${CORE_TEST_TEMPLATE_FOOTER}
```

## Template Inclusion Rules

| CSV Condition | HIDE_SELECTOR_TEMPLATE | ACTION_TEMPLATE |
|---------------|------------------------|-----------------|
| `test_hide` has values | ✅ Included | ❌ Not included |
| `test_action` has values | ❌ Not included | ✅ Included |
| Both have values | ✅ Included | ✅ Included |
| Neither has values | ❌ Not included | ❌ Not included |

## Examples

### Example 1: CSV with test_hide values only
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,button.hidden,
test2.spec.ts,https://example.com,Test 2,div,div.ads,
```

**Result**: Only `HIDE_SELECTOR_TEMPLATE` is included in the generated test.

### Example 2: CSV with test_action values only
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,,click_button
test2.spec.ts,https://example.com,Test 2,div,,fill_form
```

**Result**: Only `ACTION_TEMPLATE` is included in the generated test.

### Example 3: CSV with both values
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,button.hidden,click_button
test2.spec.ts,https://example.com,Test 2,div,div.ads,fill_form
```

**Result**: Both `HIDE_SELECTOR_TEMPLATE` and `ACTION_TEMPLATE` are included.

### Example 4: CSV with neither value
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action
test1.spec.ts,https://example.com,Test 1,button,,
test2.spec.ts,https://example.com,Test 2,div,,,
```

**Result**: Neither template is included - only the core test structure.

## Benefits

1. **Cleaner Output**: Only relevant templates are included
2. **Flexible**: Works with any combination of CSV data
3. **Efficient**: No unnecessary template code in generated tests
4. **Maintainable**: Easy to understand and modify

## Testing

You can test the conditional rendering functionality using the `test-conditional-rendering.js` file, which demonstrates all four scenarios.

## Implementation Details

The logic is implemented in the `visualTestGeneratorTool.handler` function in `tools/visual-test-generator.ts`:

```typescript
// Check if test_hide and test_action columns exist and have values
const hasHideSelectors = csvLines.slice(1).some(line => {
    const values = line.split(',').map(v => v.trim());
    const hideIndex = headers.indexOf('test_hide');
    return hideIndex >= 0 && values[hideIndex] && values[hideIndex] !== '';
});

const hasTestActions = csvLines.slice(1).some(line => {
    const values = line.split(',').map(v => v.trim());
    const actionIndex = headers.indexOf('test_action');
    return actionIndex >= 0 && values[actionIndex] && values[actionIndex] !== '';
});
```

This ensures that the system accurately detects when templates should be included based on actual CSV data content.
