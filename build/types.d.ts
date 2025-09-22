import { z } from 'zod';
export declare const ConfigSchema: z.ZodObject<{
    apiKey: z.ZodString;
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodNumber>;
    secure: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    host: string;
    port: number;
    secure: boolean;
}, {
    apiKey: string;
    host?: string | undefined;
    port?: number | undefined;
    secure?: boolean | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const ErrorSchema: z.ZodObject<{
    errorCode: z.ZodNumber;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    errorCode: number;
}, {
    message: string;
    errorCode: number;
}>;
export declare const NoteStatSchema: z.ZodObject<{
    ctime: z.ZodNumber;
    mtime: z.ZodNumber;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ctime: number;
    mtime: number;
    size: number;
}, {
    ctime: number;
    mtime: number;
    size: number;
}>;
export declare const NoteJsonSchema: z.ZodObject<{
    content: z.ZodString;
    frontmatter: z.ZodRecord<z.ZodString, z.ZodAny>;
    path: z.ZodString;
    stat: z.ZodObject<{
        ctime: z.ZodNumber;
        mtime: z.ZodNumber;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        ctime: number;
        mtime: number;
        size: number;
    }, {
        ctime: number;
        mtime: number;
        size: number;
    }>;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string;
    content: string;
    frontmatter: Record<string, any>;
    stat: {
        ctime: number;
        mtime: number;
        size: number;
    };
    tags: string[];
}, {
    path: string;
    content: string;
    frontmatter: Record<string, any>;
    stat: {
        ctime: number;
        mtime: number;
        size: number;
    };
    tags: string[];
}>;
export declare const FileListItemSchema: z.ZodObject<{
    name: z.ZodString;
    isFolder: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    isFolder: boolean;
}, {
    name: string;
    isFolder: boolean;
}>;
export declare const SearchResultSchema: z.ZodObject<{
    filename: z.ZodString;
    score: z.ZodNumber;
    matches: z.ZodArray<z.ZodObject<{
        match: z.ZodString;
        context: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        match: string;
        context: string;
    }, {
        match: string;
        context: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filename: string;
    score: number;
    matches: {
        match: string;
        context: string;
    }[];
}, {
    filename: string;
    score: number;
    matches: {
        match: string;
        context: string;
    }[];
}>;
export declare const CommandSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export type Error = z.infer<typeof ErrorSchema>;
export type NoteJson = z.infer<typeof NoteJsonSchema>;
export type FileListItem = z.infer<typeof FileListItemSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type Command = z.infer<typeof CommandSchema>;
//# sourceMappingURL=types.d.ts.map