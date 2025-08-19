# UI Test Gen MCP Server

A Model Context Protocol (MCP) server that generates Playwright visual testing scripts from CSV data with advanced configuration management, environment switching capabilities, and organized code structure.

## 🚀 Overview

This MCP server provides automated generation of Playwright visual testing scripts, helping developers quickly create comprehensive UI test suites from CSV test specifications. It includes automatic Playwright configuration validation, organized folder structure creation, intelligent code generation following best practices, and **environment switching capabilities** for multi-environment testing.

## 📦 Installation

### Option 1: Install from npm (Recommended)

```bash
# Install globally for system-wide access
npm install -g ui-test-gen-mcp

# Or install locally in your project
npm install ui-test-gen-mcp
```

### Option 2: Install from source

```bash
# Clone the repository
git clone <repository-url>
cd ui-test-gen-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## 🏗️ Project Structure

```
ui-test-gen-mcp/
├── main.ts                 # MCP server entry point
├── tools/
│   ├── index.ts           # Tool exports
│   ├── visual-test-generator.ts  # Main test generation tool
│   └── tool-lister.ts     # Tool listing utility
├── helper/
│   ├── index.ts           # Helper function exports
│   ├── template.ts        # Test templates and tag definitions
│   ├── test-tags.ts       # Tag utility functions
│   ├── env-config.ts      # Environment configuration helpers
│   ├── test-data.ts       # Test data management
│   └── register.ts        # Tool registration helper
├── data/
│   ├── core-test-script.content.txt  # Test script template
│   └── template-usage-guide.md       # Template usage documentation
└── dist/                  # Compiled JavaScript output
```

## 🛠️ Available Tools

### 1. Visual Test Generator (`create_playwright_visual_tests`)
**Purpose**: Generate comprehensive Playwright visual testing scripts from CSV data

**Features**:
- **Automatic Playwright Config Validation**: Checks and updates `playwright.config.ts` for proper `snapshotDir` configuration
- **Organized Folder Structure**: Creates `./tests/ui/`, `./utils/ui/`, `./data/ui/`, and `./pages/ui/` directories
- **CSV-Based Test Generation**: Processes CSV data to create test files following a strict template
- **Environment Switching**: **NEW** - Single test file handles multiple environments (prep, int, qa, prod, etc.)
- **Smart Code Organization**: Extracts utilities and organizes code during refactoring phase
- **Project Style Integration**: Analyzes existing code to match project's coding conventions
- **Improved Tag System**: **NEW** - Pre-calculated tag constants instead of function calls

**Input Schema**:
```typescript
{
  csvData: string  // CSV content with test information
}
```

**Required CSV Columns**:
- `file_name`: Name for the generated test file
- `test_url`: URL to test
- `test_description`: Description of what to test
- `test_selector`: CSS selector for the element
- `test_hide`: Elements to hide during testing (component-specific)
- `test_action`: Action to perform (optional)
- `test_env`: **NEW** - Environment name (prep, int, qa, prod, staging, etc.)

### 2. Tool Lister (`list_tools`)
**Purpose**: Display all available tools with simple descriptions

**Usage**: Call this tool to see what's available in the MCP server

## 🔧 Key Features

### **Playwright Configuration Management**
- Automatically validates `playwright.config.ts` files
- Ensures `snapshotDir` is set to `"./__screenshots__"`
- Updates configuration if missing or incorrect (only modifies snapshotDir)

### **Environment Switching Capabilities** 🆕
- **Single Test File**: One test file per component handles all environments
- **Dynamic Environment Config**: Environment configuration generated from CSV data
- **User-Controlled Switching**: Users manually configure environment selection
- **Flexible Environment Support**: Supports any environment name (prep, int, qa, prod, staging, etc.)

### **Improved Screenshot Path Structure** 🆕
- **Clean Paths**: `__screenshots__/fileName/fileName.png` format
- **No Environment Nesting**: Simple, clean structure without unnecessary directories
- **Consistent Naming**: Predictable and maintainable screenshot organization

### **Enhanced Tag System** 🆕
- **Pre-calculated Constants**: Uses `fullPageTags` and `sectionTags` constants
- **No Function Calls**: Eliminates `getTagsForSelector()` function calls
- **Proper Playwright Syntax**: Implements tags using `test('Name', { tag: tags }, async ({ page }) => {})`
- **Automatic Tag Selection**: Body selector gets `fullPageTags`, others get `sectionTags`

### **Organized Project Structure**
- `./tests/ui/` - Generated test files (single file per component)
- `./utils/ui/` - Utility functions organized by type:
  - `selectors.ts` - Reusable selectors and constants
  - `helpers.ts` - Common helper functions
  - `test-actions.ts` - Generated test action functions
  - `page-objects.ts` - Page object model patterns
  - `validation.ts` - Validation and error handling
  - `env-config.ts` - **NEW** Environment configuration utilities
  - `test-tags.ts` - **NEW** Tag management utilities
- `./data/ui/` - Test data and configuration
- `./pages/ui/` - Page object classes and locators

### **Intelligent Code Generation**
- Follows the embedded core test script template strictly
- Generates proper test action functions following Playwright best practices
- Preserves component-specific test_hide selectors
- Maintains separation between test files and utility/data files

### **Template Compliance**
The server uses a mandatory core test script template that ensures consistency:
- Standard Playwright test structure
- Proper screenshot handling with `toMatchSnapshot`
- Element hiding for clean visual testing
- Scroll handling for element visibility
- Proper tag implementation

## 📋 Workflow

### Phase 1: Configuration Validation
1. Locate `playwright.config.ts` files in the project
2. Verify `snapshotDir` is set to `"./__screenshots__"`
3. Update configuration if necessary

### Phase 2: Test File Generation
1. Parse CSV data for test specifications
2. Detect environment column and use appropriate template
3. Create **single test file** per component in `./tests/ui/` folder
4. Apply the core test script template with environment switching
5. Replace template variables with CSV data

### Phase 3: Project Structure Creation
1. Create organized folder structure
2. Generate utility files in appropriate locations
3. Create data and page object files
4. Generate environment configuration files

### Phase 4: Code Refactoring
1. Extract common utilities to grouped files
2. Organize code for maintainability
3. Follow project's existing coding style
4. Ensure proper separation of concerns
5. Implement proper tag system

## 🚀 Setup & Usage

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Playwright installed in your project

### Quick Start

1. **Install the package**:
   ```bash
   npm install ui-test-gen-mcp
   ```

2. **Configure your MCP client** (e.g., Cursor, VS Code with MCP extension):
   ```json
   {
     "mcpServers": {
       "ui-test-gen-mcp": {
         "command": "npx",
         "args": ["-y", "ui-test-gen-mcp"]
       }
     }
   }
   ```

3. **Alternative configuration** (if using local installation):
   ```json
   {
     "mcpServers": {
       "ui-test-gen-mcp": {
         "command": "node",
         "args": ["./node_modules/ui-test-gen-mcp/dist/main.js"]
       }
     }
   }
   ```

4. **Restart your MCP client** to load the new server

### Development Setup

If you're developing or want to run from source:

```bash
# Start development mode with auto-reload
npm run dev

