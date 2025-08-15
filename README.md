# UI Test Gen MCP Server

A Model Context Protocol (MCP) server that generates Playwright visual testing scripts from CSV data with advanced configuration management and organized code structure.

## 🚀 Overview

This MCP server provides automated generation of Playwright visual testing scripts, helping developers quickly create comprehensive UI test suites from CSV test specifications. It includes automatic Playwright configuration validation, organized folder structure creation, and intelligent code generation following best practices.

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
- **Smart Code Organization**: Extracts utilities and organizes code during refactoring phase
- **Project Style Integration**: Analyzes existing code to match project's coding conventions

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

### 2. Tool Lister (`list_tools`)
**Purpose**: Display all available tools with simple descriptions

**Usage**: Call this tool to see what's available in the MCP server

## 🔧 Key Features

### **Playwright Configuration Management**
- Automatically validates `playwright.config.ts` files
- Ensures `snapshotDir` is set to `"./screenshots"`
- Updates configuration if missing or incorrect (only modifies snapshotDir)

### **Organized Project Structure**
- `./tests/ui/` - Generated test files
- `./utils/ui/` - Utility functions organized by type:
  - `selectors.ts` - Reusable selectors and constants
  - `helpers.ts` - Common helper functions
  - `test-actions.ts` - Generated test action functions
  - `page-objects.ts` - Page object model patterns
  - `validation.ts` - Validation and error handling
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

## 📋 Workflow

### Phase 1: Configuration Validation
1. Locate `playwright.config.ts` files in the project
2. Verify `snapshotDir` is set to `"./screenshots"`
3. Update configuration if necessary

### Phase 2: Test File Generation
1. Parse CSV data for test specifications
2. Create test files in `./tests/ui/` folder
3. Apply the core test script template
4. Replace template variables with CSV data

### Phase 3: Project Structure Creation
1. Create organized folder structure
2. Generate utility files in appropriate locations
3. Create data and page object files

### Phase 4: Code Refactoring
1. Extract common utilities to grouped files
2. Organize code for maintainability
3. Follow project's existing coding style
4. Ensure proper separation of concerns

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ui-test-gen-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

### Development
```bash
# Start development mode with auto-reload
npm run dev

# Build for production
npm run build

# Start the built server
npm start
```

## 🔌 MCP Configuration

To use this MCP server, add it to your MCP client configuration:

```json
{
  "mcpServers": {
    "ui-test-gen-mcp": {
      "command": "node",
      "args": ["/path/to/ui-test-gen-mcp/dist/main.js"]
    }
  }
}
```

## 🧪 Testing

Test the MCP connection:
```bash
node test-connection.js
```

## 📝 CSV Format Example

```csv
file_name,test_url,test_description,test_selector,test_hide,test_action
homepage,https://example.com,Homepage hero section,.hero-section,.ad-banner,click
product,https://example.com/product,Product image,.product-image,.cookie-banner,screenshot
```

## ⚠️ Important Notes

### **Template Compliance**
- The core test script template is **mandatory and non-negotiable**
- Never deviate from the template structure
- Always use exact import statements and test patterns

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

## 🐛 Troubleshooting

### Common Issues
1. **MCP Connection Failed**: Ensure the server is built and running
2. **Template Errors**: Verify CSV data follows required format
3. **Configuration Issues**: Check that `playwright.config.ts` exists and is editable
4. **Folder Creation Errors**: Ensure write permissions in the project directory

### Debug Steps
1. Run `node test-connection.js` to verify MCP server
2. Check console logs for error messages
3. Verify CSV data format and content
4. Ensure project structure is properly set up

## 📚 Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Playwright Testing Framework](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns and style
- Tests are updated for new features
- Documentation is kept current

## 📄 License

ISC License - see package.json for details

---

**Note**: This MCP server is designed for generating Playwright visual testing scripts. Ensure you have Playwright properly configured in your project before using the generated tests.
