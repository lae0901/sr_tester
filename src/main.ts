// src/main.ts

import { path_getFileName } from './browser-path';

export { path_getFileName } ;

// ------------------------- array_front -------------------------------------
// return either null or the first item in the array.
export function array_front<T>(arr: T[]): T | null
{
  if (arr.length == 0)
    return null;
  else
  {
    return arr[0];
  }
}

// ------------------------------- lines_findFirst ----------------------------
// return linn and coln of first occurance of findText in string array of lines.
export function lines_findFirst(lines: string[], findText: string, options?: { start?: number })
  : { linn: number, coln: number }
{
  let linn = -1, coln = -1;

  // start find linn.
  let startLinn = 0;
  if (options)
  {
    startLinn = options.start || 0;
  }

  for (let ix = startLinn; ix < lines.length; ++ix)
  {
    const line = lines[ix];
    const fx = line.indexOf(findText);
    if (fx >= 0)
    {
      linn = ix;
      coln = fx;
      break;
    }
  }

  return { linn, coln };
}

// --------------------------- object_indexerItems ------------------------
// return an array containing the indexer properties of the object.
export function object_indexerItems(obj: { [key: string]: any }): any[]
{
  const indexer: {}[] = [];
  let str = '';
  if (obj)
  {
    for (const key of Object.keys(obj))
    {
      if (!isNaN(Number(key)))
      {
        const vlu = obj[key];
        indexer.push(vlu);
      }
    }
  }

  return indexer;
}

// ------------------------- object_toQueryString ---------------------------------
export function object_toQueryString(obj: {})
{
  // redefine the input obj argument. Redefine as object where all the property 
  // names are strings. And the property values are of type any.
  interface StringAnyMap { [key: string]: any; }
  const mapObj = obj as StringAnyMap;

  const qs = Object.keys(mapObj)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(mapObj[key]))
    .join('&');

  return qs;
}

// ----------------------------------- path_removeQueryString ---------------------
// find and remove the query string portion of the path 
export function path_removeQueryString(str: string): string
{
  const fx = str.indexOf('?');
  if (fx >= 0)
  {
    return str.substr(0, fx);
  }
  else
    return str;
}

// ---------------------------------- path_splitFront ----------------------------------
// split a path from the front.  Returning the front item and the remaining items.
export function path_splitFront(path: string, sep: string = '/'): { front: string, rem: string }
{
  let front = '', rem = '';
  const ix = path.indexOf(sep);
  if (ix >= 0)
  {
    front = path.substr(0, ix);
    if (!front)
      front = '/';
    rem = string_substrLenient(path, ix + 1);
  }
  else
  {
    front = path;
    rem = '';
  }

  return { front, rem };
}


