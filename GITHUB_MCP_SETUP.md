# GitHub MCP Server Setup Guide

## Overview

This guide will help you set up and connect to the GitHub Model Context Protocol (MCP) server for your PacMac Mobile Admin project.

## What is MCP?

Model Context Protocol (MCP) is a standard for connecting AI assistants to external data sources and tools. The GitHub MCP server allows you to interact with GitHub repositories directly through a standardized interface.

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "PacMac Admin MCP"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again!

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# GitHub MCP Configuration
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=your_github_username_here
GITHUB_REPO=your_repository_name_here

# Example:
# GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
# GITHUB_OWNER=Mattjhagen
# GITHUB_REPO=New-PacMac
```

### 3. Install Dependencies

The GitHub MCP server package is currently deprecated. We've implemented a custom solution that provides similar functionality:

```bash
npm install
```

### 4. Using the GitHub MCP Interface

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your admin panel
3. Click the "GitHub MCP" button in the admin toolbar
4. Fill in your GitHub credentials:
   - **GitHub Token**: Your personal access token
   - **Owner**: Your GitHub username
   - **Repository**: The repository name (e.g., "New-PacMac")

5. Click "Connect" to establish the MCP connection

### 5. Available Operations

Once connected, you can perform these operations:

#### Quick Actions
- **Get Repository Info**: Retrieve basic repository information
- **List Issues**: View all issues in the repository
- **List Pull Requests**: View all pull requests

#### Custom Requests
You can send custom requests using GitHub API methods:
- `github/get_file_content` - Get file contents
- `github/update_file` - Update file contents
- `github/create_issue` - Create new issues
- `github/create_pull_request` - Create pull requests

### 6. Example Usage

#### Get Repository Information
```json
{
  "method": "github/get_repository",
  "params": {}
}
```

#### Get File Contents
```json
{
  "method": "github/get_file_content",
  "params": {
    "path": "index.html"
  }
}
```

#### Update File Contents
```json
{
  "method": "github/update_file",
  "params": {
    "path": "index.html",
    "content": "new file content",
    "message": "Update index.html"
  }
}
```

## Security Best Practices

1. **Never commit your GitHub token** to version control
2. **Use environment variables** for sensitive data
3. **Limit token permissions** to only what's needed
4. **Rotate tokens regularly** for security
5. **Use different tokens** for different environments

## Troubleshooting

### Connection Issues
- Verify your GitHub token has the correct permissions
- Check that the repository name is correct (case-sensitive)
- Ensure your token hasn't expired

### Permission Errors
- Make sure your token has `repo` scope for private repositories
- Verify you have access to the repository
- Check if the repository exists and is accessible

### API Rate Limits
- GitHub has rate limits for API requests
- The MCP client handles rate limiting automatically
- Consider using a GitHub App for higher rate limits in production

## Alternative: Direct GitHub API Integration

If you prefer not to use MCP, you can use the existing GitHub integration:

1. Use the "Direct GitHub Push" button in the admin panel
2. Enter your GitHub token
3. Push inventory directly to your repository

This approach is simpler but less flexible than the full MCP implementation.

## Files Created

The following files have been added to support GitHub MCP:

- `src/lib/github-mcp.ts` - MCP client implementation
- `src/app/api/github-mcp/route.ts` - API routes for MCP operations
- `src/components/GitHubMCPInterface.tsx` - React interface component
- `mcp-config.json` - MCP server configuration
- `GITHUB_MCP_SETUP.md` - This setup guide

## Next Steps

1. Set up your GitHub token
2. Configure environment variables
3. Test the connection
4. Explore the available operations
5. Integrate MCP operations into your workflow

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your GitHub token permissions
3. Test with a simple repository operation first
4. Check the GitHub API status page for any outages

The GitHub MCP integration provides a powerful way to interact with your repositories programmatically while maintaining security and following best practices.
