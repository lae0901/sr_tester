import { path_getFileName, path_splitBaseName } from './browser-path';
export { path_getFileName, path_splitBaseName };
export declare function array_front<T>(arr: T[]): T | null;
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
export declare function path_removeQueryString(str: string): string;
export declare function path_splitFront(path: string, sep?: string): {
    front: string;
    rem: string;
};
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
