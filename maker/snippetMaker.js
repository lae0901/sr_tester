// --------------------------- docReady -----------------------------------
function docReady( )
{
  // read latest snippet from local storage.
  var bodyText = localStorage.getItem('bodyText') ;
  var prefix = localStorage.getItem('prefix') ;
  var description = localStorage.getItem('description') ;

  // store latest snippet entries in the HTML entry elements.
  var divElem = document.getElementById('promptDiv') ;
  findChild_SetText( divElem, 'bodyText', bodyText ) ;
  findChild_SetText( divElem, 'prefix', prefix ) ;
  findChild_SetText( divElem, 'description', description ) ;
  findChild_SetText( divElem, 'snippetCode', '' ) ;
}

// --------------------- makeSnippet_click ------------------------------
// see "make snippet" button on the html page.
function makeSnippet_click( elem )
{
  var tab = '\t' ;
  var newLine = '\n' ;
  var divElem = document.getElementById('promptDiv') ;
  var bodyText = findChild_GetValueOrText( divElem, 'bodyText' ).text ;  // { text:, elem:}
  var prefix = findChild_GetValueOrText( divElem, 'prefix').text ;
  var description = findChild_GetValueOrText( divElem, 'description').text ;
  var bodyLines = bodyText.split('\n') ;

  var snipText = snippet_buildText(description, prefix, description, bodyLines ) ;

  // var snipText = string_Enquote(prefix, '', '"', false, '\\' ) + ": {\n" ;
  // snipText += tab + '"prefix":' + string_Enquote(prefix, '', '"', false, '\\' ) + ',\n' ;
  // snipText += tab+  '"description": ' + string_Enquote(description, '', '"', false, '\\') + ',\n' ;
  // snipText += tab + '"body":[\n' ;

  // for( var ix = 0 ; ix < bodyLines.length ; ++ix )
  // {
  //   var tail = ',' + newLine ;
  //   if ( (ix + 1 ) == bodyLines.length )  // the last line in the array.
  //     tail = newLine ;
  //   snipText += tab + tab + string_Enquote(bodyLines[ix], '', '"', false, '\\' ) + tail ;
  // }

  // snipText += tab +  ']\n' ;
  // snipText += '}\n' ;
  
  findChild_SetText( divElem, 'snippetCode', snipText ) ;

  // save latest entries in local storage.
  localStorage.setItem('bodyText', bodyText ) ;
  localStorage.setItem('prefix', prefix ) ;
  localStorage.setItem('description', description ) ;
}

// ----------------------------- snippetFileInput_change ----------------------------
function snippetFileInput_change( elem )
{
  var traits = new scanTraits( ) ;
  var files = elem.files ;                                              
  for( ix = 0 ; ix < files.length ; ix++ )                           
  {                                                                  
    var file = files[ix] ;

    // store current snippet file name.
    {
      var el = document.getElementById('currentSnippetFile_name') ;
      js_SetValueOrText(el, file.name) ;
    }

    var fr = new FileReader( ) ;                                       
    fr.onload = function(e)                                            
    {
      // text contents of the snippet file.                                                                  
      var buf   = e.target.result ;

      // store snippet file contents in local storage.
      localStorage.setItem('currentSnippetFile_contents', buf ) ;

      {
        var el = document.getElementById('dumpArea1') ;
        js_SetValueOrText(el, buf) ;
      }

      buf = code_removeComments(buf, traits) ;

      {
        var el = document.getElementById('dumpArea2') ;
        js_SetValueOrText(el, buf) ;
      }

      var obj = null ;
      try
      {
        obj   = jsonText_toObj(buf, traits).obj ;

        // var fx = buf.lastIndexOf(',') ;
        // buf = string_ReplaceAt(buf, fx, 1, ' ') ;
        // obj   = JSON.parse( buf ) ;

        // var xtext2 = JSON.stringify(xobj2) ;
        // var xtext = JSON.stringify(obj) ;
        // if (xtext2 == xtext )
        // {
        //   var ch5 = '3' ;
        // }
      }
      catch(err)
      {
        console.log(err) ;
      }

      // object contains snippet objects as properties. One for each snipper. Convert
      // to array of snippet objects.
      var snippetArray = [] ;
      for( var key in obj )
      {
        var snippet = obj[key] ;
        snippet.key = key ;
        snippetArray.push( snippet ) ;
      }

      var columns = [
        {name:'Edit',type:'Button',hdg:'Edit', onclick:'editSnippet_click', value:'Edit'},
        {name:'prefix',hdg:'prefix'},
        {name:'description',hdg:'Description'},
        {name:'key',hdg:'key'}
      ] ;
      var meta = {columns:columns, wrapperDiv:'<div class="style1 td_smaller">'} ;      

      var tableHtml = array_ToHtmlTable( snippetArray, 'snippetTable', meta) ;
      $('#snippetTableDiv').html(tableHtml) ;
    };                                                                 
    fr.readAsText( file ) ;                                            
  }
}

