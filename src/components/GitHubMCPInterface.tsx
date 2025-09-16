'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  CodeBracketIcon,
  CloudIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface GitHubMCPConfig {
  token: string;
  owner: string;
  repo: string;
}

interface ConnectionStatus {
  connected: boolean;
  message: string;
  error?: string;
  data?: any;
}

interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default function GitHubMCPInterface() {
  const [config, setConfig] = useState<GitHubMCPConfig>({
    token: '',
    owner: '',
    repo: ''
  });
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Not connected'
  });
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MCPResponse | null>(null);
  const [customMethod, setCustomMethod] = useState('');
  const [customParams, setCustomParams] = useState('');

  // Check connection status on component mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const res = await fetch('/api/github-mcp');
      const status = await res.json();
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus({
        connected: false,
        message: 'Failed to check connection status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleConnect = async () => {
    if (!config.token || !config.owner || !config.repo) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/github-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect',
          config
        })
      });

      const result = await res.json();
      
      if (result.success) {
        setConnectionStatus({
          connected: true,
          message: 'Connected successfully'
        });
        setResponse(result);
      } else {
        setConnectionStatus({
          connected: false,
          message: 'Connection failed',
          error: result.error
        });
        setResponse(result);
      }
    } catch (error) {
      setConnectionStatus({
        connected: false,
        message: 'Connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' })
      });

      const result = await res.json();
      setConnectionStatus({
        connected: false,
        message: 'Disconnected'
      });
      setResponse(result);
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (method: string, params: any = {}) => {
    setLoading(true);
    try {
      const res = await fetch('/api/github-mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          method,
          params
        })
      });

      const result = await res.json();
      setResponse(result);
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomRequest = async () => {
    if (!customMethod) {
      alert('Please enter a method name');
      return;
    }

    let params = {};
    if (customParams.trim()) {
      try {
        params = JSON.parse(customParams);
      } catch (error) {
        alert('Invalid JSON in parameters field');
        return;
      }
    }

    await handleQuickAction(customMethod, params);
  };

  const quickActions = [
    { method: 'github/get_repository', label: 'Get Repository Info', icon: CloudIcon },
    { method: 'github/list_issues', label: 'List Issues', icon: DocumentTextIcon },
    { method: 'github/list_pull_requests', label: 'List Pull Requests', icon: CodeBracketIcon },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">GitHub MCP Server</h2>
        <p className="text-gray-600">Connect to GitHub using the Model Context Protocol (MCP) server</p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          {connectionStatus.connected ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-500" />
          )}
          <span className="font-medium">
            {connectionStatus.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <p className="text-sm text-gray-600">{connectionStatus.message}</p>
        {connectionStatus.error && (
          <p className="text-sm text-red-600 mt-1">{connectionStatus.error}</p>
        )}
      </div>

      {/* Configuration Form */}
      <div className="mb-6 p-4 rounded-lg border bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Token
            </label>
            <input
              type="password"
              value={config.token}
              onChange={(e) => setConfig({ ...config, token: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <input
              type="text"
              value={config.owner}
              onChange={(e) => setConfig({ ...config, owner: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository
            </label>
            <input
              type="text"
              value={config.repo}
              onChange={(e) => setConfig({ ...config, repo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="repository-name"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
          <button
            onClick={handleDisconnect}
            disabled={loading || !connectionStatus.connected}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            Disconnect
          </button>
          <button
            onClick={checkConnectionStatus}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Check Status
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {connectionStatus.connected && (
        <div className="mb-6 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.method)}
                  disabled={loading}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Request */}
      {connectionStatus.connected && (
        <div className="mb-6 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Custom Request</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <input
                type="text"
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="github/get_repository"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parameters (JSON)
              </label>
              <textarea
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder='{"path": "README.md"}'
              />
            </div>
            <button
              onClick={handleCustomRequest}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Send Request
            </button>
          </div>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Response</h3>
          <div className="flex items-center gap-2 mb-2">
            {response.success ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">
              {response.success ? 'Success' : 'Error'}
            </span>
          </div>
          <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Create a GitHub Personal Access Token with appropriate permissions</li>
          <li>Enter your GitHub username in the Owner field</li>
          <li>Enter the repository name in the Repository field</li>
          <li>Click Connect to establish the MCP connection</li>
          <li>Use Quick Actions or Custom Request to interact with GitHub</li>
        </ol>
      </div>
    </div>
  );
}
