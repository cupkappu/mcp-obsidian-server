import axios, { AxiosInstance } from 'axios';
import https from 'https';
import { Config, NoteJson, FileListItem, SearchResult, Command } from './types.js';

export class ObsidianAPIClient {
  private client: AxiosInstance;
  private config: Config;

  /**
   * 自定义路径编码函数，只编码真正必要的字符
   * 保留 @ 符号和其他常用符号不被编码
   */
  private encodePathComponent(str: string): string {
    // 只编码真正需要编码的字符：空格、路径分隔符、查询参数分隔符等
    return str.replace(/[\s\/?#\[\]%]/g, (match) => {
      switch (match) {
        case ' ': return '%20';
        case '/': return '%2F';
        case '?': return '%3F';
        case '#': return '%23';
        case '[': return '%5B';
        case ']': return '%5D';
        case '%': return '%25';
        default: return match;
      }
    });
  }

  constructor(config: Config) {
    this.config = config;
    const protocol = config.secure ? 'https' : 'http';
    const baseURL = `${protocol}://${config.host}:${config.port}`;

    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      // For self-signed certificates in HTTPS mode
      httpsAgent: config.secure ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    });
  }

  // System endpoints
  async getServerInfo(): Promise<any> {
    const response = await this.client.get('/');
    return response.data;
  }

  async getCertificate(): Promise<string> {
    const response = await this.client.get('/obsidian-local-rest-api.crt');
    return response.data;
  }

  async getOpenAPISpec(): Promise<any> {
    const response = await this.client.get('/openapi.yaml');
    return response.data;
  }

  // Active file operations
  async getActiveFile(asJson: boolean = false): Promise<string | NoteJson> {
    const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
    const response = await this.client.get('/active/', { headers });
    return response.data;
  }

  async updateActiveFile(content: string): Promise<void> {
    await this.client.put('/active/', content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async appendToActiveFile(content: string): Promise<void> {
    await this.client.post('/active/', content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async deleteActiveFile(): Promise<void> {
    await this.client.delete('/active/');
  }

  async patchActiveFile(operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void> {
    await this.client.patch('/active/', content, {
      headers: {
        'Operation': operation,
        'Target-Type': targetType,
        'Target': target,
        'Content-Type': 'text/markdown'
      }
    });
  }

  // Vault file operations
  async getFile(filename: string, asJson: boolean = false): Promise<string | NoteJson> {
    const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
    const response = await this.client.get(`/vault/${this.encodePathComponent(filename)}`, { headers });
    return response.data;
  }

  async createOrUpdateFile(filename: string, content: string): Promise<void> {
    await this.client.put(`/vault/${this.encodePathComponent(filename)}`, content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async appendToFile(filename: string, content: string): Promise<void> {
    await this.client.post(`/vault/${this.encodePathComponent(filename)}`, content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async deleteFile(filename: string): Promise<void> {
    await this.client.delete(`/vault/${this.encodePathComponent(filename)}`);
  }

  async patchFile(filename: string, operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void> {
    await this.client.patch(`/vault/${this.encodePathComponent(filename)}`, content, {
      headers: {
        'Operation': operation,
        'Target-Type': targetType,
        'Target': target,
        'Content-Type': 'text/markdown'
      }
    });
  }

  // Directory operations
  async listDirectory(path: string = ''): Promise<FileListItem[]> {
    const url = path ? `/vault/${this.encodePathComponent(path)}/` : '/vault/';
    const response = await this.client.get(url);
    return response.data.files || [];
  }

  // Search operations
  async searchSimple(query: string, contextLength: number = 100): Promise<SearchResult[]> {
    const response = await this.client.post('/search/simple/', null, {
      params: { query, contextLength }
    });
    return response.data || [];
  }

  async searchDataview(query: string): Promise<any> {
    const response = await this.client.post('/search/', query, {
      headers: { 'Content-Type': 'application/vnd.olrapi.dataview.dql+txt' }
    });
    return response.data;
  }

  async searchJsonLogic(query: object): Promise<any> {
    const response = await this.client.post('/search/', query, {
      headers: { 'Content-Type': 'application/vnd.olrapi.jsonlogic+json' }
    });
    return response.data;
  }

  // Command operations
  async getCommands(): Promise<Command[]> {
    const response = await this.client.get('/commands/');
    return response.data.commands || [];
  }

  async executeCommand(commandId: string): Promise<void> {
    await this.client.post(`/commands/${this.encodePathComponent(commandId)}/`);
  }

  // File opening
  async openFile(filename: string, newLeaf: boolean = false): Promise<void> {
    await this.client.post(`/open/${this.encodePathComponent(filename)}`, null, {
      params: { newLeaf }
    });
  }

  // Periodic notes operations
  async getPeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', asJson: boolean = false): Promise<string | NoteJson> {
    const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
    const response = await this.client.get(`/periodic/${period}/`, { headers });
    return response.data;
  }

  async updatePeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', content: string): Promise<void> {
    await this.client.put(`/periodic/${period}/`, content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async appendToPeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', content: string): Promise<void> {
    await this.client.post(`/periodic/${period}/`, content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async deletePeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<void> {
    await this.client.delete(`/periodic/${period}/`);
  }

  async patchPeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void> {
    await this.client.patch(`/periodic/${period}/`, content, {
      headers: {
        'Operation': operation,
        'Target-Type': targetType,
        'Target': target,
        'Content-Type': 'text/markdown'
      }
    });
  }

  // Specific date periodic notes
  async getPeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, asJson: boolean = false): Promise<string | NoteJson> {
    const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
    const response = await this.client.get(`/periodic/${period}/${year}/${month}/${day}/`, { headers });
    return response.data;
  }

  async updatePeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, content: string): Promise<void> {
    await this.client.put(`/periodic/${period}/${year}/${month}/${day}/`, content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async appendToPeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, content: string): Promise<void> {
    await this.client.post(`/periodic/${period}/${year}/${month}/${day}/`, content, {
      headers: { 'Content-Type': 'text/markdown' }
    });
  }

  async deletePeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number): Promise<void> {
    await this.client.delete(`/periodic/${period}/${year}/${month}/${day}/`);
  }

  async patchPeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void> {
    await this.client.patch(`/periodic/${period}/${year}/${month}/${day}/`, content, {
      headers: {
        'Operation': operation,
        'Target-Type': targetType,
        'Target': target,
        'Content-Type': 'text/markdown'
      }
    });
  }
}
