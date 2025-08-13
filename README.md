# SnapUI MCP Server

A Model Context Protocol (MCP) server that generates visual testing scripts from CSV data with natural language support.

## ⚠️ CRITICAL REQUIREMENT

**The core-test-script template MUST be strictly followed when generating test files. This template is mandatory and non-negotiable.**

## Features

- **Natural Language Triggers**: Tools are automatically triggered by conversational requests
- **Multiple Tool Variants**: Different tools for various ways of asking for the same functionality
- **CSV Processing**: Automatically processes CSV files containing test specifications
- **Intelligent Recognition**: Recognizes requests without explicit tool names
- **Template Compliance**: Strict adherence to the embedded core test script template
- **Universal Access**: Template is embedded in the MCP server for access from any project

## Available Tools

### 1. `generate_visual_test_scripts`
**Triggers**: "generate UI test scripts", "create automated tests", "process CSV test data"
- Main tool for generating comprehensive visual testing scripts

### 2. `create_ui_tests`
**Triggers**: "create tests", "build test scripts", "generate automated UI testing"
- Alternative tool for creating UI test scripts

## Natural Language Examples

These prompts will automatically trigger the appropriate tool:

✅ **"generate ui test scripts using @ui-test-data.csv"**
✅ **"create UI tests from this CSV data"**
✅ **"process this CSV file to generate test scripts"**
✅ **"build automated tests using the CSV"**
✅ **"convert CSV data to UI test scripts"**

## Template Compliance

All generated test files MUST strictly follow the embedded core-test-script template:

- **Exact Structure**: Never deviate from the template structure
- **Import Statements**: Always use the exact import statements
- **Test Structure**: Always use the exact test.describe and test structure
- **Implementation Patterns**: Always follow the exact implementation patterns
- **File Naming**: Use the exact file naming convention from CSV

The template is embedded directly in the MCP server, so it's always available regardless of project context.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Start the MCP server:
```bash
npm start
```

## Development

For development with auto-reload:
```bash
npm run dev
```

## Usage

The MCP server automatically recognizes when you need to generate UI test scripts and will:

- Accept CSV data as input (drag & drop, file reference, or copy-paste)
- Generate visual testing scripts based on the CSV content
- Create test files in the `./tests/ui` folder
- Follow the CSV structure for test generation
- **Strictly adhere to the embedded core-test-script template**

## CSV Format Expected

The CSV should contain columns like:
- `file_name`: Name for the generated test file
- `test_url`: URL to test
- `test_description`: Description of what to test
- `test_selector`: CSS selector for the element
- `test_hide`: Elements to hide during testing
- `test_action`: Action to perform (optional)

## MCP Configuration

To use this MCP server, add it to your MCP client configuration:

```json
{
  "mcpServers": {
    "snap-mcp": {
      "command": "node",
      "args": ["/path/to/snap-mcp/dist/main.js"]
    }
  }
}
```

## How It Works

1. **Natural Language Recognition**: The AI model recognizes your intent from conversational prompts
2. **Automatic Tool Selection**: The appropriate tool is automatically selected based on your request
3. **CSV Processing**: CSV data is processed to extract test specifications
4. **Template Compliance**: Test files are generated strictly following the embedded core-test-script template
5. **File Creation**: Test files are created in the appropriate directory structure

## Template Access

- **Embedded Template**: The core-test-script template is embedded directly in the MCP server
- **Always Available**: Template is accessible from any project context
- **No File Dependencies**: No need to reference external template files
- **Consistent Access**: Same template available regardless of project location

## Troubleshooting

If the MCP tools aren't being triggered:
1. Make sure the MCP server is running
2. Restart Cursor after updating MCP configuration
3. Try different natural language variations
4. Ensure CSV data is accessible
5. Check that the MCP client is properly configured

## Benefits

- **No Tool Names Needed**: Just ask naturally what you want
- **Multiple Trigger Patterns**: Various ways to request the same functionality
- **Automatic Recognition**: AI understands your intent automatically
- **Seamless Integration**: Works with your existing workflow
- **Template Compliance**: Ensures consistent, reliable test file generation
- **Universal Access**: Template available from any project context
