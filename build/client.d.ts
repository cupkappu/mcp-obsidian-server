import { Config, NoteJson, FileListItem, SearchResult, Command } from './types.js';
export declare class ObsidianAPIClient {
    private client;
    private config;
    /**
     * 自定义路径编码函数，只编码真正必要的字符
     * 保留 @ 符号和其他常用符号不被编码
     */
    private encodePathComponent;
    constructor(config: Config);
    getServerInfo(): Promise<any>;
    getCertificate(): Promise<string>;
    getOpenAPISpec(): Promise<any>;
    getActiveFile(asJson?: boolean): Promise<string | NoteJson>;
    updateActiveFile(content: string): Promise<void>;
    appendToActiveFile(content: string): Promise<void>;
    deleteActiveFile(): Promise<void>;
    patchActiveFile(operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void>;
    getFile(filename: string, asJson?: boolean): Promise<string | NoteJson>;
    createOrUpdateFile(filename: string, content: string): Promise<void>;
    appendToFile(filename: string, content: string): Promise<void>;
    deleteFile(filename: string): Promise<void>;
    patchFile(filename: string, operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void>;
    listDirectory(path?: string): Promise<FileListItem[]>;
    searchSimple(query: string, contextLength?: number): Promise<SearchResult[]>;
    searchDataview(query: string): Promise<any>;
    searchJsonLogic(query: object): Promise<any>;
    getCommands(): Promise<Command[]>;
    executeCommand(commandId: string): Promise<void>;
    openFile(filename: string, newLeaf?: boolean): Promise<void>;
    getPeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', asJson?: boolean): Promise<string | NoteJson>;
    updatePeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', content: string): Promise<void>;
    appendToPeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', content: string): Promise<void>;
    deletePeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<void>;
    patchPeriodicNote(period: 'daily' | 'weekly' | 'monthly' | 'yearly', operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void>;
    getPeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, asJson?: boolean): Promise<string | NoteJson>;
    updatePeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, content: string): Promise<void>;
    appendToPeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, content: string): Promise<void>;
    deletePeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number): Promise<void>;
    patchPeriodicNoteByDate(period: 'daily' | 'yearly', year: number, month: number, day: number, operation: 'append' | 'replace', targetType: 'heading' | 'frontmatter' | 'block', target: string, content: string): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map