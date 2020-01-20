// ------------------------------------ scanTraits ----------------------------
// scanning traits. characters that constitute symbols, quotes, whitespace, ...
function scanTraits()
{
  this.symbolChars = '[]{}*/-=+;:,()%!~' ;
  this.quoteChars = '\'"`' ;
  this.wsChars = ' \t\n\r' ;
  this.digitChars = '0123456789' ;
  this.numericFormatChars = '.,' ;
  this.qualChars = '.' ;
  this.nonNameChars = this.symbolChars + this.wsChars + this.digitChars 
                      + this.quoteChars + this.qualChars ;
}

// --------------------------- objwip object -------------------------
function objwip( flag = 4, obj = {} )
{
  this.obj = obj ;
  this.curProp = '' ;
  this.flag = flag ;  // 0-prop name, 1-prop:vlu separator, 2-prop vlu, 
                      // 3-prop separator or close obj, 4-open object
                      // 5-EOF,   6-array item separator or close array

  if ( Array.isArray(this.obj) == true )
  {
    this.flag = 2 ;
  }                     

  this.errmsg = '' ;
}

// ------------------------- objwip.apply ----------------------------
// apply property or value to wip object.
objwip.prototype.apply = function(vlu)
{
  if ( this.flag == 0 )
  {
    this.curProp = vlu;
    this.flag = 1 ;
  }
  else if (( this.flag == 2 ) && ( Array.isArray(this.obj) == true ))
  {
    this.obj.push(vlu) ;
    this.flag = 6 ;
  }
  else if ( this.flag == 2)
  {
    this.obj[this.curProp] = vlu ;
    this.curProp = '' ;
    this.flag = 3 ;   // next is either prop sep or close obj.
  }
};

// --------------------------- objwip.applyArraySymbol --------------------
objwip.prototype.applyArraySymbol = function( stack, symbol )
{
  if (symbol == '[')
  {
    if ( this.flag == 2 )
    {
      stack.push(this) ;

      var flag = 2 ;
      var wip = new objwip( flag, [] ) ;
      return wip ;
    }
    else
    {
      this.errmsg = 'not expecting value.' ;
    }
  }
  else if ( symbol == ']')
  {
    if ( this.flag != 6)
      this.errmsg = 'not expecting end of array symbol.' ;

    if ( stack.length > 0)
    {
      var wip = stack.pop( ) ;
      wip.apply(this.obj) ;
      return wip ;
    }
    else
    {
      this.flag = 5 ;
      return this ;
    }
  }
};

// --------------------------- objwip.applyObjectSymbol --------------------
objwip.prototype.applyObjectSymbol = function( stack, symbol )
{
  if (symbol == '{')
  {
    if ( this.flag == 2 )
    {
      // var obj = {} ;
      // this.apply(obj) ;
      stack.push(this) ;

      var flag = 0 ;
      var wip = new objwip( flag, {} ) ;
      return wip ;
    }
    else if ( this.flag == 4)
    {
      this.flag = 0 ;
      return this ;
    }
    else
    {
      this.errmsg = 'expecting property name. Start of object instead.' ;
    }
  }
  else if ( symbol == '}')
  {
    // pop from object stack.  Apply this wip to that object.
    if ( stack.length > 0)
    {
      var wip = stack.pop( ) ;
      wip.apply(this.obj) ;
      return wip ;
    }
    else
    {
      this.flag = 5 ;
      return this ;
    }
  }
};

// ----------------------- objwip.applySeparatorSymbol --------------------
objwip.prototype.applySeparatorSymbol = function( symbol )
{
  if (symbol == ',')
  {
    if ( this.flag == 3 )
    {
      this.flag = 0 ;
    }
    else if ( this.flag == 6)
    {
      this.flag = 2 ;
    }
    else
    {
      this.errmsg = 'unexpected property separator.' ;
    }
  }
  else if ( symbol == ':')
  {
    if ( this.flag == 1)
    {
      this.flag = 2 ;
    }
    else
    {
      this.errmsg = 'unexpected property/value separator.' ;
    }
  }
};


// ----------------------- jsonText_toObj ----------------------------
// returns {obj:obj, name:name, errmsg:errmsg}
function jsonText_toObj( text, traits = null )
{
  if ( traits == null )
    traits = new scanTraits( ) ;
  var toObj = {} ;
  var objName = '' ;
  var wip = new objwip(4) ;
  var stack = [];

  var ix = 0 ;
  while(ix < text.length )
  {
    var rv = code_nextItem( text, ix, traits ) ;

    // end of string.  nothing returned.
    if (rv.what == 5 )
      break ;

    // a symbol.  looking for []{},:
    if ( rv.what == 1)
    {
      var symbol = rv.text ;
      if (( symbol == '{') || ( symbol == '}'))
      {
        wip = wip.applyObjectSymbol(stack, symbol ) ;
      }
      else if ((symbol == ':') || ( symbol == ','))
      {
        wip.applySeparatorSymbol(symbol) ;
      }
      else if ((symbol == '[') || (symbol == ']'))
      {
        wip = wip.applyArraySymbol(stack, symbol) ;
      }
      ix = rv.bx + rv.lx ;
    }

    // item is an embedded comment. skip.
    else if ( rv.what == 2)
    {
      ix = rv.bx + rv.lx ;
    }

    // is quoted string.
    else if (rv.what == 3)
    {
      var txt = string_dequote(rv.text) ;
      wip.apply( txt) ;
      ix = rv.bx + rv.lx ;
    }

    // is numeric value.
    else if (rv.what == 6)
    {
      var num = +(rv.text) ;
      wip.apply( num ) ;
      ix = rv.bx + rv.lx ;
    }

    // variable name
    else if ( rv.what == 7)
    {
      wip.apply( rv.text ) ;
      ix = rv.bx + rv.lx ;
    }

    else
    {
      ix = rv.bx + rv.lx ;
    }
  }
  return {obj:wip.obj, name:objName, errmsg:wip.errmsg} ;
}

