#!/usr/bin/env node

/**
 * Test script for GitHub MCP connection
 * Run with: node test-github-mcp.js
 */

const https = require('https');

// Test configuration
const config = {
  token: process.env.GITHUB_TOKEN || 'your_token_here',
  owner: process.env.GITHUB_OWNER || 'Mattjhagen',
  repo: process.env.GITHUB_REPO || 'New-PacMac'
};

async function testGitHubConnection() {
  console.log('🔍 Testing GitHub MCP Connection...\n');
  
  if (config.token === 'your_token_here') {
    console.log('❌ Please set GITHUB_TOKEN environment variable');
    console.log('   Example: GITHUB_TOKEN=ghp_xxx node test-github-mcp.js');
    return;
  }

  try {
    // Test 1: Repository access
    console.log('📋 Test 1: Repository Access');
    const repoResponse = await makeGitHubRequest(`/repos/${config.owner}/${config.repo}`);
    
    if (repoResponse.status === 200) {
      const repoData = JSON.parse(repoResponse.data);
      console.log(`✅ Repository found: ${repoData.full_name}`);
      console.log(`   Description: ${repoData.description || 'No description'}`);
      console.log(`   Private: ${repoData.private ? 'Yes' : 'No'}`);
      console.log(`   Default branch: ${repoData.default_branch}`);
    } else {
      console.log(`❌ Repository access failed: ${repoResponse.status}`);
      return;
    }

    // Test 2: File access
    console.log('\n📄 Test 2: File Access');
    const fileResponse = await makeGitHubRequest(`/repos/${config.owner}/${config.repo}/contents/index.html`);
    
    if (fileResponse.status === 200) {
      const fileData = JSON.parse(fileResponse.data);
      console.log(`✅ File access successful: ${fileData.name}`);
      console.log(`   Size: ${fileData.size} bytes`);
      console.log(`   SHA: ${fileData.sha.substring(0, 8)}...`);
    } else {
      console.log(`❌ File access failed: ${fileResponse.status}`);
    }

    // Test 3: Issues access
    console.log('\n🎫 Test 3: Issues Access');
    const issuesResponse = await makeGitHubRequest(`/repos/${config.owner}/${config.repo}/issues?state=all&per_page=5`);
    
    if (issuesResponse.status === 200) {
      const issuesData = JSON.parse(issuesResponse.data);
      console.log(`✅ Issues access successful: ${issuesData.length} issues found`);
      if (issuesData.length > 0) {
        console.log(`   Latest issue: "${issuesData[0].title}"`);
      }
    } else {
      console.log(`❌ Issues access failed: ${issuesResponse.status}`);
    }

    console.log('\n🎉 GitHub MCP Connection Test Complete!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Start your Next.js app: npm run dev');
    console.log('   2. Open the admin panel');
    console.log('   3. Click "GitHub MCP" button');
    console.log('   4. Enter your credentials and connect');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

function makeGitHubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PacMac-Admin-MCP-Test'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Run the test
testGitHubConnection();