# Build for production
npm run build

# Start the built server
npm start
```

## 🔌 MCP Configuration Examples

### For Cursor IDE
Add to your Cursor settings:
```json
{
  "mcpServers": {
    "ui-test-gen-mcp": {
      "command": "npx",
      "args": ["-y", "ui-test-gen-mcp"]
    }
  }
}
```

### For VS Code with MCP Extension
Add to your VS Code settings:
```json
{
  "mcp.servers": {
    "ui-test-gen-mcp": {
      "command": "npx",
      "args": ["ui-test-gen-mcp"]
    }
  }
}
```

### For Other MCP Clients
```json
{
  "mcpServers": {
    "ui-test-gen-mcp": {
      "command": "npx",
      "args": ["-y", "ui-test-gen-mcp"]
    }
  }
}
```

## 🧪 Testing

Test the MCP connection:
```bash
# If installed globally
ui-test-gen-mcp

# If installed locally
npx ui-test-gen-mcp

# If running from source
node test-connection.js
```

## 📝 CSV Format Example

### Basic Format
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action
homepage,https://example.com,Homepage hero section,.hero-section,.ad-banner,click
product,https://example.com/product,Product image,.product-image,.cookie-banner,screenshot
```

### **NEW** - With Environment Support
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action,test_env
pdp,https://prep.example.com/product,PDP Full Page,body,.banner,.modal,prep
pdp,https://int.example.com/product,PDP Full Page,body,.banner,.modal,int
pdp,https://qa.example.com/product,PDP Full Page,body,.banner,.modal,qa
```

## 💡 Usage Examples

### Basic Usage
Once configured, you can use the MCP server to:

1. **Generate tests from CSV data**:
   - Call `create_playwright_visual_tests` with your CSV content
   - The server will automatically create test files and folder structure

2. **List available tools**:
   - Call `list_tools` to see what's available

### Example CSV Input
```csv
file_name,test_url,test_description,test_selector,test_hide,test_action,test_env
landing,https://myapp.com,Landing page header,.header-section,.notification-banner,screenshot,prep
dashboard,https://myapp.com/dashboard,Dashboard sidebar,.sidebar-nav,.ads-container,click,int
```

### Generated Output
The server will create:
- `./tests/ui/landing.spec.ts` - **Single test file** for landing page (handles all environments)
- `./tests/ui/dashboard.spec.ts` - **Single test file** for dashboard (handles all environments)
- `./utils/ui/` - Organized utility files including environment config
- `./data/ui/` - Test data files
- `./pages/ui/` - Page object classes

### **NEW** - Environment Switching Example
```typescript
// Generated test file with environment switching
test.describe('Landing - Visual testing', () => {
  test('Landing page header', {
    tag: sectionTags  // Pre-calculated constant, no function call
  }, async ({ page }) => {
    const testData = landingTestData.find(t => 
      t.test_description === 'Landing page header' && 
      t.test_env === getCurrentEnv()
    );
    
    if (!testData) throw new Error('Test data not found');
    
    await page.goto(testData.test_url);
    
    // Hide elements specific to this component
    await hideElements(page, testData.test_hide);
    
    const locator = page.locator(testData.test_selector);
    await locator.scrollIntoViewIfNeeded();
    
    // Clean screenshot path structure
    const fileName = generateFileName(testData.test_description);
    expect(await locator.screenshot()).toMatchSnapshot(`${fileName}/${fileName}.png`);
  });
});
```

## ⚠️ Important Notes

### **Template Compliance**
- The core test script template is **mandatory and non-negotiable**
- Never deviate from the template structure
- Always use exact import statements and test patterns

### **Environment Switching** 🆕
- **Single Test File**: One test file per component handles all environments
- **User Control**: Users manually configure environment selection
- **No Automatic Switching**: `switchEnvironment()` calls are not automatically generated
- **Flexible Implementation**: Users implement `getCurrentEnv()` based on their configuration

### **Tag System** 🆕
- **No Function Calls**: Tags use pre-calculated constants (`fullPageTags`, `sectionTags`)
- **Proper Syntax**: Implements Playwright tag syntax correctly
- **Automatic Selection**: Body selector gets `fullPageTags`, others get `sectionTags`

### **Component Safety**
- Each CSV component maintains its own `test_hide` selectors
- No cross-component selector sharing
- Preserve component-specific configurations during refactoring

### **File Organization**
- Test files must be created in `./tests/ui/` folder
- Utilities must be organized in appropriate grouped files
- Data files and page objects must be separate from `.spec.ts` files

## 🎯 Benefits

- **Rapid Test Creation**: Generate comprehensive test suites from CSV data
- **Consistent Structure**: Enforced template compliance ensures consistency
- **Professional Organization**: Industry-standard folder structure
- **Automatic Configuration**: Playwright config validation and updates
- **Maintainable Code**: Clean, organized, and well-structured test files
- **Project Integration**: Follows existing project coding styles and conventions
- **Easy Installation**: Available as npm package for quick setup
- **Environment Support**: **NEW** - Single test file handles multiple environments
- **Clean Screenshots**: **NEW** - Simple, organized screenshot paths
- **Proper Tags**: **NEW** - No function calls, uses pre-calculated constants

## 🐛 Troubleshooting

### Common Issues
1. **MCP Connection Failed**: Ensure the server is installed and configured correctly
2. **Template Errors**: Verify CSV data follows required format
3. **Configuration Issues**: Check that `playwright.config.ts` exists and is editable
4. **Folder Creation Errors**: Ensure write permissions in the project directory
5. **Environment Issues**: **NEW** - Verify `test_env` column is present in CSV for environment switching

### Debug Steps
1. Verify installation: `npm list ui-test-gen-mcp`
2. Test MCP connection: `npx ui-test-gen-mcp`
3. Check console logs for error messages
4. Verify CSV data format and content
5. Ensure project structure is properly set up
6. Check for environment column in CSV data

## 📚 Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Playwright Testing Framework](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [npm Package Page](https://www.npmjs.com/package/ui-test-gen-mcp)

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns and style
- Tests are updated for new features
- Documentation is kept current

## 📄 License

ISC License - see package.json for details

---

**Note**: This MCP server is designed for generating Playwright visual testing scripts with environment switching capabilities. Ensure you have Playwright properly configured in your project before using the generated tests.

**Package**: Available on [npm](https://www.npmjs.com/package/ui-test-gen-mcp) as `ui-test-gen-mcp`

**Recent Updates**: 
- ✅ Environment switching capabilities
- ✅ Improved screenshot path structure  
- ✅ Enhanced tag system (no function calls)
- ✅ Single test file per component
- ✅ User-controlled environment configuration