// ---------------------------- editSnippet_click -----------------------
// handle the "edit" click button event. Edit the snippet.
function editSnippet_click(elem)
{
  var trElem = $(elem).closest('TR') ;
  var key = findChild_GetValueOrText( trElem, 'key').text ;
  var prefix = findChild_GetValueOrText( trElem, 'prefix').text ;

  // parse the current snippets file.  
  var contents = localStorage.getItem('currentSnippetFile_contents') ;
  var traits = new scanTraits( ) ;
  var contentsObj  = jsonText_toObj(contents, traits).obj ;

  // get the snippet object of the clicked snippet.
  var snippet = object_GetProp(contentsObj, key, null ) ;

  // store latest snippet entries in the HTML entry elements.
  if ( snippet != null )
  {
    promptDiv_store( snippet ) ;
  }
}

// -------------------------- promptDiv_store --------------------------
// store values in child elements of promptDiv
function promptDiv_store( snippet )
{

  var divElem = document.getElementById('promptDiv') ;
  var bodyText = snippet.body.reduce( (rio, item) =>
  {
    rio += item + '\n' ;
    return rio ;
  }, '' ) ;

  findChild_SetText( divElem, 'bodyText', bodyText ) ;
  findChild_SetText( divElem, 'prefix', snippet.prefix ) ;
  findChild_SetText( divElem, 'description', snippet.description ) ;
  findChild_SetText( divElem, 'snippetCode', snippet.code ) ;  
}

// ----------------------- code_removeComments ----------------------------
function code_removeComments( text, traits )
{
  var ix = 0 ;
  while(ix < text.length )
  {
    var rv = code_nextItem( text, ix, traits ) ;

    // end of string.  nothing returned.
    if (rv.what == 5 )
      break ;

    // item is an embedded comment. replace with a single space.
    if ( rv.what == 2)
    {
      var comment = text.substr(rv.bx, rv.lx ) ;
      text = string_ReplaceAt(text, rv.bx, rv.lx, ' ') ;
      ix = rv.bx;
    }

    // is quoted string.
    else if (rv.what == 3)
    {
      var quotedText = rv.text ;
      ix = rv.bx + rv.lx ;
    }

    else
    {
      ix = rv.bx + rv.lx ;
    }
  }
  return text ;
}

// ----------------------- code_nextItem -----------------------------------
// return values.  what: 1 = symbol, 2 = embedded comment, 3 = quoted string, 4 = quoted string error.
//                       5 - EOF,    6 = numeric text,     7 = name,          8 = qualifier 
//                 bx: begin pos of item.    lx:length of item
//                 text: text of item
function code_nextItem( text, bx, traits )
{
  // var symbolChars = '[]{}*/-=+;:,()%!~' ;
  // var quoteChars = '\'"`' ;
  // var wsChars = ' \t\n\r' ;
  // var digitChars = '0123456789' ;
  // var qualChars = '.' ;
  // var traits = {symbolChars:symbolChars, wsChars:wsChars, digitChars:digitChars, quoteChars:quoteChars,
  //               qualChars:qualChars} ;
  // traits.nonNameChars = traits.symbolChars + traits.wsChars + traits.digitChars 
  //                       + traits.quoteChars + traits.qualChars ;

  // advance past whitespace
  var ix = scan_charNeAll(text, bx, traits.wsChars ) ;

  // end of string. 
  if ( ix == -1 )
  {
    return {what:5,bx:text.length,lx:0,text:''} ;
  }

  // isolate current character.
  var ch1 = text.substr(ix,1) ;

  // is start of embedded comment.
  if (( ch1 == '/' ) && ( string_nextChar(text,ix) == '*'))
  {
    var fx = scan_endEnclosedComment(text,ix +2) ;
    if (fx >= 0 )
    {
      var lx = fx - ix + 1 ;
      return {what:2,bx:ix,lx:lx,text:text.substr(ix,lx)} ;
    }
  }

  // is a symbol.
  var fx = traits.symbolChars.indexOf(ch1) ;
  if ( fx >= 0 )
  {
    var symbolChar = traits.symbolChars.substr(fx,1) ;
    return {what:1,bx:ix,lx:1,text:symbolChar } ;
  }

  // is a quoted string.
  if (traits.quoteChars.indexOf(ch1) != -1 )
  {
    var rv = scan_closeQuote(text, ix ) ;
    if ( rv.ex == -1 )
      return {what:4,bx:ix,lx:-1, text:''} ;
    else
    {
      var lx = rv.ex - rv.bx + 1 ;
      return {what:3,bx:ix,lx:lx,text:rv.quotedText} ;
    }
  }

  // qualifier character.
  if (traits.qualChars.indexOf(ch1) != -1 )
  {
    return {what:8,bx:ix,lx:1,text:ch1} ;
  }

  // numeric literal
  if ((ch1 >= '0') && ( ch1 <= '9'))
  {
    var fx = scan_endNumeric(text, ix, traits ) ;
    var lx = fx - ix + 1 ;
    return {what:6,bx:ix,lx:lx,text:text.substr(ix,lx)} ;
  }

  // variable name. 
  {
    var fx = scan_endName(text, ix, traits ) ;
    var lx = fx - ix + 1 ;
    return {what:7,bx:ix,lx:lx,text:text.substr(ix,lx)} ;
  }

  // an escape sequence
  if (( ch1 == '\\' ) && (string_extractEscape(text,ix).isEscape == true ))
  {
    var errmsg = 'unexpected escape sequence. ' + 'pos ' + ix ;
    throw errmsg ;
  }

  // note expected to be here.
  {
    var curText = string_SubstrLenient(text, ix - 10, 30 ) ;
    var errmsg = 'unexpected text in string. ' + 'pos ' + ix + ' ' + curText ;
    throw errmsg ;
  }
}

