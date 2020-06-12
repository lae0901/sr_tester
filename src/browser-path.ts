
// ------------------------- path_getFileName ------------------------

import { scan_revCharEqAny } from "./main";

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
