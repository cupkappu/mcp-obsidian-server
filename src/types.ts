import { z } from 'zod';

// Configuration schema
export const ConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  host: z.string().default('127.0.0.1'),
  port: z.number().default(27124),
  secure: z.boolean().default(true), // true for HTTPS, false for HTTP
});

export type Config = z.infer<typeof ConfigSchema>;

// API response schemas
export const ErrorSchema = z.object({
  errorCode: z.number(),
  message: z.string(),
});

export const NoteStatSchema = z.object({
  ctime: z.number(),
  mtime: z.number(),
  size: z.number(),
});

export const NoteJsonSchema = z.object({
  content: z.string(),
  frontmatter: z.record(z.any()),
  path: z.string(),
  stat: NoteStatSchema,
  tags: z.array(z.string()),
});

export const FileListItemSchema = z.object({
  name: z.string(),
  isFolder: z.boolean(),
});

export const SearchResultSchema = z.object({
  filename: z.string(),
  score: z.number(),
  matches: z.array(z.object({
    match: z.string(),
    context: z.string(),
  })),
});

export const CommandSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Error = z.infer<typeof ErrorSchema>;
export type NoteJson = z.infer<typeof NoteJsonSchema>;
export type FileListItem = z.infer<typeof FileListItemSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type Command = z.infer<typeof CommandSchema>;
