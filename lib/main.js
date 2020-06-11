"use strict";
// src/main.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_wordBx = exports.string_tail = exports.string_substrLenient = exports.string_startsWith = exports.string_rtrim = exports.string_replaceAll = exports.string_matchGeneric = exports.string_isQuoted = exports.string_head = exports.string_dequote = exports.string_contains = exports.scan_revSepWord = exports.scan_revCharNeAll = exports.scan_revCharEqAny = exports.scan_charNeAll = exports.path_splitFront = exports.path_removeQueryString = exports.object_toQueryString = exports.object_indexerItems = exports.lines_findFirst = exports.array_front = exports.path_getFileName = void 0;
const browser_path_1 = require("./browser-path");
Object.defineProperty(exports, "path_getFileName", { enumerable: true, get: function () { return browser_path_1.path_getFileName; } });
// ------------------------- array_front -------------------------------------
// return either null or the first item in the array.
function array_front(arr) {
    if (arr.length == 0)
        return null;
    else {
        return arr[0];
    }
}
exports.array_front = array_front;
// ------------------------------- lines_findFirst ----------------------------
// return linn and coln of first occurance of findText in string array of lines.
function lines_findFirst(lines, findText, options) {
    let linn = -1, coln = -1;
    // start find linn.
    let startLinn = 0;
    if (options) {
        startLinn = options.start || 0;
    }
    for (let ix = startLinn; ix < lines.length; ++ix) {
        const line = lines[ix];
        const fx = line.indexOf(findText);
        if (fx >= 0) {
            linn = ix;
            coln = fx;
            break;
        }
    }
    return { linn, coln };
}
exports.lines_findFirst = lines_findFirst;
// --------------------------- object_indexerItems ------------------------
// return an array containing the indexer properties of the object.
function object_indexerItems(obj) {
    const indexer = [];
    let str = '';
    if (obj) {
        for (const key of Object.keys(obj)) {
            if (!isNaN(Number(key))) {
                const vlu = obj[key];
                indexer.push(vlu);
            }
        }
    }
    return indexer;
}
exports.object_indexerItems = object_indexerItems;
// ------------------------- object_toQueryString ---------------------------------
function object_toQueryString(obj) {
    const mapObj = obj;
    const qs = Object.keys(mapObj)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(mapObj[key]))
        .join('&');
    return qs;
}
exports.object_toQueryString = object_toQueryString;
// ----------------------------------- path_removeQueryString ---------------------
// find and remove the query string portion of the path 
function path_removeQueryString(str) {
    const fx = str.indexOf('?');
    if (fx >= 0) {
        return str.substr(0, fx);
    }
    else
        return str;
}
exports.path_removeQueryString = path_removeQueryString;
// ---------------------------------- path_splitFront ----------------------------------
// split a path from the front.  Returning the front item and the remaining items.
function path_splitFront(path, sep = '/') {
    let front = '', rem = '';
    const ix = path.indexOf(sep);
    if (ix >= 0) {
        front = path.substr(0, ix);
        if (!front)
            front = '/';
        rem = string_substrLenient(path, ix + 1);
    }
    else {
        front = path;
        rem = '';
    }
    return { front, rem };
}
exports.path_splitFront = path_splitFront;
// --------------------------- scan_charNeAll ------------------------------
// scan in string until char not equal any of pattern chars.
function scan_charNeAll(text, bx, pattern) {
    let ix = bx;
    while (ix < text.length) {
        const ch1 = text.substr(ix, 1);
        const fx = pattern.indexOf(ch1);
        if (fx == -1)
            break;
        ix += 1;
    }
    if (ix < text.length)
        return ix;
    else
        return -1;
}
exports.scan_charNeAll = scan_charNeAll;
// ----------------------------- scan_revCharEqAny --------------------------------
// scan backwards until character is equal any of chars in anyChar string.
function scan_revCharEqAny(text, bx, anyChar) {
    let ix = bx;
    while (ix >= 0) {
        const ch1 = text.substr(ix, 1);
        const fx = anyChar.indexOf(ch1);
        if (fx >= 0)
            break;
        ix -= 1;
    }
    if (ix >= 0)
        return ix;
    else
        return -1;
}
exports.scan_revCharEqAny = scan_revCharEqAny;
// ----------------------------- scan_revCharNeAll --------------------------------
// scan backwards until character is not equal all of chars in pattern string.
function scan_revCharNeAll(text, bx, pattern) {
    let ix = bx;
    while (ix >= 0) {
        const ch1 = text.substr(ix, 1);
        const fx = pattern.indexOf(ch1);
        if (fx == -1)
            break;
        ix -= 1;
    }
    if (ix >= 0)
        return ix;
    else
        return -1;
}
exports.scan_revCharNeAll = scan_revCharNeAll;
// --------------------------------- scan_revSepWord -----------------------
// scan reverse to next separator delimited word. First step backwards past 
// separator until last char of word. Then step back until separator found. That 
// is char immed befor start of word.
// This is simple word finder. Use scan_revWord and scan_word to find a word and
// its delim chars.
function scan_revSepWord(text, pos, wsChars) {
    let wordText = '';
    let bx = -1;
    const ex = scan_revCharNeAll(text, pos, wsChars);
    if (ex >= 0) {
        const fx = scan_revCharEqAny(text, ex, wsChars);
        if (fx == -1)
            bx = 0;
        else
            bx = fx + 1;
        // isolate the word.
        const lx = ex - bx + 1;
        wordText = text.substr(bx, lx);
    }
    return (wordText) ? { text: wordText, bx } : null;
}
exports.scan_revSepWord = scan_revSepWord;
// -------------------------------- string_contains -------------------------------
function string_contains(str, pattern) {
    if (str.indexOf(pattern) >= 0)
        return true;
    else
        return false;
}
exports.string_contains = string_contains;
// ----------------------- string_dequote ------------------------
// note: the quote char can be any character. The rule is the first char is the
//       quote char. Then the closing quote is that same first char. And the
//       backslash is used to escape the quote char within the string.
// Use string_isQuoted
function string_dequote(text) {
    let dequoteText = '';
    const quoteChar = text[0];
    let ix = 1;
    const lastIx = text.length - 2;
    while (ix <= lastIx) {
        const ch1 = text[ix];
        const nx1 = (ix == lastIx) ? '' : text[ix + 1];
        if ((ch1 == '\\') && (nx1 == quoteChar)) {
            ix += 2;
            dequoteText += quoteChar;
        }
        else if ((ch1 == '\\') && (nx1 == '\\')) {
            ix += 2;
            dequoteText += ch1;
        }
        else {
            dequoteText += ch1;
            ix += 1;
        }
    }
    return dequoteText;
}
exports.string_dequote = string_dequote;
// -------------------------- string_head ----------------------
// return the front of the string
function string_head(str, lx) {
    if (!str)
        return '';
    if (lx > str.length)
        lx = str.length;
    if (lx <= 0)
        return '';
    else
        return str.substr(0, lx);
}
exports.string_head = string_head;
// ------------------------------- string_isQuoted --------------------------------
function string_isQuoted(text) {
    let isQuoted = false;
    if (text.length >= 2) {
        const headChar = string_head(text, 1);
        if ((headChar == '"') || (headChar == "'") || (headChar == '`') ||
            (headChar == '/')) {
            const tailCh1 = string_tail(text, 1);
            const tailCh2 = string_tail(text, 2);
            if ((headChar == tailCh1) && (tailCh2.substr(0, 1) != '\\'))
                isQuoted = true;
        }
    }
    return isQuoted;
}
exports.string_isQuoted = string_isQuoted;
// --------------------------------- string_matchGeneric --------------------------
function string_matchGeneric(str, pattern) {
    // remove final '*' from pattern.
    const starChar = string_tail(pattern, 1);
    if (starChar != '*')
        return false;
    const pattern_lx = pattern.length - 1;
    pattern = string_substrLenient(pattern, 0, pattern_lx);
    if (pattern_lx == 0)
        return true;
    else if (str.substr(0, pattern_lx) == pattern)
        return true;
    else
        return false;
}
exports.string_matchGeneric = string_matchGeneric;
// -------------------- string_replaceAll -----------------------
// replace all occurance of findText with replaceText
function string_replaceAll(str, findText, replaceText) {
    let res = '';
    let ix = 0;
    while (ix < str.length) {
        const fx = str.indexOf(findText, ix);
        // length from start to found position
        let lx = 0;
        if (fx == -1)
            lx = str.length - ix;
        else
            lx = fx - ix;
        // copy not match text to result.
        if (lx > 0)
            res += str.substr(ix, lx);
        // match found. add replacement text to result.
        if (fx != -1)
            res += replaceText;
        // advance in str.
        if (fx == -1)
            ix = str.length;
        else
            ix = fx + findText.length;
    }
    return res;
}
exports.string_replaceAll = string_replaceAll;
// ------------------------- string_rtrim --------------------
function string_rtrim(str) {
    if (!str)
        return '';
    else
        return str.replace(/\s+$/, "");
}
exports.string_rtrim = string_rtrim;
// -------------------------------- string_startsWith -------------------------
// test that the starting text of text matches startText.
function string_startsWith(text, startText) {
    if (!startText)
        return false;
    else if (Array.isArray(startText)) {
        for (const startTextItem of startText) {
            const rc = string_startsWith(text, startTextItem);
            if (rc)
                return true;
        }
        return false;
    }
    else {
        const startLx = startText.length;
        if (startLx > text.length)
            return false;
        else if (text.substr(0, startLx) == startText)
            return true;
        else
            return false;
    }
}
exports.string_startsWith = string_startsWith;
// ---------------------------- string_substrLenient --------------------
// return substring of the input string. only, clip the results if start or end
// pos are out of bounds of the string.
function string_substrLenient(str, fx, lx = -1) {
    if ((typeof str) != 'string')
        return '';
    // move from from negative to zero. Reduce length by the adjusted amount.
    if (fx < 0) {
        var adj = 0 - fx;
        fx += adj;
        if (lx != -1) {
            lx -= adj;
            if (lx < 0)
                lx = 0;
        }
    }
    if (fx >= str.length)
        return '';
    if (lx == -1)
        return str.substr(fx);
    // remaining length.
    var remLx = str.length - fx;
    // trim length if remaining lgth exceeded.
    if (lx > remLx)
        lx = remLx;
    return str.substr(fx, lx);
}
exports.string_substrLenient = string_substrLenient;
// ----------------------string_tail ---------------------------------
// return num number of characters from end of string.
function string_tail(str, num) {
    if (str.length <= num)
        return str;
    else {
        var bx = str.length - num;
        return str.substr(bx);
    }
}
exports.string_tail = string_tail;
// ------------------------ string_wordBx ---------------------------
// return bx of word in text that has a char located at position ix.
function string_wordBx(text, word, ix) {
    let bx = -1;
    const wordLx = word.length;
    while (ix >= 0) {
        const remLx = text.length - ix;
        if (remLx >= wordLx) {
            if (text.substr(ix, wordLx) == word) {
                bx = ix;
                break;
            }
        }
        ix -= 1;
    }
    return bx;
}
exports.string_wordBx = string_wordBx;
