import { spawn } from 'child_process';
import { readFileSync } from 'fs';

// Test the MCP server
async function testMCPServer() {
    console.log('Testing MCP Server...');
    
    const mcpProcess = spawn('node', ['dist/main.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Send a test request
    const testRequest = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {}
    };
    
    mcpProcess.stdin.write(JSON.stringify(testRequest) + '\n');
    
    mcpProcess.stdout.on('data', (data) => {
        console.log('MCP Response:', data.toString());
    });
    
    mcpProcess.stderr.on('data', (data) => {
        console.error('MCP Error:', data.toString());
    });
    
    // Wait a bit then close
    setTimeout(() => {
        mcpProcess.kill();
        console.log('Test completed');
    }, 2000);
}

testMCPServer().catch(console.error);
