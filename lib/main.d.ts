/// <reference types="node" />
import * as fs from 'fs';
export declare function array_front<T>(arr: T[]): T | null;
export declare function dir_findFirstText(dirPath: string, findText: string): Promise<{
    foundFilePath: string;
    foundLinn: number;
}>;
export declare function dir_ensureExists(dirPath: string): Promise<{
    created: boolean;
    errmsg: string;
}>;
export declare function dir_mkdir(dirPath: string): Promise<{
    exists: boolean;
    errmsg: string;
}>;
export declare function dir_readdir(dirPath: string): Promise<string[]>;
export declare function file_create(path: string): Promise<string>;
export declare function file_exists(path: string): Promise<boolean>;
export declare function file_findFirstText(filePath: string, findText: string): Promise<{
    foundLinn: number;
    foundPos: number;
}>;
export declare function file_isDir(path: string): Promise<{
    isDir: boolean;
    errmsg: string;
}>;
export declare function file_readLines(filePath: string): Promise<{
    lines: string[];
    errmsg: string;
}>;
export declare function file_stat(path: string): Promise<fs.Stats>;
export declare function file_ensureExists(path: string): Promise<void>;
export declare function file_writeFile(filePath: string, text?: string): Promise<string>;
export declare function file_writeNew(path: string, text: string): Promise<string>;
export declare function lines_findFirst(lines: string[], findText: string, options?: {
    start?: number;
}): {
    linn: number;
    coln: number;
};
export declare function object_indexerItems(obj: {
    [key: string]: any;
}): any[];
export declare function object_toQueryString(obj: {}): string;
export declare function path_findFile(dirPath: string, fileName: string): Promise<{
    dirPath: string;
    remPath: string;
}>;
interface interface_pathPart {
    root: string;
    base: string;
    ext: string;
    dir: string;
    path: string;
    remPath: string;
}
export declare function path_parts(str: string): interface_pathPart[];
export declare function path_removeQueryString(str: string): string;
export declare function path_splitFront(path: string, sep?: string): {
    front: string;
    rem: string;
};
export declare function path_toFileUri(path: string): string;
export declare function scan_charNeAll(text: string, bx: number, pattern: string): number;
export declare function scan_revCharEqAny(text: string, bx: number, anyChar: string): number;
export declare function scan_revCharNeAll(text: string, bx: number, pattern: string): number;
export declare function scan_revSepWord(text: string, pos: number, wsChars: string): {
    text: string;
    bx: number;
} | null;
export declare function string_contains(str: string, pattern: string): boolean;
export declare function string_dequote(text: string): string;
export declare function string_head(str: string, lx: number): string;
export declare function string_isQuoted(text: string): boolean;
export declare function string_matchGeneric(str: string, pattern: string): boolean;
export declare function string_replaceAll(str: string, findText: string, replaceText: string): string;
export declare function string_rtrim(str: string): string;
export declare function string_startsWith(text: string, startText: string | string[]): boolean;
export declare function string_substrLenient(str: string, fx: number, lx?: number): string;
export declare function string_tail(str: string, num: number): string;
export declare function string_wordBx(text: string, word: string, ix: number): number;
export {};
