// src/core.ts

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

// ------------------------- object_toQueryString ---------------------------------
export function object_toQueryString( obj:{} )
{
  // redefine the input obj argument. Redefine as object where all the property 
  // names are strings. And the property values are of type any.
  interface StringAnyMap { [key: string]: any; }
  const mapObj = obj as StringAnyMap ;

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

// ------------------------------ path_toFileUri ----------------------------------
// convert file path to string ready to be parsed by 
export function path_toFileUri(path: string): string 
{
  // replace '\' with '/'
  let toPath = '';
  for (let ix = 0; ix < path.length; ++ix)
  {
    const ch1 = path.substr(ix, 1);
    if (ch1 == '\\')
      toPath += '/';
    else
      toPath += ch1;
  }

  // append file:/// to front of path.
  const return_path = 'file:///' + toPath;

  return return_path;
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
export function string_dequote(text: string): string
{
  let dequoteText = '';
  const quoteChar = text[0];
  let ix = 1;
  const lastIx = text.length - 2;
  while (ix <= lastIx)
  {
    if ((text[ix] == '\\') && (text[ix + 1] == quoteChar))
    {
      ix += 2;
      dequoteText += quoteChar;
    }
    else
    {
      dequoteText += text[ix];
      ix += 1;
    }
  }
  return dequoteText;
}

// ------------------------- string_rtrim --------------------
export function string_rtrim(str:string): string
{
  if (!str)
    return '';
  else
    return str.replace(/\s+$/, "");
}


// -------------------------------- string_startsWith -------------------------
// test that the starting text of text matches startText.
export function string_startsWith(text: string, startText: string): boolean
{
  if (!startText)
    return false;
  const startLx = startText.length;
  if (startLx > text.length)
    return false;
  else if (text.substr(0, startLx) == startText)
    return true;
  else
    return false;
}

// ---------------------------- string_substrLenient --------------------
// return substring of the input string. only, clip the results if start or end
// pos are out of bounds of the string.
function string_substrLenient(str: string, fx: number, lx: number = -1): string
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

// ---------------------- regex_core ----------------------------------

// ------------------------------------- rxp --------------------------------------
// rxp - const object that contains regex match patterns.
export const rxp = {
  any: '\\.',       // match any char
  zeroMoreWhitespace: `\\s*`,
  singleQuoteQuoted: `\\s*'(?:\\\\.|[^'\\\\])*'`,
  doubleQuoteQuoted: `\\s*"(?:\\\\.|[^"\\\\])*"`,
  jsonNameVluSep: `\\s*:`,
  beginString: `^\\s*`,
  jsonStart: `\\s*{`,
  jsonEnd: `\\s*}`,
  jsonStartArray: `\\s*\\[`,
  jsonStartObject: `\\s*\\{`,
  comma: `\\s*,`,
  or: '|',
  beginCapture: '(',
  closeParen: '\\)',
  endCapture: ')',
  endCaptureZeroOne: ')?',
  endCaptureZeroMore: ')*',
  endCaptureOneMore: ')+',
  oneMoreNumeric: '[\\d.]+',
  oneMoreDigits: '\\d+',
  oneMoreAlpha: '[A-Za-z]+',
  oneMoreName: '[A-Za-z_]+',
  oneMoreWord: '\\w+',
  oneMoreWhitespace: '\\s+',
  openParen: '\\(',
  stringStart: '^',
  stringEnd: '$',
  variableName: `[a-zA-Z_]\\w*`,
  zeroOneAny: '\\.?',
  zeroMoreWord: '\\w*',

  oneMoreAnyBut: (anyChars: string) =>
  {
    return '[^' + anyChars + ']+';
  },

  jsonVluStart: function ()
  {
    return this.zeroMoreWhitespace + this.beginCapture + this.singleQuoteQuoted +
      this.or + this.variableName + this.or + this.jsonStartArray +
      this.or + this.jsonStartObject + this.endCapture
  },
  jsonPropName: function ()
  {
    return this.zeroMoreWhitespace + this.beginCapture + this.singleQuoteQuoted +
      this.or + this.variableName + this.endCapture
  },
  jsonNameVluPair: function ()
  {
    return this.zeroMoreWhitespace + this.beginCapture + this.singleQuoteQuoted +
      this.or + this.variableName + this.endCapture +
      this.jsonNameVluSep +
      this.beginCapture + this.singleQuoteQuoted +
      this.or + this.variableName + this.endCapture
  },
  escape: (char: string) => { return '\\' + char }
}

interface regex_exec_rtnval_interface
{
  matchBx: number,
  matchLx: number,
  matchText: string,
  execRv?: RegExpExecArray | null,
  [key: string]: any;
}

interface map_capture_item_interface
{
  ix: number,
  name: string,
  trim?: boolean,
  fxName?: string
}

// -------------------------- regex_exec -----------------------------------
// match to a pattern, starting at bx in text string.
// re_pattern:  either a RegExp object or regular expression pattern.
// map_capture:  map captured matches. [{ix, name, trim:true, fxName }]
//               map from array of captured matches to properties in return value.
//               ix: index in capture array of value to map
//               name: property name to map to in the return object.
//               trim: when true, trim whitespace from capture value when mapping
//                     to map to property name in return object.
//               fxName: property name in return object in which to store the
//                       found position in the search text of the trimmed capture 
//                       value.
// const rv = regex_exec(stmt, bx, rxx_dataDefn, [{ ix: 1, name: 'const' },
// { ix: 2, name: 'datatype' }, { ix: 3, name: 'pointer' }]);
export function regex_exec(text: string, bx: number, re_pattern: RegExp,
  map_capture: map_capture_item_interface[])
  : regex_exec_rtnval_interface
{
  let matchBx = -1;
  let matchLx = 0;
  let matchOx = -1;
  let matchText = '';
  let capture_ix = bx;

  // setup the regular expression to execute.
  let re = re_pattern;
  if (typeof (re_pattern) == 'string')
  {
    re = new RegExp(re_pattern, 'g');
  }

  // start position in text
  re.lastIndex = bx;

  const reg_rv = re.exec(text);

  if (reg_rv != null)
  {
    matchBx = reg_rv.index;
    matchOx = matchBx - bx;
    matchText = reg_rv[0];
    matchLx = matchText.length;
  }

  let rv: regex_exec_rtnval_interface = { matchBx, matchLx, matchOx, matchText, execRv: reg_rv };

  // map from capture array to properties in return value.
  if (map_capture && reg_rv)
  {
    for (let mx = 0; mx < map_capture.length; ++mx)
    {
      const item = map_capture[mx];
      if (item.ix < reg_rv.length)
      {
        let capture_text = reg_rv[item.ix];
        rv[item.name] = capture_text;

        // trim blanks from the capture variable.
        if (item.trim)
        {
          if (!capture_text)
            capture_text = '';
          else
            capture_text = capture_text.trim();
          rv[item.name] = capture_text;
        }

        // the found position of the capture value. Scan the input text for the
        // capture text. Store the found pos in the specified propert of the return
        // object.
        if (item.fxName)
        {
          const fx = text.indexOf(capture_text, capture_ix);
          rv[item.fxName] = fx;

          // next time look for capture text, start looking after the location of
          // this just found capture text.
          capture_ix = fx + capture_text.length;
        }
      }
    }
  }

  return rv;
}