// --------------------- snippet_buildText ------------------------------
// see "make snippet" button on the html page.
// function snippet_buildText( key, prefix, description, codeLines )
// {
//   var obj = { } ;
//   if ( key.length == 0 )
//     key = prefix ;
//   obj[key] = { prefix:prefix, description:description, body:codeLines } ;
//   var text = JSON.stringify(obj) ;

//   // remove the open and closing object braces.
//   {
//     var fx = text.indexOf('{');
//     text = string_ReplaceAt(text, fx, 1, '' ) ;
//     var fx = text.lastIndexOf('}') ;
//     text = string_ReplaceAt(text, fx, 1, '' ) ;
//   }

//   return text ;
// }

// --------------------- snippet_buildText ------------------------------
// see "make snippet" button on the html page.
function snippet_buildText( key, prefix, description, bodyLines )
{
  var tab = '\t' ;
  var newLine = '\n' ;

  if ( key.length == 0 )
    key = prefix ;

  var snipText = string_Enquote(prefix, '', '"', false, '\\' ) + ": {\n" ;
  snipText += tab + '"prefix":' + string_Enquote(prefix, '', '"', false, '\\' ) + ',\n' ;
  snipText += tab+  '"description": ' + string_Enquote(description, '', '"', false, '\\') + ',\n' ;
  snipText += tab + '"body":[\n' ;

  for( var ix = 0 ; ix < bodyLines.length ; ++ix )
  {
    var tail = ',' + newLine ;
    if ( (ix + 1 ) == bodyLines.length )  // the last line in the array.
      tail = newLine ;
    snipText += tab + tab + string_Enquote(bodyLines[ix], '', '"', false, '\\' ) + tail ;
  }

  snipText += tab +  ']\n' ;
  snipText += '}\n' ;

  return snipText ;
}

// --------------------- codeLines_toSnippetBodyArray ------------------------------
// see "make snippet" button on the html page.
function codeLines_toSnippetBodyArray( codeLines )
{
  var tab = '\t' ;
  var newLine = '\n' ;
  var divElem = document.getElementById('promptDiv') ;
  var bodyText = findChild_GetValueOrText( divElem, 'bodyText' ).text ;  // { text:, elem:}
  var prefix = findChild_GetValueOrText( divElem, 'prefix').text ;
  var description = findChild_GetValueOrText( divElem, 'description').text ;
  var bodyLines = bodyText.split('\n') ;


  var snipText = string_Enquote(prefix, '', '"', false, '\\' ) + ": {\n" ;
  snipText += tab + '"prefix":' + string_Enquote(prefix, '', '"', false, '\\' ) + ',\n' ;
  snipText += tab+  '"description": ' + string_Enquote(description, '', '"', false, '\\') + ',\n' ;
  snipText += tab + '"body":[\n' ;

  for( var ix = 0 ; ix < bodyLines.length ; ++ix )
  {
    var tail = ',' + newLine ;
    if ( (ix + 1 ) == bodyLines.length )  // the last line in the array.
      tail = newLine ;
    snipText += tab + tab + string_Enquote(bodyLines[ix], '', '"', false, '\\' ) + tail ;
  }

  snipText += tab +  ']\n' ;
  snipText += '}\n' ;
  
  findChild_SetText( divElem, 'snippetCode', snipText ) ;

  // save latest entries in local storage.
  localStorage.setItem('bodyText', bodyText ) ;
  localStorage.setItem('prefix', prefix ) ;
  localStorage.setItem('description', description ) ;
}