// ------------------------- scan_charEqAny --------------------------
// scan forward. Looking for first char that is equal any of the pattern characters.
function scan_charEqAny( text, bx, patChars )
{
  var ix = bx ;
  var foundIx = -1 ;
  while( ix < text.length )
  {
    var ch1 = text.substr(ix,1) ;
    var fx = patChars.indexOf(ch1) ;
    if ( fx >= 0 )
    {
      foundIx = ix ;
      break ;
    }
    ix += 1 ;
  }
  return foundIx ;
}

// ------------------------- scan_charNeAll --------------------------
function scan_charNeAll( text, bx, patChars )
{
  var ix = bx ;
  var foundIx = -1 ;
  while( ix < text.length )
  {
    var ch1 = text.substr(ix,1) ;
    var fx = patChars.indexOf(ch1) ;
    if ( fx == -1 )
    {
      foundIx = ix ;
      break ;
    }
    ix += 1 ;
  }
  return foundIx ;
}

// --------------------------- scan_closeQuote -------------------------------
// scan for closing quote of a quoted string.
// returns { bx:xx, ex:xxx, quotedText:quoted text including quotes }
function scan_closeQuote( text, bx )
{
  var qtChar = text.substr(bx,1) ;
  var ix = bx + 1 ;
  var foundIx = -1 ;
  while( ix < text.length )
  {
    var ch1 = text.substr(ix,1) ;

    // an escape sequence
    if (( ch1 == '\\' ) && (string_extractEscape(text,ix).isEscape == true ))
    {
      ix += 2 ;
      continue ;
    }

    // close quote
    if ( ch1 == qtChar )
    {
      foundIx = ix ;
      break ;
    }

    ix += 1 ;
  }
  var quotedText = '' ;
  if ( foundIx >= 0 )
  {
    var lx = foundIx - bx + 1 ;
    quotedText = text.substr(bx,lx) ;
  }
  return {bx:bx, ex:foundIx, quotedText:quotedText} ;
}

// -------------------------- scan_endEnclosedComment ------------------------
// return the position in string of the closing "/" of the "*/" that closes an embedded comment.
function scan_endEnclosedComment( text, bx )
{
  var fx = -1 ;
  var remLx = text.length - bx ;
  if ( remLx >= 2 )
  {
    fx = text.indexOf('*/') ;
    if ( fx >= 0 )
      fx += 1 ;
  }
  return fx ;
}

// ----------------------------- scan_endName --------------------------------
// scan forward to the last char of the current name. 
function scan_endName( text, bx, traits )
{
  // scan forward. looking for a char eq any of the nonNameChars.
  var fx = scan_charEqAny(text, bx, traits.nonNameChars ) ;
  if ( fx == -1 )
    return text.length - 1 ;
  else
    return fx - 1 ;  // back up to char before the nonName char. This is last char in the name.
}

// -------------------------------- scan_endNumeric ---------------------------
function scan_endNumeric( text, bx, traits )
{
  var ix = bx ;
  var endIx = -1 ;
  while( ix <= text.length )
  {
    // scan ahead. looking for non digit char.
    var fx = scan_charNeAll(text, ix, traits.digitChars) ;

    // nothing but digits to end of string.
    if ( fx == -1 )
    {
      endIx = text.length - 1 ;
      break ;
    }

    // if the non digit char is "." or ",", check that char that follows is a digit.  That makes
    // the period or comma part of the numeric string.
    var ch1 = string_charAt( text, fx ) ;
    if ((( ch1 == '.') || (ch1 == ',')) && ( string_charEqAny(text, fx + 1, traits.digitChars) == true ))
    {
      ix = fx + 1 ;
      continue ;
    }

    // found last digit. It is the char before the found char.
    endIx = fx - 1 ;
    break ;
  }

  return endIx ;
}

// ------------------------------- string_charAt ----------------------------
// return the character at the location in string.  return empty string if out of bounds.
function string_charAt( text, ix )
{
  if (( ix < 0 ) || ( ix >= text.length ))
    return '' ;
  else
    return text.substr(ix,1) ;
}

// ------------------------------ string_charEqAny ------------------------------
// return true or false if char in string is equal any of the compare characters.
function string_charEqAny(text, ix, anyChars)
{
  if (( ix < 0 ) || ( ix >= text.length ))
    return false ;
  else
  {
    var ch1 = text.substr(ix,1) ;
    var fx = anyChars.indexOf(ch1) ;
    if ( fx >= 0 )
      return true ;
    else
      return false ;
  }
}

// -------------------------------- string_dequote -----------------------------
function string_dequote( quotedText )
{
  var objText = '{"a":' + quotedText + '}' ;
  // console.log( 'string_dequote. ' + objText ) ;
  var obj = JSON.parse(objText) ;
  return obj.a ;
}

function string_extractEscape( text, bx)
{
  var nxChar = string_nextChar(text, bx) ;
  var escapeChars = '\\tnr"\'`bfv0' ;   // note: /0 not allowed in json encoded string.
  if ( escapeChars.indexOf(nxChar) >= 0 )
  {
    return {isEscape:true, escapeChar:nxChar } ;
  }
  else
    return {isEscape:false} ;
}

function string_nextChar( text, bx )
{
  var nx = bx + 1 ;
  if ( nx < text.length )
    return text.substr(nx,1) ;
  else
    return '' ;
}
