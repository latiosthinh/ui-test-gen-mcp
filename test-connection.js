import { spawn } from 'child_process';

// Test MCP server connection from different locations
async function testMCPConnection() {
    console.log('Testing MCP Server Connection...');
    
    // Test with absolute path
    const mcpProcess = spawn('node', ['C:/Projects/AI/cursor-planning-agent/snap-mcp/dist/main.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd() // Use current working directory
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
        console.log('✅ MCP Server Response:', data.toString());
    });
    
    mcpProcess.stderr.on('data', (data) => {
        console.error('❌ MCP Error:', data.toString());
    });
    
    mcpProcess.on('error', (error) => {
        console.error('❌ Process Error:', error.message);
    });
    
    // Wait a bit then close
    setTimeout(() => {
        mcpProcess.kill();
        console.log('Test completed');
    }, 3000);
}

testMCPConnection().catch(console.error);
