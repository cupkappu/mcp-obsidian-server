import axios from 'axios';
import https from 'https';
export class ObsidianAPIClient {
    client;
    config;
    constructor(config) {
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
    async getServerInfo() {
        const response = await this.client.get('/');
        return response.data;
    }
    async getCertificate() {
        const response = await this.client.get('/obsidian-local-rest-api.crt');
        return response.data;
    }
    async getOpenAPISpec() {
        const response = await this.client.get('/openapi.yaml');
        return response.data;
    }
    // Active file operations
    async getActiveFile(asJson = false) {
        const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
        const response = await this.client.get('/active/', { headers });
        return response.data;
    }
    async updateActiveFile(content) {
        await this.client.put('/active/', content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async appendToActiveFile(content) {
        await this.client.post('/active/', content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async deleteActiveFile() {
        await this.client.delete('/active/');
    }
    async patchActiveFile(operation, targetType, target, content) {
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
    async getFile(filename, asJson = false) {
        const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
        const response = await this.client.get(`/vault/${encodeURIComponent(filename)}`, { headers });
        return response.data;
    }
    async createOrUpdateFile(filename, content) {
        await this.client.put(`/vault/${encodeURIComponent(filename)}`, content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async appendToFile(filename, content) {
        await this.client.post(`/vault/${encodeURIComponent(filename)}`, content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async deleteFile(filename) {
        await this.client.delete(`/vault/${encodeURIComponent(filename)}`);
    }
    async patchFile(filename, operation, targetType, target, content) {
        await this.client.patch(`/vault/${encodeURIComponent(filename)}`, content, {
            headers: {
                'Operation': operation,
                'Target-Type': targetType,
                'Target': target,
                'Content-Type': 'text/markdown'
            }
        });
    }
    // Directory operations
    async listDirectory(path = '') {
        const url = path ? `/vault/${encodeURIComponent(path)}/` : '/vault/';
        const response = await this.client.get(url);
        return response.data.files || [];
    }
    // Search operations
    async searchSimple(query, contextLength = 100) {
        const response = await this.client.post('/search/simple/', null, {
            params: { query, contextLength }
        });
        return response.data.results || [];
    }
    async searchDataview(query) {
        const response = await this.client.post('/search/', query, {
            headers: { 'Content-Type': 'application/vnd.olrapi.dataview.dql+txt' }
        });
        return response.data;
    }
    async searchJsonLogic(query) {
        const response = await this.client.post('/search/', query, {
            headers: { 'Content-Type': 'application/vnd.olrapi.jsonlogic+json' }
        });
        return response.data;
    }
    // Command operations
    async getCommands() {
        const response = await this.client.get('/commands/');
        return response.data.commands || [];
    }
    async executeCommand(commandId) {
        await this.client.post(`/commands/${encodeURIComponent(commandId)}/`);
    }
    // File opening
    async openFile(filename, newLeaf = false) {
        await this.client.post(`/open/${encodeURIComponent(filename)}`, null, {
            params: { newLeaf }
        });
    }
    // Periodic notes operations
    async getPeriodicNote(period, asJson = false) {
        const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
        const response = await this.client.get(`/periodic/${period}/`, { headers });
        return response.data;
    }
    async updatePeriodicNote(period, content) {
        await this.client.put(`/periodic/${period}/`, content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async appendToPeriodicNote(period, content) {
        await this.client.post(`/periodic/${period}/`, content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async deletePeriodicNote(period) {
        await this.client.delete(`/periodic/${period}/`);
    }
    async patchPeriodicNote(period, operation, targetType, target, content) {
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
    async getPeriodicNoteByDate(period, year, month, day, asJson = false) {
        const headers = asJson ? { 'Accept': 'application/vnd.olrapi.note+json' } : {};
        const response = await this.client.get(`/periodic/${period}/${year}/${month}/${day}/`, { headers });
        return response.data;
    }
    async updatePeriodicNoteByDate(period, year, month, day, content) {
        await this.client.put(`/periodic/${period}/${year}/${month}/${day}/`, content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async appendToPeriodicNoteByDate(period, year, month, day, content) {
        await this.client.post(`/periodic/${period}/${year}/${month}/${day}/`, content, {
            headers: { 'Content-Type': 'text/markdown' }
        });
    }
    async deletePeriodicNoteByDate(period, year, month, day) {
        await this.client.delete(`/periodic/${period}/${year}/${month}/${day}/`);
    }
    async patchPeriodicNoteByDate(period, year, month, day, operation, targetType, target, content) {
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
//# sourceMappingURL=client.js.map