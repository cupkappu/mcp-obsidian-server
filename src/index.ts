#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { ObsidianAPIClient } from './client.js';
import { Config, ConfigSchema } from './types.js';

class ObsidianMCPServer {
  private server: Server;
  private client: ObsidianAPIClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'obsidian-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error: unknown) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private getConfig(): Config {
    const config = {
      apiKey: process.env.OBSIDIAN_API_KEY || '',
      host: process.env.OBSIDIAN_HOST || '127.0.0.1',
      port: parseInt(process.env.OBSIDIAN_PORT || '27124'),
      secure: process.env.OBSIDIAN_SECURE !== 'false',
    };

    try {
      return ConfigSchema.parse(config);
    } catch (error) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private ensureClient(): ObsidianAPIClient {
    if (!this.client) {
      const config = this.getConfig();
      this.client = new ObsidianAPIClient(config);
    }
    return this.client;
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // System tools
          {
            name: 'get_server_info',
            description: 'Get Obsidian server information and authentication status',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },

          // Active file tools
          {
            name: 'get_active_file',
            description: 'Get the content of the currently active file in Obsidian',
            inputSchema: {
              type: 'object',
              properties: {
                asJson: {
                  type: 'boolean',
                  description: 'Return structured JSON with metadata instead of raw markdown',
                  default: false,
                },
              },
            },
          },
          {
            name: 'update_active_file',
            description: 'Replace the content of the currently active file',
            inputSchema: {
              type: 'object',
              properties: {
                content: {
                  type: 'string',
                  description: 'New content for the file',
                },
              },
              required: ['content'],
            },
          },
          {
            name: 'append_to_active_file',
            description: 'Append content to the currently active file',
            inputSchema: {
              type: 'object',
              properties: {
                content: {
                  type: 'string',
                  description: 'Content to append',
                },
              },
              required: ['content'],
            },
          },

          // File operations
          {
            name: 'get_file',
            description: 'Get the content of a specific file in the vault',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Path to the file relative to vault root',
                },
                asJson: {
                  type: 'boolean',
                  description: 'Return structured JSON with metadata instead of raw markdown',
                  default: false,
                },
              },
              required: ['filename'],
            },
          },
          {
            name: 'create_or_update_file',
            description: 'Create a new file or update an existing one',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Path to the file relative to vault root',
                },
                content: {
                  type: 'string',
                  description: 'File content',
                },
              },
              required: ['filename', 'content'],
            },
          },
          {
            name: 'append_to_file',
            description: 'Append content to a file (creates file if it does not exist)',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Path to the file relative to vault root',
                },
                content: {
                  type: 'string',
                  description: 'Content to append',
                },
              },
              required: ['filename', 'content'],
            },
          },
          {
            name: 'delete_file',
            description: 'Delete a file from the vault',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Path to the file relative to vault root',
                },
              },
              required: ['filename'],
            },
          },

          // Directory operations
          {
            name: 'list_directory',
            description: 'List files and folders in a directory',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Directory path relative to vault root (empty for root)',
                  default: '',
                },
              },
            },
          },

          // Search operations
          {
            name: 'search_simple',
            description: 'Perform a simple text search across the vault',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                contextLength: {
                  type: 'number',
                  description: 'Amount of context to return around matches',
                  default: 100,
                },
              },
              required: ['query'],
            },
          },

          // Command operations
          {
            name: 'get_commands',
            description: 'Get a list of available Obsidian commands',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'execute_command',
            description: 'Execute an Obsidian command',
            inputSchema: {
              type: 'object',
              properties: {
                commandId: {
                  type: 'string',
                  description: 'ID of the command to execute',
                },
              },
              required: ['commandId'],
            },
          },

          // File opening
          {
            name: 'open_file',
            description: 'Open a file in the Obsidian interface',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Path to the file relative to vault root',
                },
                newLeaf: {
                  type: 'boolean',
                  description: 'Open in a new leaf/tab',
                  default: false,
                },
              },
              required: ['filename'],
            },
          },

          // Periodic notes
          {
            name: 'get_periodic_note',
            description: 'Get current periodic note for the specified period',
            inputSchema: {
              type: 'object',
              properties: {
                period: {
                  type: 'string',
                  enum: ['daily', 'weekly', 'monthly', 'yearly'],
                  description: 'Period type',
                },
                asJson: {
                  type: 'boolean',
                  description: 'Return structured JSON with metadata',
                  default: false,
                },
              },
              required: ['period'],
            },
          },
          {
            name: 'append_to_periodic_note',
            description: 'Append content to current periodic note',
            inputSchema: {
              type: 'object',
              properties: {
                period: {
                  type: 'string',
                  enum: ['daily', 'weekly', 'monthly', 'yearly'],
                  description: 'Period type',
                },
                content: {
                  type: 'string',
                  description: 'Content to append',
                },
              },
              required: ['period', 'content'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      const client = this.ensureClient();

      try {
        switch (name) {
          // System tools
          case 'get_server_info': {
            const info = await client.getServerInfo();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(info, null, 2),
                },
              ],
            };
          }

          // Active file tools
          case 'get_active_file': {
            const content = await client.getActiveFile(args?.asJson || false);
            return {
              content: [
                {
                  type: 'text',
                  text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
                },
              ],
            };
          }

          case 'update_active_file': {
            if (!args?.content) throw new McpError(ErrorCode.InvalidParams, 'Content is required');
            await client.updateActiveFile(args.content);
            return {
              content: [
                {
                  type: 'text',
                  text: 'Active file updated successfully',
                },
              ],
            };
          }

          case 'append_to_active_file': {
            if (!args?.content) throw new McpError(ErrorCode.InvalidParams, 'Content is required');
            await client.appendToActiveFile(args.content);
            return {
              content: [
                {
                  type: 'text',
                  text: 'Content appended to active file successfully',
                },
              ],
            };
          }

          // File operations
          case 'get_file': {
            if (!args?.filename) throw new McpError(ErrorCode.InvalidParams, 'Filename is required');
            const content = await client.getFile(args.filename, args?.asJson || false);
            return {
              content: [
                {
                  type: 'text',
                  text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
                },
              ],
            };
          }

          case 'create_or_update_file': {
            if (!args?.filename) throw new McpError(ErrorCode.InvalidParams, 'Filename is required');
            if (!args?.content) throw new McpError(ErrorCode.InvalidParams, 'Content is required');
            await client.createOrUpdateFile(args.filename, args.content);
            return {
              content: [
                {
                  type: 'text',
                  text: `File '${args.filename}' created/updated successfully`,
                },
              ],
            };
          }

          case 'append_to_file': {
            if (!args?.filename) throw new McpError(ErrorCode.InvalidParams, 'Filename is required');
            if (!args?.content) throw new McpError(ErrorCode.InvalidParams, 'Content is required');
            await client.appendToFile(args.filename, args.content);
            return {
              content: [
                {
                  type: 'text',
                  text: `Content appended to '${args.filename}' successfully`,
                },
              ],
            };
          }

          case 'delete_file': {
            if (!args?.filename) throw new McpError(ErrorCode.InvalidParams, 'Filename is required');
            await client.deleteFile(args.filename);
            return {
              content: [
                {
                  type: 'text',
                  text: `File '${args.filename}' deleted successfully`,
                },
              ],
            };
          }

          // Directory operations
          case 'list_directory': {
            const files = await client.listDirectory(args?.path || '');
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(files, null, 2),
                },
              ],
            };
          }

          // Search operations
          case 'search_simple': {
            if (!args?.query) throw new McpError(ErrorCode.InvalidParams, 'Query is required');
            const results = await client.searchSimple(args.query, args?.contextLength || 100);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          // Command operations
          case 'get_commands': {
            const commands = await client.getCommands();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(commands, null, 2),
                },
              ],
            };
          }

          case 'execute_command': {
            if (!args?.commandId) throw new McpError(ErrorCode.InvalidParams, 'Command ID is required');
            await client.executeCommand(args.commandId);
            return {
              content: [
                {
                  type: 'text',
                  text: `Command '${args.commandId}' executed successfully`,
                },
              ],
            };
          }

          // File opening
          case 'open_file': {
            if (!args?.filename) throw new McpError(ErrorCode.InvalidParams, 'Filename is required');
            await client.openFile(args.filename, args?.newLeaf || false);
            return {
              content: [
                {
                  type: 'text',
                  text: `File '${args.filename}' opened successfully`,
                },
              ],
            };
          }

          // Periodic notes
          case 'get_periodic_note': {
            if (!args?.period) throw new McpError(ErrorCode.InvalidParams, 'Period is required');
            const content = await client.getPeriodicNote(args.period as any, args?.asJson || false);
            return {
              content: [
                {
                  type: 'text',
                  text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
                },
              ],
            };
          }

          case 'append_to_periodic_note': {
            if (!args?.period) throw new McpError(ErrorCode.InvalidParams, 'Period is required');
            if (!args?.content) throw new McpError(ErrorCode.InvalidParams, 'Content is required');
            await client.appendToPeriodicNote(args.period as any, args.content);
            return {
              content: [
                {
                  type: 'text',
                  text: `Content appended to ${args.period} note successfully`,
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${message}`);
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Obsidian MCP server running on stdio');
  }
}

const server = new ObsidianMCPServer();
server.run().catch(console.error);
