import { NextRequest, NextResponse } from 'next/server';
import { initializeGitHubMCP, getGitHubMCPClient, GitHubMCPConfig } from '@/lib/github-mcp';

// POST /api/github-mcp - Initialize GitHub MCP connection
export async function POST(request: NextRequest) {
  try {
    const { action, config, method, params } = await request.json();

    if (action === 'connect') {
      if (!config?.token || !config?.owner || !config?.repo) {
        return NextResponse.json(
          { error: 'Missing required config: token, owner, repo' },
          { status: 400 }
        );
      }

      const mcpConfig: GitHubMCPConfig = {
        token: config.token,
        owner: config.owner,
        repo: config.repo
      };

      const client = await initializeGitHubMCP(mcpConfig);
      
      return NextResponse.json({
        success: true,
        message: 'GitHub MCP client connected successfully',
        config: {
          owner: config.owner,
          repo: config.repo
        }
      });
    }

    if (action === 'disconnect') {
      const client = getGitHubMCPClient();
      if (client) {
        await client.disconnect();
        return NextResponse.json({
          success: true,
          message: 'GitHub MCP client disconnected'
        });
      }
      return NextResponse.json({
        success: true,
        message: 'No active connection to disconnect'
      });
    }

    if (action === 'request') {
      const client = getGitHubMCPClient();
      if (!client) {
        return NextResponse.json(
          { error: 'GitHub MCP client not connected. Please connect first.' },
          { status: 400 }
        );
      }

      if (!method) {
        return NextResponse.json(
          { error: 'Method is required for request action' },
          { status: 400 }
        );
      }

      const response = await client.sendRequest(method, params || {});
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: connect, disconnect, request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('GitHub MCP API error:', error);
    return NextResponse.json(
      { 
        error: 'GitHub MCP operation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/github-mcp - Get connection status
export async function GET() {
  try {
    const client = getGitHubMCPClient();
    
    if (!client) {
      return NextResponse.json({
        connected: false,
        message: 'No active GitHub MCP connection'
      });
    }

    // Test the connection by getting repository info
    const testResponse = await client.getRepository();
    
    return NextResponse.json({
      connected: testResponse.success,
      message: testResponse.success ? 'GitHub MCP connection active' : 'Connection test failed',
      error: testResponse.error,
      data: testResponse.data
    });

  } catch (error) {
    console.error('GitHub MCP status check error:', error);
    return NextResponse.json(
      { 
        connected: false,
        error: 'Failed to check GitHub MCP status', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
