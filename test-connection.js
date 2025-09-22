#!/usr/bin/env node

import { ObsidianAPIClient } from './build/client.js';

// Simple test to verify the Obsidian API connection
async function testConnection() {
  const config = {
    apiKey: process.env.OBSIDIAN_API_KEY || '',
    host: process.env.OBSIDIAN_HOST || '127.0.0.1',
    port: parseInt(process.env.OBSIDIAN_PORT || '27124'),
    secure: process.env.OBSIDIAN_SECURE !== 'false',
  };

  if (!config.apiKey) {
    console.error('Error: OBSIDIAN_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('Testing Obsidian API connection...');
  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Secure: ${config.secure}`);
  console.log(`  API Key: ${config.apiKey.substring(0, 8)}...`);
  console.log('');

  try {
    const client = new ObsidianAPIClient(config);
    
    // Test basic connection
    console.log('1. Testing server info...');
    const info = await client.getServerInfo();
    console.log('✅ Server info retrieved successfully');
    console.log('Server response:', JSON.stringify(info, null, 2));
    console.log('');

    // Test getting commands
    console.log('2. Testing commands list...');
    const commands = await client.getCommands();
    console.log(`✅ Retrieved ${commands.length} commands`);
    console.log('');

    // Test directory listing
    console.log('3. Testing directory listing...');
    const files = await client.listDirectory('');
    console.log(`✅ Found ${files.length} items in root directory`);
    if (files.length > 0) {
      console.log('First few items:', files.slice(0, 3));
    }
    console.log('');

    console.log('🎉 All tests passed! Obsidian MCP Server is ready to use.');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    if (error instanceof Error) {
      console.error('Error:', error.message);
      if (error.message.includes('ECONNREFUSED')) {
        console.error('');
        console.error('Troubleshooting tips:');
        console.error('1. Make sure Obsidian is running');
        console.error('2. Make sure Local REST API plugin is enabled');
        console.error('3. Check that the host and port are correct');
      } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
        console.error('');
        console.error('SSL/Certificate issue detected. Try setting OBSIDIAN_SECURE=false');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        console.error('');
        console.error('Authentication failed. Check your API key.');
      }
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

testConnection();
