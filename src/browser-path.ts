
// ------------------------- path_getFileName ------------------------

import { object_toQueryString, scan_revCharEqAny, string_rtrim } from "./main";
import axios from 'axios';

// return the part of the path that follows the last "/" in the string.
export function path_getFileName(path : string ) : string
{
	let fileName = path;
	const fx = scan_revCharEqAny(path, path.length - 1, '\\/' );
	// let fx = path.lastIndexOf('/');
	const bx = fx + 1;
	if ((bx > 0) && (bx < path.length))
	{
		fileName = path.substr(bx);
	}
	return fileName;
}

// ------------------------------ path_splitBaseName ------------------------------
export function path_splitBaseName( path: string ) : { coreName:string, extName:string}
{
	const baseName = path_getFileName( path ) ;
	let coreName = baseName ;
	let extName = '' ;
	let ix = baseName.length - 1 ;
	while( ix >= 0)
	{
		const ch1 = baseName.substr(ix,1) ;
		if ( ch1 == '.')
		{
			extName = baseName.substr(ix) ;
			break ;
		}
	}
	return { coreName, extName } ;
}


// --------------------- steve_compile -----------------------
export async function steve_compile(config: { CURLIB: string, LIBL: string },
	srcfName: string, srcfLib: string, srcmbr: string):
	Promise<{ compMsg: string, compile: string[], joblog: string[] }>
{
	const promise = new Promise<{ compMsg: string, compile: string[], joblog: string[] }>
		(async (resolve, reject) =>
		{
			srcfName = srcfName || '';
			srcfLib = srcfLib || '';
			srcmbr = srcmbr || '';
			const libl = string_rtrim(config.LIBL);
			const curlib = config.CURLIB;
			let compMsg = '';
			let compile: string[] = [];
			let joblog: string[] = [];

			const url = 'http://173.54.20.170:10080/coder/common/json_getManyRows.php';
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