// --------------------------- scan_charNeAll ------------------------------
// scan in string until char not equal any of pattern chars.
export function scan_charNeAll(text: string, bx: number, pattern: string): number
{
  let ix = bx;
  while (ix < text.length)
  {
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

// ----------------------------- scan_revCharEqAny --------------------------------
// scan backwards until character is equal any of chars in anyChar string.
export function scan_revCharEqAny(text: string, bx: number, anyChar: string): number
{
  let ix = bx;
  while (ix >= 0)
  {
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

// ----------------------------- scan_revCharNeAll --------------------------------
// scan backwards until character is not equal all of chars in pattern string.
export function scan_revCharNeAll(text: string, bx: number, pattern: string): number
{
  let ix = bx;
  while (ix >= 0)
  {
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

// --------------------------------- scan_revSepWord -----------------------
// scan reverse to next separator delimited word. First step backwards past 
// separator until last char of word. Then step back until separator found. That 
// is char immed befor start of word.
// This is simple word finder. Use scan_revWord and scan_word to find a word and
// its delim chars.
export function scan_revSepWord(text: string, pos: number, wsChars: string):
  { text: string, bx: number } | null
{
  let wordText = '';
  let bx = -1;
  const ex = scan_revCharNeAll(text, pos, wsChars);
  if (ex >= 0)
  {
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

// -------------------------------- string_contains -------------------------------
export function string_contains(str: string, pattern: string): boolean
{
  if (str.indexOf(pattern) >= 0)
    return true;
  else
    return false;
}

// ----------------------- string_dequote ------------------------
// note: the quote char can be any character. The rule is the first char is the
//       quote char. Then the closing quote is that same first char. And the
//       backslash is used to escape the quote char within the string.
// Use string_isQuoted
export function string_dequote(text: string): string
{
  let dequoteText = '';
  const quoteChar = text[0];
  let ix = 1;
  const lastIx = text.length - 2;
  while (ix <= lastIx)
  {
    const ch1 = text[ix];
    const nx1 = (ix == lastIx) ? '' : text[ix + 1];
    if ((ch1 == '\\') && (nx1 == quoteChar))
    {
      ix += 2;
      dequoteText += quoteChar;
    }
    else if ((ch1 == '\\') && (nx1 == '\\'))
    {
      ix += 2;
      dequoteText += ch1;
    }
    else
    {
      dequoteText += ch1;
      ix += 1;
    }
  }
  return dequoteText;
}

// -------------------------- string_head ----------------------
// return the front of the string
export function string_head(str: string, lx: number)
{
  if (!str)
    return '';
  if (lx > str.length)
    lx = str.length;
  if (lx <= 0)
    return '';
  else
    return str.substr(0, lx);
}

// ------------------------------- string_isQuoted --------------------------------
export function string_isQuoted(text: string): boolean
{
  let isQuoted = false;
  if (text.length >= 2)
  {
    const headChar = string_head(text, 1);
    if ((headChar == '"') || (headChar == "'") || (headChar == '`') ||
      (headChar == '/'))
    {
      const tailCh1 = string_tail(text, 1);
      const tailCh2 = string_tail(text, 2);
      if ((headChar == tailCh1) && (tailCh2.substr(0, 1) != '\\'))
        isQuoted = true;
    }
  }
  return isQuoted;
}

// --------------------------------- string_matchGeneric --------------------------
export function string_matchGeneric(str: string, pattern: string): boolean
{
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

// -------------------- string_replaceAll -----------------------
// replace all occurance of findText with replaceText
export function string_replaceAll(str: string, findText: string, replaceText: string)
{
  let res = '';
  let ix = 0;
  while (ix < str.length)
  {
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

// ------------------------- string_rtrim --------------------
export function string_rtrim(str: string): string
{
  if (!str)
    return '';
  else
    return str.replace(/\s+$/, "");
}

// -------------------------------- string_startsWith -------------------------
// test that the starting text of text matches startText.
export function string_startsWith(text: string, startText: string | string[]): boolean
{
  if (!startText)
    return false;
  else if (Array.isArray(startText))
  {
    for (const startTextItem of startText)
    {
      const rc = string_startsWith(text, startTextItem);
      if (rc)
        return true;
    }
    return false;
  }
  else
  {
    const startLx = startText.length;
    if (startLx > text.length)
      return false;
    else if (text.substr(0, startLx) == startText)
      return true;
    else
      return false;
  }
}

// ---------------------------- string_substrLenient --------------------
// return substring of the input string. only, clip the results if start or end
// pos are out of bounds of the string.
export function string_substrLenient(str: string, fx: number, lx: number = -1): string
{
  if ((typeof str) != 'string')
    return '';

  // move from from negative to zero. Reduce length by the adjusted amount.
  if (fx < 0)
  {
    var adj = 0 - fx;
    fx += adj;
    if (lx != -1)
    {
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

// ----------------------string_tail ---------------------------------
// return num number of characters from end of string.
export function string_tail(str: string, num: number): string
{
  if (str.length <= num)
    return str;
  else
  {
    var bx = str.length - num;
    return str.substr(bx);
  }
}

// ------------------------ string_wordBx ---------------------------
// return bx of word in text that has a char located at position ix.
export function string_wordBx(text: string, word: string, ix: number)
  : number
{
  let bx = -1;
  const wordLx = word.length;
  while (ix >= 0)
  {
    const remLx = text.length - ix;
    if (remLx >= wordLx)
    {
      if (text.substr(ix, wordLx) == word)
      {
        bx = ix;
        break;
      }
    }
    ix -= 1;
  }

  return bx;
}

