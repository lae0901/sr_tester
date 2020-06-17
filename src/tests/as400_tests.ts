import { string_matchGeneric } from '../main';
import { steve_compile } from '../browser-path';
import axios from 'axios';
import { object_toQueryString, string_rtrim, string_head } from 'sr_core_ts';

as400_compile_test( ) ;

async function as400_compile_test()
{
  const config = {serverUrl:'http://192.168.1.170:10080', CURLIB:'couri7', LIBL:'couri7 qgpl'};
  const srcfName = 'QRPGLESRC' ;
  const srcfLib = 'COURI7' ;
  const srcmbr = 'UTL7140R' ;

  const ch5 = string_head(srcfName,5) ;


  const rv = await as400_compile(config, srcfName, srcfLib, srcmbr) ;
  console.log( rv.compMsg) ;
  for( let ix = 0 ; ix < rv.compile.length && ix < 25 ; ++ix )
  {
    const line = rv.compile[ix] ;
    console.log( line.LINE ) ;
  }
}


interface iCompileLine
{
  SKIPBFR: string,
  SPACEB: string,
  LINE: string
}

// --------------------- as400_compile -----------------------
export async function as400_compile(config: { serverUrl: string, CURLIB: string, LIBL: string },
  srcfName: string, srcfLib: string, srcmbr: string):
  Promise<{ compMsg: string, compile: iCompileLine[], joblog: string[] }>
{
  const promise = new Promise<{ compMsg: string, compile: iCompileLine[], joblog: string[] }>
    (async (resolve, reject) =>
    {
      srcfName = srcfName || '';
      srcfLib = srcfLib || '';
      srcmbr = srcmbr || '';
      const libl = string_rtrim(config.LIBL);
      const curlib = config.CURLIB;
      let compMsg = '';
      let compile: iCompileLine[] = [];
      let joblog: string[] = [];

      const url = `${config.serverUrl}/coder/common/json_getManyRows.php`;
      const params =
      {
        libl, proc: 'utl7960_compile',
        outParm1: compMsg, parm2: srcfName,
        parm3: srcfLib, parm4: srcmbr, parm5: curlib
      }
      const query = object_toQueryString(params);
      const url_query = url + '?' + query;

      const response = await axios({
        method: 'get', url: url_query, responseType: 'json'
      });

      let data = await response.data;
      let outSet = data.outSet;
      compMsg = outSet.outParm1;
      compile = data.set1 || [];
      joblog = data.set2 || [];
      resolve({ compMsg, compile, joblog });
    });

  return promise;
}
