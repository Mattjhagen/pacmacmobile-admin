import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export interface GitHubMCPConfig {
  token: string;
  owner: string;
  repo: string;
}

export interface GitHubMCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class GitHubMCPClient extends EventEmitter {
  private config: GitHubMCPConfig;
  private process: any = null;

  constructor(config: GitHubMCPConfig) {
    super();
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      // Start the GitHub MCP server process
      this.process = spawn('npx', ['-y', '@modelcontextprotocol/server-github'], {
        env: {
          ...process.env,
          GITHUB_PERSONAL_ACCESS_TOKEN: this.config.token
        },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.stdout.on('data', (data: Buffer) => {
        const message = data.toString();
        console.log('GitHub MCP Server:', message);
        this.emit('message', message);
      });

      this.process.stderr.on('data', (data: Buffer) => {
        const error = data.toString();
        console.error('GitHub MCP Server Error:', error);
        this.emit('error', error);
      });

      this.process.on('close', (code: number) => {
        console.log(`GitHub MCP Server process exited with code ${code}`);
        this.emit('close', code);
      });

      // Wait a moment for the server to start
      await new Promise(resolve => setTimeout(resolve, 2000));

      return true;
    } catch (error) {
      console.error('Failed to start GitHub MCP server:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  async sendRequest(method: string, params: any = {}): Promise<GitHubMCPResponse> {
    return new Promise((resolve) => {
      if (!this.process) {
        resolve({ success: false, error: 'MCP server not connected' });
        return;
      }

      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params: {
          ...params,
          owner: this.config.owner,
          repo: this.config.repo
        }
      };

      // Send request to MCP server
      this.process.stdin.write(JSON.stringify(request) + '\n');

      // Listen for response (simplified - in real implementation you'd need proper JSON-RPC handling)
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Request timeout' });
      }, 10000);

      const onResponse = (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.id === request.id) {
            clearTimeout(timeout);
            this.process.stdout.off('data', onResponse);
            resolve({ success: true, data: response.result });
          }
        } catch (error) {
          // Continue listening for valid response
        }
      };

      this.process.stdout.on('data', onResponse);
    });
  }

  // Convenience methods for common GitHub operations
  async getRepository(): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/get_repository');
  }

  async listIssues(): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/list_issues');
  }

  async createIssue(title: string, body: string): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/create_issue', { title, body });
  }

  async listPullRequests(): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/list_pull_requests');
  }

  async getFileContent(path: string): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/get_file_content', { path });
  }

  async updateFile(path: string, content: string, message: string): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/update_file', { path, content, message });
  }

  async createPullRequest(title: string, body: string, head: string, base: string = 'main'): Promise<GitHubMCPResponse> {
    return this.sendRequest('github/create_pull_request', { title, body, head, base });
  }
}

// Singleton instance
let githubMCPClient: GitHubMCPClient | null = null;

export function getGitHubMCPClient(): GitHubMCPClient | null {
  return githubMCPClient;
}

export async function initializeGitHubMCP(config: GitHubMCPConfig): Promise<GitHubMCPClient> {
  if (githubMCPClient) {
    await githubMCPClient.disconnect();
  }

  githubMCPClient = new GitHubMCPClient(config);
  const connected = await githubMCPClient.connect();
  
  if (!connected) {
    throw new Error('Failed to connect to GitHub MCP server');
  }

  return githubMCPClient;
}