function dummy( )
{
  var xx = {abc:25} ;
  var yy = {"abc":25 } ;

  var text = '{ "Print to console if variable exists":{	"prefix":"logif" }} ' ;
  var obj = JSON.parse(text) ;
	
  var zz = '{' + '"Print to console if variable exists":' + '{' +
           '"prop1":' + '25' + ', ' +
           '"prop2":' + '"abc"' + '}}' ;
  var obj2 = JSON.parse(zz) ;
  
  // var filter  = {slsnum:slsnum, custName:''} ;
  // var show    = {divId:'ordersDiv'} ;
  // var args    = {filter:filter, show:show} ;
  // userSnippets_BuildAndShow( args, null ) ;
}

// ----------------- userSnippets_BuildAndShow ----------------
// build the html that comprises the <table> used to edit the
// REPCHIT table.
// show - {divId:'ordersDiv'}  where to show table after it is built.
function userSnippets_BuildAndShow( args, doneFunc )
{
  var  filter     = object_GetProp( args, 'filter', {} ) ;
  var show        = object_GetProp( args, 'show', null) ;
  var  slsnum     = object_GetProp( filter, 'slsnum', '0' ) ;
  var  custName   = object_GetProp( filter, 'custName', '' ) ;
  var  poNum      = object_GetProp( filter, 'poNum', '' ) ;
  var  csno       = object_GetProp( filter, 'csno', '0' ) ;
  var  orno       = object_GetProp( filter, 'orno', '' ) ;
  var  onlyRepzio = object_GetProp( filter, 'onlyRepzio', 'N' ) ;
  var  ornoCombo  = string_PadRight( orno, 5, ' ' ) + onlyRepzio ;
  filter["ornoCombo"] = ornoCombo ;

  var  slsnum = object_GetProp( filter, 'slsnum', '0' ) ;

  var refresh = { getHtmlFunc:'userSnippets_BuildAndShow', showId: show.divId} ;

  var input     = {lib:'COURI7',proc:'orOrd_SelectSlsnum',
                   url:'json_GetManyRows.php',
                   data:filter,
                   parms:[{name:'slsnum',dftVlu:'0'},{name:'custName'},{name:'csno',dftVlu:'0'},
                          {name:'poNum'},{name:'ornoCombo'}],
                   results:{rs1:'items'}
                  } ;

  var columns = [
                 {name:'CONO',hdg:'Company',hide:true},
                 {name:'CSNO',hdg:'Cust number',hide:true},
                 {name:'ORNO',hide:true},
                 {name:'ORGN',hide:true},
                 {name:'SHOWORNO',hdg:'Order<br>number',type:'LINK',
                  onclick:'repOrh_WorkInforOrderClick'},
                 {name:'CSNM',hdg:'Cust name'},
                 {name:'CSPO',hdg:'PO number'},
                 {name:'ORSC',hdg:'Order<br>source'},
                 {name:'ENTRYDATE',hdg:'Entry<br>date'},
                 {name:'SHIPDATE',hdg:'Ship<br>date'},
                 {name:'EDIT',hdg:'Edit<br>order',
                  type:'Button',value:'Edit',onclick:'repOrh_EditClick',
                  cond:[{colName:'SHIPDATE',rltn:'EQ',vlu:' '}]
                 },
                ] ;
  var above   = { items:[
                  {name:'slsnum',hide:true},
                  {name:'custName', hdg:'Customer', alwchg:true, type:'TEXT',
                   blurRefresh:{filterProp:'custName'}},
                  {name:'poNum', hdg:'PO number', alwchg:true, type:'TEXT', width:'7em',
                   newLine:false,blurRefresh:{filterProp:'poNum'}},
                  {name:'orno', hdg:'Order', alwchg:true, type:'TEXT', width:'4em',
                   newLine:false,blurRefresh:{filterProp:'orno'}},
                  {name:'onlyRepzio', hdg:'Repzio', type:'CHECKBOX', width:'3em',
                   trueVlu:'Y', falseVlu:'N',
                   newLine:false,blurRefresh:{}}
                        ],
                  data:filter, className:'table53_above' } ;
  
  var rowKeys1 = [{name:'CONO'},{name:'ORNO'}] ;
  var table1  = { name:'ORHEDV2', lib:'COURI7', keys: rowKeys1, as:'a' } ;
  var tableId = 'slsnumOrders_' + slsnum ;
  var meta    = {tables:[table1], columns:columns, refresh:refresh,
                 show:show, input:input, wrapperDiv:'<div class="style1 td_smaller">',
                 above:above, filter:filter, tableId:tableId };
  htmlTable_BuildAndShow( ' ', meta, null ) ;
}
